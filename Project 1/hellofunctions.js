import { initShaders, vec4, flatten } from "../Code Along 1/helperfunctions";
"use strict";
//we will want references to our WebGL objects
let gl;
let canvas;
let program;
//set up program when page first loads
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL isn't available");
    }
    //take the vertex and fragment shaders and compile them into a shader program
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    makeTriangleAndBuffer();
    //we'll cover what this is in a future lecture
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    //what color is the background?
    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    //request that a frame be drawn right now
    requestAnimationFrame(render); //provide the name of your render function
};
function makeTriangleAndBuffer() {
    let trianglePoints = []; //empty array in main memory
    //create 3 vertices and add to main memory array
    //stay between -1 and 1 until we cover projection
    // I have only added vertices below and changed the number of final vertices in the last function.
    // The three vertices of each triangle are grouped together
    // They are seperated from other triangles by a new line
    // I started with the triangles for the mountains in the background
    // And ended with rocks on the cliff in the foreground
    trianglePoints.push(new vec4(1, 0.52, 0, 1));
    trianglePoints.push(new vec4(1, 0.30, 0, 1));
    trianglePoints.push(new vec4(0.696, 0.62, 0, 1));
    trianglePoints.push(new vec4(0.696, 0.62, 0, 1));
    trianglePoints.push(new vec4(0.5, 0.54, 0, 1));
    trianglePoints.push(new vec4(0.64, 0.22, 0, 1));
    trianglePoints.push(new vec4(0.426, 0.62, 0, 1));
    trianglePoints.push(new vec4(0.5, 0.54, 0, 1));
    trianglePoints.push(new vec4(0.64, 0.22, 0, 1));
    trianglePoints.push(new vec4(0.426, 0.62, 0, 1));
    trianglePoints.push(new vec4(0.116, 0.508, 0, 1));
    trianglePoints.push(new vec4(0.2, 0.12, 0, 1));
    trianglePoints.push(new vec4(0.116, 0.508, 0, 1));
    trianglePoints.push(new vec4(0.01, 0.57, 0, 1));
    trianglePoints.push(new vec4(-0.04, 0.14, 0, 1));
    trianglePoints.push(new vec4(-0.08, 0.50, 0, 1));
    trianglePoints.push(new vec4(0.01, 0.57, 0, 1));
    trianglePoints.push(new vec4(-0.04, 0.14, 0, 1));
    trianglePoints.push(new vec4(-0.08, 0.50, 0, 1));
    trianglePoints.push(new vec4(-0.18, 0.59, 0, 1));
    trianglePoints.push(new vec4(-0.18, 0.13, 0, 1));
    trianglePoints.push(new vec4(-0.18, 0.59, 0, 1));
    trianglePoints.push(new vec4(-0.26, 0.51, 0, 1));
    trianglePoints.push(new vec4(-0.294, 0.21, 0, 1));
    trianglePoints.push(new vec4(-0.36, 0.66, 0, 1));
    trianglePoints.push(new vec4(-0.26, 0.51, 0, 1));
    trianglePoints.push(new vec4(-0.294, 0.21, 0, 1));
    trianglePoints.push(new vec4(-0.36, 0.66, 0, 1));
    trianglePoints.push(new vec4(-0.42, 0.30, 0, 1));
    trianglePoints.push(new vec4(-0.46, 0.68, 0, 1));
    trianglePoints.push(new vec4(-0.54, 0.62, 0, 1));
    trianglePoints.push(new vec4(-0.44, 0.24, 0, 1));
    trianglePoints.push(new vec4(-0.46, 0.68, 0, 1));
    trianglePoints.push(new vec4(-0.54, 0.62, 0, 1));
    trianglePoints.push(new vec4(-0.68, 0.79, 0, 1));
    trianglePoints.push(new vec4(-0.52, 0.3, 0, 1));
    trianglePoints.push(new vec4(-0.68, 0.79, 0, 1));
    trianglePoints.push(new vec4(-0.78, 0.83, 0, 1));
    trianglePoints.push(new vec4(-0.92, 0.48, 0, 1));
    trianglePoints.push(new vec4(-0.90, 0.74, 0, 1));
    trianglePoints.push(new vec4(-0.78, 0.83, 0, 1));
    trianglePoints.push(new vec4(-0.92, 0.48, 0, 1));
    trianglePoints.push(new vec4(-0.90, 0.74, 0, 1));
    trianglePoints.push(new vec4(-1, 0.75, 0, 1));
    trianglePoints.push(new vec4(-1, 0.54, 0, 1));
    trianglePoints.push(new vec4(-0.92, 0.49, 0, 1));
    trianglePoints.push(new vec4(-1, 0.16, 0, 1));
    trianglePoints.push(new vec4(-1, 0.54, 0, 1));
    trianglePoints.push(new vec4(-0.92, 0.49, 0, 1));
    trianglePoints.push(new vec4(-0.70, 0.42, 0, 1));
    trianglePoints.push(new vec4(-0.74, 0.22, 0, 1));
    trianglePoints.push(new vec4(-0.62, 0.26, 0, 1));
    trianglePoints.push(new vec4(-0.70, 0.42, 0, 1));
    trianglePoints.push(new vec4(-0.74, 0.22, 0, 1));
    trianglePoints.push(new vec4(-0.68, -0.02, 0, 1));
    trianglePoints.push(new vec4(-1, 0.16, 0, 1));
    trianglePoints.push(new vec4(-1, -0.04, 0, 1));
    trianglePoints.push(new vec4(-0.68, -0.02, 0, 1));
    trianglePoints.push(new vec4(-0.74, 0.22, 0, 1));
    trianglePoints.push(new vec4(-0.55, 0.02, 0, 1));
    trianglePoints.push(new vec4(-0.74, 0.22, 0, 1));
    trianglePoints.push(new vec4(-0.62, 0.26, 0, 1));
    trianglePoints.push(new vec4(-0.52, 0.14, 0, 1));
    trianglePoints.push(new vec4(-0.55, 0.02, 0, 1));
    trianglePoints.push(new vec4(-0.52, 0.14, 0, 1));
    trianglePoints.push(new vec4(-0.36, 0.04, 0, 1));
    trianglePoints.push(new vec4(-0.36, 0.04, 0, 1));
    trianglePoints.push(new vec4(-0.18, 0.08, 0, 1));
    trianglePoints.push(new vec4(-0.01, 0.02, 0, 1));
    trianglePoints.push(new vec4(-0.01, 0.02, 0, 1));
    trianglePoints.push(new vec4(-0.08, -0.08, 0, 1));
    trianglePoints.push(new vec4(0.81, -0.28, 0, 1));
    trianglePoints.push(new vec4(-0.01, 0.02, 0, 1));
    trianglePoints.push(new vec4(0.81, -0.28, 0, 1));
    trianglePoints.push(new vec4(0.2, 0.08, 0, 1));
    trianglePoints.push(new vec4(0.2, 0.08, 0, 1));
    trianglePoints.push(new vec4(1.0, 0.02, 0, 1));
    trianglePoints.push(new vec4(0.64, 0.22, 0, 1));
    trianglePoints.push(new vec4(1.0, 0.30, 0, 1));
    trianglePoints.push(new vec4(1.0, 0.02, 0, 1));
    trianglePoints.push(new vec4(0.64, 0.22, 0, 1));
    trianglePoints.push(new vec4(1.0, 0.02, 0, 1));
    trianglePoints.push(new vec4(1.0, -0.39, 0, 1));
    trianglePoints.push(new vec4(0.81, -0.28, 0, 1));
    trianglePoints.push(new vec4(0.71, -0.30, 0, 1));
    trianglePoints.push(new vec4(1.0, -0.39, 0, 1));
    trianglePoints.push(new vec4(0.81, -0.28, 0, 1));
    trianglePoints.push(new vec4(-1.0, -0.70, 0, 1));
    trianglePoints.push(new vec4(-0.76, -0.78, 0, 1));
    trianglePoints.push(new vec4(-0.60, -0.62, 0, 1));
    trianglePoints.push(new vec4(-0.60, -0.62, 0, 1));
    trianglePoints.push(new vec4(-0.56, -0.40, 0, 1));
    trianglePoints.push(new vec4(-0.48, -0.61, 0, 1));
    trianglePoints.push(new vec4(-0.48, -0.61, 0, 1));
    trianglePoints.push(new vec4(-0.40, -0.66, 0, 1));
    trianglePoints.push(new vec4(-0.38, -0.60, 0, 1));
    trianglePoints.push(new vec4(-0.38, -0.60, 0, 1));
    trianglePoints.push(new vec4(-0.24, -0.42, 0, 1));
    trianglePoints.push(new vec4(-0.30, 0.0, 0, 1));
    trianglePoints.push(new vec4(-0.19, -0.02, 0, 1));
    trianglePoints.push(new vec4(-0.27, -0.58, 0, 1));
    trianglePoints.push(new vec4(-0.06, -0.54, 0, 1));
    trianglePoints.push(new vec4(-0.06, -0.54, 0, 1));
    trianglePoints.push(new vec4(0.22, -0.72, 0, 1));
    trianglePoints.push(new vec4(0.06, -0.56, 0, 1));
    trianglePoints.push(new vec4(0.06, -0.56, 0, 1));
    trianglePoints.push(new vec4(0.16, -0.43, 0, 1));
    trianglePoints.push(new vec4(0.24, -0.50, 0, 1));
    trianglePoints.push(new vec4(0.24, -0.50, 0, 1));
    trianglePoints.push(new vec4(0.41, -0.38, 0, 1));
    trianglePoints.push(new vec4(0.42, -0.48, 0, 1));
    trianglePoints.push(new vec4(0.42, -0.48, 0, 1));
    trianglePoints.push(new vec4(0.68, -0.60, 0, 1));
    trianglePoints.push(new vec4(0.52, -0.42, 0, 1));
    trianglePoints.push(new vec4(0.52, -0.42, 0, 1));
    trianglePoints.push(new vec4(0.70, -0.38, 0, 1));
    trianglePoints.push(new vec4(0.90, -0.52, 0, 1));
    trianglePoints.push(new vec4(0.98, -0.43, 0, 1));
    trianglePoints.push(new vec4(0.70, -0.38, 0, 1));
    trianglePoints.push(new vec4(0.90, -0.52, 0, 1));
    trianglePoints.push(new vec4(-1.0, -0.95, 0, 1));
    trianglePoints.push(new vec4(-0.76, -0.76, 0, 1));
    trianglePoints.push(new vec4(-0.38, -0.66, 0, 1));
    trianglePoints.push(new vec4(-0.24, -1.0, 0, 1));
    trianglePoints.push(new vec4(-1.0, -0.95, 0, 1));
    trianglePoints.push(new vec4(-0.38, -0.66, 0, 1));
    trianglePoints.push(new vec4(0.90, -0.52, 0, 1));
    trianglePoints.push(new vec4(0.79, -0.62, 0, 1));
    trianglePoints.push(new vec4(0.22, -0.72, 0, 1));
    trianglePoints.push(new vec4(0.44, -0.74, 0, 1));
    trianglePoints.push(new vec4(0.79, -0.62, 0, 1));
    trianglePoints.push(new vec4(0.22, -0.72, 0, 1));
    trianglePoints.push(new vec4(0.70, -1.0, 0, 1));
    trianglePoints.push(new vec4(0.80, -1.0, 0, 1));
    trianglePoints.push(new vec4(0.64, -0.70, 0, 1));
    trianglePoints.push(new vec4(1.0, -1.0, 0, 1));
    trianglePoints.push(new vec4(0.80, -1.0, 0, 1));
    trianglePoints.push(new vec4(1.0, -0.64, 0, 1));
    trianglePoints.push(new vec4(-0.24, -1.0, 0, 1));
    trianglePoints.push(new vec4(0.70, -1.0, 0, 1));
    trianglePoints.push(new vec4(0.22, -0.72, 0, 1));
    trianglePoints.push(new vec4(1.0, -0.64, 0, 1));
    trianglePoints.push(new vec4(0.90, -0.52, 0, 1));
    trianglePoints.push(new vec4(1.0, -0.49, 0, 1));
    trianglePoints.push(new vec4(0.22, -0.72, 0, 1));
    trianglePoints.push(new vec4(0.24, -0.50, 0, 1));
    trianglePoints.push(new vec4(0.42, -0.48, 0, 1));
    trianglePoints.push(new vec4(-0.06, -0.54, 0, 1));
    trianglePoints.push(new vec4(-0.01, -0.69, 0, 1));
    trianglePoints.push(new vec4(-0.24, -1.0, 0, 1));
    trianglePoints.push(new vec4(-0.01, -0.69, 0, 1));
    trianglePoints.push(new vec4(-0.26, -0.58, 0, 1));
    trianglePoints.push(new vec4(-0.38, -0.66, 0, 1));
    //need some graphics memory allocated
    let bufferId = gl.createBuffer();
    //tell WebGL that the buffer we just created is the one we want to work with
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //send main memory data to video memory.  Note use of Angel's flatten
    gl.bufferData(gl.ARRAY_BUFFER, flatten(trianglePoints), gl.STATIC_DRAW);
    //What is this data going to be used for?
    //The vertex shader code had an attribute named "vPosition".  This data feeds that
    let vPosition = gl.getAttribLocation(program, "vPosition"); //fetch by name
    //attrib location we just fetched, 4 elements per value, data type float, don't normalize
    //data has no gaps, starts right away at index 0
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}
//draw one frame
function render() {
    //start by clearing any buffers
    gl.clear(gl.COLOR_BUFFER_BIT);
    //if needed...
    //gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    //draw our geometry
    //draw triangles, start at index 0, there will be 153 verts total
    gl.drawArrays(gl.TRIANGLES, 0, 153);
}
//# sourceMappingURL=hellofunctions.js.map