var stripesFrag = `
uniform float size;
uniform float frequency;

in vec3 interpolatedPosition;

#include <noise.frag>

void main() {
  vec3 realPosition = (interpolatedPosition / (size / 2.0) + 1.0) / 2.0;

  vec3 major = normalize(vec3(0.2, 0.6, 0.4));
  vec3 minor = normalize(vec3(0.4, 0.1, 0.9));

  vec3 color = mix(major, minor, (cos(frequency * interpolatedPosition.y) + 1.0) / 2.0);

  gl_FragColor = vec4(color, 1.0);
}
`
