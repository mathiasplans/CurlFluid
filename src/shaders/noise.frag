var noiseFrag = `
#include <noise.comp>

/**
 * Calculates derivative of the noise (on 2D slice)
 */
vec2 dnoise2(in vec3 p) {
  // Delta
  // float delta = 1.0 / 100000.0;
  float o = noise(p);

  // Dn/Dx
  float x1 = o;
  float x2 = noise(p + dFdx(p));
  float dx = (x2 - x1) / dFdx(p).x;

  // Dn/Dy
  float y1 = o;
  float y2 = noise(p + dFdy(p));
  float dy = (y2 - y1) / dFdy(p).y;

  // // Dn/Dx
  // float dx = dFdx(noise(coord)) / dFdx(coord).x;
  //
  // // Dn/Dy
  // float dy = dFdy(noise(coord)) / dFdy(coord).y;

  return vec2(dx, dy) / 6.0;
}

vec3 dnoise3(in vec3 p) {
  // Coordinates
  vec3 coord = p;

  // Delta
  float delta = 1.0 / 10000.0;

  // Dn/Dx
  float x1 = noise(coord - vec3(delta, 0.0, 0.0));
  float x2 = noise(coord + vec3(delta, 0.0, 0.0));
  float dx = (x2 - x1) / delta;

  // Dn/Dy
  float y1 = noise(coord - vec3(0.0, delta, 0.0));
  float y2 = noise(coord + vec3(0.0, delta, 0.0));
  float dy = (y2 - y1) / delta;

  // Dn/Dz
  float z1 = noise(coord - vec3(0.0, 0.0, delta));
  float z2 = noise(coord + vec3(0.0, 0.0, delta));
  float dz = (z2 - z1) / delta;

  return vec3(dx, dy, dz);
}

vec2 cnoise2(in vec3 p) {
  vec2 d = dnoise2(p);
  return vec2(d.y, -d.x);
}

vec3 cnoise3(in vec3 p) {
  vec3 d = dnoise3(p);
  return vec3(d.z - d.y, d.x - d.z, d.y - d.x);
}
`
