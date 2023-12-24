#version 300 es
precision mediump float;

in vec4 AmbientDiffuseColor;
in vec4 Normal;
in vec4 SpecularColor;
in float SpecularExponent;
in vec3 V;
in vec3 N;
in vec4 position;

out vec4  fColor;

uniform mat4 model_view;
uniform mat4 projection;
uniform vec4 ambient_light;
uniform float[6] theta;
uniform vec4[6] light_position;
uniform vec4[6] light_direction;
uniform vec4[6] light_color;
uniform int[6] light_on;

void main()
{
	vec4 amb = vec4(0,0,0,1);
	vec4 diff = vec4(0,0,0,1);
	vec4 spec = vec4(0,0,0,1);

	vec4 veyepos = model_view * position;

	vec3 l;
	vec3 r;
	vec3 v = normalize(V);
	vec3 n = normalize(N);

	if (dot(n, v) < 0.0) {
		n *= -1.0;
	}

	amb = AmbientDiffuseColor * ambient_light; //Normal

	for (int i = 0; i < light_position.length(); i++) {
		if (light_on[i] == 1) {
			l = normalize(light_position[i].xyz - veyepos.xyz);
			r = normalize(reflect(-l, n));

			if (theta[i] <= dot(normalize(light_direction[i].xyz), normalize(veyepos.xyz-light_position[i].xyz))) {
				diff = diff + max(dot(l, n), 0.0) * AmbientDiffuseColor * light_color[i];
				spec = spec + pow(max(dot(r, v), 0.0), SpecularExponent) * SpecularColor;
				if (dot(l, n) < 0.0) { // aka we are just over the horizon
					spec = vec4(0, 0, 0, 1);// get rid of specular term
				}
			}
		}
	}

	vec4 color = amb + diff + spec;
	//color = Normal;
	color.a = 1.0;
	fColor = color;
}