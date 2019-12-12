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

/**
 * Calculate derivative of the simplex noise on the surface of a sphere
 */
vec2 dsnoise2(in vec3 p) {
  // Get the delta angle
  float delta = 0.001;

  // Get the normal
  vec3 n = normalize(p);

  // Get the direction vectors
  vec3 ydir = delta * normalize(cross(vec3(1.0, 0.0, 0.0), n));
  vec3 xdir = delta * normalize(cross(n, ydir));

  // Get the points for Dn/Dx
  float x1 = noise(normalize(p + xdir));
  float x2 = noise(normalize(p - xdir));

  // Get the points for Dn/Dy
  float y1 = noise(normalize(p + ydir));
  float y2 = noise(normalize(p - ydir));

  // Dn/Dx
  float dx = (x1 - x2) / delta;

  // Dn/Dy
  float dy = (y1 - y2) / delta;

  return vec2(dx, dy);
}

/**
 * Calculate derivative of the simplex noise on the surface of a sphere,
 * return the change in 3D space
 */
vec3 dsnoise3(in vec3 p) {
  // Get the delta angle
  float delta = 0.001;

  // Get the normal
  vec3 n = normalize(p);

  // Get the direction vectors
  vec3 yndir = normalize(cross(vec3(1.0, 0.0, 0.0), n));
  vec3 xndir = normalize(cross(n, yndir));
  vec3 ydir = delta * yndir;
  vec3 xdir = delta * xndir;

  // Get the points for Dn/Dx
  float x1 = noise(normalize(p + xdir));
  float x2 = noise(normalize(p - xdir));

  // Get the points for Dn/Dy
  float y1 = noise(normalize(p + ydir));
  float y2 = noise(normalize(p - ydir));

  // Dn/Dx
  float dx = (x1 - x2) / delta;

  // Dn/Dy
  float dy = (y1 - y2) / delta;

  return yndir * dy + xndir * dx;
}

vec2 cnoise2(in vec3 p) {
  vec2 d = dnoise2(p);
  return vec2(d.y, -d.x);
}

vec3 cnoise3(in vec3 p) {
  vec3 d = dnoise3(p);
  return vec3(d.z - d.y, d.x - d.z, d.y - d.x);
}

vec2 csnoise2(in vec3 p) {
  vec2 d = dsnoise2(p);
  return vec2(d.y, -d.x);
}

vec3 csnoise3(in vec3 p) {
  vec3 d = dsnoise3(p);
  return vec3(d.z - d.y, d.x - d.z, d.y - d.x);
}

vec3 csnoise23(in vec3 p, in vec3 normal) {
  vec2 curl = csnoise2(p);

  // Get the direction vectors
  vec3 yndir = normalize(cross(vec3(1.0, 0.0, 0.0), normal));
  vec3 xndir = normalize(cross(normal, yndir));

  return xndir * curl.x + yndir * curl.y;
  //return xndir;
}
`
