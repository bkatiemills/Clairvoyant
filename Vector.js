//-----Clairvoyant.js Vector Class------------------------------------------------------ 

function Vector(elements) {
    'use strict';

    if (!(elements instanceof Array)) {
        throw ('ERROR: Must pass either an array of values OR a single number and position.');
    }

    if (elements) {
        this.elements = elements;
        this.dimension = elements.length;
    } else {
        this.elements = [];
        this.elements[0] = 0;
        this.dimension = 1;
    }

    // Pass an Array or a single number as <value> to the Vector; single numbers get 
    // assigned at <position> in the vector.

    this.setVal = function (value, position) {

        if (!(value instanceof Array) && (position !== 'undefined')) {
            throw ('ERROR: Must pass either an array of values OR a single number and position.');
        }

        if (typeof position !== 'undefined') {
            this.elements[position] = value;
            if (this.dimension < (position + 1)) {
                this.dimension = position + 1;
                return;
            }
        } else {
            this.elements = value;
            this.dimension = value.length;
            return;
        }
    };


    // Take the dot product of this Vector with Vector <vector>.  Optional Matrix <metric>
    // Will be used as a metric (default rectangular Cartesian)

    this.dot = function (vector, metric) {

        var dimension, sum, left;

        if (!(vector instanceof Vector)) {
            throw ('ERROR: Not a vector. Must take dot product with another Vector.');
        }
        if (this.dimension !==  vector.dimension) {
            throw ('ERROR: Vectors must be the same length to take dot product.');
        }

        sum = 0;

        if (metric) {

            // if (!(metric instanceof Matrix)) {
            //     throw('ERROR: Not a matrix. Second argument, when provided, must always be a matrix.')
            //     return;
            // }

            if ((this.dimension !==  metric.rows) || (vector.dimension !==  metric.cols)) {
                throw ('ERROR: Incorrect metric dimension.');
            }

            left = metric.mtxMulti(this, 'left');
            for (dimension = 0; dimension < left.dimension; dimension++) {
                sum  += left.elements[dimension] * vector.elements[dimension];
            }
        } else {
            for (dimension = 0; dimension < this.dimension; dimension++) {
                sum  += this.elements[dimension] * vector.elements[dimension];
            }
        }
        return sum;
    };


    //Returns the length of this Vector.  Matrix <metric> optional, default rectangular Cartesian.
    this.getLength = function (metric) {
        var length;

        length = 0;

        if (metric) {
            length = Math.pow((metric.mtxMulti(this, 'left')).dot(this), 0.5);
        } else {
            length = Math.pow(this.dot(this), 0.5);
        }
        return length;
    };

    // Return this Vector scaled by <scale>
    this.scale = function (sc) {
        var i, scale, scaledVec;

        if (typeof sc !== 'undefined') {
            scale = sc;
        } else {
            scale = 1;
        }

        scaledVec = new Vector();
        for (i = 0; i < this.dimension; i++) {
            scaledVec.setVal(this.elements[i] * scale, i);
        }

        return scaledVec;
    };

    // Log this Vector to the console:
    this.dump = function () {
        var i;

        console.log('(');
        for (i = 0; i < this.dim; i++) {
            if (i !== this.dim - 1) {
                console.log(this.elements[i] + ', ');
            } else {
                console.log(this.elements[i] + ')');
            }
        }
    };

    //return the Vector projection of this Vector along Vector <vec>:
    this.project = function (vec) {
        var component, lengthSquared, norm;

        component = this.dot(vec);
        lengthSquared = vec.dot(vec);
        norm = component / lengthSquared;

        return vec.scale(norm);

    };

}
