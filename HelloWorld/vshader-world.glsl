#version 300 es
precision mediump float;

in vec4 vPosition;
in vec4 vNormal;
in vec4 vTangent;
in vec4 vSpecularColor;
in float vSpecularExponent;
in vec2 texCoord;

out vec2 ftexCoord;
out vec4 position;
out vec4 positionNormal;
out vec3 V;
out vec3 N;
out vec3 vT;
out vec3 vN;
out vec4 SpecularColor;
out float SpecularExponent;

uniform mat4 model_view;
uniform mat4 projection;
uniform vec4 camera_position;

void main()
{
    // Pass through multiple variables
    position = vPosition;
    ftexCoord = texCoord;

    // Do a few calculations that will be used in the fragment shader
    V = normalize( camera_position.xyz );
    N = normalize( (model_view * vNormal).xyz );

    vN = normalize(model_view * vNormal).xyz;
    vT = normalize(model_view * vTangent).xyz;

    positionNormal = model_view*vPosition;

    SpecularColor = vSpecularColor;
    SpecularExponent = vSpecularExponent;

    // use the matrices to calculate the final position
    gl_Position = projection * model_view * vPosition;

}