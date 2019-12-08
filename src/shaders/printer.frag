var printerFrag = `
uniform sampler2D target;
in vec3 interpolatedPosition;

void main() {
  // TODO: Read the color of the particle from a texture
  vec3 realPosition = (interpolatedPosition / 400.0 + 1.0) / 2.0;

  gl_FragColor = vec4(texture(target, realPosition.xy).xyz, 1.0);
}
`
