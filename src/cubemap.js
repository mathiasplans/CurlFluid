class CubeMap {
  constructor(renderer, size, prescaler = 1) {
    renderer.setSize(6 * size, size);

    this.renderer = renderer;

    // Create Vortexer
    var vortexer = new VortexerCube(size);
    this.vortexer = vortexer;

    // Particle position calculation
    var material = new THREE.ShaderMaterial({
      uniforms: {
        sizex: {
          value: 6 * size
        },

        sizey: {
          value: size
        },

        faces: {
          value: this.vortexer.textures[1]
        },

        face1: {
          value: this.vortexer.textures[1][0]
        },

        face2: {
          value: this.vortexer.textures[1][0]
        },

        face3: {
          value: this.vortexer.textures[1][0]
        },

        face4: {
          value: this.vortexer.textures[1][0]
        },

        face5: {
          value: this.vortexer.textures[1][0]
        },

        face6: {
          value: this.vortexer.textures[1][0]
        }
      },

      vertexShader: printerVert,
      fragmentShader: printerCubeFrag
    });

    // Preprocess
    setPre(material);

    var geometry = new THREE.PlaneBufferGeometry(6 * size, size);

    var plane = new THREE.Mesh(geometry, material);

    // Camera
    var cam = new THREE.OrthographicCamera(-size / 2 * 6, size / 2 * 6, size / 2, -size / 2, 0.1, 10);
    cam.position.set(0, 0, 4);
    cam.lookAt(plane.position);
    cam.up.set(0, 1, 0);

    var s = new THREE.Scene();
    s.add(plane);
    s.add(cam);

    this.sizex = 6 * size;
    this.sizey = size;
    this.scene = s;
    this.camera = cam;
    this.material = material;
    this.mesh = plane;

    // Internal state
    this.prescaler = prescaler;
    this.parity = 0;
    this.v = 0;
  }

  update() {
    if (this.v == 0) {
      // Get the parity
      this.parity = ++this.parity & 1;

      // Swap between the two textures. Add to the time
      this.vortexer.update(renderer, this.parity)

      // Now that we have the position map, we can move the particles according to it
      this.material.uniforms.faces.value = this.vortexer.textures[this.parity];

      this.material.uniforms.face1.value = this.vortexer.targets[this.parity][0].texture;
      this.material.uniforms.face2.value = this.vortexer.targets[this.parity][1].texture;
      this.material.uniforms.face3.value = this.vortexer.targets[this.parity][2].texture;
      this.material.uniforms.face4.value = this.vortexer.targets[this.parity][3].texture;
      this.material.uniforms.face5.value = this.vortexer.targets[this.parity][4].texture;
      this.material.uniforms.face6.value = this.vortexer.targets[this.parity][5].texture;

      // Render
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }

    this.v = ++this.v % this.prescaler;
  }
}
