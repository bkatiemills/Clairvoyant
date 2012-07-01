//-----Clairvoyant.js Matrix Class------------------------------------------------------ 

function Matrix(name, rows, columns, preDef) {
    'use strict';

    var col, dim, row;

    this.name = name;
    this.rows = rows;
    this.cols = columns;
    this.elements = [];

    // start with all entries = 0
    for (row = 0; row < this.rows; row++) {
        this.elements[row] = [];
        for (col = 0; col < this.cols; col++) {
            this.elements[row][col] = 0;
        }
    }


    if (arguments.length === 4) {

        if (preDef  ===  'identity') {
            if (this.rows !== this.cols) {
                alert('Identity matrix must be square.    Aborting...');
                return -999;
            }
            for (dim = 0; dim < this.rows; dim++) {
                this.elements[dim][dim] = 1;
            }

        }

        if (preDef  ===  'Minkowski') {
            if (this.rows !==  4 || this.cols !==  4) {
                alert('Minkowski space has a 4 by 4 metric, please adjust rows & columns accordingly.    Aborting...');
                return -999;
            }
            for (dim = 1; dim < this.rows; dim++) {
                this.elements[dim][dim] = 1;
            }
            this.elements[0][0] = -1;
        }

    }


    // writes out the contents of this matrix.
    this.dump = function () {
        var col, row;

        document.write('</br>');
        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < this.cols; col++) {
                document.write(this.elements[row][col] + ' ');
            }
            document.write('</br>');
        }

        return 0;
    };


    // return sum of  < matrix >  with this matrix.
    this.mtxAdd = function (matrix) {
        var col, name, name1, name2, result, row;

        if (!(matrix instanceof Matrix)) {
            alert('Argument is not a matrix.    Aborting...');
            return -999;
        }

        if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
            alert('Matrices must be the same dimension to add them.    Aborting...');
            return -999;
        }

        name1 = this.name;
        name2 = matrix.name;
        name = name1  +  'plus'  +  name2;
        result = new Matrix(name, this.rows, this.cols);

        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < this.cols; col++) {
                result.elements[row][col] = this.elements[row][col]  +  matrix.elements[row][col];
            }
        }

        return result;
    };


    // places  < object >  on side  < side >  of this matrix, and multiplies
    this.mtxMulti = function (object, side) {
        var col, elt, name, name1, name2, result, row, sum;

        if (side !==  'left' && side !==  'right') {
            alert('Second argument must be either left or right, indicating which side of the matrix you want to place the first argument on before multiplying.    Aborting...');
            return -999;
        }

        if ((object instanceof Vector) && (side === 'left')) {
            if (object.dim !==  this.rows) {
                alert('Vector * Matrix requires length of Vector = number of rows in Matrix.    Aborting...');
                return -999;
            }
            result = new Vector('result');
            sum = 0;
            for (col = 0; col < this.cols; col++) {
                for (row = 0; row < this.rows; row++) {
                    sum  += object.elts[row] * this.elements[row][col];
                }
                result.setVal(sum, col);
                sum = 0;
            }
            return result;
        }

        if ((object instanceof Vector) && (side === 'right')) {
            if (this.cols !==  object.dim) {
                alert('Matrix * Vector requires length of Vector = number of columns in Matrix.    Aborting...');
                return -999;
            }
            result = new Vector('result');
            sum = 0;
            for (row = 0; row < this.rows; row++) {
                for (col = 0; col < this.cols; col++) {
                    sum  += object.elts[col] * this.elements[row][col];
                }
                result.setVal(sum, row);
                sum = 0;
            }
            return result;
        }

        if ((object instanceof Matrix) && (side === 'left')) {

            if (object.cols !==  this.rows) {
                alert('Matrix1 * Matrix2 requires Matrix1 to have # cols = # rows in Matrix2.    Aborting...');
                return -999;
            }

            name1 = object.name;
            name2 = this.name;
            name = name1  +  'times'  +  name2;
            result = new Matrix(name, object.rows, this.cols);

            sum = 0;
            for (row = 0; row < object.rows; row++) {
                for (col = 0; col < this.cols; col++) {
                    for (elt = 0; elt < this.rows; elt++) {
                        sum  += object.elements[row][elt] * this.elements[elt][col];
                    }
                    result.elements[row][col] = sum;
                    sum = 0;
                }
            }
            return result;
        }

        if ((object instanceof Matrix) && (side === 'right')) {

            if (object.rows !==  this.cols) {
                alert('Matrix1 * Matrix2 requires Matrix1 to have # cols = # rows in Matrix2.    Aborting...');
                return -999;
            }

            name1 = this.name;
            name2 = object.name;
            name = name1  +  'times'  +  name2;
            result = new Matrix(name, object.rows, this.cols);

            sum = 0;
            for (row = 0; row < object.rows; row++) {
                for (col = 0; col < this.cols; col++) {
                    for (elt = 0; elt < this.rows; elt++) {
                        sum  += this.elements[row][elt] * object.elements[elt][col];
                    }
                    result.elements[row][col] = sum;
                    sum = 0;
                }
            }
            return result;
        }
    };


    // Doolittle algo to extract determinant for this matrix.
    this.getDeterminant = function () {
        var A, detA, detL, iter, L, l, row;

        if (this.rows !==  this.cols) {
            alert('Matrix must be square.    Aborting...');
            return -999;
        }

        // zeroth iteration:
        A = this;
        L = new Matrix('L', this.rows, this.cols, 'identity');
        l = new Matrix('l', this.rows, this.cols);

        for (iter = 1; iter < this.rows; iter++) {

            // construct this iteration's lower triangular matrix:
            l = new Matrix('l', this.rows, this.cols, 'identity');
            for (row = iter; row < this.rows; row++) {
                l.elements[row][iter - 1] = -1 * A.elements[row][iter - 1] / A.elements[iter - 1][iter - 1];
                L.elements[row][iter - 1] = -1 * l.elements[row][iter - 1];
            }

            // update A:
            A = A.mtxMulti(l, 'left');
        }

        detA = 1;
        detL = 1;
        for (iter = 0; iter < this.rows; iter++) {
            detA = detA * A.elements[iter][iter];
            detL = detL * L.elements[iter][iter];
        }

        return detA * detL;
    };


    // function to calculate the minor matrix of this matrix
    this.getMinor = function () {
        var cMap, col, mtxMinor, rMap, row, subCol, subMtx, subRow;

        subMtx = new Matrix('subMtx', this.rows - 1, this.cols - 1);
        mtxMinor = new Matrix('mtxMinor', this.rows, this.cols);

        rMap = 0;
        cMap = 0;

        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < this.cols; col++) {

                rMap = 0;
                for (subRow = 0; subRow < subMtx.rows; subRow++) {
                    if (rMap === row) {
                        rMap++;
                    }
                    cMap = 0;
                    for (subCol = 0; subCol < subMtx.cols; subCol++) {
                        if (cMap === col) {
                            cMap++;
                        }
                        subMtx.elements[subRow][subCol] = this.elements[rMap][cMap];
                        cMap++;
                    }
                    rMap++;
                }
                mtxMinor.elements[row][col] = subMtx.getDeterminant();
            }
        }
        return mtxMinor;
    };


    // function to calculate cofactor matrix of this matrix
    this.getCofactor = function () {
        var cofac, col, minor, row;

        minor = this.getMinor();
        cofac = new Matrix('cofac', this.rows, this.cols);

        for (row = 0; row < cofac.rows; row++) {
            for (col = 0; col < cofac.cols; col++) {
                cofac.elements[row][col] = Math.pow(-1, row + col) * minor.elements[row][col];
            }
        }

        return cofac;
    };


    // function to calculate the transpose of this matrix
    this.getTranspose = function () {
        var col, row, trans;

        trans = new Matrix('trans', this.cols, this.rows);

        for (row = 0; row < trans.rows; row++) {
            for (col = 0; col < trans.cols; col++) {
                trans.elements[row][col] = this.elements[col][row];
            }
        }

        return trans;
    };


    // function to return adjugate of matrix
    this.getAdjugate = function () {
        var cof;

        cof = this.getCofactor();
        return cof.getTranspose();
    };


    // function to scale matrix by  < scale > 
    this.mtxScale = function (scale) {
        var col, row, scaled;

        scaled = new Matrix('scaled', this.rows, this.cols);

        for (row = 0; row < scaled.rows; row++) {
            for (col = 0; col < scaled.cols; col++) {
                scaled.elements[row][col] = scale * this.elements[row][col];
            }
        }

        return scaled;
    };


    // function to get the inverse of this matrix
    this.getInverse = function () {
        var adjug, deter;

        deter = this.getDeterminant();
        adjug = this.getAdjugate();

        return adjug.mtxScale(1 / deter);

    };


}
