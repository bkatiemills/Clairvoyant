function fit (theory, data, guess) {
    'use strict'
    
    var min, results, seek;
    
    results = new FitInfo();
    
    min = curry(parameterization, theory, data);
    seek = new Func(min);
    
    results.parameters = seek.minimize(guess);
    theory.setParameters(results.parameters);
    
    findParameterUncertainty(theory, data, results);
    results.chi2 = chi2(data, theory);
    results.reducedChi2 = results.chi2 / (data.length - theory.params.length);
    
    return results;
}


function parameterization(theory, data, parameters) {
    'use strict';

    theory.setParameters(parameters);
    return chi2(data, theory);
}


function chi2(data, theory) {
    'use strict'
    
    var argument, c2, dataCopy, i, j, result, theoryResult, uncertainty;
    
    dataCopy = [];
    for (i = 0; i < data.length; i++) {
        dataCopy[i] = [];
        for (j = 0; j < data[i].length; j++) {
            dataCopy[i][j] = data[i][j];
        }
    }
    
    c2 = 0;
    for (i = 0; i < dataCopy.length; i++) {
        argument = dataCopy[i];
        uncertainty = argument.pop();
        result = argument.pop();
        theoryResult = theory.evaluate(argument);
        
        c2 += Math.pow( (result - theoryResult) / uncertainty, 2);
    }
    
    return c2;
    
}

function findParameterUncertainty (theory, data, results) {
    var chiHere, chiMin, i, parNominal, step, tolerance;
    
    tolerance = 0.000001;
    
    chiMin = chi2(data, theory);
    chiHere = chiMin - 1;
    
    for (i = 0; i < theory.params.length; i++) {
        results.parameterUncertainty[i] = [];

        //Lower 1 sigma:
        chiHere = chiMin - 1;
        step = Math.abs(theory.params[i]) / 100;
        parNominal = theory.params[i];
        while (Math.abs(chiMin + 1 - chiHere) > tolerance) {
            if (chiHere < chiMin + 1) {
                theory.params[i] -= step;
            } else if (chiHere > chiMin + 1) {
                theory.params[i] += step;
                step = step / 10;
            }
            chiHere = chi2(data, theory);
        }
        results.parameterUncertainty[i].push(theory.params[i]);
        theory.params[i] = parNominal;
        
        //Upper 1 sigma:
        chiHere = chiMin - 1;
        step = Math.abs(theory.params[i]) / 100;
        parNominal = theory.params[i];
        while (Math.abs(chiMin + 1 - chiHere) > tolerance) {
            if (chiHere < chiMin + 1) {
                theory.params[i] += step;
            } else if (chiHere > chiMin + 1) {
                theory.params[i] -= step;
                step = step / 10;
            }
            chiHere = chi2(data, theory);
        }
        results.parameterUncertainty[i].push(theory.params[i]);
        theory.params[i] = parNominal;

    }

}


function curry (fn) {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
    return function () {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}


function FitInfo() {
    'use strict';
    
    this.parameters = [];
    this.parameterUncertainty = [];
    this.chi2;
    this.reducedChi2;
    
}
