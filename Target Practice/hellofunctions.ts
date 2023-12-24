import {initShaders, vec4, flatten} from "./helperfunctions.js";

// This is the main javascript file for Target Practice

"use strict";
//we will want references to our WebGL objects
let gl:WebGLRenderingContext;
let canvas:HTMLCanvasElement;
let program:WebGLProgram;

let color:vec4; //this one lives in main memory
let ucolor:WebGLUniformLocation; //store location of shader uniform
let bufferId: WebGLBuffer;
let myTimer:number;

// Whether the rectangles are currently moving
let gameInProgress:number;

// In input mouse values
let xMouse:number;
let yMouse:number;

// The current number of targets left on the screen
let targetsRemaining:number;
// These two arrays store the location and directions of the targets
let targets = [];
let targetDirections = [];

// This sets the radius of the rectangles
let radiusX:number;
let radiusY:number;

// These variables set the range the speed will stay within
let upperSpeedBound:number;
let lowerSpeedBound:number;

//set up program when page first loads
window.onload = function init(){
    // A bunch of initializing important things
    radiusX = 0.03;
    radiusY = 0.055;
    gameInProgress = 0;
    targetsRemaining = 10;
    upperSpeedBound = 100;
    lowerSpeedBound = 500;

    // Setting up the canvas
    canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
    gl = canvas.getContext('webgl2') as WebGLRenderingContext;
    if (!gl){
        alert("WebGL isn't available");
    }

    // Setting up the shaders
    //take the vertex and fragment shaders and compile them into a shader program
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Setting background colors and stuff
    color = new vec4(1,1,1,1);//rgba for white
    ucolor = gl.getUniformLocation(program, "color");
    gl.uniform4fv(ucolor, color.flatten());

    //set up keyboard listener for stopping and starting the motion
    window.addEventListener("keydown", function(event:KeyboardEvent){
        switch (event.key) {
            case "m":
                if (!gameInProgress) {
                    myTimer = window.setInterval(update, 16);
                    gameInProgress = 1;
                    document.getElementById("details").innerHTML = "Keep clicking those squares! To stop the movement, press \"m\".";
                } else {
                    window.clearInterval(myTimer);
                    myTimer = null;
                    gameInProgress = 0;
                    document.getElementById("details").innerHTML = "Keep clicking those squares!  Press \"m\" to make the squares move.";
                }
                break;
        }
        //send main memory value over as uniform value
        gl.uniform4fv(ucolor, color.flatten());
        requestAnimationFrame(render); //we need a new frame, render() is our drawing function
    });

    // Adding a few more listeners for clicks and buttons
    canvas.addEventListener("click", mouseDownListener);
    document.getElementById("resetButton").onclick = reset;
    document.getElementById("gl-canvas").style.cursor = "crosshair";

    // Going through the final set up steps that will be done for every new game
    reset();
}

// This function is run everytime the frame updates
function update() {

    for (let i = 0; i < targetDirections.length; i+=2) {
        if (targets[i] != -999) {
        let newDirections:number[];
        // Checks whether the target has hit the edge
        if (targets[i] >= (1-radiusX) || targets[i+1] >= (1-radiusY) || targets[i] <= (-1+radiusX) || targets[i+1] <= (-1+radiusY)) {
            // If it has, it gives is good new direction with another method
            newDirections = pickDirection(targets[i], targets[i+1]);
            targetDirections[i] = newDirections[0];
            targetDirections[i+1] = newDirections[1];
        }
        targets[i] += targetDirections[i];
        targets[i+1] += targetDirections[i+1];
        }
    }
    // Makes the new triangles in their new spots if they are moving
    makeTriangles();
}

function pickDirection(oldX:number, oldY:number):number[] {
    // This method chooses a new direction by randomly finding a spot on the unit circle
    // Then it checks whether it is going the right direction
    // Finally it divides by a random number in a range to set the speed it will go in that direction
    let x:number = 0;
    let y:number = 0;
    let goodDirection = false;
    while (!goodDirection) {
        let u = Math.random();
        let v = Math.random();
        let longitude = 2 * Math.PI * u;
        let latitude = Math.acos(2 * v - 1);
        x = Math.sin(latitude) * Math.cos(longitude);
        y = Math.sin(latitude) * Math.sin(longitude);
        // Checking if new numbers are good or go out of bounds
        if ((oldX == 0) || (oldX >= (1-radiusX) && x < 0) || (oldX <= (-1+radiusX) && x > 0) || (oldY >= (1-radiusY) && y < 0) || (oldY <= (-1+radiusY) && y > 0)) {
            goodDirection = true;
        }
    }

    // Setting the speed and returning
    let speed1 = Math.floor(Math.random() * lowerSpeedBound) + upperSpeedBound;
    let speed2 = Math.floor(Math.random() * lowerSpeedBound) + upperSpeedBound;
    return [x/speed1, y/speed2];
}

// Sets up the game board back to initial state
function reset() {
    window.clearInterval(myTimer);
    myTimer = null;

    // If you just won a game, it will tell you good job
    if (targetsRemaining == 0) {
        document.getElementById("details").innerHTML = "You WON!! YAY!!  Press \"m\" to make the squares move.";
    } else {
        document.getElementById("details").innerHTML = "Click on all the squares to win the game! Press \"m\" to make the squares move.";
    }

    // Other various set up stuff
    gameInProgress = 0;
    targetsRemaining = 10;
    document.getElementById("score").innerHTML = "Remaining Squares: ".concat(targetsRemaining.toString());
    makeTriangleAndBuffer();
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    requestAnimationFrame(render);
}

// Loop through the list of rectangle centers and make some triangles
function makeTriangles() {
    let trianglePoints = []; //empty array
    //create 3 new triangle verts altered by mouse click offsets
    for (let i = 0; i < targets.length; i+=2) {
        if (targets[i] != -999) {
            trianglePoints.push(new vec4(targets[i] - radiusX, targets[i+1] - radiusY, 0, 1));
            trianglePoints.push(new vec4(targets[i] + radiusX, targets[i+1] + radiusY, 0, 1));
            trianglePoints.push(new vec4(targets[i] - radiusX, targets[i+1] + radiusY, 0, 1));

            trianglePoints.push(new vec4(targets[i] - radiusX, targets[i+1] - radiusY, 0, 1));
            trianglePoints.push(new vec4(targets[i] + radiusX, targets[i+1] + radiusY, 0, 1));
            trianglePoints.push(new vec4(targets[i] + radiusX, targets[i+1] - radiusY, 0, 1));
        }
    }

    // Then send them off to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(trianglePoints), gl.STATIC_DRAW);
    requestAnimationFrame(render); //we're ready for a new image to be drawn with this info
}

// If the mouse if down check whether it hit a rectangle
function mouseDownListener(event:MouseEvent){
    let rect:ClientRect = canvas.getBoundingClientRect(); //canvas has spacing to edge of window
    let canvasY:number = event.clientY - rect.top; //window -> canvas coordinates
    let flippedY:number = canvas.clientHeight - canvasY; //openGL wants origin lower left

    // Get the rectangle's coords
    yMouse = 2 * flippedY / canvas.clientHeight - 1;
    xMouse = 2 * (event.clientX - rect.left)/canvas.clientWidth - 1;

    // Loop through all the targets and if they are matching get rid of them
    for (let i = 0; i < targets.length; i+=2) {
        if (targets[i] != -999) {
            if (xMouse > targets[i] - radiusX && xMouse < targets[i] + radiusX && yMouse > targets[i + 1] - radiusY && yMouse < targets[i + 1] + radiusY) {
                targets[i] = -999;
                targets[i + 1] = -999;
                targetsRemaining--;
                document.getElementById("score").innerHTML = "Remaining Squares: ".concat(targetsRemaining.toString());
                if (targetsRemaining == 0) {
                    reset();
                }
            }
        }
    }

    // Make the triangles again without any deleted targets
    makeTriangles();
}

// Make the triangles, same as before just split into own method
function makeTriangleAndBuffer(){
    let trianglePoints:vec4[] = []; //empty array in main memory

    let ranNumX = 0;
    let ranNumY = 0;
    for (let i = 0; i < targetsRemaining*2; i+=2) {
        ranNumX = (Math.floor(Math.random() * (300 - 100) + 100) / 100) - 2; // I think this is right, but not entirely sure
        ranNumY = (Math.floor(Math.random() * (300 - 100) + 100) / 100) - 2;

        targets[i] = ranNumX;
        targets[i+1] = ranNumY;

        let newDirections:number[];
        newDirections = pickDirection(0, 0);
        targetDirections[i] = newDirections[0];
        targetDirections[i+1] = newDirections[1];
    }

    bufferId = gl.createBuffer();
    makeTriangles();
    let vPosition:GLint = gl.getAttribLocation(program, "vPosition"); //fetch by name
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

// Draw only one frame at a time
function render(){
    //start by clearing any buffers
    gl.clear(gl.COLOR_BUFFER_BIT);
    //draw triangles, start at index 0, there will be 3 verts total
    gl.drawArrays(gl.TRIANGLES, 0, targetsRemaining*6);
}