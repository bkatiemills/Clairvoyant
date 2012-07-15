function Graph(x, y, sigX, sigY) {
    var i;

    if (!(x instanceof Array || typeof x === 'undefined') || !(y instanceof Array || typeof y === 'undefined')) {
        throw('Graph() objects must be created with arrays of x and y coordinates, or no arguments at all.')
    }
    
    if (x.length !== y.length) {
        throw('Graph() objects must be created with arrays of x and y coordinates of equal length');
    }

    if (x instanceof Array){
        this.x = x;
    } else {
        this.x = [];
    }
    if (y instanceof Array){
        this.y = y;
    } else {
        this.y = [];
    }    
    
    if (sigX instanceof Array) {
        this.sigX = sigX;
    } else {
        this.sigX = [];
        for (i = 0; i < this.x.length; i++) {
            this.sigX.push(0);
        }
    }
    if (sigY instanceof Array) {
        this.sigY = sigY;
    } else {
        this.sigY = [];
        for (i = 0; i < this.y.length; i++) {
            this.sigY.push(0);
        }
    }

    this.add = function(x, y, sigX, sigY) {
        var i;
        
        //Validate input:
        if (!(x instanceof Array) && typeof x !== 'number') {
            throw('First argument must be either a number or an array.');
        }
        
        if (x instanceof Array) {
            if (!(y instanceof Array)) {
                throw('First two arguments must either both be numbers or both be arrays of equal length.');
            } else if (y instanceof Array && x.length !== y.length) {
                throw('First two arguments must either both be numbers or both be arrays of equal length.');
            }
        }
        
        if (typeof x === 'number' && typeof y !== 'number') {
            throw('If the first argument of Graph() is a single number, then so must the second argument be.');
        }
    
        if (x instanceof Array) {
            this.x = this.x.concat(x);
            this.y = this.y.concat(y);
            
            if (sigX instanceof Array) {
                this.sigX = this.sigX.concat(sigX);
                if (this.sigX.length < this.x.length) {
                    for (i = 0; i < this.x.length - this.sigX.length; i++) {
                        this.sigX.push(0);
                    }
                }
            }
            if (sigY instanceof Array) {
                this.sigY = this.sigY.concat(sigY);
                if (this.sigY.length < this.y.length) {
                    for (i = 0; i < this.y.length - this.sigY.length; i++) {
                        this.sigY.push(0);
                    }
                }
            }
        }
        
        if (typeof x === 'number') {
            this.x.push(x);
            this.y.push(y);
            if (typeof sigX === 'number') {
                this.sigX.push(sigX);
            } else {
                this.sigX.push(0);
            }
            if (typeof sigY === 'number') {
                this.sigY.push(sigY);
            } else {
                this.sigY.push(0);
            }
        }
    };
    
    this.remove = function(i) {
        this.x.splice(i, 1);
        this.y.splice(i, 1);
        this.sigX.splice(i, 1);
        this.sigY.splice(i, 1);
    };
    
    this.draw = function (canvas, xmin, xmax, ymin, ymax, title, xtitle, ytitle, plotstyle) {

        var canvX, canvY, color, errorBarX, errorBarY, i, lineWidth, plot, binHeight, opacity, xMin, xMax, yMin, yMax;

        if (xmin >= xmax) {
            xMin = 'null';
            xMax = 'null';
            for (i = 0; i < this.x.length; i++) {
                if (this.x[i] > xMax || xMax === 'null') {
                    xMax = this.x[i];
                }
                if (this.x[i] < xMin || xMin === 'null') {
                    xMin = this.x[i];
                }
            }
            xMax = xMax + 0.1*(xMax-xMin);
            xMin = xMin - 0.1*(xMax-xMin);
        } else {
            xMin = xmin;
            xMax = xmax;
        }

        if (ymin >= ymax) {
            yMin = 'null';
            yMax = 'null';
            for (i = 0; i < this.y.length; i++) {
                if (this.y[i] > yMax || yMax === 'null') {
                    yMax = this.y[i];
                }
                if (this.y[i] < yMin || yMin === 'null') {
                    yMin = this.y[i];
                }
            }
            yMax = yMax + 0.1*(yMax-yMin);
            yMin = yMin - 0.1*(yMax-yMin);
        } else {
            yMin = ymin;
            yMax = ymax;
        }
        

        if (typeof plotstyle !== 'undefined') {
            plot = new Plot(canvas, xMin, xMax, yMin, yMax, title, xtitle, ytitle, plotstyle);
            color = plotstyle.color;
            opacity = plotstyle.opacity;
            lineWidth = plotstyle.lineWidth;
        } else {
            plot = new Plot(canvas, xMin, xMax, yMin, yMax, title, xtitle, ytitle);
            color = 'black';
            opacity = 1;
            lineWidth = 2;
        }

        //allow axis suppression for overlaying multiple drawings
        if ((typeof plotstyle !== 'undefined' && !plotstyle.suppress) || typeof plotstyle === 'undefined') {
            plot.draw();
        }

        plot.context.strokeStyle = color;
        plot.context.globalAlpha = opacity;
        plot.context.lineWidth = lineWidth;
        
        for (i = 0; i < this.x.length; i++) {
            if (this.x[i] <= xMax && this.x[i] >= xMin && this.y[i] <= yMax && this.y[i] >= yMin) {
                canvX = plot.marginScaleY * plot.marginSize + (this.x[i] - xMin)  / (xMax - xMin) * (plot.canvas.width - (1 + plot.marginScaleY) * plot.marginSize);
                canvY = plot.canvas.height - (plot.marginSize + (this.y[i] - yMin) / (yMax - yMin) * (plot.canvas.height - 2 * plot.marginSize));            
                errorBarX = this.sigX[i] / (xMax-xMin) * (plot.canvas.width - (1 + plot.marginScaleY) * plot.marginSize);
                errorBarY = this.sigY[i] / (yMax - yMin) * (plot.canvas.height - 2 * plot.marginSize);
                
                plot.context.beginPath();
                //draw point:
                plot.context.arc(canvX, canvY, 2, 0, 2*Math.PI);

                //x error bar left:
                plot.context.moveTo(canvX, canvY);
                if (canvX - errorBarX > plot.marginScaleY * plot.marginSize) {
                    plot.context.lineTo(canvX - errorBarX, canvY);
                } else {
                    plot.context.lineTo(plot.marginScaleY*plot.marginSize, canvY);
                }
                //x error bar right:
                plot.context.moveTo(canvX, canvY);
                if (canvX + errorBarX < plot.canvas.width - plot.marginSize) {
                    plot.context.lineTo(canvX + errorBarX, canvY);
                } else {
                    plot.context.lineTo(plot.canvas.width - plot.marginSize, canvY);
                }
                //y error bar up
                plot.context.moveTo(canvX, canvY);
                if (canvY - errorBarY > plot.marginSize) {
                    plot.context.lineTo(canvX, canvY - errorBarY);
                } else {
                    plot.context.lineTo(canvX, plot.marginSize);
                }
                //y error bar down
                plot.context.moveTo(canvX, canvY);
                if (canvY + errorBarY < plot.canvas.height - plot.marginSize ) {
                    plot.context.lineTo(canvX, canvY + errorBarY);
                } else {
                    plot.context.lineTo(canvX, plot.canvas.height - plot.marginSize);
                }
                
                plot.context.stroke();
            }
        }
        
    };

}