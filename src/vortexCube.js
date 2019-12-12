class VortexerCube {
  constructor(size) {
    // Internal state
    this.targets = [
      [
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size)
      ],
      [
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size),
        new THREE.WebGLRenderTarget(size, size)
      ]
    ];

    this.textures = [
      [
        this.targets[0][0].texture,
        this.targets[0][1].texture,
        this.targets[0][2].texture,
        this.targets[0][3].texture,
        this.targets[0][4].texture,
        this.targets[0][5].texture
      ],
      [
        this.targets[1][0].texture,
        this.targets[1][1].texture,
        this.targets[1][2].texture,
        this.targets[1][3].texture,
        this.targets[1][4].texture,
        this.targets[1][5].texture
      ]
    ];

    // Set to repeat wrapping

    for (var i = 0; i < 6; ++i) {
      this.targets[0][i].texture.wrapS = THREE.RepeatWrapping;
      this.targets[0][i].texture.wrapT = THREE.RepeatWrapping;
      this.targets[1][i].texture.wrapS = THREE.RepeatWrapping;
      this.targets[1][i].texture.wrapT = THREE.RepeatWrapping;
      // this.targets[0][i].texture.magFilter = THREE.NearestFilter;
      // this.targets[0][i].texture.minFilter = THREE.NearestFilter;
      // this.targets[1][i].texture.magFilter = THREE.NearestFilter;
      // this.targets[1][i].texture.minFilter = THREE.NearestFilter;

        // Don't need those buffers
      this.targets[0][i].depthBuffer = false;
      this.targets[0][i].depthBuffer = false;
      this.targets[1][i].stencilBuffer = false;
      this.targets[1][i].stencilBuffer = false;
    }


    // Create six faces
    this.cubeFaces = [
      new vortexFace(1, size, this.textures),
      new vortexFace(2, size, this.textures),
      new vortexFace(3, size, this.textures),
      new vortexFace(4, size, this.textures),
      new vortexFace(5, size, this.textures),
      new vortexFace(6, size, this.textures),
    ];
  }

  update(renderer, parity) {
    for (var i = 0; i < 6; ++i) {
      this.cubeFaces[i].update(1 - parity);
      renderer.setRenderTarget(this.targets[parity][i]);
      renderer.render(this.cubeFaces[i].scene, this.cubeFaces[i].camera);
    }
  }
}
