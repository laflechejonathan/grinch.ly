
JCanvas = {

    DEFAULT_TOOL : 'line',
    
    tool : {},
    
    canvas : {},
    contextDynamic : {},
    contextStatic : {},

    init : function() {

        // Find the canvas element.
        var canvasElement = document.getElementById('imageView');
        if ( ! canvasElement || ! canvasElement.getContext || ! canvasElement.getContext('2d')) {
            alert('Error: Something is wrong with the canvas!');
            return;
        }

        // Get the 2D canvas context.
        JCanvas.contextStatic = canvasElement.getContext('2d');

        // Add the temporary canvas.
        JCanvas.canvas = document.createElement('canvas');
        if ( ! JCanvas.canvas) {
            alert('Error: Canvas element cannot be created!');
            return;
        }

        JCanvas.canvas.id     = 'imageTemp';
        JCanvas.canvas.width  = canvasElement.width;
        JCanvas.canvas.height = canvasElement.height;
        canvasElement.parentNode.appendChild(JCanvas.canvas);

        JCanvas.contextDynamic = JCanvas.canvas.getContext('2d');

        // Get the tool select input.
        var toolSelect = document.getElementById('dtool');
        if ( ! toolSelect) {
            alert('Error: Failed to get the dtool element!');
            return;
        }
        toolSelect.addEventListener('change', JCanvas.toolChangeEvent, false);

        // Activate the default tool.
        if (JCanvas.tools[JCanvas.DEFAULT_TOOL]) {
            JCanvas.tool = new JCanvas.tools[JCanvas.DEFAULT_TOOL]();
            toolSelect.value = JCanvas.DEFAULT_TOOL;
        }

        // Attach the mousedown, mousemove and mouseup event listeners.
        JCanvas.canvas.addEventListener('mousedown', JCanvas.canvasEvent, false);
        JCanvas.canvas.addEventListener('mousemove', JCanvas.canvasEvent, false);
        JCanvas.canvas.addEventListener('mouseup',   JCanvas.canvasEvent, false);
    },

    // The general-purpose event handler. This function just determines the mouse 
    // position relative to the canvas element.
    canvasEvent : function(ev) {

        if (ev.layerX || ev.layerX == 0) { // Firefox
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        } 
        else if (ev.offsetX || ev.offsetX == 0) { // Opera
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        // Call the event handler of the tool.
        var func = JCanvas.tool[ev.type];
        if (func) {
            func(ev);
        }
    },

    // The event handler for any changes made to the tool selector.
    toolChangeEvent : function(ev) {

        if (JCanvas.tools[this.value]) {
            JCanvas.tool = new JCanvas.tools[this.value]();
        }
    },

    // This function draws the #imageTemp canvas on top of #imageView, after which 
    // #imageTemp is cleared. This function is called each time when the user 
    // completes a drawing operation.
    imageUpdate : function() {

        JCanvas.contextStatic.drawImage(JCanvas.canvas, 0, 0);
        JCanvas.contextDynamic.clearRect(0, 0, JCanvas.canvas.width, JCanvas.canvas.height);
    },

    // This object holds the implementation of each drawing tool.
    tools : {

        ellipse : function() {

            var tool = JCanvas.toolUtils.init(this);

            this.mousemove = function(ev) {
                
                if ( ! JCanvas.toolUtils.mousemove(ev, tool)) return;

                JDrawer.drawEllipse(
                    JCanvas.contextDynamic,
                    Math.min(ev._x,  tool.x0),
                    Math.min(ev._y,  tool.y0),
                    Math.abs(ev._x - tool.x0),
                    Math.abs(ev._y - tool.y0));
            };

            this.mousedown = function(ev) { JCanvas.toolUtils.mousedown(ev, tool) };
            this.mouseup = function (ev) { JCanvas.toolUtils.mouseup(ev, tool) };
        },

        line : function() {

            var tool = JCanvas.toolUtils.init(this);

            this.mousemove = function (ev) {

                if ( ! JCanvas.toolUtils.mousemove(ev, tool)) return;

                JDrawer.drawLine(
                    JCanvas.contextDynamic,
                    tool.x0, 
                    tool.y0, 
                    ev._x, 
                    ev._y);
            };

            this.mousedown = function(ev) { JCanvas.toolUtils.mousedown(ev, tool) };
            this.mouseup = function (ev) { JCanvas.toolUtils.mouseup(ev, tool) };
        }
    },

    // Common methods among all the tools
    toolUtils : {

        init : function(tool) {
            tool.started = false;
            return tool;
        },

        mousedown : function(ev, tool) {
            tool.started = true;
            tool.x0 = ev._x;
            tool.y0 = ev._y;
        },

        mousemove : function(ev, tool) {
            if ( ! tool.started || (ev._x == tool.x0 && ev._y == tool.y0)) {
                return false;
            }
            JCanvas.contextDynamic.clearRect(0, 0, JCanvas.canvas.width, JCanvas.canvas.height);
            return true;
        },

        mouseup : function(ev, tool) {
            if (tool.started) {
                tool.mousemove(ev);
                tool.started = false;
                JCanvas.imageUpdate();
            }
        }
    },
};

JDrawer = {

    drawEllipse : function(context, x, y, w, h) {
        
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        context.beginPath();
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        context.closePath();
        context.stroke();
    },

    drawLine : function(context, x0, y0, x1, y1) {
        
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.stroke();
        context.closePath();
    }
};


if (window.addEventListener) {
    window.addEventListener('load', JCanvas.init(), false); 
}

