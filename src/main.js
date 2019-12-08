var size = 800;

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

  renderer.setSize(size, size);

  // Create Plane vortecies
  controller = new Plane(size);

  draw();
}

var parity = 0;
var x = 0;

function draw() {
  requestAnimationFrame(draw);

  controller.update(renderer);
}
