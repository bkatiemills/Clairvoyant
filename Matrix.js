//-----Clairvoyant.js Matrix Class------------------------------------------------------ 

function Matrix(rows, columns, preDef) {
    'use strict';

    var col, dim, row;

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


    if (arguments.length === 3) {

        if (preDef  ===  'identity') {
            try {
                if (this.rows !== this.cols) {
                    throw ('Identity matrix must be square.    Aborting...');
                }
            } catch (err0) {
                return;
            }
            for (dim = 0; dim < this.rows; dim++) {
                this.elements[dim][dim] = 1;
            }

        }

        if (preDef  ===  'Minkowski') {
            try {
                if (this.rows !==  4 || this.cols !==  4) {
                    throw ('Minkowski space has a 4 by 4 metric, please adjust rows & columns accordingly.    Aborting...');
                }
            } catch (err1) {
                return;
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
        var col, result, row;

        try {
            if (!(matrix instanceof Matrix)) {
                throw ('Argument is not a matrix.    Aborting...');
            }
        } catch (err3) {
            return;
        }

        try {
            if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
                throw ('Matrices must be the same dimension to add them.    Aborting...');
            }
        } catch (err4) {
            return;
        }

        result = new Matrix(this.rows, this.cols);

        for (row = 0; row < this.rows; row++) {
            for (col = 0; col < this.cols; col++) {
                result.elements[row][col] = this.elements[row][col]  +  matrix.elements[row][col];
            }
        }

        return result;
    };


    // places  < object >  on side  < side >  of this matrix, and multiplies
    this.mtxMulti = function (object, side) {
        var col, elt, result, row, sum;

        try {
            if (side !==  'left' && side !==  'right') {
                throw ('Second argument must be either left or right, indicating which side of the matrix you want to place the first argument on before multiplying.    Aborting...');
            }
        } catch (err5) {
            return;
        }

        if ((object instanceof Vector) && (side === 'left')) {
            try {
                if (object.dimension !==  this.rows) {
                    throw ('Vector * Matrix requires length of Vector = number of rows in Matrix.    Aborting...');
                }
            } catch (err6) {
                return;
            }
            result = new Vector();
            sum = 0;
            for (col = 0; col < this.cols; col++) {
                for (row = 0; row < this.rows; row++) {
                    sum  += object.elements[row] * this.elements[row][col];
                }
                result.setVal(sum, col);
                sum = 0;
            }
            return result;
        }

        if ((object instanceof Vector) && (side === 'right')) {
            try {
                if (this.cols !==  object.dimension) {
                    throw ('Matrix * Vector requires length of Vector = number of columns in Matrix.    Aborting...');
                }
            } catch (err7) {
                return;
            }
            result = new Vector();
            sum = 0;
            for (row = 0; row < this.rows; row++) {
                for (col = 0; col < this.cols; col++) {
                    sum  += object.elements[col] * this.elements[row][col];
                }
                result.setVal(sum, row);
                sum = 0;
            }
            return result;
        }

        if ((object instanceof Matrix) && (side === 'left')) {
            try {
                if (object.cols !==  this.rows) {
                    throw ('Matrix1 * Matrix2 requires Matrix1 to have # cols = # rows in Matrix2.    Aborting...');
                }
            } catch (err8) {
                return;
            }

            result = new Matrix(object.rows, this.cols);

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

            try {
                if (object.rows !==  this.cols) {
                    throw ('Matrix1 * Matrix2 requires Matrix1 to have # cols = # rows in Matrix2.    Aborting...');
                }
            } catch (err9) {
                return;
            }

            result = new Matrix(object.rows, this.cols);

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

        try {
            if (this.rows !==  this.cols) {
                throw ('Matrix must be square.    Aborting...');
            }
        } catch (err9) {
            return;
        }

        // zeroth iteration:
        A = this;
        L = new Matrix(this.rows, this.cols, 'identity');
        l = new Matrix(this.rows, this.cols);

        for (iter = 1; iter < this.rows; iter++) {

            // construct this iteration's lower triangular matrix:
            l = new Matrix(this.rows, this.cols, 'identity');
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

        subMtx = new Matrix(this.rows - 1, this.cols - 1);
        mtxMinor = new Matrix(this.rows, this.cols);

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
        cofac = new Matrix(this.rows, this.cols);

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

        trans = new Matrix(this.cols, this.rows);

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

        scaled = new Matrix(this.rows, this.cols);

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


    // Gram-Schmidt process to construct an orthonormal set of vectors spanning the
    //same space as the columns of this Matrix.  Columns must be linearly 
    //independent (currently unchecked!) 
    this.orthonormalGS = function () {
        var col, emptyVec, i, notOrthogonal, orthonormalSet, rawColumns, row;

        //extract the columns of this Matrix as an Array of Vectors.
        rawColumns = [];

        for (col = 0; col < this.cols; col++) {
            emptyVec = new Vector();
            rawColumns.push(emptyVec);
            for (row = 0; row < this.rows; row++) {
                rawColumns[col].setVal(this.elements[row][col], row);
            }
            //rawColumns[col].dump()
            //document.write('</br>');
        }


        //construct orthogonal set
        orthonormalSet = [];

        //first element is simple:
        orthonormalSet[0] = rawColumns[0];
        //orthonormalSet[0].dump();
        //document.write('</br>');

        for (col = 1; col < this.cols; col++) {

            orthonormalSet[col] = rawColumns[col];

            //declare empty vector for non-orthogonal piece:
            notOrthogonal = new Vector();
            for (i = 0; i < this.rows; i++) {
                notOrthogonal.setVal(0, i);
            }

            //construct the component of this column that is non-orthogonal to all the previous elements:
            for (i = 0; i < col; i++) {
                notOrthogonal = notOrthogonal.add(rawColumns[col].project(orthonormalSet[i]));
            }

            //notOrthogonal.dump();
            //document.write('; ');

            notOrthogonal = notOrthogonal.scale(-1);

            //remove nonorthogonal component:
            orthonormalSet[col] = orthonormalSet[col].add(notOrthogonal);

            //orthonormalSet[col].dump();
            //document.write('</br>');
        }

        //normalize
        for (col = 0; col < this.cols; col++) {
            orthonormalSet[col] = orthonormalSet[col].scale();

        }

        return orthonormalSet;
    };

    //QR process to find Schur form of this Matrix.
    this.qr = function (tol, iter) {
        var A, column, done, invQ, iterations, iterLimit, orthonormalSet, Q, row, tolerance;

        try {
            if (this.rows !== this.cols) {
                throw ('Matrix not square, abandoning QR process.');
            }
        } catch (err) {
            return;
        }

        tolerance = typeof tol !== 'undefined' ? tol : 0.000001;
        iterLimit = typeof iter !== 'undefined' ? iter : 1000;

        A = this;
        Q = new Matrix(this.rows, this.cols);

        done = 0;
        while (done === 0) {

            orthonormalSet = A.orthonormalGS();

            for (row = 0; row < this.rows; row++) {
                for (column = 0; column < this.cols; column++) {
                    Q.elements[row][column] = orthonormalSet[column].elements[row];
                }
            }

            invQ = Q.getInverse();
            A = invQ.mtxMulti(A, 'right');
            A = A.mtxMulti(Q, 'right');

            done = 1;

            for (column = 0; column < this.cols; column++) {
                for (row = column + 1; row < this.rows; row++) {
                    if (Math.abs(A.elements[row][column]) > tolerance) {
                        done = 0;
                    }
                }
            }

            iterations++;
            if (iterations > iterLimit) {
                done = 1;
            }

        }

        try {
            if (iterations > iterLimit) {
                throw ('qr algo did not converge to Schur form fast enough, abandoning...');
            }
        } catch (convergeErr) {
            return A;
        }

        return A;
    };

    //returns an Array() containing the eigenvalues of this Matrix as determined by the qr() method.
    //note if qr() does not converge, these values will not be reliable!
    this.getEigenvalues = function (tol, iter) {
        var eigenvalues, i, iterLimit, schur, tolerance;

        tolerance = typeof tol !== 'undefined' ? tol : 0.000001;
        iterLimit = typeof iter !== 'undefined' ? iter : 1000;

        try {
            if (this.rows !== this.cols) {
                throw ('Matrix not square, abandoning eigenvalue calculation.');
            }
        } catch (err) {
            return;
        }

        schur = this.qr(tolerance, iterLimit);
        eigenvalues = [];

        for (i = 0; i < this.rows; i++) {
            eigenvalues[i] = schur.elements[i][i];
        }

        return eigenvalues;
    };

}
