"use strict";

// Here are all my global variables
let gl:WebGLRenderingContext;
let canvas:HTMLCanvasElement;
let program:WebGLProgram;
let bufferId:WebGLBuffer;
let umv:WebGLUniformLocation;
let uproj:WebGLUniformLocation;
let vPosition:GLint; // index of the vPosition vertex attribute in our shader
let vNormal:GLint;
let vAmbientDiffuseColor:GLint; //Ambient and Diffuse can be the same for the material
let vSpecularColor:GLint; //highlight color
let vSpecularExponent:GLint; // how shiny is the thing, higher = shinier

let ambient_light:WebGLUniformLocation; // everyone gets this amount of light automatically
let camera_position:WebGLUniformLocation;
let theta:WebGLUniformLocation;
let light_position:WebGLUniformLocation;
let light_direction:WebGLUniformLocation;
let light_color:WebGLUniformLocation; // and magnitude or brightness
let light_on:WebGLUniformLocation;

let ambient_level:vec4;
let cameraPosition:vec4;
let thetaIn:number[];
let lightPosition:vec4[];
let lightDirection:vec4[];
let lightColor:vec4[];
let lightOn:number[];
let hazardLightAngle:number;

// Boat stuff
let spinRight:boolean;
let spinLeft:boolean;
let moveForward:boolean;
let moveBackwards:boolean;

let fanRotAngleZ: number;
let fanOffsetY: number;

let rudderRotAngleY: number;
let rudderOffsetX: number;
let rudderOffsetZ: number;
let rudderMag: number;

let boatRotAngleY:number;
let boatOffsetX: number;
let boatOffsetZ: number;
let boatVelocity: number;
let boatsidey:number;

let spotlightRight: boolean;
let spotlightLeft: boolean;
let spotlight: number;
let numOfPoints: number;
let originX:number;
let originY:number;
let radius:number;

// Camera Variables: 1 for free roam, 2 for overhead, 3 for chase, 4 for spotlight
let cameraMode: number;
let zoomIn: boolean;
let zoomOut: boolean;
let zoom: number;
let dollyIn: boolean;
let dollyOut: boolean;
let dollyX: number;
let dollyY: number;
let dollyZ: number;
let lookAtOrigin: boolean;
let lookAtX: number;
let lookAtY: number;
let lookAtZ: number;
let upX: number;
let upY: number;
let upZ: number;
let mode1zoom: number;
let mode1dollyX: number;
let mode1dollyY: number;

let spotlightLight:vec4;

// Imports for set up from the other file
import {getCirclePoints, getSpherePoints, ScenePoints} from "./SetUpFunctions.js";

import {
    initFileShaders,
    vec4,
    mat4,
    flatten,
    perspective,
    translate,
    lookAt,
    rotateX,
    rotateY,
    rotateZ, rotate,
} from './helperfunctions.js';

//We want some set up to happen immediately when the page loads
window.onload = function init() {

    //fetch reference to the canvas element we defined in the html file
    canvas = document.getElementById("gl-canvas") as HTMLCanvasElement;
    //grab the WebGL 2 context for that canvas.  This is what we'll use to do our drawing
    gl = canvas.getContext('webgl2') as WebGLRenderingContext;
    if (!gl) {
        alert("WebGL isn't available");
    }

    //Take the vertex and fragment shaders we provided and compile them into a shader program
    program = initFileShaders(gl, "vshader-combined.glsl", "fshader-combined.glsl");
    gl.useProgram(program); //and we want to use that program for our rendering

    // Setting up matrices
    umv = gl.getUniformLocation(program, "model_view");
    uproj = gl.getUniformLocation(program, "projection");
    vNormal = gl.getAttribLocation(program, "vNormal");
    vAmbientDiffuseColor = gl.getAttribLocation(program, "vAmbientDiffuseColor");
    vSpecularColor = gl.getAttribLocation(program, "vSpecularColor");
    vSpecularExponent = gl.getAttribLocation(program, "vSpecularExponent");
    ambient_light = gl.getUniformLocation(program, "ambient_light");
    camera_position = gl.getUniformLocation(program, "camera_position");
    theta = gl.getUniformLocation(program, "theta");
    light_position = gl.getUniformLocation(program, "light_position");
    light_direction = gl.getUniformLocation(program, "light_direction");
    light_color = gl.getUniformLocation(program, "light_color");
    light_on = gl.getUniformLocation(program, "light_on");

    // Initializing boolean variables
    spinRight = spinLeft = moveBackwards = moveForward = false;
    spotlightRight = spotlightLeft = false;

    // Initializing number variables
    fanRotAngleZ = boatRotAngleY = rudderRotAngleY = boatOffsetX = boatOffsetZ = 0;
    fanOffsetY = 0.05;
    boatVelocity = 0.01;
    rudderMag = -0.065;
    rudderOffsetZ = rudderMag*Math.cos(boatRotAngleY* (Math.PI/180));
    rudderOffsetX = rudderMag*Math.sin(boatRotAngleY* (Math.PI/180));
    numOfPoints = 50;
    boatsidey = 0.04;
    radius = 0.015;
    originX = 0;
    originY = boatsidey + radius;
    resetCamera();

    // This is all my light set up code.
    ambient_level = new vec4(0.3, 0.3, 0.3, 1);
    cameraPosition = new vec4(dollyX, dollyY, dollyZ, 1);

    thetaIn = [];
    lightPosition = [];
    lightDirection = [];
    lightColor = [];

    // Here I am initializing my values
    thetaIn[0] = Math.cos(20 * (Math.PI/180));
    lightPosition[0] = new vec4(0, boatsidey+radius, 0.08, 1);
    lightDirection[0] = new vec4(0, 0, 1, 0);
    lightColor[0] = new vec4(1, 1, 1, 1);

    thetaIn[1] = Math.cos(70 * (Math.PI/180));
    lightPosition[1] = new vec4(-0.03, boatsidey, 0, 1);
    lightDirection[1] = new vec4(-1, 0, 0, 0);
    lightColor[1] = new vec4(0, 0.5, 0, 1);

    thetaIn[2] = Math.cos(70 * (Math.PI/180));
    lightPosition[2] = new vec4(0.03, boatsidey, 0, 1);
    lightDirection[2] = new vec4(1, 0, 0, 0);
    lightColor[2] = new vec4(0.5, 0, 0, 1);

    thetaIn[3] = Math.cos(90 * (Math.PI/180));
    lightPosition[3] = new vec4(0, boatsidey, -0.05, 1);
    lightDirection[3] = new vec4(0, 0, -1, 0);
    lightColor[3] = new vec4(0.2, 0.2, 0.2, 1);

    thetaIn[4] = Math.cos(90 * (Math.PI/180));
    lightPosition[4] = new vec4(0.03, boatsidey+0.04, -0.04, 1);
    lightDirection[4] = new vec4(1, 0, 0, 0);
    lightColor[4] = new vec4(150/256, 80/256, 0, 1);

    thetaIn[5] = Math.cos(90 * (Math.PI/180));
    lightPosition[5] = new vec4(-0.03, boatsidey+0.04, 0, 1);
    lightDirection[5] = new vec4(-1, 0, 0, 0);
    lightColor[5] = new vec4(150/256, 80/256, 0, 1);

    lightOn = [1, 1, 1, 1, 1, 1, 1];

    spotlightLight = new vec4(1.0, 1.0, 0.5, 1.0);
    hazardLightAngle = 0;


    // Key listeners for all the options including moving the boat and camera
    // Each of the camera modes sets several constants that are either constants for where the camera is points or zoom/dolly values
    // Each of these were choosen because they made sense or becasue they looked good
    window.addEventListener("keydown" ,function(event) {
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
                if (cameraMode == 1 ) {
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
                    } else {
                        lookAtOrigin = true;
                    };
                }
                break;
            case "r":
                if (cameraMode == 1) {
                    resetCamera();
                }
                break;
            case "s":
                if (lightOn[0] == 1) {
                    lightOn[0] = 0;
                    spotlightLight = new vec4(0.6, 0.6, 0, 1.0);
                } else {
                    lightOn[0] = 1;
                    spotlightLight = new vec4(1.0, 1.0, 0.7, 1.0);
                }
                break;
            case "n":
                if (lightOn[1] == 1) {
                    lightOn[1] = lightOn[2] = lightOn[3] = 0;
                } else {
                    lightOn[1] = lightOn[2] = lightOn[3] = 1;
                }
                break;
            case "h":
                if (lightOn[4] == 1) {
                    lightOn[4] = lightOn[5] = 0;
                } else {
                    lightOn[4] = lightOn[5] = 1;
                }
                break;
        }
        requestAnimationFrame(render);//and now we need a new frame since we made a change
    });

    window.addEventListener("keyup" ,function(event) {
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
        requestAnimationFrame(render);//and now we need a new frame since we made a change
    });

    makeWaterBuffer(gl, bufferId, program, vPosition, vNormal);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    window.setInterval(update, 16); //target 60 frames per second
};

function makeWaterBuffer(gl:WebGLRenderingContext , bufferId:WebGLBuffer, program, vPosition, vNormal) {
    // This method is in the other file because it is a lot of code
    let waterpoints:vec4[] = ScenePoints(numOfPoints, originX, originY, radius, boatsidey);

    // More initial set up steps
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(waterpoints), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(vPosition);

    vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 32, 16);
    gl.enableVertexAttribArray(vNormal);
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
function update(){



    // Calculating spin stuff
    if (spinLeft) {
        boatRotAngleY += 3;
        rudderRotAngleY = -20;
    } else if (spinRight) {
        boatRotAngleY -= 3;
        rudderRotAngleY = 20;
    } else {
        rudderRotAngleY = 0;
    }

    // Calculating rudder positioning using unit circle
    rudderOffsetZ = rudderMag*Math.cos(boatRotAngleY* (Math.PI/180));
    rudderOffsetX = rudderMag*Math.sin(boatRotAngleY* (Math.PI/180));

    // Calculating movement forward and backward
    // The if statements are to stop the boat at the edge.
    if (moveForward) {
        let z = boatVelocity*Math.cos(boatRotAngleY* (Math.PI/180));
        let x = boatVelocity*Math.sin(boatRotAngleY* (Math.PI/180));
        if (boatOffsetZ + z < 1  && boatOffsetZ + z > -1 && boatOffsetX + x < 1  && boatOffsetX + x > -1) {
            if ((boatOffsetZ + z < 0.7-0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17)) && (boatOffsetZ + z > -0.7+0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17))) {
                boatOffsetZ += z;
                boatOffsetX += x;
                fanRotAngleZ += 9;
            }
        }
    }

    if (moveBackwards) {
        let z = boatVelocity*Math.cos(boatRotAngleY* (Math.PI/180));
        let x = boatVelocity*Math.sin(boatRotAngleY* (Math.PI/180));
        if (boatOffsetZ - z < 1  && boatOffsetZ - z > -1 && boatOffsetX - x < 1  && boatOffsetX - x > -1) {
            if ((Math.abs(boatOffsetZ + z) < 0.7-0.37 || Math.abs(boatOffsetX + x) > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17)) && (boatOffsetZ + z > -0.7+0.37 || boatOffsetX + x > 0.7 || (boatOffsetX + x < 0.32 && boatOffsetX + x > 0.17) || (boatOffsetX + x > -0.32 && boatOffsetX + x < -0.17))) {
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
    } else {
        lookAtX = boatOffsetX;
        lookAtZ = boatOffsetZ;
    }

    // For camera mode 2: always look at the spot the boat is, which is the offset in the appropriate direction
    // the up direction is the x/z component of the rotation of the boat.  This comes from basic trig
    if (cameraMode == 2) {
        lookAtX = boatOffsetX;
        lookAtZ = boatOffsetZ;
        upX = Math.sin(boatRotAngleY* (Math.PI/180));
        upZ = Math.cos(boatRotAngleY* (Math.PI/180));
    }

    // For camera mode 3: always look at the spot the boat is, which is the offset in the appropriate direction
    // The location of the camera starts right above the boat.  Then, it is moved backwards in the opposite direction of the rotation angle
    // The rotation angle keeps track of the front of the back, so the camera will look at the back of the boat
    // The distance back that it is is the camera radius, which i choose because it looked best
    let cameraRadius:number;
    if (cameraMode == 3) {
        cameraRadius = 6;
        lookAtX = boatOffsetX;
        lookAtZ = boatOffsetZ;
        dollyX = boatOffsetX-cameraRadius*Math.sin(boatRotAngleY* (Math.PI/180));
        dollyZ = boatOffsetZ-cameraRadius*Math.cos(boatRotAngleY* (Math.PI/180));
    }

    // For camera mode 4: the camera is located on the front of the boat, which is found using teh boat offset plus an additional distance in the direction it is facing
    // the camera is looking at the spot in the same direction the spotlight is facing and a certain radius in front of that as the distance
    if (cameraMode == 4) {
        cameraRadius = 0.5;
        lookAtX = boatOffsetX + cameraRadius*Math.sin((boatRotAngleY+spotlight)* (Math.PI/180));
        lookAtZ = boatOffsetZ + cameraRadius*Math.cos((boatRotAngleY+spotlight)* (Math.PI/180));
        cameraRadius = 0.03;
        dollyX = boatOffsetX+cameraRadius*Math.sin(boatRotAngleY* (Math.PI/180));
        dollyZ = boatOffsetZ+cameraRadius*Math.cos(boatRotAngleY* (Math.PI/180));
    }

    if (lightOn[2] == 1) {
        hazardLightAngle += 2;
    }


    // Changing the light calculation variables for the light positions
    // First, is the spotlight
    cameraPosition = new vec4(dollyX, dollyY, dollyZ, 1);
    lightPosition[0] = new vec4(boatOffsetX + 0.08*Math.sin((boatRotAngleY)* (Math.PI/180)), boatsidey+radius, boatOffsetZ + 0.08*Math.cos((boatRotAngleY)* (Math.PI/180)), 1);
    lightDirection[0] = new vec4(Math.sin((boatRotAngleY + spotlight)* (Math.PI/180)), 0, Math.cos((boatRotAngleY + spotlight)* (Math.PI/180)), 0);

    // Then are the navigational lights
    lightPosition[1] = new vec4(-0.03*Math.cos((boatRotAngleY)* (Math.PI/180)) + boatOffsetX, boatsidey, 0.03*Math.sin((boatRotAngleY)* (Math.PI/180)) + boatOffsetZ, 1);
    lightDirection[1] = new vec4(-Math.cos(-boatRotAngleY* (Math.PI/180)), 0, -Math.sin(-boatRotAngleY* (Math.PI/180)), 0);
    lightPosition[2] = new vec4(0.03*Math.cos((boatRotAngleY)* (Math.PI/180)) + boatOffsetX, boatsidey, -0.03*Math.sin((boatRotAngleY)* (Math.PI/180)) + boatOffsetZ, 1);
    lightDirection[2] = new vec4(Math.cos(-boatRotAngleY* (Math.PI/180)), 0, Math.sin(-boatRotAngleY* (Math.PI/180)), 0);
    lightPosition[3] = new vec4(-0.06*Math.sin((boatRotAngleY)* (Math.PI/180)) + boatOffsetX, boatsidey, -0.06*Math.cos((boatRotAngleY)* (Math.PI/180)) + boatOffsetZ, 1);
    lightDirection[3] = new vec4(Math.sin(-boatRotAngleY* (Math.PI/180)), 0, -Math.cos(boatRotAngleY* (Math.PI/180)), 0);

    // Finally are the hazard lights
    lightPosition[4] = new vec4(-0.03*Math.cos((-boatRotAngleY)* (Math.PI/180)) - 0.03*Math.sin((boatRotAngleY)* (Math.PI/180)) + boatOffsetX, boatsidey+0.04, -0.03*Math.sin((-boatRotAngleY)* (Math.PI/180)) - 0.03*Math.cos((boatRotAngleY)* (Math.PI/180)) + boatOffsetZ, 1);
    lightDirection[4] = new vec4(Math.sin(hazardLightAngle* (Math.PI/180)), 0, -Math.cos(hazardLightAngle* (Math.PI/180)), 0);
    lightPosition[5] = new vec4(0.03*Math.cos((-boatRotAngleY)* (Math.PI/180)) - 0.03*Math.sin((boatRotAngleY)* (Math.PI/180)) + boatOffsetX, boatsidey+0.04, 0.03*Math.sin((-boatRotAngleY)* (Math.PI/180)) - 0.03*Math.cos((boatRotAngleY)* (Math.PI/180)) + boatOffsetZ, 1);
    lightDirection[5] = new vec4(Math.sin((hazardLightAngle+180)* (Math.PI/180)), 0, -Math.cos((hazardLightAngle+180)* (Math.PI/180)), 0);

    requestAnimationFrame(render);
}

// This function is here to help eliminate some of the copy-paste below
function renderObject(mv:mat4, first:number, count:number) {
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, first, count);
}

// This function makes it so I don't have to type out the boat matrix every time, I should have used it more often
function boatMatrix(mvOriginal:mat4) {
    return mvOriginal.mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(rotateY(boatRotAngleY));
}

//draw a new frame
function render(){

    // Below are the different color options and named based on where they are used
    let water:vec4 = new vec4(0.3, 0.3, 1.0, 1);
    let boatTop:vec4 = new vec4(222/255,184/255,135/255, 1.0);
    let boatRight:vec4 = new vec4(119/255,136/255,153/255, 1.0);
    let boatLeft:vec4 = new vec4(72/255,61/255,139/255, 1.0);
    let boatFront:vec4 = new vec4(143/255,188/255,143/255, 1.0);
    let boatBack:vec4 = new vec4(85/255,107/255,47/255, 1.0);
    let boatSpoiler:vec4 = new vec4(0/255,206/255,209/255, 1.0);
    let boatFan1:vec4 = new vec4(245/255,222/255,179/255, 1.0);
    let boatFan2:vec4 = new vec4(176/255,196/255,222/255, 1.0);
    let boatRudder1:vec4 = new vec4(139/255,0/255,0/255, 1.0);
    let boatRudder2:vec4 = new vec4(178/255,34/255,34/255, 1.0);
    let boatRudder3:vec4 = new vec4(205/255,92/255,92/255, 1.0);
    let spotlightBarrel = new vec4(0.5, 0.5, 0.5, 1.0);

    let dockTop:vec4 = new vec4(101/255,56/255,24/255, 1.0);
    let dockSides:vec4 = new vec4(139/255,69/255,19/255, 1.0);
    let dockLegs:vec4 = new vec4(105/255,105/255,105/255, 1.0);
    let dockLegsTop:vec4 = new vec4(150/255,150/255,150/255, 1.0);

    let insideBarrel:vec4 = new vec4(57/255,61/255,71/255, 1.0);
    let outsideBarrel:vec4 = new vec4(129/255,97/255,62/255, 1.0);

    let rightLight:vec4 = new vec4(50/255,255/255,50/255, 1.0);
    let leftLight:vec4 = new vec4(255/255,50/255,50/255, 1.0);
    let hazardLight:vec4 = new vec4(150/256, 80/256, 0, 1);

    let insideCrate:vec4 = new vec4(174/255,115/255,78/255, 1.0);
    let outsideCrate:vec4 = new vec4(195/255,176/255,145/255, 1.0);

    // Set up perspective matrix
    // The value of zoom was set and changed above to the appropriate value given the situation
    let ratio:number = canvas.width/canvas.height;
    let p:mat4 = perspective(zoom, ratio, 0.05, 100.0);

    // This is the same as before
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uproj, false, p.flatten());
    gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);

    // The lookat function is given x, y, z values for 3 things, which are dolly, lookAt, and up direction
    // All of these values are set and changed above in different functions like update and the key listener
    let mv:mat4 = lookAt(new vec4(dollyX, dollyY, dollyZ, 1), new vec4(lookAtX, lookAtY, lookAtZ ,1), new vec4(upX, upY, upZ, 0));
    // Keeping track of the original matrix so we can start over each time we put a new element
    let mvOriginal = mv;

    let Position:vec4[] = [];
    let Direction:vec4[] = [];

    for (let i = 0; i < lightPosition.length; i++) {
        Position[i] = mv.mult(lightPosition[i]);
        Direction[i] = mv.mult(lightDirection[i]);
    }

    gl.vertexAttrib4fv(vSpecularColor, [1.0, 1.0, 1.0, 1.0]);
    gl.vertexAttrib1f(vSpecularExponent, 1.0);
    gl.vertexAttrib4fv(vAmbientDiffuseColor, water);

    // Sending in the uniforms
    gl.uniform4fv(ambient_light, ambient_level); // knock down to 0.1 for project
    gl.uniform4fv(camera_position, mv.mult(cameraPosition).flatten());
    gl.uniform1fv(theta, thetaIn);
    gl.uniform4fv(light_position, flatten(Position));
    gl.uniform4fv(light_direction, flatten(Direction));
    gl.uniform4fv(light_color, flatten(lightColor));
    gl.uniform1iv(light_on, lightOn);

    // Now, I am going through all the objects in the scene, getting the correct matix, and then rendering it

    // First, I am going to put the water in place
    renderObject(mv, 0, 6);

    gl.vertexAttrib1f(vSpecularExponent, 25.0);
    // Now, I am going to turn the base boat and move it forward if things have changed in the offset or rotation
    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatFront);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 6, 12);


    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatBack);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 18, 12);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatLeft);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 30, 12);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatRight);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 42, 12);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatTop);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 54, 6);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatSpoiler);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 102, 6);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, rightLight);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints), getCirclePoints(numOfPoints)/4);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, leftLight);
    mv = boatMatrix(mvOriginal);
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + getCirclePoints(numOfPoints)/4, getCirclePoints(numOfPoints)/4);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, hazardLight);
    mv = boatMatrix(mvOriginal).mult(translate(-0.03, boatsidey+0.04, -0.03));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4, getSpherePoints(numOfPoints));

    gl.vertexAttrib4fv(vAmbientDiffuseColor, hazardLight);
    mv = boatMatrix(mvOriginal).mult(translate(0.03, boatsidey+0.04, -0.03));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4, getSpherePoints(numOfPoints));


    // Then, I am going to rotate the fans if they are changing
    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatFan1);
    mv = mvOriginal.mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(translate(0, fanOffsetY, 0)).mult(rotateY(boatRotAngleY)).mult(rotateZ(fanRotAngleZ));
    renderObject(mv, 60, 12);

    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatFan2);
    mv = mvOriginal.mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(translate(0, fanOffsetY, 0)).mult(rotateY(boatRotAngleY)).mult(rotateZ(fanRotAngleZ));
    renderObject(mv, 72, 12);

    // Next, I am going to move the rudders if we are turning
    // I'm doing each seperately because I want them to be different colors
    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatRudder1);
    mv = mvOriginal.mult(translate(rudderOffsetX, 0, rudderOffsetZ)).mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(rotateY(boatRotAngleY + rudderRotAngleY));
    renderObject(mv, 84, 6);

    // Rudder 2
    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatRudder2);
    mv = mvOriginal.mult(translate(rudderOffsetX, 0, rudderOffsetZ)).mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(rotateY(boatRotAngleY + rudderRotAngleY)).mult(translate(0.03, 0, 0));
    renderObject(mv, 90, 6);

    // Rudder 3
    gl.vertexAttrib4fv(vAmbientDiffuseColor, boatRudder3);
    mv = mvOriginal.mult(translate(rudderOffsetX, 0, rudderOffsetZ)).mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(rotateY(boatRotAngleY + rudderRotAngleY)).mult(translate(-0.03, 0, 0));
    renderObject(mv, 96, 6);



    // This is the spotlight and it transformations and rotations
    mv = mvOriginal.mult(translate(boatOffsetX, 0, boatOffsetZ)).mult(rotateY(boatRotAngleY)).mult(translate(0, 0, 0.08)).mult(rotateY(spotlight));
    for (let i = 0; i < getCirclePoints(numOfPoints); i+=12) {
        gl.vertexAttrib4fv(vAmbientDiffuseColor, spotlightLight);
        renderObject(mv, 108+i, 3);
        gl.vertexAttrib4fv(vAmbientDiffuseColor, spotlightBarrel);
        renderObject(mv, 108+3+i, 9);
    }

    mv = mv.mult(translate(0, 0, 0.041));
    for (let i = 0; i < getCirclePoints(numOfPoints); i+=12) {
        gl.vertexAttrib4fv(vAmbientDiffuseColor, spotlightLight);
        renderObject(mv, 108+3+i, 3);
    }




    gl.vertexAttrib1f(vSpecularExponent, 15.0);

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
        gl.vertexAttrib4fv(vAmbientDiffuseColor, dockSides);
        mv = mvOriginal.mult(translate(x[i], 0.02, z[i]));
        renderObject(mv, 108 + 2 * getCirclePoints(numOfPoints), 24);

        gl.vertexAttrib4fv(vAmbientDiffuseColor, dockTop);
        mv = mvOriginal.mult(translate(x[i], 0.02, z[i]));
        renderObject(mv, 132 + 2 * getCirclePoints(numOfPoints), 12);


        for (let j = 0; j < 4; j++) {
            let k = j;
            if (i >= 3) {
                k += 4;
            }

            mv = mvOriginal.mult(translate(x1[i], 0, z1[k]));
            gl.vertexAttrib4fv(vAmbientDiffuseColor, dockLegs);
            renderObject(mv, 144 + 2 * getCirclePoints(numOfPoints), 24);
            gl.vertexAttrib4fv(vAmbientDiffuseColor, dockLegsTop);
            renderObject(mv, 168 + 2 * getCirclePoints(numOfPoints), 12);

            mv = mvOriginal.mult(translate(x2[i], 0, z1[k]));
            gl.vertexAttrib4fv(vAmbientDiffuseColor, dockLegs);
            renderObject(mv, 144 + 2 * getCirclePoints(numOfPoints), 24);
            gl.vertexAttrib4fv(vAmbientDiffuseColor, dockLegsTop);
            renderObject(mv, 168 + 2 * getCirclePoints(numOfPoints), 12);
        }
    }

    gl.vertexAttrib1f(vSpecularExponent, 5.0);

    // Here we do something similar with barrels
    // A lot of standing barrels
    let barrelX = [0.53, 0.56, 0.48, 0.45, 0.52, 0.06, -0.066, 0.042, -0.45, -0.56, -0.51, 0.52, 0.47, 0.44, 0.035, -0.041, 0.03, -0.043, -0.46, -0.52, -0.48, -0.43];
    let barrelZ = [0.55, 0.59, 0.91, 0.85, 0.82, 0.7, 0.56, 0.92, 0.48, 0.87, 0.9, -0.76, -0.82, -0.49, -0.45, -0.52, -0.54, -0.93, -0.65, -0.89, -0.43, -0.56];
    for (let i = 0; i < barrelX.length; i++) {
        mv = mvOriginal.mult(translate(barrelX[i], 0.08, barrelZ[i])).mult(rotateX(-90));
        for (let i = 0; i < getCirclePoints(numOfPoints); i+=12) {
            gl.vertexAttrib4fv(vAmbientDiffuseColor, insideBarrel);
            renderObject(mv, 108+getCirclePoints(numOfPoints)+i, 3);
            gl.vertexAttrib4fv(vAmbientDiffuseColor, outsideBarrel);
            renderObject(mv, 108+getCirclePoints(numOfPoints)+3+i, 9);
        }
    }

    // Some barrels on their side
    barrelX = [0.49, 0.01, -0.52, 0.54];
    barrelZ = [0.67, -0.67, 0.78, -0.53];
    let angle = [45, -30, 63, -60];
    for (let i = 0; i < barrelX.length; i++) {
        mv = mvOriginal.mult(translate(barrelX[i], 0.06, barrelZ[i])).mult(rotateY(angle[i]));
        for (let i = 0; i < getCirclePoints(numOfPoints); i+=12) {
            gl.vertexAttrib4fv(vAmbientDiffuseColor, insideBarrel);
            renderObject(mv, 108+getCirclePoints(numOfPoints)+i, 3);
            gl.vertexAttrib4fv(vAmbientDiffuseColor, outsideBarrel);
            renderObject(mv, 108+getCirclePoints(numOfPoints)+3+i, 9);
        }
    }


    // I meant for the boat to go through the red spheres because they are just going under the boat
    gl.vertexAttrib1f(vSpecularExponent, 15.0);
    gl.vertexAttrib4fv(vAmbientDiffuseColor, new vec4(0.8, 0.2, 0.2, 1));
    mv = (mvOriginal).mult(translate(0, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(0.2, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(0.4, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(0.6, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(0.8, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(-0.2, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(-0.4, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(-0.6, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));

    mv = (mvOriginal).mult(translate(-0.8, 0, 0.0));
    renderObject(mv, 216 + 2 * getCirclePoints(numOfPoints) + 2*getCirclePoints(numOfPoints)/4 + getSpherePoints(numOfPoints), getSpherePoints(numOfPoints));


}
