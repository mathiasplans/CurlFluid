class vortexFace {
  constructor(face, size, textures) {
    this.findex = face;
    this.size = size;
    this.textures = textures;

    // Particle position calculation
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },

        size: {
          value: size
        },

        faces: {
          value: this.textures[0]
        },

        initialFrame: {
          value: this.textures[0][0]
        },

        velocityPrescaler: {
          value: 140.0
        },

        blendScaler: {
          value: 0.00
        }
      },

      defines: {
        FACE: face
      },

      vertexShader: vortexVert,
      fragmentShader: vortexFaceFrag
    });

    // Preprocess
    setPre(material);

    var geometry = new THREE.PlaneBufferGeometry(size, size);

    var buffer = new THREE.Mesh(geometry, material);

    // Camera
    var cam = new THREE.OrthographicCamera(-size / 2, size / 2, size / 2, -size / 2, 0.1, 10);
    cam.position.set(0, 0, 4);
    cam.lookAt(buffer.position);
    cam.up.set(0, 1, 0);

    var s = new THREE.Scene();
    s.add(buffer);
    s.add(cam);

    this.scene = s;
    this.camera = cam;
    this.material = material;
    this.mesh = buffer;
  }

  update(parity) {
    this.material.uniforms.time.value += 0.01;
    this.material.uniforms.faces.value = this.textures[parity];
  }
}
