//returns the mean of an Array
function mean (set) {
    'use strict';

    if (!(set instanceof Array)) {
        throw ('Please pass an Array to the mean() function.');
    }

    var i, mean;

    mean = 0;
    for (i = 0; i < set.length; i++) {
        mean += set[i];
    }

    return mean / set.length;

}

//returns the covariance of two Arrays of numbers of equal length.
function covariance (setA, setB) {
    'use strict';

    var i, product;

    if (setA.length !== setB.length) {
        throw ('covariance() only accepts Arrays() of equal length.');
    }

    product = [];
    for (i = 0; i < setA.length; i++) {
        product[i] = setA[i] * setB[i];
    }

    return mean(product) - mean(setA)*mean(setB);    

}

//returns the standard deviation of an Array.
function stdev (set) {

    if (!(set instanceof Array)) {
        throw ('Please pass an Array to the stdev() function.');
    }

    return Math.sqrt(covariance(set, set));
}


//returns the correlation coefficient between two Arrays of numbers of equal length.
function correlation (setA, setB) {
    'use strict';

    if (setA.length !== setB.length) {
        throw ('correlation() only accepts Arrays() of equal length.');
    }

    return covariance(setA, setB) / stdev(setA) / stdev(setB);
}
