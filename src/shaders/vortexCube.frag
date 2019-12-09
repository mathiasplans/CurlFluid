var vortexCubeFrag = `
uniform sampler2D previousFrame;
uniform sampler2D initialFrame;
uniform float time;
uniform float sizex;
uniform float sizey;
uniform float velocityPrescaler;
uniform float blendScaler;

in vec3 interpolatedPosition;

#include <noise.frag>

float normalFlip(float a) {
  return 1.0 - a;
}

void main() {
  vec3 realPosition;
  realPosition.x = (interpolatedPosition.x / (sizex / 2.0) + 1.0) / 2.0;
  realPosition.y = (interpolatedPosition.y / (sizey / 2.0) + 1.0) / 2.0;

  // Determine the face
  float face = ceil(6.0 * realPosition.x);
  float normalFace = (face - 1.0) / 6.0;

  vec3 facePosition = realPosition - vec3(normalFace, 0.0, 0.0);
  facePosition.x *= 6.0;

  // Where on the sphere the point is
  vec3 spherePosition = facePosition;
  if (face == 1.0) {
    spherePosition.x = normalFlip(spherePosition.x);
    spherePosition.z = 1.0;
  }

  else if (face == 2.0) {
    spherePosition.z = normalFlip(spherePosition.x);
    spherePosition.x = 0.0;
  }

  else if (face == 4.0) {
    spherePosition.z = spherePosition.x;
    spherePosition.x = 1.0;
  }

  else if (face == 5.0) {
    spherePosition.z = normalFlip(spherePosition.x);
    spherePosition.x = normalFlip(spherePosition.y);
    spherePosition.y = 1.0;
  }

  else if (face == 6.0) {
    spherePosition.z = normalFlip(spherePosition.x);
    spherePosition.x = spherePosition.y;
    spherePosition.y = 0.0;
  }

  // Now if we normalize the position, every point should be at the same distance from the center of the sphere
  // TODO: Shift and uvCoord also have to be calculated on the sphere. Otherwise this will ruin everything
  //spherePosition = normalize(spherePosition);

  // TODO: Use 2D noise!
  vec3 shift = cnoise3(5.0 * spherePosition + vec3(time, time, time) / 30.0) / velocityPrescaler;
  vec2 uvPosition = (facePosition + shift).xy;
  uvPosition.x /= 6.0;
  uvPosition += vec2(normalFace, 0.0);

  // TODO: Change the uvCoords if in another cubeFace (0 > and 1 <)

  vec3 color = texture(previousFrame, uvPosition).xyz;
  vec3 inplace = texture(previousFrame, realPosition.xy).xyz;

  // If there is no color, set initial value from initialFrame
  if (color == vec3(0.0, 0.0, 0.0)) {
    color = texture(initialFrame, realPosition.xy).xyz;
    inplace = color;
  }

  // Just makes the swirls last longer (introduces different pixels into mix)
  if (realPosition.y < 0.1)
    color *= 1.0 + (0.1 - realPosition.y) / sizey;

  gl_FragColor = vec4(mix(color, inplace, blendScaler), 1.0);
  // gl_FragColor = vec4(vec3(spherePosition), 1.0);
}
`
