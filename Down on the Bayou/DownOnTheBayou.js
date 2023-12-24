"use strict";
//it will be handy to have references to some of our WebGL related objects
let gl;
let canvas;
let program;
let bufferId;
let umv;
let uproj;
let vPosition; // index of the vPosition vertex attribute in our shader
let vColor; // index of the vColor vertex attribute in our shader
let watersize;
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
import { initShaders, vec4, flatten, perspective, translate, lookAt, rotateY, rotateZ, } from './helperfunctions.js';
/*
import {
    RenderObject
} from './RenderObject.js';
*/
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
    umv = gl.getUniformLocation(program, "model_view");
    uproj = gl.getUniformLocation(program, "projection");
    spinRight = spinLeft = moveBackwards = moveForward = false;
    // Initializing variables
    fanRotAngleZ = boatRotAngleY = rudderRotAngleY = boatOffsetX = boatOffsetZ = 0;
    fanOffsetY = 0.05;
    boatVelocity = 0.01;
    rudderMag = -0.065;
    rudderOffsetZ = rudderMag * Math.cos(boatRotAngleY * (Math.PI / 180));
    rudderOffsetX = rudderMag * Math.sin(boatRotAngleY * (Math.PI / 180));
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
        }
        requestAnimationFrame(render); //and now we need a new frame since we made a change
    });
    watersize = 1.0;
    //We'll split this off to its own function for clarity, but we need something to make a picture of
    //makeCubeAndBuffer();
    makeWaterBuffer();
    //we'll talk more about this in a future lecture, but this is saying what part of the canvas
    //we want to draw to.  In this case, that's all of it.
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    //What color do you want the background to be?  This sets it to black and opaque.
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //we need to do this to avoid having objects that are behind other objects show up anyway
    gl.enable(gl.DEPTH_TEST);
    window.setInterval(update, 16); //target 60 frames per second
};
function makeWaterBuffer() {
    let waterpoints = [];
    let boatsidex = 0.03;
    let boatsidey = 0.04;
    let boatsidez = 0.05;
    let boatSlant = 0.03;
    let ruddery = 0.09;
    let rudderz1 = 0.035;
    let rudderz2 = 0.015;
    let fanSlant = 0.008;
    let fanw1 = 0.005;
    let fanh1 = 0.005;
    let fanw2 = 0.05;
    let fancenterx = 0;
    let fancentery = 0; // 0.05
    let fanz = 0.065;
    // water triangles
    waterpoints.push(new vec4(watersize, 0, -watersize, 1.0));
    waterpoints.push(new vec4(0.3, 0.3, 1.0, 1)); //blue
    waterpoints.push(new vec4(watersize, 0, watersize, 1.0));
    waterpoints.push(new vec4(0.3, 0.3, 1.0, 1)); //blue
    waterpoints.push(new vec4(-watersize, 0, watersize, 1.0));
    waterpoints.push(new vec4(0.3, 0.3, 1.0, 1)); //blue
    waterpoints.push(new vec4(-watersize, 0, watersize, 1.0));
    waterpoints.push(new vec4(0.3, 0.3, 1.0, 1)); //blue
    waterpoints.push(new vec4(-watersize, 0, -watersize, 1.0));
    waterpoints.push(new vec4(0.3, 0.3, 1.0, 1)); //blue
    waterpoints.push(new vec4(watersize, 0, -watersize, 1.0));
    waterpoints.push(new vec4(0.3, 0.3, 1.0, 1)); //blue
    // This is the base of the boat
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    //back face
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    //left face
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    //right face
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    //top
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-boatsidex, boatsidey, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 0.0, 1.0, 1.0)); //blue
    //bottom
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 1.0)); //green
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 1.0)); //green
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 1.0)); //green
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 1.0)); //green
    waterpoints.push(new vec4(-boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 1.0)); //green
    waterpoints.push(new vec4(boatsidex, 0, -boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 0.0, 1.0)); //green
    // This is the slanted front part of the boat
    //front face = 6 verts, position then color
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(0.0, 1.0, 1.0, 1.0)); //cyan
    //right face
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    waterpoints.push(new vec4(-boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //red
    //left face
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez + boatSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, 0, boatsidez, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    // Here are the fan rotors
    //top fan
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery + fanw1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery + fanw2, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery + fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery + fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery + fanw1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery + fanw1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 1.0, 1.0)); //magenta
    //bottom fan
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw2, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw2, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanh1, fancentery - fanw1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanh1, fancentery - fanw1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //magenta
    //right fan
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(new vec4(0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(new vec4(0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(0, 1.0, 1.0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx - fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(new vec4(0, 1.0, 1.0, 1.0)); //magenta
    //left fan
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanw2, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery - fanh1, -fanz + fanSlant, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0, 1.0)); //magenta
    waterpoints.push(new vec4(fancenterx + fanw1, fancentery + fanh1, -fanz, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0, 1.0)); //magenta
    // These are the three rudders
    //one rudder
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(0.5, 1.0, 0.5, 1.0)); //yellow
    waterpoints.push(new vec4(0, 0, -rudderz1, 1.0));
    waterpoints.push(new vec4(0.5, 1.0, 0.5, 1.0)); //yellow
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(0.5, 1.0, 0.5, 1.0)); //yellow
    waterpoints.push(new vec4(0, 0, -rudderz2, 1.0));
    waterpoints.push(new vec4(0.5, 1.0, 0.5, 1.0)); //yellow
    waterpoints.push(new vec4(0, ruddery, -rudderz2, 1.0));
    waterpoints.push(new vec4(0.5, 1.0, 0.5, 1.0)); //yellow
    waterpoints.push(new vec4(0, ruddery, -rudderz1, 1.0));
    waterpoints.push(new vec4(0.5, 1.0, 0.5, 1.0)); //yellow
    // Adding some extra stuff to my boat
    waterpoints.push(new vec4(watersize, -0.01, -watersize, 1.0));
    waterpoints.push(new vec4(0.2, 0.2, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(watersize, -0.01, watersize, 1.0));
    waterpoints.push(new vec4(0.2, 0.2, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-watersize, -0.01, watersize, 1.0));
    waterpoints.push(new vec4(0.2, 0.2, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-watersize, -0.01, watersize, 1.0));
    waterpoints.push(new vec4(0.2, 0.2, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-watersize, -0.01, -watersize, 1.0));
    waterpoints.push(new vec4(0.2, 0.2, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(watersize, -0.01, -watersize, 1.0));
    waterpoints.push(new vec4(0.2, 0.2, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez - 0.03, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, boatsidey, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez - 0.03, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(-boatsidex, boatsidey, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 0.0, 0.0, 1.0)); //yellow
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.04, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(-boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //blue
    waterpoints.push(new vec4(boatsidex, boatsidey + 0.02, boatsidez - 0.08, 1.0));
    waterpoints.push(new vec4(1.0, 1.0, 1.0, 1.0)); //blue
    //we need some graphics memory for this information
    bufferId = gl.createBuffer();
    //tell WebGL that the buffer we just created is the one we want to work with right now
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //send the local data over to this buffer on the graphics card.  Note our use of Angel's "flatten" function
    gl.bufferData(gl.ARRAY_BUFFER, flatten(waterpoints), gl.STATIC_DRAW);
    //Data is packed in groups of 4 floats which are 4 bytes each, 32 bytes total for position and color
    // position            color
    //  x   y   z     w       r    g     b    a
    // 0-3 4-7 8-11 12-15  16-19 20-23 24-27 28-31
    //What is this data going to be used for?
    //The vertex shader has an attribute named "vPosition".  Let's associate part of this data to that attribute
    vPosition = gl.getAttribLocation(program, "vPosition");
    //attribute location we just fetched, 4 elements in each vector, data type float, don't normalize this data,
    //each position starts 32 bytes after the start of the previous one, and starts right away at index 0
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(vPosition);
    //The vertex shader also has an attribute named "vColor".  Let's associate the other part of this data to that attribute
    vColor = gl.getAttribLocation(program, "vColor");
    //attribute location we just fetched, 4 elements in each vector, data type float, don't normalize this data,
    //each color starts 32 bytes after the start of the previous one, and the first color starts 16 bytes into the data
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 32, 16);
    gl.enableVertexAttribArray(vColor);
}
//increase rotation angle and request new frame
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
    // Calculting rudder positoning using unit circle
    rudderOffsetZ = rudderMag * Math.cos(boatRotAngleY * (Math.PI / 180));
    rudderOffsetX = rudderMag * Math.sin(boatRotAngleY * (Math.PI / 180));
    // Calculating movement stuff
    // The if statemnts are to stop the boat at the edge.
    if (moveForward) {
        let z = boatVelocity * Math.cos(boatRotAngleY * (Math.PI / 180));
        let x = boatVelocity * Math.sin(boatRotAngleY * (Math.PI / 180));
        if (boatOffsetZ + z < 1 && boatOffsetZ + z > -1 && boatOffsetX + x < 1 && boatOffsetX + x > -1) {
            boatOffsetZ += z;
            boatOffsetX += x;
            fanRotAngleZ += 9;
        }
    }
    if (moveBackwards) {
        let z = boatVelocity * Math.cos(boatRotAngleY * (Math.PI / 180));
        let x = boatVelocity * Math.sin(boatRotAngleY * (Math.PI / 180));
        if (boatOffsetZ - z < 1 && boatOffsetZ - z > -1 && boatOffsetX - x < 1 && boatOffsetX - x > -1) {
            boatOffsetZ -= z;
            boatOffsetX -= x;
            fanRotAngleZ -= 9;
        }
    }
    requestAnimationFrame(render);
}
//draw a new frame
function render() {
    // The Water: 1-6
    // The Boat: 6-48
    // The Rudders: 48-72
    // The Fans: 72-96
    //start by clearing any previous data for both color and depth
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //we'll discuss projection matrices in a couple of days, but use this for now:
    let p = perspective(45.0, canvas.clientWidth / canvas.clientHeight, 1.0, 100.0);
    gl.uniformMatrix4fv(uproj, false, p.flatten());
    //now set up the model view matrix and send it over as a uniform
    //the inputs to this lookAt are to move back 20 units, point at the origin, and the positive y axis is up
    let mv = lookAt(new vec4(2, 1, 0, 1), new vec4(0, 0, 0, 1), new vec4(0, 1, 0, 0));
    let mvOriginal = mv;
    // First, I am going to put the water in place
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 84, 6);
    // Now, I am going to turn the base boat and move it forward if things have changed in the offset or rotation
    mv = mvOriginal;
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 6, 48);
    gl.drawArrays(gl.TRIANGLES, 90, 12);
    // Then, I am going to rotate the fans if they are changing
    mv = mvOriginal;
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(translate(0, fanOffsetY, 0));
    mv = mv.mult(rotateY(boatRotAngleY)).mult(rotateZ(fanRotAngleZ));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 54, 24);
    // Next, I am going to move the rudders if we are turning
    // I'm doing each seperately because they are coming from the same points and rotating on different axises
    mv = mvOriginal;
    mv = mv.mult(translate(rudderOffsetX, 0, rudderOffsetZ));
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY + rudderRotAngleY));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 78, 6);
    mv = mvOriginal;
    mv = mv.mult(translate(rudderOffsetX, 0, rudderOffsetZ));
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY + rudderRotAngleY));
    mv = mv.mult(translate(0.03, 0, 0));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 78, 6);
    mv = mvOriginal;
    mv = mv.mult(translate(rudderOffsetX, 0, rudderOffsetZ));
    mv = mv.mult(translate(boatOffsetX, 0, boatOffsetZ));
    mv = mv.mult(rotateY(boatRotAngleY + rudderRotAngleY));
    mv = mv.mult(translate(-0.03, 0, 0));
    gl.uniformMatrix4fv(umv, false, mv.flatten());
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.drawArrays(gl.TRIANGLES, 78, 6);
    // 0-96
}
//# sourceMappingURL=DownOnTheBayou.js.map