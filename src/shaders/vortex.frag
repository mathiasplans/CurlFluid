var vortexFrag = `
uniform sampler2D previousFrame;
uniform float time;
uniform float size;

in vec3 interpolatedLocalPosition;
in vec3 interpolatedPosition;
in vec3 interpolatedNormal;

#include <noise.frag>

void main() {
  // Get the current position in the position map
  //vec3 current = texture(previousFrame, interpolatedLocalPosition.xy / vec2(size)).xyz;

  // Add the curl to it
  //current += vec3(cnoise2(interpolatedLocalPosition + current), 0.0);

  vec3 realPosition = (interpolatedPosition / 400.0 + 1.0) / 2.0;
  realPosition.z = 0.0;
  vec2 shift = cnoise2(5.0 * realPosition + vec3(0.0, time, 0.0));
  vec2 uvPosition = realPosition.xy + shift;

  vec3 color = texture(previousFrame, uvPosition).xyz;

  if (color == vec3(0.0, 0.0, 0.0))
    color = vec3(pow(abs(cos(0.035 * interpolatedPosition.x)), 5.0), pow(abs(cos(0.035 * interpolatedPosition.x)), 2.6), pow(abs(cos(0.035 * interpolatedPosition.y)), 3.0));

  // Just makes the swirls last longer (introduces different pixels into mix)
  if (realPosition.y < 0.1)
    color *= 1.0 + (0.1 - realPosition.y) / 800.0;

  //gl_FragColor = vec4(current, 1.0);
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(uvPosition, 0.0, 1.0);
}
`
