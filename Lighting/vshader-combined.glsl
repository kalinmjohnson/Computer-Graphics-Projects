#version 300 es
precision mediump float;
precision lowp int;

in vec4 vPosition;
in vec4 vAmbientDiffuseColor;
in vec4 vNormal;
in vec4 vSpecularColor;
in float vSpecularExponent;

out vec4 AmbientDiffuseColor;
out vec4 Normal;
out vec4 SpecularColor;
out float SpecularExponent;
out vec3 V;
out vec3 N;
out vec4 position;

uniform mat4 model_view;
uniform mat4 projection;
uniform vec4 camera_position;

void main() {
	position = vPosition;

	V = normalize( camera_position.xyz ); // -veyepos.xyz eye space is world space but the camera is at the origin
	N = normalize( (model_view * vNormal).xyz); // Normal vector in eye space


	Normal = vec4(N, 0.0);
	AmbientDiffuseColor = vAmbientDiffuseColor;
	SpecularColor = vSpecularColor;
	SpecularExponent = vSpecularExponent;

	gl_Position = projection * model_view * vPosition;
}