//-----Clairvoyant.js user defined function class -------------------------------------- 

function Func(func, parameters) {
    'use strict';

    this.func = func;
    this.params = [];

    if (typeof parameters !== 'undefined') {
        if (parameters instanceof Array) {
            this.params = parameters;
        } else {
            this.params[0] = parameters;
        }
    } else {
        this.params[0] = 0;    // dummy for no - parameter functions;
    }

    //-----methods for user defined function class-------------------------- 

    this.evaluate = function (inputs) {
        return this.func(inputs, this.params);
    };


    // load the current parameters of the Func into an Array
    this.getParameters = function (pbr) {
        var getP;

        for (getP = 0; getP < this.params.length; getP++) {
            pbr[getP] = this.params[getP];
        }

        return 0;
    };


    // set the parameters of a Func to some new values
    this.setParameters = function (newParam) {
        var newP;

        for (newP = 0; newP < newParam.length; newP++) {
            this.params[newP] = newParam[newP];
        }

        return 0;
    };


    // function to find this function's extremum on  < min > .. < max >  by finding the derivative
    // zeroes.    Tolerance defaults to 1 / 10^6 unless user specifies  < tol > .    Returns an array, 
    // first element = coordinate of extrema, second element is 0 for minima and 1 for maxima. 
    this.getExtremum = function (min, max, tol) {
        var concavity, copyFunc, ddx, extrema, ddxFunc, results, tolerance;

        tolerance = typeof tol !== 'undefined' ? tol : 0.000001;

        results = [];
        
        //ddxFunc can see copyFunc, allowing us to pass the 'this' down a level
        copyFunc = this;
        ddxFunc = function (x, par) {
            return copyFunc.derivative(x, 0, 0.000001,0);
        }
        ddx = new Func(ddxFunc);

        extrema = ddx.brentSoln(min, max, tolerance);
        concavity = ddx.derivative(extrema);

        results[0] = Math.round(extrema / tolerance) * tolerance;
        if (concavity > 0) {
            results[1] = 0;
        }
        if (concavity < 0) {
            results[1] = 1;
        }

        return results;

    };
    

    // return a random pull from a 1D function, between  < min >  and  < max > .    
    // Function must be non - negative and pole - free across the requested 
    // range for this to make sense. 
    this.randPull = function (min, max) {
        var decision, done, extreme, thresh, x;

        done = 0;

        // find the highest point of the function in range: grid search to find global maximum, 
        // then getExtremum to zero in on it.
        extreme = [];
        extreme = this.getExtremum(min, max);

        x = 0;
        thresh = 0;
        decision = 0;

        while (done === 0) {
            // choose a point in range
            x = min  +  (max - min) * Math.random();

            // find normalized height of the function at x
            thresh = this.evaluate(x) / extreme[0];

            // decide if we should keep the pull
            decision = Math.random();
            if (decision  <  thresh) {
                return x;
            }
        }
    };


    // implementation of Brent's Algo for finding the zero of a 1D function
    // between  < hi >  and  < lo > .    Letters label the steps in the wikipedia
    // factoring of the algorithm; step (a) is the function call itself. 
    this.brentSoln = function (lo, hi, tol) {
        var a, answer, b, buffer, c, d, f_a, f_b, f_c, f_s, initHi, initLo, loops, mflag, s, tolerance;

        tolerance = typeof tol !== 'undefined' ? tol : 0.000001;

        // (b)
        initHi = this.evaluate(hi);
        // (c)
        initLo = this.evaluate(lo);
        // (d)
        try {
            if ((initHi * initLo >= 0)) {
                throw ('Range provided does not bracket a unique zero, attempting to recover...');
            }
        } catch (err) {
            return this.biSoln(lo, hi);
        }
        // (e)
        a = lo;
        b = hi;
        if (Math.abs(initLo)  <  Math.abs(initHi)) {
            a = hi;
            b = lo;
        }
        // (f)
        c = a;
        // (g)
        mflag = 1;

        // (h)
        f_a = this.evaluate(a);
        f_b = this.evaluate(b);
        f_c = this.evaluate(c);
        s = b - f_b * (b - a) / (f_b - f_a);
        f_s = this.evaluate(s);
        d = 0;
        buffer = 0;
        loops = 0;
        while (f_b !== 0 && f_s !== 0 && Math.abs(b - a) > tolerance) {
            loops++;
            f_a = this.evaluate(a);
            f_b = this.evaluate(b);
            f_c = this.evaluate(c);

            // (h_i)
            if (f_a !== f_c && f_b !== f_c) {
                // (h_i_1)
                s = a * f_b * f_c / (f_a - f_b) / (f_a - f_c)  +  b * f_a * f_c / (f_b - f_a) / (f_b - f_c)  +  c * f_a * f_b / (f_c - f_a) / (f_c - f_b);
            } else { //(h_ii)
                // (h_ii_1)
                s = b - f_b * (b - a) / (f_b - f_a);
            }
            // (h_iii)
            // (h_iv)
            if (((s > b && s > (3 * a + b) / 4) || (s < b && s < (3 * a + b) / 4)) || (mflag === 1 && Math.abs(s - b)  >=  Math.abs(b - c) / 2) || (mflag === 0 && Math.abs(s - b)  >=  Math.abs(c - d) / 2) || (mflag === 1 && Math.abs(b - c) < tolerance) || (mflag === 0 && Math.abs(c - d) < tolerance)) {
                // (h_iv_1)
                s = (a + b) / 2;
                // (h_iv_2)
                mflag = 1;
            } else { //(h_v)
                // (h_v_1)
                mflag = 0;
            }
            // (h_vi)
            // (h_vii)
            f_s = this.evaluate(s);
            // (h_viii)        
            d = c;
            // (h_ix)
            c = b;
            // (h_x)
            if (f_a * f_s < 0) {
                b = s;
            } else {
                a = s;
            }
            // (h_xi)
            if (Math.abs(this.evaluate(a))  <  Math.abs(this.evaluate(b))) {
                buffer = a;
                a = b;
                b = buffer;
            }
        }

        // (i)
        if (this.evaluate(b) === 0) {
            answer = Math.round(b / tolerance) * tolerance;
        } else {
            answer = Math.round(s / tolerance) * tolerance;
        }

        return answer;
    };

    // Simple grid search  +  bisection method for finding a function zero in the range  < min > .. < max >  to tolerance  < tol > .
    // This is SLOW, and should only be called to help brentSoln recover when the user fails to bracket a unique    zero.
    this.biSoln = function (min, max, tol) {
        var a, b, c, f_a, f_b, f_c, gridMin, gridS, gridSteps, here, high, low, lowestPoint, stepSize, tolerance;

        // grid search to find some zero, very slow
        gridSteps = 1000;
        stepSize = (max - min) / gridSteps;
        here = min;
        gridMin = Math.abs(this.evaluate(min));
        lowestPoint = here;
        for (gridS = 0; gridS < gridSteps; gridS++) {
            if (Math.abs(this.evaluate(here))  <  gridMin) {
                lowestPoint = here;
                gridMin = Math.abs(this.evaluate(here));
            }
            here  += stepSize;
        }

        low = lowestPoint - stepSize;
        high = lowestPoint  +  stepSize;

        tolerance = typeof tol !== 'undefined' ? tol : 0.000001;

        a = low;
        b = high;
        f_a = Math.abs(this.evaluate(a));
        f_b = Math.abs(this.evaluate(b));
        c = (a + b) / 2;
        f_c = Math.abs(this.evaluate(c));

        while (Math.abs(a - b)  >  tolerance) {
            if (f_a  >  f_b && f_a  >  f_c) {
                a = c;
                f_a = Math.abs(this.evaluate(a));
            } else if (f_b  >  f_a && f_b  >  f_c) {
                b = c;
                f_b = Math.abs(this.evaluate(b));
            }
            c = (a + b) / 2;
            f_c = Math.abs(this.evaluate(c));
        }

        return Math.round(c / tolerance) * tolerance;
    };


    // Richardson's extrapolation for derivative computation in 1D, evaluated at  < x >  in
    // dimension  < dim >  (default 0) to tolerance  < tol >  (default 1 / 10^6).     < roundoff >  flag
    // chooses whether or not to round the result to tolerance (default yes = 1); needs to
    // be 0 for maxima finding so tolerances don't compound.
    this.derivative = function (x, dim, tol, roundoff) {
        var D, dimension, doRound, dtol, dtol2, tolerance, vary, Xhi, Xhi2, Xlo, Xlo2;

        dimension = typeof dim !== 'undefined' ? dim : 0;
        tolerance = typeof tol !== 'undefined' ? tol : 0.000001;
        doRound = typeof roundoff !== 'undefined' ? roundoff : 1;

        if (!(x instanceof Array)) {
            dtol = (this.evaluate(x + tolerance) - this.evaluate(x - tolerance)) / (2 * tolerance);
            dtol2 = (this.evaluate(x + tolerance / 2) - this.evaluate(x - tolerance / 2)) / tolerance;
        } else {
            Xhi = [];
            Xlo = [];
            Xhi2 = [];
            Xlo2 = [];

            for (vary = 0; vary < x.length; vary++) {
                Xhi[vary] = x[vary];
                Xlo[vary] = x[vary];
                Xhi2[vary] = x[vary];
                Xlo2[vary] = x[vary];
            }
            Xhi[dimension]  += tolerance;
            Xlo[dimension]  -=  tolerance;
            Xhi2[dimension]  += tolerance / 2;
            Xlo2[dimension]  -=  tolerance / 2;

            dtol = (this.evaluate(Xhi) - this.evaluate(Xlo)) / (2 * tolerance);
            dtol2 = (this.evaluate(Xhi2) - this.evaluate(Xlo2)) / tolerance;
        }

        D = (4 * dtol2 - dtol) / 3;

        if (doRound  ===  0) {
            return D;
        }
        if (doRound  ===  1) {
            return Math.round(D / tolerance) * tolerance;
        }
    };

    //gradient of the function evaluated at <x>
    this.gradient = function (x) {
        var dim, dimension, grad;

        dimension = x.length;
        grad = [];

        for (dim = 0; dim < dimension; dim++) {
            grad[dim] = this.derivative(x, dim); // *  direction[dim]
        }

        return grad;
    };

    //draw this function in the window from <xmin> to <xmax> and <ymin> to <ymax>
    this.draw = function (canvas, xmin, xmax, ymin, ymax, title, xtitle, ytitle, plotstyle) {
        var canvX, canvY, color, i, inWindow, lineWidth, nSamples, plot, xStep, x, y, yMin, yMax;

        //auto-find a y window if ymin === ymax:
        yMin = ymin;
        yMax = ymax;
        x = xmin;
        xStep = (xmax - xmin) / 100;
        if (ymin === ymax) {
            for (i = 0; i < 100; i++) {
                y = this.evaluate(x);
                if (y > yMax) {
                    yMax = y;
                }
                if (y < yMin) {
                    yMin = y;
                }
                x += xStep;
            }
            yMax += (yMax - yMin) * 0.1;
            yMin -= (yMax - yMin) * 0.1;
        }

        //make a new Plot, fetch style info
        if (typeof plotstyle !== 'undefined') {
            plot = new Plot(canvas, xmin, xmax, yMin, yMax, title, xtitle, ytitle, plotstyle);
            color = plotstyle.color;
            lineWidth = plotstyle.lineWidth;
        } else {
            plot = new Plot(canvas, xmin, xmax, yMin, yMax, title, xtitle, ytitle);
            color = 'black';
            lineWidth = 2;
        }

        //allow axis suppression for overlaying multiple drawings.
        if ((typeof plotstyle !== 'undefined' && !plotstyle.suppress) || typeof plotstyle === 'undefined') {
            plot.draw();
        }


        //draw function as nSamples line segements joining f(x) at each step of x in range.  
        //nSamples = #pixels in width of canvas ensures smooth-looking line (ie each line segment is at most 1px long).
        nSamples = plot.canvas.width;
        xStep = (xmax - xmin) / nSamples;
        x = xmin;
        inWindow = 0;
        plot.context.beginPath();
        plot.context.strokeStyle = color;
        plot.context.lineWidth = lineWidth;
        for (i = 0; i < nSamples + 1; i++) {
            y = this.evaluate(x);
            canvX = plot.marginScaleY * plot.marginSize + (x - xmin)  / (xmax - xmin) * (plot.canvas.width - (1 + plot.marginScaleY) * plot.marginSize);
            canvY = plot.canvas.height - (plot.marginSize + (y - yMin) / (yMax - yMin) * (plot.canvas.height - 2 * plot.marginSize));
            if (y > yMin && y < yMax) {
                if (inWindow === 0) {
                    plot.context.moveTo(canvX, canvY);
                    plot.context.beginPath();
                    inWindow = 1;
                } else {
                    plot.context.lineTo(canvX, canvY);
                }
            } else {
                inWindow = 0;
            }
            plot.context.stroke();
            x += xStep;
        }

        return 0;

    };


    this.minimize = function (dim, minBounds, maxBounds) {
        var coords, copyFunc, dimension, funcs, functions, i, j, lower, protoFunc;
        
        dimension = dim;
        functions = [];
        funcs = [];
        coords = [];
        for (i = 0; i < dimension; i++) {
            coords.push(0);
        }

        funcs[0] = this;
        functions[0] = this.func;
        
        for (i = 1; i < dimension; i++) { 
            functions[i] = function (i, x) {
                var split = function (i, x, y) {
                    var arg = [];
                    if (x instanceof Array) {
                        for (j = 0; j < x.length; j++) {
                            arg[j] = x[j];
                        }
                        arg.push(y)
                    } else {
                        arg[0] = x;
                        arg[1] = y;
                    }
                    
                    return curry(functions[i-1], arg)();
                }
                split = curry(split, i, x);
            
                funcs[i] = new Func(split);
            
                coords[i-1] = funcs[i].getExtremum(minBounds[dimension-i], maxBounds[dimension-i])[0];
                //alert(coords[i-1])
                return funcs[i].evaluate(coords[i-1])
            }
            functions[i] = curry(functions[i], i);
        }

        var last = new Func(functions[functions.length-1]);
        coords[dimension-1] = last.getExtremum(minBounds[0],maxBounds[0])[0]
        
        coords.reverse();
        
        return coords;


    };






/*
    //derping around with curry:
    this.minimize = function (dim) {
        var copyFunc, dimension, Funcs, functions, i, j, lower, protoFunc;
        
        dimension = dim;
        functions = [];
        Funcs = [];
        
        //this will get curried at each step, reducing dimensionality one at a time.
        protoFunc = function (i, x) {
            var x_reduced = [];
            for (j = 0; j < i; j++) {
                x_reduced[j] = x[j];
            }
            x_reduced[i] = 1;
                
            return Funcs[i-1].evaluate(x_reduced)
        }

        Funcs[0] = this;

        for (i = 1; i < dimension; i++) {
            
            functions[i] = curry(protoFunc, i)
            
            Funcs[i] = new Func(functions[i]);
        }

        return Funcs[1].evaluate([2])
    };
*/
}


//shamelessly ripped from StackOverflow:
function curry (fn) {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
    return function () {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}