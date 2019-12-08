function setPre(material) {
  // Noise generation shader
  material.onBeforeCompile = shader => {
    // Noise fragment shader
    shader.fragmentShader = shader.fragmentShader.replace('#include <noise.frag>', noiseFrag);
    shader.vertexShader = shader.vertexShader.replace('#include <noise.frag>', noiseFrag);

    // Noise computation shader
    shader.fragmentShader = shader.fragmentShader.replace('#include <noise.comp>', noiseComp);
    shader.vertexShader = shader.vertexShader.replace('#include <noise.comp>', noiseComp);
  };
}
