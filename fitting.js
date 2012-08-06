function fit (theory, data, guess) {
    'use strict'
    
    var min, results, seek;
    
    results = new FitInfo();
    
    min = curry(parameterization, theory, data);
    seek = new Func(min);
    
    results.parameters = seek.minimize(guess);
    theory.setParameters(results.parameters);
    
    findParameterCovariance(theory, data, results);
    
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

function findParameterCovariance (theory, data, results) {

    var aij, argument, d, dataCopy, i, j, nPars, parDer1, parDer2, parDerFunc1, parDerFunc2, result, uncertainty;
    
    //number of parameters
    nPars = theory.params.length;
    
    //initialize covariance matrix:
    results.covarianceMatrix = new Matrix(nPars, nPars);
    
    //copy of the data matrix
    dataCopy = [];
    for (i = 0; i < data.length; i++) {
        dataCopy[i] = [];
        for (j = 0; j < data[i].length; j++) {
            dataCopy[i][j] = data[i][j];
        }
    }


    for (d = 0; d < dataCopy.length; d++) {
        argument = dataCopy[d];
        uncertainty = argument.pop();
        result = argument.pop();
                
        parDer1 = curry(parameterFunction, theory, argument);
        parDer2 = curry(parameterFunction, theory, argument);
                
        parDerFunc1 = new Func(parDer1);
        parDerFunc2 = new Func(parDer2);
                
        for (i = 0; i < nPars; i++) {
            for (j = i; j < nPars; j++) {                
                results.covarianceMatrix.elements[i][j] += parDerFunc1.derivative(theory.params, i) * parDerFunc2.derivative(theory.params, j) / uncertainty / uncertainty;
                results.covarianceMatrix.elements[j][i] = results.covarianceMatrix.elements[i][j];
            }
        }
    }

    results.covarianceMatrix = results.covarianceMatrix.getInverse();

}

//turns a Func of x with fixed parameters into a function of those
//parameters with fixed x.
function parameterFunction(func, x, pars) {
    func.setParameters(pars);
    
    return func.evaluate(x);
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
    this.chi2;
    this.reducedChi2;
    this.covarianceMatrix;
    
}
