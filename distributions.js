//-----Clairvoyant.js Statistical Distributions----------------------------------------- 

function kolmogorov(z) {
    'use strict';

    var j, Kprob;

    Kprob = 2 * Math.exp(-2 * z * z);    // start with first term (ie j = 1)

    j = 2;
    while (2 * Math.pow(-1, j - 1) * Math.exp(-2 * j * j * z * z) + Kprob !==  Kprob && j < 1000000) {
        Kprob  += 2 * Math.pow(-1, j - 1) * Math.exp(-2 * j * j * z * z);
        j++;
    }


    return Kprob;

}

function gaussian(mu, sigma, x) {
    'use strict';

    return 1 / sigma / Math.sqrt(2 * 3.14159265358979) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}
