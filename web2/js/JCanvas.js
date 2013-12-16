
JCanvas = {

    DEFAULT_TOOL : 'hand',
    
    tool : {},
    
    canvas : {},

    init : function() {

        $( '#drawingtools' ).selectable({
            selected : function(event, ui) {
                JCanvas.changeTool(ui.selected.id);
            }
        });

        // Find the canvas element.
        var canvasElement = document.getElementById('imageView');
        if ( ! canvasElement || ! canvasElement.getContext || ! canvasElement.getContext('2d')) {
            alert('Error: Something is wrong with the canvas!');
            return;
        }

        JCanvas.canvas = new fabric.Canvas('imageView');

        // Activate the default tool.
        if (JCanvas.tools[JCanvas.DEFAULT_TOOL]) {
            JCanvas.tool = new JCanvas.tools[JCanvas.DEFAULT_TOOL]();
        }

        JCanvas.canvas.on('mouse:down', function(options) {
            if ( ! options.target) {
                JCanvas.canvasEvent(options.e);
            }
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
        if (func) {
            func(ev);
        }
    },

    changeTool : function(tool) {

        console.log(tool);
        if (JCanvas.tools[tool]) {
            JCanvas.tool = new JCanvas.tools[tool]();
        }
    },

    tools : {

        hand: function() { },

        ellipse : function() {
            this.mousedown = function(ev) { 
                JCanvas.canvas.add(
                    new fabric.Ellipse({
                        fill: 'none', 
                        stroke : 'black',
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
