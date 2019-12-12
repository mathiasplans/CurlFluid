var cubeFrag = `
vec2 rotateLeft(vec2 p) {
  return vec2(1.0 - p.y, p.x);
}

vec2 rotateRight(vec2 p) {
  return vec2(p.y, 1.0 - p.x);
}

vec2 doubleRotate(vec2 p) {
  return 1.0 - p;
}

vec3 faceToSphere(vec3 p) {
#if (FACE == 1)
  p.x = -p.x;
  p.z = 1.0;
#endif
#if (FACE == 2)
  p.z = -p.x;
  p.x = -1.0;
#endif
#if (FACE == 3)
  p.z = -1.0;
#endif
#if (FACE == 4)
  p.z = p.x;
  p.x = 1.0;
#endif
#if (FACE == 5)
  p.z = -p.x;
  p.x = -p.y;
  p.y = 1.0;
#endif
#if (FACE == 6)
  p.z = -p.x;
  p.x = p.y;
  p.y = -1.0;
#endif

  return p;
}

vec3 sphereToFace(vec3 p) {
#if (FACE == 1)
  p.x = -p.x;
#endif
#if (FACE == 2)
  p.x = -p.z;
#endif
#if (FACE == 4)
  p.x = p.z;
#endif
#if (FACE == 5)
  p.y = -p.x;
  p.x = -p.z;
#endif
#if (FACE == 6)
  p.y = p.x;
  p.x = -p.z;
#endif
  p.z = 0.0;

  return p;
}

#define M_PI     (3.14159265359)
#define R        (M_PI / 2.0)

vec3 rotateSphere(vec3 spherePosition, ivec2 direction) {
  vec2 angle = R * vec2(direction);

  mat3 horizontalRotation = mat3(
    cos(angle.x), 0, sin(angle.x),
    0, 1, 0,
    -sin(angle.x), 0, cos(angle.x)
  );

  mat3 verticalRotation = mat3(
    1, 0, 0,
    0, cos(angle.y), -sin(angle.y),
    0, sin(angle.y),  cos(angle.y)
  );

  // Left/Right
  spherePosition = horizontalRotation * spherePosition;

  // Up/down
  spherePosition = verticalRotation * spherePosition;

  return spherePosition;
}

/**
 * Calculates the UV coordinates of the texture on the face of the shifted point
 */
vec2 getUV(vec3 spherePosition, vec3 shift, out int tindex) {
  // Get the shifted point
  vec3 shifted = normalize(spherePosition + shift);

  // Normals
  vec3 normals[6];

  // Face 0
  normals[0] = vec3(0.0, 0.0, 1.0);
  normals[1] = vec3(-1.0, 0.0, 0.0);
  normals[2] = vec3(0.0, 0.0, -1.0);
  normals[3] = vec3(1.0, 0.0, 0.0);
  normals[4] = vec3(0.0, 1.0, 0.0);
  normals[5] = vec3(0.0, -1.0, 0.0);

  // Calculate closest normal
  float dist = -1.0;
  float current;
  int closest = 0;
  for (int i = 0; i < 6; ++i) {
    current = dot(shifted, normals[i]);
    if (current > dist) {
      dist = current;
      closest = i;
    }
  }

  // Now we know the face. Now can project back to cube face
  // NOTE: How is denormalization done? The new length of the position vector can be calculated
  // by multiplying the point on the sphere with 1 / cos(x), where x is angle between face normal
  // and position vector. We already have it calculated in variable dist.

  // First, we rotate the sphere when the shifted point crosses it's original cube face (if needed),
  // then, we denormalize the point (project it back onto cube). Then, we undo what was done in
  // faceToSphere function and set the z coord to 0. In addition, we assing the new face to the
  // tindex argument

  ivec2 rotation = ivec2(0, 0);
#if (FACE == 1)
  // If face == 2, rotate left
  if (closest == 1)
    rotation.x = -1;

  // If face == 4, rotate right
  else if (closest == 3)
    rotation.x = 1;

  // If face == 5, rotate down
  else if (closest == 4)
    rotation.y = -1;

  // If face == 6, rotate up
  else if (closest == 5)
    rotation.y = 1;

  spherePosition = rotateSphere(spherePosition, rotation);
  spherePosition /= dist;
  spherePosition.x = -spherePosition.x;
#endif
#if (FACE == 2)
  // If face == 3, rotate left
  if (closest == 2)
    rotation.x = -1;

  // If face == 1, rotate right
  else if (closest == 0)
    rotation.x = 1;

  // If face == 5, rotate down
  else if (closest == 4)
    rotation.y = -1;

  // If face == 6, rotate up
  else if (closest == 5)
    rotation.y = 1;

  spherePosition = rotateSphere(spherePosition, rotation);
  spherePosition /= dist;
  spherePosition.x = -spherePosition.z;
#endif
#if (FACE == 3)
  // If face == 4, rotate left
  if (closest == 3)
    rotation.x = -1;

  // If face == 2, rotate right
  else if (closest == 1)
    rotation.x = 1;

  // If face == 5, rotate down
  else if (closest == 4)
    rotation.y = -1;

  // If face == 6, rotate up
  else if (closest == 5)
    rotation.y = 1;

  spherePosition = rotateSphere(spherePosition, rotation);
  spherePosition /= dist;
#endif
#if (FACE == 4)
  // If face == 1, rotate left
  if (closest == 0)
    rotation.x = -1;

  // If face == 3, rotate right
  else if (closest == 2)
    rotation.x = 1;

  // If face == 5, rotate down
  else if (closest == 4)
    rotation.y = -1;

  // If face == 6, rotate up
  else if (closest == 5)
    rotation.y = 1;

  spherePosition = rotateSphere(spherePosition, rotation);
  spherePosition /= dist;
  spherePosition.x = spherePosition.z;
#endif
#if (FACE == 5)
  // If face == 3, rotate left
  if (closest == 2)
    rotation.x = -1;

  // If face == 1, rotate right
  else if (closest == 0)
    rotation.x = 1;

  // If face == 4, rotate down
  else if (closest == 3)
    rotation.y = -1;

  // If face == 2, rotate up
  else if (closest == 1)
    rotation.y = 1;

  spherePosition = rotateSphere(spherePosition, rotation);
  spherePosition /= dist;
  spherePosition.y = -spherePosition.x;
  spherePosition.x = -spherePosition.z;
#endif
#if (FACE == 6)
  // If face == 3, rotate left
  if (closest == 2)
    rotation.x = -1;

  // If face == 1, rotate right
  else if (closest == 0)
    rotation.x = 1;

  // If face == 2, rotate down
  else if (closest == 1)
    rotation.y = -1;

  // If face == 4, rotate up
  else if (closest == 3)
    rotation.y = 1;

  spherePosition = rotateSphere(spherePosition, rotation);
  spherePosition /= dist;
  spherePosition.y = spherePosition.x;
  spherePosition.x = -spherePosition.z;
#endif
  spherePosition.z = 0.0;

  // Output
  tindex = closest;
  return (vec2(spherePosition.x, spherePosition.y) + 1.0) / 2.0;
}

vec2 cubeStich(vec2 uv, out int tindex) {
#if (FACE == 1)
  // If x > 1.0 -> to face 2, no rotation
  if (uv.x >= 1.0) {
    uv.x -= 1.0;
    tindex = 1;
  }

  // If x < 0.0 -> to face 4, no rotation
  else if (uv.x < 0.0) {
    uv.x += 1.0;
    tindex = 3;
  }

  // If y > 1.0 -> to face 5, rotate coordinates to right once
  else if (uv.y >= 1.0) {
    uv.y -= 1.0;
    uv = rotateRight(uv);
    tindex = 4;
  }

  // If y < 0.0 -> to face 6, rotate coordinates to left once
  else if (uv.y < 0.0) {
    uv.y += 1.0;
    uv = rotateLeft(uv);
    tindex = 5;
  }
#endif
#if (FACE == 2)
  // If x > 1.0 -> to face 3, no rotation
  if (uv.x >= 1.0) {
    uv.x -= 1.0;
    tindex = 2;
  }

  // If x < 0.0 -> to face 1, no rotation
  else if (uv.x < 0.0) {
    uv.x += 1.0;
    tindex = 0;
  }

  // If y > 1.0 -> to face 5, no rotation
  else if (uv.y >= 1.0) {
    uv.y -= 1.0;
    tindex = 4;
  }

  // If y < 0.0 -> to face 6, no rotation
  else if (uv.y < 0.0) {
    uv.y += 1.0;
    tindex = 5;
  }
#endif
#if (FACE == 3)
  // If x > 1.0 -> to face 4, no rotation
  if (uv.x >= 1.0) {
    uv.x -= 1.0;
    tindex = 3;
  }

  // If x < 0.0 -> to face 2, no rotation
  else if (uv.x < 0.0) {
    uv.x += 1.0;
    tindex = 1;
  }

  // If y > 1.0 -> to face 5, rotate left
  else if (uv.y >= 1.0) {
    uv.y -= 1.0;
    uv = rotateLeft(uv);
    tindex = 4;
  }

  // If y < 0.0 -> to face 6, rotate right
  else if (uv.y < 0.0) {
    uv.y += 1.0;
    uv = rotateRight(uv);
    tindex = 5;
  }
#endif
#if (FACE == 4)
  // If x > 1.0 -> to face 1, no rotation
  if (uv.x >= 1.0) {
    uv.x -= 1.0;
    tindex = 0;
  }

  // If x < 0.0 -> to face 3
  else if (uv.x < 0.0) {
    uv.x += 1.0;
    tindex = 2;
  }

  // If y > 1.0 -> to face 5, rotate twice
  else if (uv.y >= 1.0) {
    uv.y -= 1.0;
    uv = doubleRotate(uv);
    tindex = 4;
  }

  // If y < 0.0 -> to face 6, rotate twice
  else if (uv.y < 0.0) {
    uv.y += 1.0;
    uv = doubleRotate(uv);
    tindex = 5;
  }
#endif
#if (FACE == 5)
  // If x > 1.0 -> to face 3
  if (uv.x >= 1.0) {
    uv.x -= 1.0;
    uv = rotateRight(uv);
    tindex = 2;
  }

  // If x < 0.0 -> to face 1, rotate right
  else if (uv.x < 0.0) {
    uv.x += 1.0;
    uv = rotateLeft(uv);
    tindex = 0;
  }

  // If y > 1.0 -> to face 4, rotate twice
  else if (uv.y >= 1.0) {
    uv.y -= 1.0;
    uv = doubleRotate(uv);
    tindex = 3;
  }

  // If y < 0.0 -> to face 2
  else if (uv.y < 0.0) {
    uv.y += 1.0;
    tindex = 1;
  }
#endif
#if (FACE == 6)
  // If x > 1.0 -> to face 3, rotate left
  if (uv.x >= 1.0) {
    uv.x -= 1.0;
    uv = rotateLeft(uv);
    tindex = 2;
  }

  // If x < 0.0 -> to face 1, rotate right
  else if (uv.x < 0.0) {
    uv.x += 1.0;
    uv = rotateRight(uv);
    tindex = 0;
  }

  // If y > 1.0 -> to face 2
  else if (uv.y >= 1.0) {
    uv.y -= 1.0;
    tindex = 1;
  }

  // If y < 0.0 -> to face 4, rotate twice
  else if (uv.y < 0.0) {
    uv.y += 1.0;
    uv = doubleRotate(uv);
    tindex = 3;
  }
#endif

  else {
    tindex = FACE - 1;
  }

  return uv;
}

`
