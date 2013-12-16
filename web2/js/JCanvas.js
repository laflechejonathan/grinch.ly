
JCanvas = {

    DEFAULT_TOOL : 'hand',
    
    tool : {},
    
    canvas : {},

    init : function() {

        // Initialize Selectable Tools
        $( '#drawingtools' ).selectable({
            selected : function(event, ui) {
                JCanvas.changeTool(ui.selected.id);
            }
        });

        // Initialize Tool to Default Tool
        if (JCanvas.tools[JCanvas.DEFAULT_TOOL]) {
            JCanvas.tool = new JCanvas.tools[JCanvas.DEFAULT_TOOL]();
        }

        // Initialize Canvas and attach event handler(s)
        JCanvas.canvas = new fabric.Canvas('imageView');
        JCanvas.canvas.on('mouse:down', function(options) {
            if ( ! options.target) {
                JCanvas.canvasEvent(options.e);
            }
        });
    },

    changeTool : function(tool) {
        
        if (JCanvas.tools[tool]) {
            JCanvas.tool = new JCanvas.tools[tool]();
        }
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
