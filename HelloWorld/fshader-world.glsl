#version 300 es
precision mediump float;

// --- Structure of this File ---
// This file is broken into parts by if statements depending on which components are on and off
// 1. In, Out, and Uniform Variables at the Top
// 2. Initializing Additional Variables in the Main Function
// 3. Base without the Night
// 4. Base with the Night
// 5. Specular without Normal
// 6. Normal Mapping
// 7. Cloud Layer (mode 2)

//IN
// Base and overall variables
in vec2 ftexCoord;
in vec4 position;
in vec3 V;
in vec3 N;

// Normal mapping Variables
in vec4 positionNormal;
in vec3 vT; //parallel to surface in eye space
in vec3 vN; //perpendicular to surface in eye space

// Specular values for the shininess
in vec4 SpecularColor;
in float SpecularExponent;

//OUT
// Outgoing total color
out vec4  fColor;

// UNIFORM
// Matrix and light information
uniform mat4 model_view;
uniform mat4 projection;
uniform vec4 ambient_light;
uniform vec4 light_color;
uniform vec4 light_position;

// The different textures used in the scene
uniform sampler2D textureSampler;
uniform sampler2D specularSampler;
uniform sampler2D nightSampler;
uniform sampler2D cloudSampler;
uniform sampler2D normalSampler;

// Int values determining which pieces of the scene are on
uniform int specular_on;
uniform int base_on;
uniform int night_on;
uniform int normal_on;

// Used to distinguish between the clouds and the earth
uniform int mode;

void main()
{
    // Initializing the three light terms
    vec4 amb = vec4(0,0,0,1);
    vec4 diff = vec4(0,0,0,1);
    vec4 spec = vec4(0,0,0,1);

    // Set the eye position
    vec4 veyepos = model_view * position;

    // Calculate Values for lighting equation
    vec3 v = -normalize(V);
    vec3 n = normalize(N);
    vec3 l = normalize( light_position.xyz - veyepos.xyz );
    vec3 r = normalize( reflect(-l, n) );

    // 1. Only the Base Texture
    if (base_on == 1 && night_on == 0 && mode == 1) {
        amb = texture(textureSampler, ftexCoord) * ambient_light;
        diff = texture(textureSampler, ftexCoord) *  max(dot(l, n), 0.0) * light_color;
    }

    // Base Texture and the Night Texture
    if (base_on == 1 && night_on == 1 && mode == 1) {
        float cutoff = 0.2;

        // This is the part where I do the graadual transition
        if (dot(l, n) < -cutoff) {
            amb = texture(nightSampler, ftexCoord);
        } else if (cutoff > dot(l, n) && dot(l, n) > -cutoff) {
            // Percent is the percent of the way across the gradiant region the fragment is so I know how much of each texture to use
            float percent = (dot(l, n) + cutoff) * (1.0/(cutoff*2.0));
            amb = percent*texture(textureSampler, ftexCoord) * ambient_light + (1.0-percent)*texture(nightSampler, ftexCoord);
            // The night doesn't have a diffuse term
            diff = texture(textureSampler, ftexCoord) *  max(dot(l, n), 0.0) * light_color;
        } else {
            amb = texture(textureSampler, ftexCoord) * ambient_light;
            diff = texture(textureSampler, ftexCoord) *  max(dot(l, n), 0.0) * light_color;
        }
    }

    // Specular Component when it is not being recalculating in the normal section
    if (specular_on == 1 && mode == 1 && normal_on == 0) {
        spec = pow( max(dot(r, v), 0.0), SpecularExponent) * texture(specularSampler, ftexCoord);
        if (dot(l, n) < 0.0) { // aka we are just over the horizon
            spec = vec4(0, 0, 0, 1); // get rid of specular term
        }
    }

    // When Normal Mapping is on the diffuse and specular are recalculated
    if (normal_on == 1 && mode == 1) {

        // Normalize the variables again
        vec3 N = normalize(vN);
        vec3 T = normalize(vT);

        // Take the cross product to find the binormal
        // This works because the binormal should be perpindicular to both the normal and tangent, which is what the cross product does
        vec3 BN = cross(N, T);

        // Calculate the eye matrix using a padded version of the three vectors I just made
        // THis moves from local space to eye space
        mat4 eye = mat4(vec4(T, 0.0), vec4(BN, 0.0), vec4(N, 0.0), vec4(0.0, 0.0, 0.0, 1.0));

        vec3 L = normalize(light_position - positionNormal).xyz;
        vec3 E = normalize(-positionNormal).xyz;

        // Read in from the normal texture and get it into the correct range
        vec4 normal = (texture(normalSampler, ftexCoord) - 0.5) * 2.0;
        normal.w = 0.0;

        // Calculate what the correct normal vector is and use it in the lighting equation
        vec4 normalEye = eye * normal;

        // If the base is on use that, otherwise use gray
        vec4 base;
        if (base_on == 1) {
            base = texture(textureSampler, ftexCoord);
        } else {
            base = vec4(0.5, 0.5, 0.5, 1.0);
        }

        // Do the lighting equation steps
        diff = base * max(dot(L, normalEye.xyz), 0.0) * light_color;
        if (specular_on == 1) {
            r = normalize( reflect(-l, normalEye.xyz) );
            spec = pow(max(dot(r, v), 0.0), SpecularExponent) * texture(specularSampler, ftexCoord);
            if (dot(L, normalEye.xyz) < 0.0) { // aka we are just over the horizon
                spec = vec4(0, 0, 0, 1);// get rid of specular term
            }
        }
    }

    // Calculate the final FColor for everything except clouds
    fColor = amb + diff + spec;

    // Clouds: only recalculate the amb and diff for clouds since that are what they need
    // If spec was included, it would mess up the alpha value
    if (mode == 2) {
        amb = texture(cloudSampler, ftexCoord) * vec4(0.2, 0.2, 0.2, 0.1);
        diff = texture(cloudSampler, ftexCoord) *  max(dot(l, n), 0.0) * light_color;
        fColor = amb + diff;
    }

}