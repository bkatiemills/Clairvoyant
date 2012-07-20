function fit (theory, data, guess) {
    'use strict'
    
    var min = curry(parameterization, theory, data);
    var seek = new Func(min);
    return seek.minimize(guess);
}


function parameterization(theory, data, parameters) {
    'use strict';

    theory.setParameters(parameters);
    return chi2(data, theory)
}


function chi2(data, theory) {
    'use strict'
    
    var argument, c2, dataCopy, i, j, result, theoryResult;
    
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
        result = argument.pop();
        theoryResult = theory.evaluate(argument);
        
        c2 += Math.pow(result - theoryResult, 2);
    }
    
    return c2;
    
}


function curry (fn) {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
    return function () {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}
