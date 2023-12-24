"use strict";
import { initFileShaders, perspective, vec2, vec4, flatten, lookAt, rotateX, rotateY } from '../helperfunctions.js';
import { getData } from "./Data.js";
let gl;
let program;
let checkerTex;
// 2D array with vector field
// In Data:
// Column 1: x position
// Column 2: y position
// Column 3: x velocity
// Column 4: y velocity
// Column 5: pressure
// Column 6: vorticity
let vectorField;
let streamX;
let streamY;
let texHeight;
let texWidth;
//uniform locations
let umv; //uniform for mv matrix
let uproj; //uniform for projection matrix
//matrices
let mv; //local mv
let p; //local projection
//shader variable indices for material properties
let vPosition;
let vTexCoord;
let uTextureSampler; //this will be a pointer to our sampler2D
//document elements
let canvas;
//interaction and rotation state
let xAngle;
let yAngle;
let zoom = 40;
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2', { antialias: true });
    if (!gl) {
        alert("WebGL isn't available");
    }
    //black background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    program = initFileShaders(gl, "vshader.glsl", "fshader.glsl");
    gl.useProgram(program);
    umv = gl.getUniformLocation(program, "model_view");
    uproj = gl.getUniformLocation(program, "projection");
    uTextureSampler = gl.getUniformLocation(program, "textureSampler"); //get reference to sampler2D
    //set up basic perspective viewing
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    p = perspective(zoom, (canvas.clientWidth / canvas.clientHeight), 1, 20);
    gl.uniformMatrix4fv(uproj, false, p.flatten());
    //texHeight = 200;
    //texWidth = 700;
    texHeight = 600;
    texWidth = 600;
    vectorField = getData();
    makeSquareAndBuffer();
    makeWhiteNoiseTexture();
    //initialize rotation angles
    xAngle = 0;
    yAngle = 0;
    window.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowDown":
                if (zoom < 170) {
                    zoom += 5;
                }
                break;
            case "ArrowUp":
                if (zoom > 5) {
                    zoom -= 5;
                }
                break;
        }
        p = perspective(zoom, (canvas.clientWidth / canvas.clientHeight), 1, 20);
        gl.uniformMatrix4fv(uproj, false, p.flatten());
        requestAnimationFrame(render); //and now we need a new frame since we made a change
    });
    requestAnimationFrame(render);
};
//Make a square and send it over to the graphics card
function makeSquareAndBuffer() {
    let squarePoints = []; //empty array
    //create 4 vertices and add them to the array
    squarePoints.push(new vec4(-1, -1, 0, 1));
    squarePoints.push(new vec2(0, 0)); //texture coordinates, bottom left
    squarePoints.push(new vec4(1, -1, 0, 1));
    squarePoints.push(new vec2(1, 0)); //texture coordinates, bottom right
    squarePoints.push(new vec4(1, 1, 0, 1));
    squarePoints.push(new vec2(1, 1)); //texture coordinates, top right
    squarePoints.push(new vec4(-1, 1, 0, 1));
    squarePoints.push(new vec2(0, 1)); //texture coordinates, top left
    //we need some graphics memory for this information
    let bufferId = gl.createBuffer();
    //tell WebGL that the buffer we just created is the one we want to work with right now
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //send the local data over to this buffer on the graphics card.  Note our use of Angel's "flatten" function
    gl.bufferData(gl.ARRAY_BUFFER, flatten(squarePoints), gl.STATIC_DRAW);
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 24, 0); //stride is 24 bytes total for position, texcoord
    gl.enableVertexAttribArray(vPosition);
    vTexCoord = gl.getAttribLocation(program, "texCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 24, 16); //stride is 24 bytes total for position, texcoord
    gl.enableVertexAttribArray(vTexCoord);
}
function makeWhiteNoiseTexture() {
    let randNumArr = Array(texWidth).fill(0).map(x => Array(texHeight).fill(0));
    // This loop give me a 2D array of white noise that is easier to use than the 1D array with 4 values at each pixel location
    for (let i = 0; i < texWidth; i++) {
        for (let j = 0; j < texHeight; j++) {
            randNumArr[i][j] = Math.floor(Math.random() * 1000);
        }
    }
    //mmtexture is the main memory texture
    let mmtexture = useStreamlines(randNumArr);
    //now create a texture object [in graphics memory hopefully]
    checkerTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, checkerTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, mmtexture);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //try different min and mag filters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    let anisotropic_ext = gl.getExtension('EXT_texture_filter_anisotropic');
    gl.texParameterf(gl.TEXTURE_2D, anisotropic_ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
}
// This function makes the texture by taking in the noise, starting streamline calculation and sampling along the streamline
function useStreamlines(randNumArr) {
    let mmtexture = new Uint8Array(texHeight * texWidth * 4);
    // Looping through each pixel
    for (let i = 0; i < texHeight; i++) {
        for (let j = 0; j < texWidth; j++) {
            // Starting streamline calculation with the pixel as the initial point
            rungeKutta4(i, j);
            // Streamline will be a series of points connected by straight lines that make up the streamline
            let count = 1;
            let average = 0;
            for (let k = 0; k < streamX.length - 1; k++) {
                // This is Texture Convolution.
                if (streamX[k] != -1 && streamY[k] != -1 && streamX[k + 1] != -1 && streamY[k + 1] != -1) {
                    //let point1 = [(streamX[k] + 0.5) * (texWidth/3.5), (streamY[k] + 0.5) * texHeight];
                    //let point2 = [(streamX[k + 1] + 0.5) * (texWidth/3.5), (streamY[k + 1] + 0.5) * texHeight];
                    let point1 = [streamX[k], streamY[k]];
                    let point2 = [streamX[k + 1], streamY[k + 1]];
                    // Get the length in pixels of the line
                    let distanceBetweenPoints = Math.round(Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)));
                    // X Coordinate Calculation for the points I will sample
                    let xComPoints = new Array(distanceBetweenPoints);
                    let xDiffBetweenPoints = (point1[0] - point2[0]);
                    let xSpaceBetweenPixel = xDiffBetweenPoints / distanceBetweenPoints;
                    for (let n = 0; n < xComPoints.length; n++) {
                        xComPoints[n] = Math.round(point1[0] + n * xSpaceBetweenPixel);
                        if (xComPoints[n] >= 600 || xComPoints[n] < 0) {
                            xComPoints[n] = 9999;
                        }
                    }
                    // Y Coordinate Calculation for the points I will sample
                    let yComPoints = new Array(distanceBetweenPoints);
                    let yDiffBetweenPoints = (point1[1] - point2[1]);
                    let ySpaceBetweenPixel = yDiffBetweenPoints / distanceBetweenPoints;
                    for (let n = 0; n < distanceBetweenPoints; n++) {
                        yComPoints[n] = Math.round(point1[1] + n * ySpaceBetweenPixel);
                        if (yComPoints[n] >= 600 || yComPoints[n] < 0) {
                            yComPoints[n] = 9999;
                        }
                    }
                    // Combine the x and y points and get the average noise value
                    let avTemp = 0;
                    let total = 0;
                    for (let q = 0; q < distanceBetweenPoints; q++) {
                        if (yComPoints[q] != 9999 && xComPoints[q] != 9999) {
                            avTemp += randNumArr[yComPoints[q]][xComPoints[q]];
                            total++;
                        }
                    }
                    // add that average value to the total average value
                    average += (avTemp / total);
                    count++;
                }
            }
            // Normalize Intensity
            average = (1 / (2 * count + 1)) * (average);
            // Get the final average value and add it to mmtexture at i and j
            mmtexture[4 * (texWidth * i + j)] = average;
            mmtexture[4 * (texWidth * i + j) + 1] = average;
            mmtexture[4 * (texWidth * i + j) + 2] = average;
            mmtexture[4 * (texWidth * i + j) + 3] = 255;
        }
    }
    return mmtexture;
}
// This function performs the Runge Kutta 4 math to find streamline points for the input value
function rungeKutta4(x, y) {
    // Step size
    let hf = 0.5;
    let maxh = 10.0;
    // Tolerance level
    let tol = 0.1;
    // Set up streamline array
    let fullstreamlength = 19;
    streamX = new Array(fullstreamlength);
    streamY = new Array(fullstreamlength);
    // Put the initial points in the middle
    streamX[0] = x;
    streamY[0] = y;
    // Set out of bounds to false
    let boundsF = 1;
    // Initialize values
    let tu = 0;
    let tv = 0;
    // Set up the error
    let error = Array(2);
    let errorLowest = 1;
    let temp = Array(2);
    // Set up the coefficients
    let k1 = new Array(2);
    let k2 = new Array(2);
    let k3 = new Array(2);
    let k4 = new Array(2);
    // Loop through all
    for (let i = 1; i < fullstreamlength + 1; i++) {
        // Out of bounds check
        if (boundsF == 1) {
            tu = streamX[i - 1];
            tv = streamY[i - 1];
            // Out of bounds check
            if (tu < 0 || tu > texWidth || tv < 0 || tv > texHeight) {
                boundsF = 0;
            }
            // Complete the math by finding the k coefficients and plug them into the larger equation
            while (true) {
                temp = flowFunction(tu, tv);
                k1[0] = hf * temp[0];
                k1[1] = hf * temp[1];
                temp = flowFunction(tu + 0.5 * k1[0], tv + 0.5 * k1[1]);
                k2[0] = hf * temp[0];
                k2[1] = hf * temp[1];
                temp = flowFunction(tu + 0.5 * k2[0], tv + 0.5 * k2[1]);
                k3[0] = hf * temp[0];
                k3[1] = hf * temp[1];
                temp = flowFunction(tu + k3[0], tv + k3[1]);
                k4[0] = hf * temp[0];
                k4[1] = hf * temp[1];
                // Larger Equation
                streamX[i] = streamX[i - 1] + (1.0 / 6.0) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
                streamY[i] = streamY[i - 1] + (1.0 / 6.0) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
                // Out of bounds check
                if (streamX[i] < 0 || streamY[i] < 0 || streamX[i] >= texWidth || streamY[i] >= texHeight) {
                    break;
                }
                // Error Calculation
                temp = flowFunction(streamX[i], streamY[i]);
                error[0] = (1.0 / 6.0) * (k4[0] - hf * temp[0]);
                error[1] = (1.0 / 6.0) * (k4[1] - hf * temp[1]);
                // Find the lower of the two errors
                if (error[0] < error[1]) {
                    errorLowest = error[1];
                }
                else {
                    errorLowest = error[0];
                }
                // Adaptive step by checking and changing h value
                let hstar = hf * Math.pow(Math.abs(0.9 * tol / errorLowest), 0.2);
                if (errorLowest > tol) {
                    hf = hstar; //loop again with new step size
                }
                else if (maxh < hstar) { //error low enough, new step size and break
                    hf = maxh;
                    break;
                }
                else {
                    hf = hstar;
                    break;
                }
            }
            // Out of bounds check
            if (streamX[i] < 0 || streamY[i] < 0 || streamX[i] >= texWidth || streamY[i] >= texHeight) {
                boundsF = 0;
                streamX[i] = -1;
                streamY[i] = -1;
            }
        }
        else { //out of bounds at beginning of loop
            streamX[i] = -1;
            streamY[i] = -1;
        }
    }
}
function flowFunction(x, y) {
    let theta;
    // Move circle to the middle of the screen
    x -= 300;
    y -= 300;
    // Error checking for straight up and down (Don't divide by 0)
    if (x != 0) {
        theta = Math.atan(y / x);
    }
    else {
        if (y > 0) {
            theta = Math.PI / 2;
        }
        else {
            theta = 3 * Math.PI / 2;
        }
    }
    if (x < 0) {
        theta += Math.PI;
    }
    // Adjust theta to get the perpendicular vector
    theta = theta + (Math.PI / 2);
    let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    //let radius = 10;
    let result = new Array(2);
    result[0] = radius * Math.cos(theta);
    result[1] = radius * Math.sin(theta);
    // This makes the image appear to be a circle
    if (radius > 300) {
        result[0] = 0;
        result[1] = 0;
    }
    return result;
}
/*
function flowFunction(x:number, y:number): number[] {
    let theta:number;

    // Move circle to the middle of the screen


    let result = new Array(2);
    result[0] = (3 * Math.pow(x, 2) * Math.pow(y, 2) + 1);
    result[1] = (2 * Math.pow(x, 3) * y);

    return result;

}
 */
/*
function closestVectorFieldPoint(x:number, y:number) {
    // x and y are locations in pixel space that have already been scaled to vector field space

    let xVectorField = vectorField[0][0];
    let yVectorField = vectorField[0][1];

    let closestPoint:number[] = vectorField[0];
    let closestValue:number = Math.sqrt(Math.pow(Math.abs(x-xVectorField), 2) + Math.pow(Math.abs(y-yVectorField), 2));
    for (let i = 1; i < vectorField.length; i++) {
        xVectorField = (vectorField[i][0] + 1) * (texWidth/3.5);
        yVectorField = (vectorField[i][1] + 0.5) * texHeight;

        let tempVal = Math.sqrt(Math.pow((x-xVectorField), 2) + Math.pow((y-yVectorField), 2));

        if (tempVal < closestValue) {
            closestValue = tempVal;
            closestPoint = vectorField[i];
        }
    }

    return closestPoint;
}
*/
// Drawing a new frame
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mv = lookAt(new vec4(0, 0, 3, 1), new vec4(0, 0, 0, 1), new vec4(0, 1, 0, 0));
    mv = mv.mult(rotateY(yAngle).mult(rotateX(xAngle)));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.activeTexture(gl.TEXTURE0); //we're using texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, checkerTex); //we want checkerTex on that texture unit
    gl.uniform1i(uTextureSampler, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
//# sourceMappingURL=visualizationFunctions.js.map