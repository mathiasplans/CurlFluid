class CubeMap {
  constructor(renderer, size, prescaler = 1) {
    renderer.setSize(6 * size, size);

    this.renderer = renderer;

    // Create Vortexer
    var vortexer = new Vortexer(6 * size, size);
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

        target: {
          value: this.vortexer.target[0].texture
        }
      },
      vertexShader: printerVert,
      fragmentShader: printerFrag
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
      this.vortexer.material.uniforms.time.value += 0.01;
      this.vortexer.material.uniforms.previousFrame.value = this.vortexer.target[1 - this.parity].texture;

      // Render the vortecies
      this.renderer.setRenderTarget(this.vortexer.target[this.parity]);
      this.renderer.render(this.vortexer.scene, this.vortexer.camera);

      // Now that we have the position map, we can move the particles according to it
      this.material.uniforms.target.value = this.vortexer.target[this.parity].texture;

      // Render
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }

    this.v = ++this.v % this.prescaler;
  }
}
