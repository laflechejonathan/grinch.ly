// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas, context;

  // Initialization sequence.
  function init () {
    // Find the canvas element.
    canvas = document.getElementById('imageView');
    if (!canvas) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvas.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    context = canvas.getContext('2d');
    if (!context) {
      alert('Error: failed to getContext!');
      return;
    }

    // Attach the mousemove event handler.
    canvas.addEventListener('click', ev_click, false);
    canvas.addEventListener('dblclick', ev_double_click, false);
  }

  // The mousemove event handler.
  var started = false;
  function ev_click (ev) {
    var x, y;

    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
      x = ev.layerX;
      y = ev.layerY;
    }

	// left click
	if (ev.button == 0)
	{
		if (!started || ev.ctrlKey)
		{
			console.log("move to" + x + y);
			started = true;
			context.beginPath();
			context.moveTo(x,y);
		}
		else
		{
			console.log("line to" + x + y);
			context.lineTo(x,y);
			context.stroke();
		}
	}
  }

  function double_click (ev) {
	console.log("Double Click");
	context.closePath();
	context.stroke();
  }

  init();
}, false); }

