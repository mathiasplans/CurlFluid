var vortexFaceFrag = `
uniform sampler2D initialFrame;
uniform sampler2D faces[6];

uniform float time;
uniform float size;
uniform float velocityPrescaler;
uniform float blendScaler;

in vec3 interpolatedPosition;

#include <noise.frag>
#include <cube.frag>

void main() {
  vec3 realPosition = interpolatedPosition / (size / 2.0);

  // Where on the sphere the point is
  // The end result is in [-1; 1]
  vec3 spherePosition = faceToSphere(realPosition);

  // Now if we normalize the position, every point should be at the same distance from 0, 0, 0.
  // AKA the point is on the sphere
  spherePosition = normalize(spherePosition);

  float timeScalar = 1.0;

  // Rotation matrix, if we want to rotate the noise
  mat3 rotation = mat3(
     cos(timeScalar * time), 0, sin(timeScalar * time),
     0,         1,         0,
    -sin(timeScalar * time), 0, cos(timeScalar * time)
  );

  vec3 shift = csnoise23(rotation * spherePosition, spherePosition) / velocityPrescaler * 11.0;
  //vec3 shift = csnoise3(rotation * spherePosition) / velocityPrescaler * 11.0;
  //vec3 shift = dsnoise3(rotation * spherePosition) / velocityPrescaler * 11.0;

  int tindex = 0;
  vec2 uv = getUV(spherePosition, shift, tindex);
  vec3 color;

  color = texture(faces[tindex], uv).xyz;

  vec3 inplace = texture(faces[FACE - 1], realPosition.xy).xyz;

  // If there is no color, set initial value from initialFrame
  if (time < 0.02) {
    color = texture(initialFrame, realPosition.xy).xyz;
 /*   color = vec3(float(FACE) / 6.0, 1.0 - float(FACE) / 6.0, float(FACE) / 12.0);
    if (FACE == 5)
      color = vec3(1.0, 0.0, 0.0);

    if (FACE == 6)
      color = vec3(0.0, 0.0, 1.0);*/
    inplace = color;
  }

  // Just makes the swirls last longer (introduces different pixels into mix)
  //if (realPosition.y < 0.1)
  //  color *= 1.0 + (0.1 - realPosition.y) / sizey;

  gl_FragColor = vec4(mix(color, inplace, blendScaler), 1.0);
  //gl_FragColor = vec4(((shift * velocityPrescaler)), 1.0);
  //gl_FragColor = vec4((shift * 2.0 + 1.0) / 2.0 , 1.0);
  //gl_FragColor = vec4(uv, 0.0, 1.0);

  // uv.x += float(tindex);
  // uv.x /= 6.0;
  // gl_FragColor = vec4(uv, 0.0, 1.0);

  //gl_FragColor = vec4(color, 1.0);

  //gl_FragColor = vec4(spherePosition, 1.0);
  //float f = float(FACE);
  //gl_FragColor = vec4(vec3(f / 6.0), 1.0);
  //gl_FragColor = vec4(realPosition, 1.0);
  //gl_FragColor = vec4(vec3(((ffaaccee)) / 6.0), 1.0);
  //gl_FragColor = vec4(vec3(((ffaaccee2))), 1.0);
  //gl_FragColor = vec4(vec3(float(tindex) / 6.0), 1.0);
}
`
