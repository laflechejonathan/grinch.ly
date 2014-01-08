
/**
 * Module dependencies.
 */

var PORT = 8080;
var COMMANDS_FILE_NAME = "../../files/commands.txt";
var INTERPRETER_FILE_NAME = "../../jcanvas/src2/interpreter.py";

var fabric = require('fabric').fabric;
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var url = require('url');
var childProcess = require('child_process');

var fs = require('fs');
var app = express();

// all environments
app.set('port', process.env.PORT || PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/api/images', function(req, res) {
    console.log(JSON.stringify(req.files));
});

app.post('/test', function(req, res) {

    console.log("START");
    console.log(req.body);
    console.log(req.body.objects);
    console.log("DONE");

    commands = [];

    var canvasObjects = req.body.objects;
    for (var i in canvasObjects) {
        var canvasObject = canvasObjects[i];
        var type = canvasObject.type;

        if (type == "line") {
            var x1 = canvasObject.x1,
                y1 = canvasObject.y1,
                x2 = canvasObject.x2,
                y2 = canvasObject.y2;
            commands.push("moveto " + x1 + " " + y1);
            commands.push("lineto " + x2 + " " + y2);
        }
        else if (type == "ellipse") {
            var left = + canvasObject.left,
                top = + canvasObject.top,
                width = + canvasObject.width * canvasObject.scaleX,
                height = + canvasObject.height * canvasObject.scaleY;
            var middleX = Math.floor((left + width) / 2),
                middleY = Math.floor((top + height) / 2);
            commands.push("moveto " + middleX + " " + middleY);
            commands.push("ellipse " + width + " " + height);
        }
        else {
            console.log("Shape unsupported!");
        }
    }

    console.log(commands);

    fs.writeFile(COMMANDS_FILE_NAME, commands.join("\n"), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 

    childProcess.exec("python " + INTERPRETER_FILE_NAME + " " + COMMANDS_FILE_NAME, 
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        }
    );

    // var canvas = fabric.createCanvasForNode(800, 600);
    // var out = fs.createWriteStream(__dirname + '/test.png');

    // canvas.loadFromJSON(req.body, function() {

    //     var stream = canvas.createPNGStream();
      
    //     stream.on('data', function(chunk) {
    //         out.write(chunk);
    //     });
    // });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
