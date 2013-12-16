

if (window.addEventListener) {
  
    window.addEventListener('load', function () {
    
        var DEFAULT_TOOL = 'line';

        var canvas, context, canvaso, contexto;

        // The active tool instance.
        var tool;
        
        function init () {
      
            // Find the canvas element.
            canvaso = document.getElementById('imageView');
            if ( ! canvaso) {
                alert('Error: I cannot find the canvas element!');
                return;
            }

            if ( ! canvaso.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }

            // Get the 2D canvas context.
            contexto = canvaso.getContext('2d');
            if ( ! contexto) {
                alert('Error: failed to getContext!');
                return;
            }

            // Add the temporary canvas.
            var container = canvaso.parentNode;
            canvas = document.createElement('canvas');
            if ( ! canvas) {
                alert('Error: I cannot create a new canvas element!');
                return;
            }

            canvas.id     = 'imageTemp';
            canvas.width  = canvaso.width;
            canvas.height = canvaso.height;
            container.appendChild(canvas);

            context = canvas.getContext('2d');

            // Get the tool select input.
            var tool_select = document.getElementById('dtool');
            if ( ! tool_select) {
                alert('Error: failed to get the dtool element!');
                return;
            }
            tool_select.addEventListener('change', ev_tool_change, false);

            // Activate the default tool.
            if (tools[DEFAULT_TOOL]) {
                tool = new tools[DEFAULT_TOOL]();
                tool_select.value = DEFAULT_TOOL;
            }

            // Attach the mousedown, mousemove and mouseup event listeners.
            canvas.addEventListener('mousedown', ev_canvas, false);
            canvas.addEventListener('mousemove', ev_canvas, false);
            canvas.addEventListener('mouseup',   ev_canvas, false);
        }

        // The general-purpose event handler. This function just determines the mouse 
        // position relative to the canvas element.
        function ev_canvas(ev) {
          
            if (ev.layerX || ev.layerX == 0) { // Firefox
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } 
            else if (ev.offsetX || ev.offsetX == 0) { // Opera
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }

            // Call the event handler of the tool.
            var func = tool[ev.type];
            if (func) {
                func(ev);
            }
        }

        // The event handler for any changes made to the tool selector.
        function ev_tool_change (ev) {
            if (tools[this.value]) {
                tool = new tools[this.value]();
            }
        }

        // This function draws the #imageTemp canvas on top of #imageView, after which 
        // #imageTemp is cleared. This function is called each time when the user 
        // completes a drawing operation.
        function img_update () {
      		  contexto.drawImage(canvas, 0, 0);
      		  context.clearRect(0, 0, canvas.width, canvas.height);
        }

        // This object holds the implementation of each drawing tool.
        var tools = {

            
        };

        var tool_utils = {
            mouseup : function(ev, tool) {
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    img_update();
                }
            }
        };

        

        tools.ellipse = function() {
          
            var tool = this;
            this.started = false;

            this.mousedown = function(ev) {
                tool.started = true;
                tool.x0 = ev._x;
                tool.y0 = ev._y;
            };

            this.mousemove = function(ev) {
                
                if ( ! tool.started) {
                    return;
                }

                var x = Math.min(ev._x,  tool.x0),
                    y = Math.min(ev._y,  tool.y0),
                    w = Math.abs(ev._x - tool.x0),
                    h = Math.abs(ev._y - tool.y0);

                context.clearRect(0, 0, canvas.width, canvas.height);

                if (!w || !h) {
                    return;
                }

                drawEllipse(context, x, y, w, h);
            };

            this.mouseup = function (ev) { tool_utils.mouseup(ev, tool) };

            function drawEllipseByCenter(ctx, cx, cy, w, h) {
                drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
            }

            function drawEllipse(ctx, x, y, w, h) {
                var kappa = .5522848,
                    ox = (w / 2) * kappa, // control point offset horizontal
                    oy = (h / 2) * kappa, // control point offset vertical
                    xe = x + w,           // x-end
                    ye = y + h,           // y-end
                    xm = x + w / 2,       // x-middle
                    ym = y + h / 2;       // y-middle

                ctx.beginPath();
                ctx.moveTo(x, ym);
                ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                ctx.closePath();
                ctx.stroke();
            }
        };

        // The line tool.
        tools.line = function () {
            var tool = this;
            this.started = false;

            this.mousedown = function (ev) {
                tool.started = true;
                tool.x0 = ev._x;
                tool.y0 = ev._y;
            };

            this.mousemove = function (ev) {
                
                if (!tool.started) {
                    return;
                }

                context.clearRect(0, 0, canvas.width, canvas.height);

                context.beginPath();
                context.moveTo(tool.x0, tool.y0);
                context.lineTo(ev._x,   ev._y);
                context.stroke();
                context.closePath();
            };

            this.mouseup = function (ev) { tool_utils.mouseup(ev, tool) };
        };

        // tools.pencil = function () {
            
        //     var tool = this;
        //     this.started = false;

        //     this.mousedown = function (ev) {
        //         context.beginPath();
        //         context.moveTo(ev._x, ev._y);
        //         tool.started = true;
        //     };

        //     this.mousemove = function (ev) {
        //         if (tool.started) {
        //             context.lineTo(ev._x, ev._y);
        //             context.stroke();
        //         }
        //     };

        //     this.mouseup = function (ev) { tool_utils.mouseup(ev, tool) };
        // };

        // The rectangle tool.
        // tools.rect = function () {
            
        //     var tool = this;
        //     this.started = false;

        //     this.mousedown = function (ev) {
        //         tool.started = true;
        //         tool.x0 = ev._x;
        //         tool.y0 = ev._y;
        //     };

        //     this.mousemove = function (ev) {
        //         if (!tool.started) {
        //             return;
        //         }

        //         var x = Math.min(ev._x,  tool.x0),
        //             y = Math.min(ev._y,  tool.y0),
        //             w = Math.abs(ev._x - tool.x0),
        //             h = Math.abs(ev._y - tool.y0);

        //         context.clearRect(0, 0, canvas.width, canvas.height);

        //         if (!w || !h) {
        //             return;
        //         }

        //         context.strokeRect(x, y, w, h);
        //     };

        //     this.mouseup = function (ev) { tool_utils.mouseup(ev, tool) };
        // };

        init();

    }, false); 
}

