var vortexVert = `
out vec3 interpolatedPosition;
out vec3 interpolatedNormal;
out vec3 interpolatedLocalPosition;

void main() {
  interpolatedLocalPosition = position;
  interpolatedPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
