//-----Clairvoyant.js Plot Class------------------------------------------------------ 

function Plot(canvas, xmin, xmax, ymin, ymax, title, xtitle, ytitle) {
    'use strict';

    this.xmin  = xmin;
    this.xmax  = xmax;
    this.ymin  = ymin;
    this.ymax  = ymax;
    this.xtitle = xtitle;
    this.ytitle = ytitle;
    this.title = title;
    
    //margin size, in pixels:
    this.marginSize = 70;
    
    //tick mark size, in pixels:
    this.bigTick = 10;
    this.smallTick = 5;
    
    //number of major divisions on the x axis:
    this.majorX = 3;
    //number of minor divisions between major divisions on the x axis:
    this.minorX = 9;
    
    //number of major divisions on the y axis:
    this.majorY = 3;
    //number of minor divisions between major divisions on the y axis:
    this.minorY = 9;
    
    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.context.textAlign = "center";     
    
    //draw this Plot in its canvas.
    this.draw = function () {

        var i, j, majorTickSpacingX, minorTickSpacingX, majorTickSpacingY, minorTickSpacingY;
    
        //axes
        this.context.moveTo(this.marginSize, this.canvas.height - this.marginSize);
        this.context.lineTo(this.canvas.width - this.marginSize, this.canvas.height - this.marginSize);
        this.context.moveTo(this.marginSize, this.canvas.height - this.marginSize);
        this.context.lineTo(this.marginSize, this.marginSize);
    
        //x-axis tick marks
        majorTickSpacingX = (this.canvas.width - 2 * this.marginSize) / (this.majorX - 1);
        minorTickSpacingX = majorTickSpacingX / (this.minorX + 1);
        for (i = 0; i < this.majorX; i++) {
            this.context.moveTo(this.marginSize + i * majorTickSpacingX, this.canvas.height - this.marginSize);
            this.context.lineTo(this.marginSize + i * majorTickSpacingX, this.canvas.height - this.marginSize + this.bigTick);
   
            this.context.font = "15px sans-serif";        
            this.context.fillText(((this.xmax - this.xmin) / (this.majorX - 1) * i + this.xmin).toFixed(), this.marginSize + i * majorTickSpacingX, this.canvas.height - this.marginSize + this.bigTick + 12);            
             
            if(i < this.majorX - 1){
                for (j = 0; j < this.minorX; j++) {
                    this.context.moveTo(this.marginSize + i * majorTickSpacingX + (j + 1) * minorTickSpacingX, this.canvas.height - this.marginSize);
                    this.context.lineTo(this.marginSize + i * majorTickSpacingX + (j + 1) * minorTickSpacingX, this.canvas.height - this.marginSize + this.smallTick);
                }
            }
        }
        
        //y-axis tick marks
        majorTickSpacingY = (this.canvas.height - 2 * this.marginSize) / (this.majorY - 1);
        minorTickSpacingY = majorTickSpacingY / (this.minorY + 1);
        for (i = 0; i < this.majorY; i++) {
            this.context.moveTo(this.marginSize, this.canvas.height - this.marginSize - i * majorTickSpacingY);
            this.context.lineTo(this.marginSize - this.bigTick, this.canvas.height - this.marginSize - i * majorTickSpacingY);
            
            this.context.font = "15px sans-serif";
            this.context.textBaseline = "middle";
            this.context.textAlign = "right";        
            this.context.fillText( ((this.ymax - this.ymin) / (this.majorY - 1) * i + this.ymin).toFixed(), this.marginSize - this.bigTick - 12, this.canvas.height - this.marginSize - i * majorTickSpacingY);
            
            if(i < this.majorY - 1){
                for (j = 0; j < this.minorY; j++) {
                    this.context.moveTo(this.marginSize, this.canvas.height - this.marginSize - i * majorTickSpacingY - (j + 1) * minorTickSpacingY);
                    this.context.lineTo(this.marginSize - this.smallTick, this.canvas.height - this.marginSize - i * majorTickSpacingY - (j + 1) * minorTickSpacingY);
                }
            }
        }  
  
  
        //titles  
  
        this.context.textBaseline = "middle";
        this.context.textAlign = "right";
        this.context.font = "italic 18pt times new roman"
        this.context.fillText(this.xtitle, this.canvas.width - this.marginSize - minorTickSpacingX, this.canvas.height - this.marginSize / 2);
        
        this.context.save();
        this.context.translate(this.marginSize / 2, this.marginSize + minorTickSpacingY);
        this.context.rotate(-1 * Math.PI / 2);
        this.context.textBaseline = "bottom";
        this.context.fillText(this.ytitle,0,0);
        this.context.restore();
        
        this.context.textBaseline = "bottom";
        this.context.fillText(this.title, this.canvas.width - this.marginSize - minorTickSpacingX, this.marginSize);
  
  
        this.context.stroke();
    };
}