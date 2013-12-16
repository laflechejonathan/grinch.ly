
debug = {};

JCanvas = {

    DEFAULT_TOOL : 'line',
    
    tool : {},
    
    canvas : {},

    init : function() {

        // Find the canvas element.
        var canvasElement = document.getElementById('imageView');
        if ( ! canvasElement || ! canvasElement.getContext || ! canvasElement.getContext('2d')) {
            alert('Error: Something is wrong with the canvas!');
            return;
        }

        JCanvas.canvas = new fabric.Canvas('imageView');

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

        JCanvas.canvas.on('mouse:down', function(options) {
            JCanvas.canvasEvent(options.e);
        });
    },

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
        console.log(func);
        if (func) {
            func(ev);
        }
    },

    toolChangeEvent : function(ev) {

        if (JCanvas.tools[this.value]) {
            JCanvas.tool = new JCanvas.tools[this.value]();
        }
    },

    tools : {

        manipulate: function() {

        },

        ellipse : function() {

            this.mousedown = function(ev) { 

                JCanvas.canvas.add(
                    new fabric.Ellipse({
                        borderColor: 'green', 
                        left: ev._x, 
                        top: ev._y, 
                        rx: 50, 
                        ry: 50
                    }));

            };
        },

        line : function() {

            this.mousedown = function(ev) { 
                
                JCanvas.canvas.add(
                    new fabric.Line([
                        ev._x - 50, 
                        ev._y - 50, 
                        ev._x + 50, 
                        ev._y + 50], { stroke: 'black' }
                    ));

            };
        }
    }
};
