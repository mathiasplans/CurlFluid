class VortexerCube {
  constructor (sizex, sizey) {
    // Internal state
    this.target = [
      [
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
      ],
      [
        new THREE.WebGLRenderTarget(sizex, sizey)
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
        new THREE.WebGLRenderTarget(sizex, sizey),
      ]
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

    //this.target[0].magFilter = THREE.NearestFilter;
    //this.target[0].minFilter = THREE.NearestFilter;
    //this.target[1].magFilter = THREE.NearestFilter;
    //this.target[1].minFilter = THREE.NearestFilter;

    // Particle position calculation
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },

        sizex: {
          value: sizex
        },

        sizey: {
          value: sizey
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
      fragmentShader: vortexCubeFrag
    });

    // Preprocess
    setPre(material);

    var geometry = new THREE.PlaneBufferGeometry(sizex, sizey);

    var buffer = new THREE.Mesh(geometry, material);

    // Camera
    var cam = new THREE.OrthographicCamera(-sizex / 2, sizex / 2, sizey / 2, -sizey / 2, 0.1, 10);
    cam.position.set(0, 0, 4);
    cam.lookAt(buffer.position);
    cam.up.set(0, 1, 0);

    var s = new THREE.Scene();
    s.add(buffer);
    s.add(cam);

    this.sizex = sizex;
    this.sizet = sizey;
    this.scene = s;
    this.camera = cam;
    this.material = material;
    this.mesh = buffer;
  }
}
