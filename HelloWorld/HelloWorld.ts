"use strict";

// Sorry about the complicated maneuvering system

import {
    initFileShaders,
    perspective,
    vec2,
    vec4,
    mat4,
    flatten,
    lookAt,
    translate,
    rotateX,
    rotateY,
    rotateZ, scalem, vec3
} from '../helperfunctions.js';
let gl:WebGLRenderingContext;
let program:WebGLProgram;

//uniform locations
let umv:WebGLUniformLocation; //uniform for mv matrix
let uproj:WebGLUniformLocation; //uniform for projection matrix
let camera_position:WebGLUniformLocation;
let ambient_light:WebGLUniformLocation;
let umode:WebGLUniformLocation;

//matrices
let mv:mat4; //local mv
let p:mat4; //local projection

//shader variable indices for material properties
let vPosition:GLint;
let vNormal:GLint;
let vTangent:GLint;
let vTexCoord:GLint;

// Texture Variables
let uTextureSampler:WebGLUniformLocation;//this will be a pointer to our sampler2D
let uSpecularSampler:WebGLUniformLocation;//this will be a pointer to our sampler2D
let uNightSampler:WebGLUniformLocation;//this will be a pointer to our sampler2D
let uCloudSampler:WebGLUniformLocation;//this will be a pointer to our sampler2D
let uNormalSampler:WebGLUniformLocation;//this will be a pointer to our sampler2D

// Light Information
let light_color:WebGLUniformLocation; // and magnitude or brightness
let light_position:WebGLUniformLocation;

// Information about which components are on
let specular_on:WebGLUniformLocation;
let base_on:WebGLUniformLocation;
let night_on:WebGLUniformLocation;
let normal_on:WebGLUniformLocation;

// Specular Information
let vSpecularColor:GLint; //highlight color
let vSpecularExponent:GLint; // how shiny is the thing, higher = shinier

// Variables to set that are passed into the shaders
let cameraPosition:vec3;
let lookAtSpot:vec4;
let ambient_level:vec4;
let lightColor:vec4;
let lightPosition:vec4;
let specularOn:number;
let baseOn:number;
let nightOn:number;
let cloudsOn:number;
let normalOn:number;
let specularExponent:number;
let specularColor:vec4;

//document elements
let canvas:HTMLCanvasElement;

//interaction and rotation state
let xAngle:number;
let yAngle:number;
let zoom:number = 45;

// Camera, Zoom, and Light Variables
let zoomIn:boolean;
let zoomOut:boolean;

let dollyXPositive:boolean;
let dollyYPositive:boolean;
let dollyZPositive:boolean;
let dollyXNegative:boolean;
let dollyYNegative:boolean;
let dollyZNegative:boolean;

let increment:number;
let upperLimit:number;
let lowerLimit:number;
let lightXPositive:boolean;
let lightYPositive:boolean;
let lightZPositive:boolean;
let lightXNegative:boolean;
let lightYNegative:boolean;
let lightZNegative:boolean;

let lookAtXPositive:boolean;
let lookAtYPositive:boolean;
let lookAtZPositive:boolean;
let lookAtXNegative:boolean;
let lookAtYNegative:boolean;
let lookAtZNegative:boolean;

// More Texture Variables
let earthtex:WebGLTexture;
let earthimage:HTMLImageElement;
let shinyearthtex:WebGLTexture;
let shinyearthimage:HTMLImageElement;
let nightearthtex:WebGLTexture;
let nightearthimage:HTMLImageElement;
let normalearthtex:WebGLTexture;
let normalearthimage:HTMLImageElement;
let cloudearthtex:WebGLTexture;
let cloudearthimage:HTMLImageElement;

// The number of vertices in the globe, which is used for rendering
let globeVertices:number;

window.onload = function init() {

    canvas = document.getElementById("gl-canvas") as HTMLCanvasElement ;
    gl = canvas.getContext('webgl2', {antialias:true}) as WebGLRenderingContext;
    if (!gl) {
        alert("WebGL isn't available");
    }

    //black background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Reading in all the information from the Shaders
    program = initFileShaders(gl, "vshader-world.glsl", "fshader-world.glsl");
    gl.useProgram(program);
    umv = gl.getUniformLocation(program, "model_view");
    uproj = gl.getUniformLocation(program, "projection");
    umode = gl.getUniformLocation(program, "mode");
    camera_position = gl.getUniformLocation(program, "camera_position");
    ambient_light = gl.getUniformLocation(program, "ambient_light");
    specular_on = gl.getUniformLocation(program, "specular_on");
    base_on = gl.getUniformLocation(program, "base_on");
    night_on = gl.getUniformLocation(program, "night_on");
    normal_on = gl.getUniformLocation(program, "normal_on");
    light_color = gl.getUniformLocation(program, "light_color");
    light_position = gl.getUniformLocation(program, "light_position");
    vSpecularColor = gl.getAttribLocation(program, "vSpecularColor");
    vSpecularExponent = gl.getAttribLocation(program, "vSpecularExponent");
    vNormal = gl.getAttribLocation(program, "vNormal");
    vTangent = gl.getAttribLocation(program, "vTangent");

    // Specifically the Textures
    uTextureSampler = gl.getUniformLocation(program, "textureSampler");//get reference to sampler2D
    uSpecularSampler = gl.getUniformLocation(program, "specularSampler");//get reference to sampler2D
    uNightSampler = gl.getUniformLocation(program, "nightSampler");//get reference to sampler2D
    uCloudSampler = gl.getUniformLocation(program, "cloudSampler");//get reference to sampler2D
    uNormalSampler = gl.getUniformLocation(program, "normalSampler");//get reference to sampler2D

    //set up basic perspective viewing
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    p = perspective(zoom, (canvas.clientWidth / canvas.clientHeight), 1, 20);
    gl.uniformMatrix4fv(uproj, false, p.flatten());

    // Initialize variables to be where I want them
    cameraPosition = new vec3(0, 0, 5);
    ambient_level = new vec4(0.2, 0.2, 0.2, 1);
    lightColor = new vec4(1, 1, 1, 1);
    lightPosition = new vec4(25, 0, 0, 1);
    lookAtSpot = new vec4(0, 0, 0, 1);

    // I turn everything on at the beginning
    specularOn = 1;
    baseOn = 1;
    nightOn = 1;
    cloudsOn = 1;
    normalOn = 1;

    // Set Specular values
    specularExponent = 20.0;
    specularColor = new vec4(0.6, 0.6, 0.6, 1.0);

    //don't forget to load in the texture files to main memory
    initTextures();
    makeSquareAndBuffer();

    //initialize rotation angles
    xAngle = 0;
    yAngle = 0;

    // Use these values to change how the light can move
    // Change these if you want more or less light movement
    increment = 1;
    upperLimit = 300;
    lowerLimit = -300;

    // All the key listeners
    // Refer to HTML to see what each of them does
    window.addEventListener("keydown" ,event=>{
        switch(event.key) {
            case "ArrowDown":
                zoomOut = true;
                break;
            case "ArrowUp":
                zoomIn = true;
                break;
            case "ArrowLeft":
                yAngle += 90;
                break;
            case "ArrowRight":
                yAngle -= 90;
                break;
            case "r":
                cameraPosition = new vec3(0, 0, 5);
                yAngle = 0;
                zoom = 45;
                lookAtSpot = new vec4(0, 0, 0, 1);
                lightPosition = new vec4(25, 0, 0, 1);
                break;
            case "1":
                lightXNegative = true;
                break;
            case "2":
                lightXPositive = true;
                break;
            case "3":
                lightYNegative = true;
                break;
            case "4":
                lightYPositive = true;
                break;
            case "5":
                lightZNegative = true;
                break;
            case "6":
                lightZPositive = true;
                break;
            case "t":
                dollyXNegative = true;
                break;
            case "y":
                dollyXPositive = true;
                break;
            case "u":
                dollyYNegative = true;
                break;
            case "i":
                dollyYPositive = true;
                break;
            case "o":
                dollyZNegative = true;
                break;
            case "p":
                dollyZPositive = true;
                break;

            case "f":
                lookAtXNegative = true;
                break;
            case "g":
                lookAtXPositive = true;
                break;
            case "h":
                lookAtYNegative = true;
                break;
            case "j":
                lookAtYPositive = true;
                break;
            case "k":
                lookAtZNegative = true;
                break;
            case "l":
                lookAtZPositive = true;
                break;

            case "s":
                if (specularOn == 1) {
                    specularOn = 0;
                } else {
                    specularOn = 1;
                }
                break;
            case "b":
                if (baseOn == 1) {
                    baseOn = 0;
                } else {
                    baseOn = 1;
                }
                break;
            case "n":
                if (nightOn == 1) {
                    nightOn = 0;
                } else {
                    nightOn = 1;
                }
                break;
            case "c":
                if (cloudsOn == 1) {
                    cloudsOn = 0;
                } else {
                    cloudsOn = 1;
                }
                break;
            case "m":
                if (normalOn == 1) {
                    normalOn = 0;
                } else {
                    normalOn = 1;
                }
                break;
        }

        requestAnimationFrame(render); // Now we need a new frame since we made a change
    });

    window.addEventListener("keyup" ,event=>{
        switch(event.key) {
            case "ArrowDown":
                zoomOut = false;
                break;
            case "ArrowUp":
                zoomIn = false;
                break;
            case "1":
                lightXNegative = false;
                break;
            case "2":
                lightXPositive = false;
                break;
            case "3":
                lightYNegative = false;
                break;
            case "4":
                lightYPositive = false;
                break;
            case "5":
                lightZNegative = false;
                break;
            case "6":
                lightZPositive = false;
                break;
            case "t":
                dollyXNegative = false;
                break;
            case "y":
                dollyXPositive = false;
                break;
            case "u":
                dollyYNegative = false;
                break;
            case "i":
                dollyYPositive = false;
                break;
            case "o":
                dollyZNegative = false;
                break;
            case "p":
                dollyZPositive = false;
                break;
            case "f":
                lookAtXNegative = false;
                break;
            case "g":
                lookAtXPositive = false;
                break;
            case "h":
                lookAtYNegative = false;
                break;
            case "j":
                lookAtYPositive = false;
                break;
            case "k":
                lookAtZNegative = false;
                break;
            case "l":
                lookAtZPositive = false;
                break;
        }


        requestAnimationFrame(render);//and now we need a new frame since we made a change
    });

    requestAnimationFrame(render);

    window.setInterval(update, 16); //target 60 frames per second

};

function update(){
    // This is setting the natural rotation of the earth
    yAngle += 0.1;

    if (zoomOut && zoom < 170) {
        zoom += 1;
    }
    if (zoomIn && zoom > 2) {
        zoom -= 1;
    }

    increment = 1;
    if (lightXNegative && lightPosition[0] > lowerLimit) {
        lightPosition[0] -= increment;
    }

    if (lightXPositive && lightPosition[0] < upperLimit) {
        lightPosition[0] += increment;
    }

    if (lightYNegative && lightPosition[1] > lowerLimit) {
        lightPosition[1] -= increment;
    }

    if (lightYPositive && lightPosition[1] < upperLimit) {
        lightPosition[1] += increment;
    }

    if (lightZNegative && lightPosition[2] > lowerLimit) {
        lightPosition[2] -= increment;
    }

    if (lightZPositive && lightPosition[2] < upperLimit) {
        lightPosition[2] += increment;
    }

    increment = 0.1;
    if (dollyXNegative && cameraPosition[0] > lowerLimit) {
        cameraPosition[0] -= increment;
    }

    if (dollyXPositive && cameraPosition[0] < upperLimit) {
        cameraPosition[0] += increment;
    }

    if (dollyYNegative && cameraPosition[1] > lowerLimit) {
        cameraPosition[1] -= increment;
    }

    if (dollyYPositive && cameraPosition[1] < upperLimit) {
        cameraPosition[1] += increment;
    }

    if (dollyZNegative && cameraPosition[2] > lowerLimit) {
        cameraPosition[2] -= increment;
    }

    if (dollyZPositive && cameraPosition[2] < upperLimit) {
        cameraPosition[2] += increment;
    }

    increment = 0.05;
    if (lookAtXNegative && lookAtSpot[0] > lowerLimit) {
        lookAtSpot[0] -= increment;
    }

    if (lookAtXPositive && lookAtSpot[0] < upperLimit) {
        lookAtSpot[0] += increment;
    }

    if (lookAtYNegative && lookAtSpot[1] > lowerLimit) {
        lookAtSpot[1] -= increment;
    }

    if (lookAtYPositive && lookAtSpot[1] < upperLimit) {
        lookAtSpot[1] += increment;
    }

    if (lookAtZNegative && lookAtSpot[2] > lowerLimit) {
        lookAtSpot[2] -= increment;
    }

    if (lookAtZPositive && lookAtSpot[2] < upperLimit) {
        lookAtSpot[2] += increment;
    }

    requestAnimationFrame(render);
}

//Make a square and send it over to the graphics card
function makeSquareAndBuffer(){
    let globePoints:any[] = []; //empty array to add vertices to for the sphere

    // Keeps track of how many vertices are created so they can all be rendered
    globeVertices = 0;

    // Initialize Variables for sphere creation
    let point1:vec4;
    let point2:vec4;
    let tan:vec4;
    // Determines how detailed the sphere is
    let numOfPoints = 500;
    // Sets the radius of the sphere
    let radius = 1.5;
    // Calculates how large each segment of the sphere is using teh number of total segments
    let step:number = (360.0 / numOfPoints)*(Math.PI / 180.0);

    // Loops in both the horizontal and vertical components of the sphere
    for (let lat:number = 0; lat <= Math.PI; lat += step){ //latitude
        for (let lon:number = 0; lon <= 2*Math.PI; lon += step){ //longitude

            // This is where I calculate my tangent vector for the sphere

            // --- The Explanation ---
            // To calculate the tangent vector, I am subtracting two points used the form the triangles
            // The points I am subtracting have the same latitude values so they are the same vertically,
            // but they are separated by the step value in the horizontal direction
            // The subtraction will result in a vector that faces either east or west
            // Since I wanted a vector that faced west, I subtracted the point without the step from the point with the step
            // I did this because my initial point doesn't have the step and my final point does have the step
            // I do this for each new set of lat and log values since the tangent changes each time

            // Additionally, I use the same tangent vector for the entire square because they all point in the same direction

            // Here I am setting the two points
            point1 = new vec4(Math.sin(lat) * Math.sin(lon) ,Math.cos(lat) , Math.cos(lon) * Math.sin(lat), 1.0);
            point2 = new vec4(Math.sin(lat) * Math.sin(lon + step), Math.cos(lat),Math.cos(lon + step) * Math.sin(lat),  1.0);
            // And here I am subtracting them
            tan = point2.subtract(point1);

            // ORDER OF PUSH
            // 1. point
            // 2. normal vector
            // 3. texture coordinate
            // 4. tangent vector

            //Adding the point for triangle 1
            globePoints.push(new vec4(radius*Math.sin(lat) * Math.sin(lon) ,radius*Math.cos(lat) , radius*Math.cos(lon) * Math.sin(lat), 1.0)); // point
            globePoints.push(new vec4(Math.sin(lat) * Math.sin(lon), Math.cos(lat),Math.cos(lon) * Math.sin(lat),  0.0)); // normal vector
            globePoints.push(new vec2(lon/(2*Math.PI), -lat/Math.PI)); // texture coordinate
            globePoints.push(tan); // tangent vector

            globePoints.push(new vec4(radius*Math.sin(lat) * Math.sin(lon + step), radius*Math.cos(lat),radius*Math.sin(lat) * Math.cos(lon + step),  1.0)); // point
            globePoints.push(new vec4(Math.sin(lat) * Math.sin(lon + step),  Math.cos(lat),Math.sin(lat) * Math.cos(lon + step), 0.0)); // normal vector
            globePoints.push(new vec2((lon + step)/(2*Math.PI), -lat/Math.PI)); // texture coordinate
            globePoints.push(tan); // tangent vector

            globePoints.push(new vec4(radius*Math.sin(lat + step) * Math.sin(lon + step), radius*Math.cos(lat + step),radius*Math.cos(lon + step) * Math.sin(lat + step),  1.0)); // point
            globePoints.push(new vec4(Math.sin(lat + step) * Math.sin(lon + step), Math.cos(lat + step),Math.cos(lon + step) * Math.sin(lat + step),  0.0)); // normal vector
            globePoints.push(new vec2((lon + step)/(2*Math.PI), -(lat + step)/Math.PI)); // texture coordinate
            globePoints.push(tan); // tangent vector

            //Adding the point for triangle 2
            globePoints.push(new vec4(radius*Math.sin(lat + step) * Math.sin(lon + step),  radius*Math.cos(lat + step),radius*Math.cos(lon + step) * Math.sin(lat + step), 1.0)); // point
            globePoints.push(new vec4(Math.sin(lat + step) * Math.sin(lon + step),  Math.cos(lat + step),Math.cos(lon + step) * Math.sin(lat + step), 0.0)); // normal vector
            globePoints.push(new vec2((lon + step)/(2*Math.PI), -(lat + step)/Math.PI)); // texture coordinate
            globePoints.push(tan); // tangent vector

            globePoints.push(new vec4(radius*Math.sin(lat + step) * Math.sin(lon), radius*Math.cos(lat + step),radius*Math.sin(lat + step) * Math.cos(lon),  1.0)); // point
            globePoints.push(new vec4(Math.sin(lat + step) * Math.sin(lon), Math.cos(lat + step), Math.sin(lat + step) * Math.cos(lon), 0.0)); // normal vector
            globePoints.push(new vec2(lon/(2*Math.PI), -(lat + step)/Math.PI)); // texture coordinate
            globePoints.push(tan); // tangent vector

            globePoints.push(new vec4(radius*Math.sin(lat) * Math.sin(lon), radius*Math.cos(lat),radius*Math.cos(lon) * Math.sin(lat),  1.0)); // point
            globePoints.push(new vec4(Math.sin(lat) * Math.sin(lon),  Math.cos(lat),Math.cos(lon) * Math.sin(lat), 0.0)); // normal vector
            globePoints.push(new vec2(lon/(2*Math.PI), -lat/Math.PI)); // texture coordinate
            globePoints.push(tan); // tangent vector

            // Add the six vertices form this iteration to the total count
            globeVertices += 6;
        }
    }

    //we need some graphics memory for this information
    let bufferId:WebGLBuffer = gl.createBuffer();
    //tell WebGL that the buffer we just created is the one we want to work with right now
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //send the local data over to this buffer on the graphics card.  Note our use of Angel's "flatten" function
    gl.bufferData(gl.ARRAY_BUFFER, flatten(globePoints), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 56, 0); //stride is 56 bytes total for position, normal, texcoord, and tangent vector
    gl.enableVertexAttribArray(vPosition);

    vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 56, 16); //stride is 56 bytes total for position, normal, texcoord, and tangent vector
    gl.enableVertexAttribArray(vNormal);

    vTexCoord = gl.getAttribLocation(program, "texCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 56, 32); //stride is 56 bytes total for position, normal, texcoord, and tangent vector
    gl.enableVertexAttribArray(vTexCoord);

    vTangent = gl.getAttribLocation(program, "vTangent");
    gl.vertexAttribPointer(vTangent, 4, gl.FLOAT, false, 56, 40); //stride is 56 bytes total for position, normal, texcoord, and tangent vector
    gl.enableVertexAttribArray(vTangent);

}

// This function is where I am initializing all of my textures
function initTextures() {
    // The base earth texture
    earthtex = gl.createTexture();
    earthimage = new Image();
    earthimage.onload = function() { handleTextureLoaded(earthimage, earthtex); };
    earthimage.src = 'Earth.png';

    // The specular map for the shiny component
    shinyearthtex = gl.createTexture();
    shinyearthimage = new Image();
    shinyearthimage.onload = function() { handleTextureLoaded(shinyearthimage, shinyearthtex); };
    shinyearthimage.src = 'EarthSpec.png';

    // The night texture for the night side of the earth
    nightearthtex = gl.createTexture();
    nightearthimage = new Image();
    nightearthimage.onload = function() { handleTextureLoaded(nightearthimage, nightearthtex); };
    nightearthimage.src = 'EarthNight.png';

    // The normal texture to make the earth appear bumpy where there are mountains
    normalearthtex = gl.createTexture();
    normalearthimage = new Image();
    normalearthimage.onload = function() { handleTextureLoaded(normalearthimage, normalearthtex); };
    normalearthimage.src = 'EarthNormal.png';

    // The cloud texture for the cloud layer above the earth
    cloudearthtex = gl.createTexture();
    cloudearthimage = new Image();
    cloudearthimage.onload = function() { handleTextureLoaded(cloudearthimage, cloudearthtex); };
    cloudearthimage.src = 'EarthCloud.png';
}

// This function is run for each of the textures
function handleTextureLoaded(image:HTMLImageElement, texture:WebGLTexture) {

    // I am using Linear-Linear Mipmapping
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  //disagreement over what direction Y axis goes
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let anisotropic_ext = gl.getExtension('EXT_texture_filter_anisotropic');
    gl.texParameterf(gl.TEXTURE_2D, anisotropic_ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);

    gl.bindTexture(gl.TEXTURE_2D, null);
}


// This function is called each time I am drawing a frame
function render(){
    // Use the only program I have
    gl.useProgram(program);

    p = perspective(zoom, (canvas.clientWidth / canvas.clientHeight), 1, 20);
    gl.uniformMatrix4fv(uproj, false, p.flatten());

    // Clear out the previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Position camera 5 units back from origin, look at the origin, and have positive y be the up direction
    mv = lookAt(new vec4(cameraPosition[0], cameraPosition[1], cameraPosition[2], 0), lookAtSpot, new vec4(0, 1, 0, 0));

    //rotate if the user has been dragging the mouse around
    let camera:mat4 = mv;

    // Send all the important stuff over to the shaders
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.uniform4fv(camera_position, mv.mult(new vec4(cameraPosition[0], cameraPosition[1], cameraPosition[2], 1)).flatten());
    gl.uniform4fv(ambient_light, ambient_level);
    gl.uniform4fv(light_color, lightColor.flatten());
    gl.uniform4fv(light_position, lightPosition.flatten());
    gl.uniform1i(specular_on, specularOn); // switch to integer
    gl.uniform1i(base_on, baseOn);
    gl.uniform1i(night_on, nightOn);
    gl.uniform1i(normal_on, normalOn);
    gl.vertexAttrib4fv(vSpecularColor, specularColor);
    gl.vertexAttrib1f(vSpecularExponent, specularExponent);

    // Even the textures
    gl.uniform1i(uTextureSampler, 0);
    gl.uniform1i(uSpecularSampler, 1);
    gl.uniform1i(uNightSampler, 2);
    gl.uniform1i(uCloudSampler, 3);
    gl.uniform1i(uNormalSampler, 4);

    // Bind the Textures to the correct locations
    // Should match with the uniform locations above
    gl.activeTexture(gl.TEXTURE0); //we're using texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, earthtex);
    gl.activeTexture(gl.TEXTURE1); //we're using texture unit 1
    gl.bindTexture(gl.TEXTURE_2D, shinyearthtex);
    gl.activeTexture(gl.TEXTURE2); //we're using texture unit 2
    gl.bindTexture(gl.TEXTURE_2D, nightearthtex);
    gl.activeTexture(gl.TEXTURE3); //we're using texture unit 3
    gl.bindTexture(gl.TEXTURE_2D, cloudearthtex);
    gl.activeTexture(gl.TEXTURE4); //we're using texture unit 4
    gl.bindTexture(gl.TEXTURE_2D, normalearthtex);

    //EARTH
    gl.uniform1i(umode,1);
    mv = mv.mult(rotateY((120+yAngle)).mult(rotateX(xAngle)));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.drawArrays(gl.TRIANGLES, 0, globeVertices);

    // CLOUDS
    // Only render them if the clouds are turned on
    let scale:number;
    if (cloudsOn == 1) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);

        gl.uniform1i(umode,2);
        scale = 1.005;
        mv = camera.mult(rotateY(120+(yAngle/1.5)).mult(rotateX(xAngle))).mult(scalem(scale, scale, scale));
        gl.uniformMatrix4fv(umv, false, mv.flatten());
        gl.drawArrays(gl.TRIANGLES, 0, globeVertices);

        //and now put it back to appropriate values for opaque objects
        gl.disable(gl.BLEND);
        gl.depthMask(true);
    }
}