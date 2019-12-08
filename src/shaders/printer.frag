var printerFrag = `
uniform sampler2D target;
uniform float size;
in vec3 interpolatedPosition;

void main() {
  // TODO: Read the color of the particle from a texture
  vec3 realPosition = (interpolatedPosition / (size / 2.0) + 1.0) / 2.0;

  gl_FragColor = vec4(texture(target, realPosition.xy).xyz, 1.0);
}
`
