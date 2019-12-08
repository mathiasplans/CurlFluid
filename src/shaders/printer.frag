var printerFrag = `
uniform sampler2D target;
uniform float sizex;
uniform float sizey;
in vec3 interpolatedPosition;

void main() {
  vec3 realPosition;
  realPosition.x = (interpolatedPosition.x / (sizex / 2.0) + 1.0) / 2.0;
  realPosition.y = (interpolatedPosition.y / (sizey / 2.0) + 1.0) / 2.0;

  gl_FragColor = vec4(texture(target, realPosition.xy).xyz, 1.0);
}
`
