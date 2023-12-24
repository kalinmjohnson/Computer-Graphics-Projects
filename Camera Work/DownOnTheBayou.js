"use strict";
//it will be handy to have references to some of our WebGL related objects
// Here are all my global variables
let gl;
let canvas;
let program;
let bufferId;
let umv;
let uproj;
let vPosition; // index of the vPosition vertex attribute in our shader
let vColor; // index of the vColor vertex attribute in our shader
// Boat stuff
let spinRight;
let spinLeft;
let moveForward;
let moveBackwards;
let fanRotAngleZ;
let fanOffsetY;
let rudderRotAngleY;
let rudderOffsetX;
let rudderOffsetZ;
let rudderMag;
let boatRotAngleY;
let boatOffsetX;
let boatOffsetZ;
let boatVelocity;
let spotlightRight;
let spotlightLeft;
let spotlight;
let numOfPoints;
// Camera Variables: 1 for free roam, 2 for overhead, 3 for chase, 4 for spotlight
let cameraMode;
let zoomIn;
let zoomOut;
let zoom;
let dollyIn;
let dollyOut;
let dollyX;
let dollyY;
let dollyZ;
let lookAtOrigin;
let lookAtX;
let lookAtY;
let lookAtZ;
let upX;
let upY;
let upZ;
let mode1zoom;
let mode1dollyX;
let mode1dollyY;
// Imports for set up from the other file
import { getCirclePoints, ScenePoints } from "./SetUpFunctions.js";
import { initShaders, vec4, flatten, perspective, translate, lookAt, rotateX, rotateY, rotateZ, } from './helperfunctions.js';
//We want some set up to happen immediately when the page loads
window.onload = function init() {
    //fetch reference to the canvas element we defined in the html file
    canvas = document.getElementById("gl-canvas");
    //grab the WebGL 2 context for that canvas.  This is what we'll use to do our drawing
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL isn't available");
    }
    //Take the vertex and fragment shaders we provided and compile them into a shader program
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program); //and we want to use that program for our rendering
    // Setting up matrices
    umv = gl.getUniformLocation(program, "model_view");
    uproj = gl.getUniformLocation(program, "projection");
    // Initializing boolean variables
    spinRight = spinLeft = moveBackwards = moveForward = false;
    spotlightRight = spotlightLeft = false;
    // Initializing number variables
    fanRotAngleZ = boatRotAngleY = rudderRotAngleY = boatOffsetX = boatOffsetZ = 0;
    fanOffsetY = 0.05;
    boatVelocity = 0.01;
    rudderMag = -0.065;
    rudderOffsetZ = rudderMag * Math.cos(boatRotAngleY * (Math.PI / 180));
    rudderOffsetX = rudderMag * Math.sin(boatRotAngleY * (Math.PI / 180));
    numOfPoints = 50;
    resetCamera();
    // Key listeners for all the options including moving the boat and camera
    // Each of the camera modes sets several constants that are either constants for where the camera is points or zoom/dolly values
    // Each of these were choosen because they made sense or becasue they looked good
    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowDown":
                moveBackwards = true;
                break;
            case "ArrowUp":
                moveForward = true;
                break;
            case "ArrowLeft":
                spinLeft = true;
                break;
            case "ArrowRight":
                spinRight = true;
                break;
            case "a":
                spotlightLeft = true;
                break;
            case "d":
                spotlightRight = true;
                break;
            case "1":
                cameraMode = 1;
                // looking at the base of the water
                lookAtY = 0;
                // up is in the direction of the water's normal vector
                upY = 1;
                upX = upZ = 0;
                // The mode1 variables are to save the values when we switch to a different mode
                zoom = mode1zoom;
                dollyX = mode1dollyX;
                dollyY = mode1dollyY;
                dollyZ = 0;
                break;
            case "2":
                cameraMode = 2;
                // looking at the base of the origin
                lookAtY = 0;
                // up is no longer the normal vector but something that is calcualted in the update function
                upY = 0;
                dollyX = 1;
                dollyY = 90;
                zoom = 1;
                break;
            case "3":
                cameraMode = 3;
                // look at something slightly above the water, just looked better
                lookAtY = 0.1;
                // up is the normal vector again
                upY = 1;
                upX = upZ = 0;
                // Things that looked nice
                dollyY = 3;
                zoom = 5;
                break;
            case "4":
                cameraMode = 4;
                // look slightly above the water again
                lookAtY = 0.1;
                // up is the normal vector
                upY = 1;
                upX = upZ = 0;
                // zoom and location settings
                zoom = 55;
                dollyY = 0.1;
                break;
            case "x":
                if (cameraMode == 1) {
                    zoomIn = true;
                }
                break;
            case "z":
                if (cameraMode == 1) {
                    zoomOut = true;
                }
                break;
            case "q":
                if (cameraMode == 1) {
                    dollyIn = true;
                }
                break;
            case "e":
                if (cameraMode == 1) {
                    dollyOut = true;
                }
                break;
            case "f":
                if (cameraMode == 1) {
                    if (lookAtOrigin) {
                        lookAtOrigin = false;
                    }
                    else {
                        lookAtOrigin = true;
                    }
                    ;
                }
                break;
            case "r":
                if (cameraMode == 1) {
                    resetCamera();
                }
                break;
        }
        requestAnimationFrame(render); //and now we need a new frame since we made a change
    });
    window.addEventListener("keyup", function (event) {
        switch (event.key) {
            case "ArrowDown":
                moveBackwards = false;
                break;
            case "ArrowUp":
                moveForward = false;
                break;
            case "ArrowLeft":
                spinLeft = false;
                break;
            case "ArrowRight":
                spinRight = false;
                break;
            case "a":
                spotlightLeft = false;
                break;
            case "d":
                spotlightRight = false;
                break;
            case "x":
                if (cameraMode == 1) {
                    zoomIn = false;
                }
                break;
            case "z":
                if (cameraMode == 1) {
                    zoomOut = false;
                }
                break;
            case "q":
                if (cameraMode == 1) {
                    dollyIn = false;
                }
                break;
            case "e":
                if (cameraMode == 1) {
                    dollyOut = false;
                }
                break;
        }
        requestAnimationFrame(render); //and now we need a new frame since we made a change
    });
    makeWaterBuffer(gl, bufferId, program, vPosition, vColor);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    window.setInterval(update, 16); //target 60 frames per second
};
function makeWaterBuffer(gl, bufferId, program, vPosition, vColor) {
    // This method is in the other file because it is a lot of code
    let waterpoints = ScenePoints(numOfPoints);
    // More initial set up steps
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(waterpoints), gl.STATIC_DRAW);
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(vPosition);
    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 32, 16);
    gl.enableVertexAttribArray(vColor);
}
// This function is used to reset the camera in mode 1 and is used at the beginning to set initial values
function resetCamera() {
    cameraMode = dollyX = dollyY = mode1dollyX = mode1dollyY = upY = 1;
    zoom = mode1zoom = 60.0;
    lookAtX = lookAtY = lookAtZ = 0;
    upX = upZ = dollyZ = spotlight = 0;
    zoomIn = zoomOut = dollyIn = dollyOut = false;
    lookAtOrigin = true;
}
//do a bunch of checks and request new frame
function update() {
    // Calculating spin stuff
    if (spinLeft) {
        boatRotAngleY += 3;
        rudderRotAngleY = -20;
    }
    else if (spinRight) {
        boatRotAngleY -= 3;
        rudderRotAngleY = 20;
    }
    else {
        rudderRotAngleY = 0;
    }
    // Calculating rudder positioning using unit circle
    rudderOffsetZ = rudderMag * Math.cos(boatRotAngleY * (Math.PI / 180));
    rudderOffsetX = rudderMag * Math.sin(boatRotAngleY * (Math.PI / 180));
    // Calculating movement forward and backward
    // The if statements are to stop the boat at the edge.
    if (moveForward) {
        let z = boatVelocity * Math.cos(boatRotAngleY * (Math.PI / 180));
        let x = boatVelocity * Math.sin(boatRotAngleY * (Math.PI / 180));
        if (boatOffsetZ + z < 1 && boatOffsetZ + z > -1 && boatOffsetX + x < 1 && boatOffsetX + x > -1) {
            if ((boatOffsetZ + z < 0.7 - 0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17)) && (boatOffsetZ + z > -0.7 + 0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17))) {
                boatOffsetZ += z;
                boatOffsetX += x;
                fanRotAngleZ += 9;
            }
        }
    }
    if (moveBackwards) {
        let z = boatVelocity * Math.cos(boatRotAngleY * (Math.PI / 180));
        let x = boatVelocity * Math.sin(boatRotAngleY * (Math.PI / 180));
        if (boatOffsetZ - z < 1 && boatOffsetZ - z > -1 && boatOffsetX - x < 1 && boatOffsetX - x > -1) {
            if ((boatOffsetZ + z < 0.7 - 0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17)) && (boatOffsetZ + z > -0.7 + 0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17))) {
                boatOffsetZ -= z;
                boatOffsetX -= x;
                fanRotAngleZ -= 9;
            }
        }
    }
    // Adjust spotlight angle if necessary
    if (spotlightRight && spotlight > -90) {
        spotlight -= 3;
    }
    if (spotlightLeft && spotlight < 90) {
        spotlight += 3;
    }
    // Adjust zoom if in correct mode and key pressed
    // Also, don't let them zoom in or out too far
    // For all these values I choose what felt reasonable :)
    if (zoomIn && zoom > 5) {
        zoom -= 0.5;
        mode1zoom = zoom;
    }
    if (zoomOut && zoom < 160) {
        zoom += 0.5;
        mode1zoom = zoom;
    }
    // Adjust dolly if in correct mode and key pressed
    // Also, don't let them dolly in or out too far
    // Keep track of value for future if mode changes
    if (dollyIn && dollyX > 0.2) {
        dollyX -= 0.05;
        mode1dollyX = dollyX;
    }
    if (dollyOut && dollyX < 7) {
        dollyX += 0.05;
        mode1dollyX = dollyX;
    }
    // Toggle between looking at the origin and at the boat
    if (lookAtOrigin) {
        lookAtX = lookAtZ = 0;
    }
    else {
        lookAtX = boatOffsetX;
        lookAtZ = boatOffsetZ;
    }
    // For camera mode 2: always look at the spot the boat is, which is the offset in the appropriate direction
    // the up direction is the x/z component of the rotation of the boat.  This comes from basic trig
    if (cameraMode == 2) {
        lookAtX = boatOffsetX;
        lookAtZ = boatOffsetZ;
        upX = Math.sin(boatRotAngleY * (Math.PI / 180));
        upZ = Math.cos(boatRotAngleY * (Math.PI / 180));
    }
    // For camera mode 3: always look at the spot the boat is, which is the offset in the appropriate direction
    // The location of the camera starts right above the boat.  Then, it is moved backwards in the opposite direction of the rotation angle
    // The rotation angle keeps track of the front of the back, so the camera will look at the back of the boat
    // The distance back that it is is the camera radius, which i choose because it looked best
    let cameraRadius;
    if (cameraMode == 3) {
        cameraRadius = 6;
        lookAtX = boatOffsetX;
        lookAtZ = boatOffsetZ;
        dollyX = boatOffsetX - cameraRadius * Math.sin(boatRotAngleY * (Math.PI / 180));
        dollyZ = boatOffsetZ - cameraRadius * Math.cos(boatRotAngleY * (Math.PI / 180));
    }
    // For camera mode 4: the camera is located on the front of the boat, which is found using teh boat offset plus an additional distance in the direction it is facing
    // the camera is looking at the spot in the same direction the spotlight is facing and a certain radius in front of that as the distance
    if (cameraMode == 4) {
        cameraRadius = 0.5;
        lookAtX = boatOffsetX + cameraRadius * Math.sin((boatRotAngleY + spotlight) * (Math.PI / 180));
        lookAtZ = boatOffsetZ + cameraRadius * Math.cos((boatRotAngleY + spotlight) * (Math.PI / 180));
        cameraRadius = 0.03;
        dollyX = boatOffsetX + cameraRadius * Math.sin(boatRotAngleY * (Math.PI / 180));
        dollyZ = boatOffsetZ + cameraRadius * Math.cos(boatRotAngleY * (Math.PI / 180));
    }
    requestAnimationFrame(render);
}
// This function is here to help eliminate some of the copy-paste below
function renderObject(mv, first, count) {
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, first, count);
}
//draw a new frame
function render() {
    // Set up perspective matrix
    // The value of zoom was set and changed above to the appropriate value given the situation
    let ratio = canvas.width / canvas.height;
    let p = perspective(zoom, ratio, 0.05, 100.0);
    // This is the same as before
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uproj, false, p.flatten());
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // The lookat function is given x, y, z values for 3 things, which are dolly, lookAt, and up direction
    // All of these values are set and changed above in different functions like update and the key listener
    let mv = lookAt(new vec4(dollyX, dollyY, dollyZ, 1), new vec4(lookAtX, lookAtY, lookAtZ, 1), new vec4(upX, upY, upZ, 0));
    // Keeping track of the original matrix so we can start over each time we put a new element
    let mvOriginal = mv;
    // Now, I am going through all the objects in the scene, getting the correct matix, and then rendering it
    // First, I am going to put the water in place
    renderObject(mv, 0, 6);
    // Now, I am going to turn the base boat and move it forward if things have changed in the offset or rotation
    mv = mvOriginal;
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY));
    renderObject(mv, 6, 48);
    renderObject(mv, 96, 12);
    // Then, I am going to rotate the fans if they are changing
    mv = mvOriginal;
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(translate(0, fanOffsetY, 0));
    mv = mv.mult(rotateY(boatRotAngleY)).mult(rotateZ(fanRotAngleZ));
    renderObject(mv, 54, 24);
    // Next, I am going to move the rudders if we are turning
    // I'm doing each seperately because I want them to be different colors
    mv = mvOriginal;
    mv = mv.mult(translate(rudderOffsetX, 0, rudderOffsetZ));
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY + rudderRotAngleY));
    renderObject(mv, 78, 6);
    // Rudder 2
    mv = mvOriginal;
    mv = mv.mult(translate(rudderOffsetX, 0, rudderOffsetZ));
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY + rudderRotAngleY));
    mv = mv.mult(translate(0.03, 0, 0));
    renderObject(mv, 84, 6);
    // Rudder 3
    mv = mvOriginal;
    mv = mv.mult(translate(rudderOffsetX, 0, rudderOffsetZ));
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY + rudderRotAngleY));
    mv = mv.mult(translate(-0.03, 0, 0));
    renderObject(mv, 90, 6);
    // This is the spotlight and it transformations and rotations
    mv = mvOriginal;
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY));
    mv = mv.mult(translate(0, 0, 0.08));
    mv = mv.mult(rotateY(spotlight));
    renderObject(mv, 108, getCirclePoints(numOfPoints));
    // Then, I am going to set up the scene around my boat
    // The docks: x = 0.5, 0, -0.5 on both sides
    // These are location values
    let x = [0.5, 0, -0.5, 0.5, 0, -0.5];
    let x1 = [0.4, 0.1, -0.6, 0.4, 0.1, -0.6];
    let x2 = [0.6, -0.1, -0.4, 0.6, -0.1, -0.4];
    let z = [0.7, 0.7, 0.7, -0.7, -0.7, -0.7];
    let z1 = [0.99, 0.8, 0.6, 0.4, -0.99, -0.8, -0.6, -0.4];
    // Here we go through the arrays above and set the value so the docks are in the right spots
    for (let i = 0; i < 6; i++) {
        mv = mvOriginal;
        mv = mv.mult(translate(x[i], 0.02, z[i]));
        renderObject(mv, 108 + 2 * getCirclePoints(numOfPoints), 36);
        for (let j = 0; j < 4; j++) {
            let k = j;
            if (i >= 3) {
                k += 4;
            }
            mv = mvOriginal;
            mv = mv.mult(translate(x1[i], 0, z1[k]));
            renderObject(mv, 144 + 2 * getCirclePoints(numOfPoints), 36);
            mv = mvOriginal;
            mv = mv.mult(translate(x2[i], 0, z1[k]));
            renderObject(mv, 144 + 2 * getCirclePoints(numOfPoints), 36);
        }
    }
    // Here we do something similar with barrels
    // A lot of standing barrels
    let barrelX = [0.53, 0.56, 0.48, 0.45, 0.52, 0.06, -0.066, 0.042, -0.45, -0.56, -0.51, 0.52, 0.47, 0.44, 0.035, -0.041, 0.03, -0.043, -0.46, -0.52, -0.48, -0.43];
    let barrelZ = [0.55, 0.59, 0.91, 0.85, 0.82, 0.7, 0.56, 0.92, 0.48, 0.87, 0.9, -0.76, -0.82, -0.49, -0.45, -0.52, -0.54, -0.93, -0.65, -0.89, -0.43, -0.56];
    for (let i = 0; i < barrelX.length; i++) {
        mv = mvOriginal;
        mv = mv.mult(translate(barrelX[i], 0.08, barrelZ[i]));
        mv = mv.mult(rotateX(-90));
        renderObject(mv, 108 + getCirclePoints(numOfPoints), getCirclePoints(numOfPoints));
    }
    // Some barrels on their side
    barrelX = [0.49, 0.01, -0.52, 0.54];
    barrelZ = [0.67, -0.67, 0.78, -0.53];
    let angle = [45, -30, 63, -60];
    for (let i = 0; i < barrelX.length; i++) {
        mv = mvOriginal;
        mv = mv.mult(translate(barrelX[i], 0.06, barrelZ[i]));
        mv = mv.mult(rotateY(angle[i]));
        renderObject(mv, 108 + getCirclePoints(numOfPoints), getCirclePoints(numOfPoints));
    }
}
//# sourceMappingURL=DownOnTheBayou.js.map