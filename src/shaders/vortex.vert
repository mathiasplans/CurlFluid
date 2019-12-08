var vortexVert = `
out vec3 interpolatedPosition;

void main() {
  interpolatedPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
