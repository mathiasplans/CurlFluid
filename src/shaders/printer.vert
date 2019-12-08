var printerVert = `
out vec3 interpolatedPosition;
out vec3 interpolatedNormal;

void main() {
  interpolatedPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
