var size = 256;

var renderer;
var controller;

function onLoad() {
  if (WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
    console.log("WebGL2 is not available");
  }

  var canvasContainer = document.getElementById('myCanvasContainer');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('webgl2');
  canvasContainer.appendChild(canvas);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: context
  });

  // Create Plane vortecies
  // controller = new Plane(renderer, size, 5);

  controller = new CubeMap(renderer, size, 5);

  draw();
}

var parity = 0;
var x = 0;

var initFrame = true;

var initial;

function draw() {
  requestAnimationFrame(draw);

  if (initFrame) {
    // Get the initial picture
    initial = createStripes(renderer, size, 0.05);
    controller.vortexer.material.uniforms.initialFrame.value = initial;
    initFrame = false;
  }

  else
    controller.update();
}
