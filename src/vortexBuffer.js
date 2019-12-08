class Vortexer {
  constructor (size) {
    // Internal state
    this.target = [
      new THREE.WebGLRenderTarget(size, size),
      new THREE.WebGLRenderTarget(size, size)
    ];

    // Set to repeat wrapping
    this.target[0].texture.wrapS = THREE.RepeatWrapping;
    this.target[0].texture.wrapT = THREE.RepeatWrapping;
    this.target[1].texture.wrapS = THREE.RepeatWrapping;
    this.target[1].texture.wrapT = THREE.RepeatWrapping;

    // Don't need those buffers
    this.target[0].depthBuffer = false;
    this.target[0].depthBuffer = false;
    this.target[1].stencilBuffer = false;
    this.target[1].stencilBuffer = false;

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
        },

        initialFrame: {
          value: this.target[0].texture
        },

        velocityPrescaler: {
          value: 140.0
        },

        blendScaler: {
          value: 0.00
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
