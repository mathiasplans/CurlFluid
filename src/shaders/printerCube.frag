var printerCubeFrag = `
uniform sampler2D faces[6];

uniform sampler2D face1;
uniform sampler2D face2;
uniform sampler2D face3;
uniform sampler2D face4;
uniform sampler2D face5;
uniform sampler2D face6;

uniform float sizex;
uniform float sizey;
in vec3 interpolatedPosition;

void main() {
  vec3 realPosition;
  realPosition.x = (interpolatedPosition.x / (sizex / 2.0) + 1.0) / 2.0;
  realPosition.y = (interpolatedPosition.y / (sizey / 2.0) + 1.0) / 2.0;

  float face;
  modf((6.0 * (interpolatedPosition.x + sizex / 2.0)) / sizex, face);
  float normalFace = (face) / 6.0;
  vec3 facePosition = realPosition - vec3(normalFace, 0.0, 0.0);
  facePosition.x *= 6.0;

  gl_FragColor = vec4(texture(faces[int(face)], facePosition.xy).xyz, 1.0);

  int f = int(face);
  if (f == 0)
    gl_FragColor = vec4(texture(face1, facePosition.xy).xyz, 1.0);
  if (f == 1)
    gl_FragColor = vec4(texture(face2, facePosition.xy).xyz, 1.0);
  if (f == 2)
    gl_FragColor = vec4(texture(face3, facePosition.xy).xyz, 1.0);
  if (f == 3)
    gl_FragColor = vec4(texture(face4, facePosition.xy).xyz, 1.0);
  if (f == 4)
    gl_FragColor = vec4(texture(face5, facePosition.xy).xyz, 1.0);
  if (f == 5)
    gl_FragColor = vec4(texture(face6, facePosition.xy).xyz, 1.0);
}
`
