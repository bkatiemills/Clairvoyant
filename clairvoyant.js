//define 1-D histogram class----------------------------------------------------------------
function Histo(name, nBins, min, max){
  this.name = name;
  this.nBins = nBins;
  this.min = min;
  this.max = max;

  //set up array of histogram bins
  this.binSize = (max-min)/nBins;
  this.bins = new Array();
  for(var i=0; i<nBins; i++){
    this.bins.push({lo: this.min + i*this.binSize, weight: 0});
  }
  this.bins.push({lo: max, weight: 0});

  //initialize member functions
  this.dumpContents = dumpContents;
  this.increment = increment;
  this.integrate = integrate;
  this.normalize = normalize;
  this.add = add;
  this.getMean = getMean;
  this.getVariance = getVariance;
  this.getCDF = getCDF;
  this.KStest = KStest;
  this.sample = sample;

}

//function definitions:---------------------------------------------------------------------


//write all contents of histogram as <lo edge> : <weight>
function dumpContents(){
  document.write('</br>');
  document.write(this.name);
  document.write('</br>');
  for(var i=0; i<this.bins.length; i++){
    document.write(this.bins[i].lo);
    document.write(' : ');
    document.write(this.bins[i].weight);
    document.write('</br>');
  }

  return 0;
}

//increment the bin in which <value> falls by <amount>;
//increments this bin by 1 if no value provided for <amount>.
function increment(value, amount){
  if(arguments.length == 1){
    amount = 1;
  }

  if(value < this.min || value >= this.max){
    return -999;
  }
  
  var index = 0;
  for(var i = 0; i<this.bins.length; i++){
    if(this.bins[i].lo <= value){
      index = i;
    }
  }

  //document.write(index)
  //document.write('</br>')
  this.bins[index].weight += amount;

  return 0;
}



//integrate from <min> to <max>;
//returns integral of whole histo if no args provided;
//if bound is in the middle of a bin, treats weight as distributed flat across the bin
function integrate(min, max){

  //return integral of whole histo if no arguments provided
  if(arguments.length==0){
    var total = 0;
    for(var i=0; i<this.bins.length; i++){
      total+= this.bins[i].weight;
    }
    return total;
  }

  //otherwise integrate from min to max:
  if(arguments.length==2){

    if(min < this.min || max > this.max){
      document.write('bounds OOR');
      return -999;
    }

    var minBin = -1;
    var maxBin = -1;
    for(i=0; i<this.bins.length; i++){
      if(this.bins[i].lo <= min){
        minBin = i;
      }
      if(this.bins[i].lo < max){
        maxBin = i;
      }
    }

    var total = 0;
    //integrate all bins in range except for fractionally included ones:
    for(i=minBin+1; i<maxBin; i++){
      total += this.bins[i].weight;
    }
    //treat weight as distributed evenly across a bin for fractionally included first bin
    total += this.bins[minBin].weight*(this.bins[minBin+1].lo-min) / (this.bins[minBin+1].lo-this.bins[minBin].lo);

    //similarly for the last bin
    if(minBin!=maxBin){
      total += this.bins[maxBin].weight*(max - this.bins[maxBin].lo) / (this.bins[maxBin+1].lo-this.bins[maxBin].lo);
    }
  
    return total;

  }

}

//normalize the histogram to <factor>;
//<factor> set to 1 if not provided
function normalize(factor){
  if(arguments.length==0){
    factor = 1;
  }

  var total = this.integrate();

  for(var i=0; i<this.bins.length; i++){
    this.bins[i].weight = factor*this.bins[i].weight/total;
  }
  
  return 0;
}

//increment this histo by the corresponding weights in <otherHisto>, multiplied by <scale>;
//<scale> default = 1
function add(otherHisto, scale1, scale2){

  if(this.nBins != otherHisto.nBins || this.min != otherHisto.min || this.max != otherHisto.max){
    alert('Can\'t add histrograms with different binning.  Aborting...');
    return -999;
  }

  var sumHisto = new Histo('sumHisto',this.nBins, this.min, this.max);
  
  if(arguments.length==1){
    scale1 = 1;
    scale2 = 1;
  }

  for(var j=0; j<this.bins.length; j++){
    sumHisto.increment(this.bins[j].lo, scale1*this.bins[j].weight);
    sumHisto.increment(otherHisto.bins[j].lo, scale2*otherHisto.bins[j].weight);
  }

  return sumHisto;
}


//returns the mean of the distribution.  bin weight is attributed to the low edge of the bin
function getMean(){
  var totalWeight = this.integrate();
  var weightedSum = 0;
  for(var i=0; i<this.bins.length-1; i++){
    weightedSum += this.bins[i].lo * this.bins[i].weight;
  }

  return weightedSum / totalWeight;
}

//returns the variance of the distribution.
function getVariance(){

  var totalWeight = this.integrate();
  var weightedSquares = 0;
  for(var i=0; i<this.bins.length-1; i++){
    weightedSquares += Math.pow(this.bins[i].lo,2) * this.bins[i].weight;
  }
  var meanSquare = weightedSquares / totalWeight;

  var mean = this.getMean();

  return meanSquare - mean*mean;
}

//returns the cumulative distribution function of this (normalized) histogram
function getCDF(){

  var cloneHist = this;
  cloneHist.normalize();

  for(var i=1; i<cloneHist.bins.length-1; i++){
      cloneHist.bins[i].weight += cloneHist.bins[i-1].weight;
  }

  return cloneHist;
    
}

//perform a KS match between this histo and <target> histo
function KStest(target){
  if( (this.nBins != target.nBins)  ||  (this.min != target.min)  || (this.max != target.max) ){
    document.write('</br>');
    document.write('histos must have same min, max and divisions for KS test, abandoning test...');
    return -999;
  }

  var CDF1 = new Histo('CDF1', 10,0,10);
  CDF1 = this.getCDF();
  var CDF2 = new Histo('CDF2', 10,0,10);
  CDF2 = target.getCDF();

  var weight1 = this.integrate();
  var weight2 = target.integrate();
 
  var delta = 0;
  for(var i=0; i<this.bins.length; i++){
    if(Math.abs(CDF1.bins[i].weight - CDF2.bins[i].weight)>delta){
      delta = Math.abs(CDF1.bins[i].weight - CDF2.bins[i].weight);
    }
  }

  KSstat = Math.sqrt(weight1*weight2/(weight1+weight2))*delta;

  return Kolmogorov(KSstat);
}

function sample(nSamples,source){

  var x = new Array();
  var p = new Array();
  for(var nP=0; nP<source.params.length; nP++){
    p[nP] = source.params[nP];
  }
  for(var pull=0; pull<nSamples; pull++){
    x[0] = Math.random()*(this.max - this.min) + this.min;
    this.increment(x[0],source.evaluate(x,p));
  }

  return 0;
}

//-----end 1D histo methods----------------------------------------------

//-----user defined function class---------------------------------------
//USAGE: userString must be some evaluate-able expression in n dimensions, where
//the coordinates are represented as x[0], x[1], ..., x[n-1], and m parameters are 
//represented similarly as par[0], par[1], ..., par[m-1].
//Currently <name> needs to be the same as the var name of the object itself in order for getExtremum
//to work, might fix this in future.
function Func(name, userString, parameters){
  this.name = name;
  this.userString = userString;
  this.params = [];

  if(arguments.length == 3){
    if(parameters instanceof Array){
      this.params = parameters;
    }
    else{
      this.params[0] = parameters;
    }
  }
  else{
    this.params[0] = 0  //dummy for no-parameter functions;
  }

  this.evaluate = evaluate;
  this.getParameters = getParameters;
  this.setParameters = setParameters;
  this.getExtremum = getExtremum;
  this.randPull = randPull;
  this.brentSoln = brentSoln;
  this.biSoln = biSoln;
  this.derivative = derivative;
  this.gradient = gradient;
}

//----- methods for user defined function class--------------------------

//evaluates the function at the coordinate <inputs> in phase space, using the
//parameters set on creation of the function or on a call to this.setParameters
//<inputs> may be either an Array or a single number
function evaluate(inputs){
  var x = new Array();
  
  if(inputs instanceof Array){
    for(var ins=0; ins<inputs.length; ins++){
      x[ins] = inputs[ins];
    }
  }
  else{
    x[0] = inputs;
  }

  var par = new Array();
  for(ins=0; ins<this.params.length; ins++){
      par[ins] = this.params[ins];
  }

  return eval(this.userString);

}

//load the current parameters of the Func into an Array
function getParameters(pbr){

  for(var getP=0; getP<this.params.length; getP++){
    pbr[getP]=this.params[getP];
  }

  return 0;
}

//set the parameters of a Func to some new values
function setParameters(newParam){

  for(var newP=0; newP<newParam.length; newP++){
    this.params[newP] = newParam[newP];
  }

  return 0;
}

//function to find this function's extremum on <min>..<max> by finding the derivative
//zeroes.  Tolerance defaults to 1/10^6 unless user specifies <tol>.  Returns an array,
//first element = coordinate of extrema, second element is 0 for minima and 1 for maxima. 
function getExtremum(min, max, tol){

  var tolerance = 0.000001;
  if(arguments.length == 3){
    tolerance = tol;
  }

  var funcString = this.name+'.derivative(x[0],0,0.000001,0)';

  var ddx = new Func('ddx', funcString);
  var extrema = ddx.brentSoln(min,max,tolerance);
  var concavity = ddx.derivative(extrema);

  var results = new Array();
  results[0] = Math.round(extrema/tolerance)*tolerance;
  if(concavity>0){
    results[1] = 0;
  }
  if(concavity<0){
    results[1] = 1;
  }

  return results;
}




//return a random pull from a 1D function, between <min> and <max>.  
//Function must be non-negative and pole-free across the requested 
//range for this to make sense. 
function randPull(min, max){
 
  var done = 0;

  //find the highest point of the function in range: grid search to find global maximum,
  //then getExtremum to zero in on it.
  var extreme = new Array();
  extreme = this.getExtremum(min,max);

  var x = 0;
  var thresh = 0;
  var decision = 0;

  while(done==0){
    //choose a point in range
    x = min + (max-min)*Math.random();

    //find normalized height of the function at x
    thresh = this.evaluate(x) / extreme[0];

    //decide if we should keep the pull
    decision = Math.random();
    if(decision < thresh){
      //alert(x)
      return x;
    }
    else{
      done = 0;
    }
  }

}

//implementation of Brent's Algo for finding the zero of a 1D function
//between <hi> and <lo>.  Letters label the steps in the wikipedia
//factoring of the algorithm; step (a) is the function call itself. 
function brentSoln(lo, hi, tol){

  var tolerance = 0.000001;
  if(arguments.length == 3){
    tolerance = tol;
  }

  //(b)
  var initHi = this.evaluate(hi);
  //(c)
  var initLo = this.evaluate(lo);
  //(d)
  if( (initHi*initLo>=0) ){
    alert('Range provided does not bracket a unique zero, attempting to recover...');
    return this.biSoln(lo, hi);
  }
  //(e)
  var a = lo;
  var b = hi;
  if(Math.abs(initLo) < Math.abs(initHi)){
    a = hi;
    b = lo;
  }
  //(f)
  var c = a;
  //(g)
  var mflag = 1;

  //(h)
  var f_a = this.evaluate(a);
  var f_b = this.evaluate(b);
  var f_c = this.evaluate(c);
  var s = b - f_b*(b-a)/(f_b-f_a);
  var f_s = this.evaluate(s);
  var d = 0;
  var buffer = 0;
  var loops = 0;
  while(f_b!=0 && f_s!=0 && Math.abs(b-a)>tolerance){
    loops++;
    var f_a = this.evaluate(a);
    var f_b = this.evaluate(b);
    var f_c = this.evaluate(c);

    //(h_i)
    if(f_a!=f_c && f_b!=f_c){
      //(h_i_1)
      s = a*f_b*f_c/(f_a-f_b)/(f_a-f_c) + b*f_a*f_c/(f_b-f_a)/(f_b-f_c) + c*f_a*f_b/(f_c-f_a)/(f_c-f_b);
    }
    //(h_ii)
    else{
      //(h_ii_1)
      s = b - f_b*(b-a)/(f_b-f_a);
    }
    //(h_iii)
    //(h_iv)
    if( ((s>b && s>(3*a+b)/4)||(s<b && s<(3*a+b)/4)) || (mflag==1 && Math.abs(s-b) >= Math.abs(b-c)/2) || (mflag==0 && Math.abs(s-b) >= Math.abs(c-d)/2) || (mflag==1 && Math.abs(b-c)<tolerance) || (mflag==0 && Math.abs(c-d)<tolerance) ){
      //(h_iv_1)
      s = (a+b)/2;
      //(h_iv_2)
      mflag = 1;
    }
    //(h_v)
    else{
      //(h_v_1)
      mflag = 0;
    }
    //(h_vi)
    //(h_vii)
    f_s = this.evaluate(s);
    //(h_viii)    
    d = c;
    //(h_ix)
    c = b;
    //(h_x)
    if(f_a*f_s<0){
      b = s;
    }
    else{
      a = s;
    }
    //(h_xi)
    if( Math.abs(this.evaluate(a)) < Math.abs(this.evaluate(b)) ){
      buffer = a;
      a = b;
      b = buffer;
    }
  }


  //(i)
  if(this.evaluate(b)==0){
    return Math.round(b/tolerance)*tolerance;
  }
  else{
    return Math.round(s/tolerance)*tolerance;
  }

}

//Simple grid search + bisection method for finding a function zero in the range <min>..<max> to tolerance <tol>.
//This is SLOW, and should only be called to help brentSoln recover when the user fails to bracket a unique zero.
function biSoln(min, max, tol){

  //grid search to find some zero, very slow
  var gridSteps = 1000;
  var stepSize = (max-min)/gridSteps;
  var here = min;
  var gridMin = Math.abs(this.evaluate(min));
  var lowestPoint = here;
  for(var gridS=0; gridS<gridSteps; gridS++){
    if( Math.abs(this.evaluate(here)) < gridMin ){
      lowestPoint = here;
      gridMin = Math.abs(this.evaluate(here));
    }
    here += stepSize;
  }

  var low = lowestPoint - stepSize;
  var high = lowestPoint + stepSize;

  var tolerance = 0.000001;
  if(arguments.length == 3){
    tolerance = tol;
  }

  var a = low;
  var b = high;
  var f_a = Math.abs(this.evaluate(a));
  var f_b = Math.abs(this.evaluate(b));
  var c = (a+b)/2;
  var f_c = Math.abs(this.evaluate(c));

  while(Math.abs(a-b) > tolerance){
    if(f_a > f_b && f_a > f_c){
      a = c;
      f_a = Math.abs(this.evaluate(a));
    }
    else if(f_b > f_a && f_b > f_c){
      b = c;
      f_b = Math.abs(this.evaluate(b));
    }
    c = (a+b)/2;
    f_c = Math.abs(this.evaluate(c));
  }

  return Math.round(c/tolerance)*tolerance;

}

//Richardson's extrapolation for derivative computation in 1D, evaluated at <x> in
//dimension <dim> (default 0) to tolerance <tol> (default 1/10^6).  <roundoff> flag
//chooses whether or not to round the result to tolerance (default yes=1); needs to
//be 0 for maxima finding so tolerances don't compound.
function derivative(x, dim, tol, roundoff){

  var dimension = 0;
  if(arguments.length==2){
    dimension = dim;
  }

  var tolerance = 0.000001;
  if(arguments.length==3){
    tolerance = tol;
  }

  var doRound = 1;
  if(arguments.length==4){
    doRound = roundoff;
  }

  if( !(x instanceof Array) ){
    var dtol = ( this.evaluate(x+tolerance) - this.evaluate(x-tolerance) ) / (2*tolerance);
    var dtol2 = ( this.evaluate(x+tolerance/2) - this.evaluate(x-tolerance/2) ) / tolerance;
  }
  else{
    var Xhi = new Array();
    var Xlo = new Array();
    var Xhi2 = new Array();
    var Xlo2 = new Array();

    for(var vary=0; vary<x.length; vary++){
      Xhi[vary] = x[vary];
      Xlo[vary] = x[vary];
      Xhi2[vary] = x[vary];
      Xlo2[vary] = x[vary];
    }
    Xhi[dimension] += tolerance;
    Xlo[dimension] -= tolerance;
    Xhi2[dimension] += tolerance/2;
    Xlo2[dimension] -= tolerance/2;

    var dtol = ( this.evaluate(Xhi) - this.evaluate(Xlo) ) / (2*tolerance);
    var dtol2 = ( this.evaluate(Xhi2) - this.evaluate(Xlo2) ) / tolerance;
  }


  var D = (4*dtol2 - dtol) / 3;

  if(doRound == 0){
    return D;
  }
  if(doRound == 1){
    return Math.round(D / tolerance)*tolerance;
  }

}

function gradient(x){
/*
  var dimension = direction.length

  //normalize direction vector
  var length = 0
  for(var dim=0; dim<dimension; dim++){
    length += direction[dim]*direction[dim]
  }
  length = Math.pow(length,0.5)
  for(dim=0; dim<dimension; dim++){
    direction[dim] = direction[dim] / length
  }
*/

  var dimension = x.length;
  var grad = new Array();

  for(var dim=0; dim<dimension; dim++){
    grad[dim] = this.derivative(x,dim); //* direction[dim]
  }

  return grad;

}



//-----end user defined function class-----------------------------------


//-----Vector Class------------------------------------------------------

function Vector(name, elements){
  this.name = name;
  if(arguments.length==1){
    this.elts = [];
    this.elts[0] = 0;
    this.dim = 1;
  }
  if(arguments.length==2){
    this.elts = elements;
    this.dim = elements.length;
  }

  this.setVal = setVal;
  this.dot = dot;
  this.getLength = getLength;

}

function setVal(value, position){
  if(arguments.length==1){
    this.elts = value;
    this.dim = value.length;
    return;
  }
  if(arguments.length==2){
    this.elts[position] = value;
    if(this.dim<(position+1)){
      this.dim = position+1;
    }
    return 0;
  }
}

function dot(vec, metric){

  if( !(vec instanceof Vector) ){
    alert('Must take dot product with another Vector.  Aborting...');
    return -999;
  }
  if(this.dim != vec.dim){
    alert('Vectors must be the same length to take dot product.  Aborting...');    
    return -999;
  }

  var sum = 0;

  if(arguments.length==1){
    for(var dim=0; dim<this.dim; dim++){
      sum += this.elts[dim]*vec.elts[dim];
    }
    return sum;
  }

  if(arguments.length==2){
    if( (this.dim != metric.rows) || (vec.dim != metric.cols) ){
      alert('Incorrect metric dimension.  Aborting...');
      return -999;
    }
    var left = metric.mtxMulti(this,'left');
    for(dim=0; dim<left.dim; dim++){
      sum += left.elts[dim]*vec.elts[dim];
    }
    return sum;
  }

}

function getLength(metric){

  var length = 0;

  if(arguments.length==0){
    length = Math.pow(this.dot(this), 0.5);
  }

  if(arguments.length==1){
    length = Math.pow((metric.mtxMulti(this, 'left')).dot(this), 0.5);
  }
  
  return length;
}

//-----end Vector Class--------------------------------------------------


//-----Matrix Class------------------------------------------------------

function Matrix(name, rows, columns, preDef){
  this.name = name;
  this.rows = rows;
  this.cols = columns; 
  this.elements = new Array(rows);

  //start with all entries = 0
  for(var row=0; row<this.rows; row++){
    this.elements[row] = new Array(this.cols);
    for(var col=0; col<this.cols; col++){
      this.elements[row][col] = 0;
    }
  }


  if(arguments.length==4){

    if(preDef == 'identity'){
      if(this.rows!=this.cols){
        alert('Identity matrix must be square.  Aborting...');
        return -999;
      }
      for(dim=0; dim<this.rows; dim++){
        this.elements[dim][dim] = 1;
      }

    }

    if(preDef == 'Minkowski'){
      if(this.rows != 4 || this.cols != 4){
        alert('Minkowski space has a 4 by 4 metric, please adjust rows & columns accordingly.  Aborting...');
        return -999;
      }
      for(dim=1; dim<this.rows; dim++){
        this.elements[dim][dim] = 1;
      }
      this.elements[0][0] = -1;
    }

  }

  this.dump = dump;
  this.mtxAdd = mtxAdd;
  this.mtxMulti = mtxMulti;
  this.getDeterminant = getDeterminant;
  this.getMinor = getMinor;
  this.getCofactor = getCofactor;
  this.getTranspose = getTranspose;
  this.getAdjugate = getAdjugate;
  this.mtxScale = mtxScale;
  this.getInverse = getInverse;

}

//writes out the contesnts of this matrix.
function dump(){
  for(var row=0; row<this.rows; row++){
    for(var col=0; col<this.cols; col++){
      document.write(this.elements[row][col]);
    }
    document.write('</br>');
  }
  
  return 0;
}


//return sum of <matrix> with this matrix.
function mtxAdd(matrix){

  if( !(matrix instanceof Matrix) ){
    alert('Argument is not a matrix.  Aborting...');
    return -999;
  }

  if(this.rows!=matrix.rows || this.cols!=matrix.cols){
    alert('Matrices must be the same dimension to add them.  Aborting...');
    return -999;
  }

  var name1 = this.name;
  var name2 = matrix.name;
  var name = name1 + 'plus' + name2;
  var result = new Matrix(name, this.rows, this.cols);

  for(var row=0; row<this.rows; row++){
    for(var col=0; col<this.cols; col++){
      result.elements[row][col] = this.elements[row][col] + matrix.elements[row][col];
    }
  }

  return result;

}

//places <object> on side <side> of this matrix, and multiplies
function mtxMulti(object, side){

  if(side != 'left' && side != 'right'){
    alert('Second argument must be either left or right, indicating which side of the matrix you want to place the first argument on before multiplying.  Aborting...');
    return -999;
  }

  if( (object instanceof Vector) && (side=='left') ){
    if(object.dim != this.rows){
      alert('Vector*Matrix requires length of Vector = number of rows in Matrix.  Aborting...');
      return -999;
    }
    var result = new Vector('result');
    var sum = 0;
    for(var col=0;col<this.cols;col++){
      for(var row=0;row<this.rows;row++){
        sum += object.elts[row] * this.elements[row][col];
      }
      result.setVal(sum,col);
      sum=0;
    }
    return result;
  }

  if( (object instanceof Vector) && (side=='right') ){
    if(this.cols != object.dim){
      alert('Matrix*Vector requires length of Vector = number of columns in Matrix.  Aborting...');
      return -999;
    }
    var result = new Vector('result');
    var sum = 0;
    for(var row=0;row<this.rows;row++){
      for(var col=0;col<this.cols;col++){
        sum += object.elts[col] * this.elements[row][col];
      }
      result.setVal(sum,row);
      sum=0;
    }
    return result;
  }

  if( (object instanceof Matrix) && (side=='left') ){

    if(object.cols != this.rows){
      alert('Matrix1*Matrix2 requires Matrix1 to have # cols = # rows in Matrix2.  Aborting...');
      return -999;
    }

    var name1 = object.name;
    var name2 = this.name;
    var name = name1 + 'times' + name2;
    var result = new Matrix(name, object.rows, this.cols);

    var sum = 0;
    for(var row=0;row<object.rows;row++){
      for(var col=0;col<this.cols;col++){
        for(var elt=0;elt<this.rows;elt++){
          sum += object.elements[row][elt] * this.elements[elt][col];
        }
        result.elements[row][col] = sum;
        sum=0;
      }
    }
    return result;

  }

  if( (object instanceof Matrix) && (side=='right') ){

    if(object.rows != this.cols){                                   
      alert('Matrix1*Matrix2 requires Matrix1 to have # cols = # rows in Matrix2.  Aborting...');
      return -999;
    }

    var name1 = this.name;
    var name2 = object.name;
    var name = name1 + 'times' + name2;
    var result = new Matrix(name, object.rows, this.cols);

    var sum = 0;
    for(var row=0;row<object.rows;row++){
      for(var col=0;col<this.cols;col++){
        for(var elt=0;elt<this.rows;elt++){
          sum += this.elements[row][elt] * object.elements[elt][col];
        }
        result.elements[row][col] = sum;
        sum=0;
      }
    }
    return result;

  }

}

//Doolittle algo to extract determinant for this matrix.
function getDeterminant(eigenvalue){

  if(this.rows != this.cols){
    alert('Matrix must be square.  Aborting...');
    return -999;
  }

  //if an eigenvalue gets passed into the function, construct this-lambda*identity
  var lambda = 0;
  if(arguments.length==1){
    lambda = eigenvalue;
  }
  var lambdaI = new Matrix('lambdaI', this.rows,this.cols,'identity');
  lambdaI = lambdaI.mtxScale(-1*lambda);
  var detMatrix = this.mtxAdd(lambdaI);
  

  //zeroth iteration:
  var A = detMatrix;
  var L = new Matrix('L', detMatrix.rows, detMatrix.cols, 'identity');
  var l = new Matrix('l',detMatrix.rows,detMatrix.cols);

  for(var iter=1;iter<detMatrix.rows;iter++){

    //construct this iteration's lower triangular matrix:
    l = new Matrix('l',detMatrix.rows,detMatrix.cols,'identity');
    for(var row=iter; row<detMatrix.rows; row++){
      l.elements[row][iter-1] = -1*A.elements[row][iter-1] / A.elements[iter-1][iter-1];
      L.elements[row][iter-1] = -1*l.elements[row][iter-1];
    }

    //update A:
    A = A.mtxMulti(l, 'left');
/* 
    if(lambda!=0){
      A.dump()
    }
*/  
  }

  var detA = 1;
  var detL = 1;
  for(iter=0;iter<detMatrix.rows;iter++){
    detA = detA*A.elements[iter][iter];
    detL = detL*L.elements[iter][iter];
  }

  return detA*detL;

}

//function to calculate the minor matrix of this matrix
function getMinor(){

  var subMtx = new Matrix('subMtx',this.rows-1,this.cols-1);
  var mtxMinor = new Matrix('mtxMinor', this.rows, this.cols);

  var rMap=0;
  var cMap=0;

  for(var row=0;row<this.rows;row++){
    for(var col=0;col<this.cols;col++){

      rMap=0;
      for(var subRow=0;subRow<subMtx.rows;subRow++){
        if(rMap==row){
          rMap++;
        }
        cMap=0;
        for(var subCol=0;subCol<subMtx.cols;subCol++){
          if(cMap==col){
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

}

//function to calculate cofactor matrix of this matrix
function getCofactor(){
 
  var minor = this.getMinor();

  var cofac = new Matrix('cofac', this.rows, this.cols);

  for(var row=0;row<cofac.rows;row++){
    for(var col=0;col<cofac.cols;col++){
      cofac.elements[row][col] = Math.pow(-1,row+col)*minor.elements[row][col];
    }
  }

  return cofac;

}

//function to calculate the transpose of this matrix
function getTranspose(){

  var trans = new Matrix('trans',this.cols,this.rows);

  for(var row=0;row<trans.rows;row++){
    for(var col=0;col<trans.cols;col++){
      trans.elements[row][col] = this.elements[col][row];
    }
  }

  return trans;

}

//function to return adjugate of matrix
function getAdjugate(){
  var cof = this.getCofactor();
  return cof.getTranspose();
}

//function to scale matrix by <scale>
function mtxScale(scale){

  var scaled = new Matrix('scaled',this.rows,this.cols);

  for(var row=0;row<scaled.rows;row++){
    for(var col=0;col<scaled.cols;col++){
      scaled.elements[row][col] = scale*this.elements[row][col];
    }
  }

  return scaled;
}

//function get the inverse of this matrix
function getInverse(){

  var deter = this.getDeterminant();
  var adjug = this.getAdjugate();

  return adjug.mtxScale(1/deter);

}


//-----end Matrix Class--------------------------------------------------



//-----Statistical Distributions-----------------------------------------

function Kolmogorov(z){

  Kprob = 2*Math.exp(-2*z*z);  //start with first term (ie j=1)

  //keep addting terms on to fp precision
  var j = 2;
  while(2*Math.pow(-1,j-1)*Math.exp(-2*j*j*z*z)+Kprob != Kprob && j<1000000){
    Kprob +=2*Math.pow(-1,j-1)*Math.exp(-2*j*j*z*z);
    j++;
  }


  return Kprob;

}

function Gaussian(mu, sigma, x){
  return 1/sigma/Math.sqrt(2*3.14159265358979)*Math.exp(-0.5*Math.pow((x-mu)/sigma,2));
}










