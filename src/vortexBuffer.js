class Vortexer {
  constructor (size) {
    // Internal state
    this.target = [
      new THREE.WebGLRenderTarget(size, size),
      new THREE.WebGLRenderTarget(size, size)
    ];

    // Particle position calculation
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },

        size: {
          value: size
        },

        previousFrame: {
          value: this.target[1].texture
        }
      },

      vertexShader: vortexVert,
      fragmentShader: vortexFrag
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

    this.size = size;
    this.scene = s;
    this.camera = cam;
    this.material = material;
    this.mesh = buffer;
  }
}
