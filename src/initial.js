function createStripes(renderer, size, frequency) {
  // Particle position calculation
  var material = new THREE.ShaderMaterial({
    uniforms: {
      size: {
        value: size
      },

      frequency: {
        value: frequency
      }
    },

    vertexShader: vortexVert,
    fragmentShader: stripesFrag
  });

  // Preprocess
  setPre(material);

  var geometry = new THREE.PlaneBufferGeometry(size, size);

  var init = new THREE.Mesh(geometry, material);

  // Camera
  var cam = new THREE.OrthographicCamera(-size / 2, size / 2, size / 2, -size / 2, 0.1, 10);
  cam.position.set(0, 0, 4);
  cam.lookAt(init.position);
  cam.up.set(0, 1, 0);

  var s = new THREE.Scene();
  s.add(init);
  s.add(cam);

  var target = new THREE.WebGLRenderTarget(size, size);
  renderer.setRenderTarget(target);
  renderer.render(s, cam);

  return target.texture;
}
