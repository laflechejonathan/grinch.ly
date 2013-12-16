
JDrawer = {

    Ellipse : function(context, x, y, w, h) {
        
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

    Line : function(canvas, x0, y0, x1, y1) {
        
        canvas.add(
            new fabric.Line([x0, y0, x1, y1], {
                stroke: 'black'
            }));

        // context.beginPath();
        // context.moveTo(x0, y0);
        // context.lineTo(x1, y1);
        // context.stroke();
        // context.closePath();
    }
};