var vortexCubeFrag = `
uniform sampler2D previousFrame;
uniform sampler2D initialFrame;
uniform float time;
uniform float sizex;
uniform float sizey;
uniform float velocityPrescaler;
uniform float blendScaler;

in vec3 interpolatedPosition;

#include <noise.frag>

float normalFlip(float a) {
  return 1.0 - a;
}

vec2 faceToUV(vec2 p, float normalFace) {
  p.x /= 6.0;
  return p + vec2(normalFace, 0.0);
}

vec2 UVtoFace(vec2 p, float normalFace) {
  vec2 facePos = p - vec2(normalFace, 0.0);
  facePos.x *= 6.0;
  return facePos;
}

vec2 rotateLeft(vec2 p) {
  return vec2(1.0 - p.y, p.x);
}

vec2 rotateRight(vec2 p) {
  return vec2(p.y, 1.0 - p.x);
}

vec2 doubleRotate(vec2 p) {
  return 1.0 - p;
}

void main() {
  vec3 realPosition;
  realPosition.x = (interpolatedPosition.x / (sizex / 2.0) + 1.0) / 2.0;
  realPosition.y = (interpolatedPosition.y / (sizey / 2.0) + 1.0) / 2.0;

  // Determine the face
  float face = ceil(6.0 * realPosition.x);
  float normalFace = (face - 1.0) / 6.0;

  vec3 facePosition = realPosition - vec3(normalFace, 0.0, 0.0);
  facePosition.x *= 6.0;

  // Where on the sphere the point is
  vec3 spherePosition = facePosition * 2.0 - 1.0;
  if (face == 1.0) {
    spherePosition.x = -spherePosition.x;
    spherePosition.z = 1.0;
  }

  else if (face == 2.0) {
    spherePosition.z = -spherePosition.x;
    spherePosition.x = -1.0;
  }

  else if (face == 3.0) {
    spherePosition.z = -1.0;
  }

  else if (face == 4.0) {
    spherePosition.z = spherePosition.x;
    spherePosition.x = 1.0;
  }

  else if (face == 5.0) {
    spherePosition.z = -spherePosition.x;
    spherePosition.x = -spherePosition.y;
    spherePosition.y = 1.0;
  }

  else if (face == 6.0) {
    spherePosition.z = -spherePosition.x;
    spherePosition.x = spherePosition.y;
    spherePosition.y = -1.0;
  }

  // Now if we normalize the position, every point should be at the same distance from the center of the sphere
  spherePosition = normalize(spherePosition);

  float timeScalar = 0.0;

  // Rotation matrix
  mat3 rotation = mat3(
     cos(timeScalar * time), 0, sin(timeScalar * time),
     0,         1,         0,
    -sin(timeScalar * time), 0, cos(timeScalar * time)
  );

  vec2 shift = csnoise2(5.0 * rotation * spherePosition) / velocityPrescaler * 1.0;
  vec2 uvPosition = facePosition.xy + shift;
  uvPosition.x /= 6.0;
  uvPosition += vec2(normalFace, 0.0);

  vec2 uvFace =  UVtoFace(uvPosition, normalFace);

  // TODO: Change the uvCoords if in another cubeFace (0 > and 1 <)
  if (face == 1.0) {
    // If x > 1.0 -> to face 2
    // If x < 0.0 -> to face 4
    if (uvFace.x < 0.0) {
      uvFace.x += 1.0;
      uvFace.x += 3.0;
    }

    // If y > 1.0 -> to face 5, rotate coordinates to right once
    else if (uvFace.y >= 1.0) {
      uvFace.y -= 1.0;

      uvFace = rotateRight(uvFace);

      uvFace.x += 4.0;
    }

    // If y < 0.0 -> to face 6, rotate coordinates to left once
    else if (uvFace.y < 0.0) {
      uvFace.y += 1.0;

      uvFace = rotateLeft(uvFace);

      uvFace.x += 5.0;
    }
  }

  else if (face == 2.0) {
    // If x > 1.0 -> to face 3
    // If x < 0.0 -> to face 1
    // If y > 1.0 -> to face 5, orientation same
    if (uvFace.y >= 1.0) {
      uvFace.y -= 1.0;
      uvFace.x += 3.0;
    }

    // If y < 0.0 -> to face 6, orientation same
    else if (uvFace.y < 0.0) {
      uvFace.y += 1.0;
      uvFace.x += 4.0;
    }
  }

  else if (face == 3.0) {
    // If x > 1.0 -> to face 4
    // If x < 0.0 -> to face 2
    // If y > 1.0 -> to face 5, rotate coordinates to left once
    if (uvFace.y >= 1.0) {
      uvFace.y -= 1.0;

      uvFace = rotateLeft(uvFace);

      uvFace.x += 2.0;
    }

    // If y < 0.0 -> to face 6, rotate coordinates to right once
    if (uvFace.y < 0.0) {
      uvFace.y += 1.0;

      uvFace = rotateRight(uvFace);

      uvFace.x += 3.0;
    }
  }

  else if (face == 4.0) {
    // If x > 1.0 -> to face 1
    if (uvFace.x >= 1.0) {
      uvFace.x -= 1.0;
      uvFace.x -= 3.0;
    }

    // If x < 0.0 -> to face 3
    // If y > 1.0 -> to face 5, rotate twice
    else if (uvPosition.y >= 1.0) {
      uvFace.y -= 1.0;

      uvFace = doubleRotate(uvFace);

      uvFace.x += 1.0;
    }

    // If y < 0.0 -> to face 6, rotate twice
    else if (uvPosition.y < 0.0) {
      uvFace.y += 1.0;

      uvFace = doubleRotate(uvFace);

      uvFace.x += 2.0;
    }
  }

  else if (face == 5.0) {
    // If x > 1.0 -> to face 3
    if (uvFace.x >= 1.0) {
      uvFace.x -= 1.0;

      uvFace = rotateRight(uvFace);

      uvFace.x -= 2.0;
    }

    // If x < 0.0 -> to face 1, rotate right
    else if (uvFace.x < 0.0) {
      uvFace.x += 1.0;

      uvFace = rotateLeft(uvFace);

      uvFace.x -= 4.0;
    }

    // If y > 1.0 -> to face 4, rotate twice
    else if (uvFace.y >= 1.0) {
      uvFace.y -= 1.0;

      uvFace = doubleRotate(uvFace);

      uvFace.x -= 1.0;

    }

    // If y < 0.0 -> to face 2
    else if (uvFace.y < 0.0) {
      uvFace.y += 1.0;
      uvFace.x -= 3.0;
    }
  }

  else if (face == 6.0) {
    // If x > 1.0 -> to face 3, rotate left
    if (uvFace.x >= 1.0) {
      uvFace.x -= 1.0;

      uvFace = rotateLeft(uvFace);

      uvFace.x -= 3.0;
    }

    // If x < 0.0 -> to face 1, rotate right
    else if (uvFace.x < 0.0) {
      uvFace.x += 1.0;

      uvFace = rotateRight(uvFace);

      uvFace.x -= 5.0;
    }

    // If y > 1.0 -> to face 2
    if (uvFace.y >= 1.0) {
      uvFace.y -= 1.0;
      uvFace.x -= 4.0;
    }

    // If y < 0.0 -> to face 4, rotate twice
    if (uvFace.y < 0.0) {
      uvFace.y += 1.0;

      uvFace = doubleRotate(uvFace);

      uvFace.x -= 2.0;
    }
  }

  uvPosition = faceToUV(uvFace, normalFace);

  vec3 color = texture(previousFrame, uvPosition).xyz;
  vec3 inplace = texture(previousFrame, realPosition.xy).xyz;

  // If there is no color, set initial value from initialFrame
  if (color == vec3(0.0, 0.0, 0.0)) {
    color = texture(initialFrame, realPosition.xy).xyz;
/*    color = vec3(normalFace, 1.0 - normalFace, normalFace * normalFace);
    if (face == 5.0)
      color = vec3(1.0, 0.0, 0.0);

    if (face == 6.0)
      color = vec3(0.0, 0.0, 1.0);*/
    inplace = color;
  }

  // Just makes the swirls last longer (introduces different pixels into mix)
  if (realPosition.y < 0.1)
    color *= 1.0 + (0.1 - realPosition.y) / sizey;

  gl_FragColor = vec4(mix(color, inplace, blendScaler), 1.0);
  //gl_FragColor = vec4(((shift * velocityPrescaler * 4.0) + 1.0) / 2.0, 0.0, 1.0);
  //gl_FragColor = vec4(uvPosition, 0.0, 1.0);
  //gl_FragColor = vec4(realPosition, 0.0);
}
`
