var vortexFrag = `
uniform sampler2D previousFrame;
uniform sampler2D initialFrame;
uniform float time;
uniform float size;
uniform float velocityPrescaler;
uniform float blendScaler;

in vec3 interpolatedPosition;

#include <noise.frag>

void main() {
  vec3 realPosition = (interpolatedPosition / (size / 2.0) + 1.0) / 2.0;
  realPosition.z = 0.0;
  vec2 shift = cnoise2(5.0 * realPosition + vec3(time, 0.0, time / 30.0)) / velocityPrescaler;
  vec2 uvPosition = realPosition.xy + shift;

  vec3 color = texture(previousFrame, uvPosition).xyz;
  vec3 inplace = texture(previousFrame, realPosition.xy).xyz;

  // If there is no color, set initial value from initialFrame
  if (color == vec3(0.0, 0.0, 0.0)) {
    color = texture(initialFrame, realPosition.xy).xyz;
    inplace = color;
  }

  // Just makes the swirls last longer (introduces different pixels into mix)
  if (realPosition.y < 0.1)
    color *= 1.0 + (0.1 - realPosition.y) / size;

  gl_FragColor = vec4(mix(color, inplace, blendScaler), 1.0);
}
`
