// Clairvoyant.js Dataset class ---------------------------------------------------------------- 
function Dataset(variables) {
    'use strict';
    var i;

    //an array containing the variable names in order:
    this.variables = variables;
    
    //last variable is include / disinclude flag:
    this.variables.push('accepted');
    
    //prepare an array of arrays to hold the data.  First index correponds to variable, second index
    //labels data point:
    this.data = [];
    for (i = 0; i < this.variables.length; i++) {
        this.data[i] = [];
    }
    


    // function definitions: --------------------------------------------------------------------- 

    // dump data table to screen:
    this.dump = function () {
        var d, i;
        
        for (i = 0; i < this.variables.length; i++) {
            document.write(this.variables[i] + "\t");
        }
        document.write("</br>");
        for (d = 0; d < this.data[0].length; d++) {
            for (i = 0; i < this.variables.length; i++) {
                document.write(this.data[i][d] + "\t");
            }
            document.write("</br>");
        }        
        
    };


    // add a new entry to the table.  <entry> is an Array containing all the values for this entry
    // in the order defined in <variables> in the class definition
    this.addEntry = function (entry) {
    
        var i;

        if (!(entry instanceof Array)) {
            alert ('fee!');
            return;
        }
        if (entry.length !== this.variables.length - 1) {
            alert ('fie!');
            return;
        }


        for (i = 0; i < entry.length; i++) {
            this.data[i].push(entry[i]);
        }
        //accept new data point by default:
        this.data[entry.length].push(1);

    };
    
    //  delete an entry from the table at row index <index>
    this.deleteEntry = function (index) {
        var i;
        
        if (index >= this.data[0].length) {
            alert('index for dataset entry deletion out of range');
            return;
        }
        
        for (i = 0; i < this.data.length; i++) {
            this.data[i].splice(index,1);
        }
    };
    
    //  change accepted status to <flag> for an entry at row index <index>
    this.accept = function (index, flag) {
        var i;
        
        if(flag !== 0 && flag !== 1) {
            alert('Dataset flags must either be 0 or 1.');
            return;
        }
        if (index >= this.data[0].length) {
            alert('index for acceptance flag setting out of range');
            return;
        }
        
        this.data[this.data.length-1][index] = flag;
        
    };
    
    // change all acceptance flags to <flag>:
    this.setAll = function(flag) {
        var i;
        
        for (i = 0; i < this.data[0].length; i++) {
            this.data[this.data.length - 1][i] = flag;
        }
    };
    
    //change acceptance flags to 1 based on a boolean condition:
    this.filter = function(variable, operator, value) {
    
        var d, i;
    
        i = this.variables.indexOf(variable);
    
        if (i === -1) {
            alert(variable+' is not present in this dataset.');
            return;
        }
        
        switch (operator) {
            case '==':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] == value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            case '===':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] === value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }            
            break;
            case '!=':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] != value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            case '!==':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] !== value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            case '>':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] > value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            case '<':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] < value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            case '>=':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] >= value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            case '<=':
                for (d = 0; d < this.data[i].length; d++) {
                    if (this.data[i][d] <= value) {
                        this.data[this.data.length - 1][d] = 1;
                    }
                }
            break;
            default:
                alert('<operator> must be one of ==, ===, !=, !==, <, >, <=, >=');
                return; 
        }
    };

    //produce a subset of this Dataset based on some boolean conditions
    this.subset = function (conditions) {
    
        var condArray, condString, parsePosition, tokenizedCond, tokens;
        
        //remove whitespace:
        condString = conditions.replace(" ", "");
        //tab
        //newline
     
        //tokenize the conditions string:
        condArray = condString.split("");
        tokens = this.variables;
        tokens[tokens.length] = '(';
        tokens[tokens.length] = ')';
        tokens[tokens.length] = '&&';
        tokens[tokens.length] = '||';
        tokens[tokens.length] = '==';
        tokens[tokens.length] = '===';
        tokens[tokens.length] = '!=';
        tokens[tokens.length] = '!==';
        tokens[tokens.length] = '>';
        tokens[tokens.length] = '<';
        tokens[tokens.length] = '>=';
        tokens[tokens.length] = '<=';

    
        //parse the conditions:
        parsePosition = 0;
        tokenizedCond = [];
        while (parsePosition < condArray.length) {
        
        }
    
    };


}
