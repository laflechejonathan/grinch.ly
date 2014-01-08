
JCanvas = {

    CANVAS_WIDTH : 800,

    CANVAS_HEIGHT : 600,

    DEFAULT_TOOL : 'hand',
    
    tool : {},
    
    canvas : {},

    images : [],

    init : function() {

        // Initialize Selectable Tools
        $( '#drawingtools' ).selectable({
            selected : function(event, ui) {
                JCanvas.changeTool(ui.selected.id);
            }
        });

        // Initialize Submission Options
        $( '#submissionoptions' ).selectable({
            selected : function(event, ui) {
                JCanvas.submitCanvas();
                $('#submissionoptions .ui-selected').removeClass('ui-selected')
            }
        });

        // Initialize Tool to Default Tool
        if (JCanvas.tools[JCanvas.DEFAULT_TOOL]) {
            JCanvas.tool = new JCanvas.tools[JCanvas.DEFAULT_TOOL]();
        }

        // Initialize Canvas and attach event handler(s)
        JCanvas.canvas = new fabric.Canvas('canvas');
        JCanvas.canvas.width = JCanvas.CANVAS_WIDTH;
        JCanvas.canvas.height = JCanvas.CANVAS_HEIGHT;
        JCanvas.canvas.on('mouse:down', function(options) {
            if ( ! options.target) {
                JCanvas.canvasEvent(options.e);
            }
        });

        // Initialize drag+drop image API
        var target = document.getElementById("canvascontainer");
        target.addEventListener("dragover", function(ev) { ev.preventDefault(); }, true);
        target.addEventListener("drop", function(ev) {
            ev.preventDefault(); 
            JCanvas.addImage(ev.dataTransfer.files[0]);
        }, true);
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

    addImage : function(src) {

        if ( ! src.type.match(/image.*/)) {
            console.log("The dropped file is not an image: ", src.type);
            return;
        }

        var reader = new FileReader();
        
        reader.onload = function(ev) {

            var image = new Image();

            image.onload = function() {
                var canvas = document.getElementById("canvas");

                var scale = Math.min(
                    JCanvas.CANVAS_HEIGHT / image.height, 
                    JCanvas.CANVAS_WIDTH / image.width) - 0.01;

                var imgInstance = new fabric.Image(image, {
                    left: 100,
                    top: 100,
                    scaleX: scale,
                    scaleY: scale,
                    angle: 0,
                    opacity: 1.0
                });
                
                JCanvas.canvas.add(imgInstance);
            };
            image.src = ev.target.result;
            JCanvas.images.push(image);
        }
        reader.readAsDataURL(src);
    },

    submitCanvas : function() {

        // Submit the drawing
        if (JCanvas.canvas._objects.length > 0) {
            JCanvas.sendDrawing(JCanvas.canvas);
            alert("Successfully submitted drawing!");
        }

        // Clear Canvas
        JCanvas.canvas.clear();
    },

    sendDrawing : function(canvas) {
        
        $.ajax({
          type: "POST",
          url: "/test",
          data: canvas.toJSON()
        });

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
