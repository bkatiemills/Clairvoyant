//-----Clairvoyant.js Plot Class------------------------------------------------------ 

function Plot(canvas, xmin, xmax, ymin, ymax, title, xtitle, ytitle, plotstyle) {
    'use strict';

    this.xmin  = xmin;
    this.xmax  = xmax;
    this.ymin  = ymin;
    this.ymax  = ymax;
    this.xtitle = xtitle;
    this.ytitle = ytitle;
    this.title = title;

    //base margin size, in pixels:
    this.marginSize = typeof plotstyle !== 'undefined' ? plotstyle.marginSize : 70;
    //scale y-margin to accomodate tick mark labels & axis title
    this.marginScaleY = typeof plotstyle !== 'undefined' ? plotstyle.marginScaleY : 1.5;

    //axis line weights:
    this.axisLineWidth = typeof plotstyle !== 'undefined' ? plotstyle.axisLineWidth : 2;

    //tick mark size, in pixels:
    this.bigTick = typeof plotstyle !== 'undefined' ? plotstyle.bigTick : 10;
    this.smallTick = typeof plotstyle !== 'undefined' ? plotstyle.smallTick : 5;

    //number of major divisions on the x axis:
    this.majorX = typeof plotstyle !== 'undefined' ? plotstyle.majorX : 3;
    //number of minor divisions between major divisions on the x axis:
    this.minorX = typeof plotstyle !== 'undefined' ? plotstyle.minorX : 9;

    //number of major divisions on the y axis:
    this.majorY = typeof plotstyle !== 'undefined' ? plotstyle.majorY : 3;
    //number of minor divisions between major divisions on the y axis:
    this.minorY = typeof plotstyle !== 'undefined' ? plotstyle.minorY : 9;
    
    //fonts:
    this.scaleFont = typeof plotstyle !== 'undefined' ? plotstyle.scaleFont : '15px sans-serif';
    this.titleFont = typeof plotstyle !== 'undefined' ? plotstyle.titleFont : 'italic 24px times new roman';
    
    //nudges:
    this.titleNudgeX = typeof plotstyle !== 'undefined' ? plotstyle.titleNudgeX : 0;
    this.titleNudgeY = typeof plotstyle !== 'undefined' ? plotstyle.titleNudgeY : 0;
    this.xLabelNudgeX = typeof plotstyle !== 'undefined' ? plotstyle.xLabelNudgeX : 0;
    this.xLabelNudgeY = typeof plotstyle !== 'undefined' ? plotstyle.xLabelNudgeY : 0;
    this.yLabelNudgeX = typeof plotstyle !== 'undefined' ? plotstyle.yLabelNudgeX : 0;
    this.yLabelNudgeY = typeof plotstyle !== 'undefined' ? plotstyle.yLabelNudgeY : 0;

    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");
    this.context.textAlign = "center";

    //draw this Plot in its canvas.
    this.draw = function (plotstyle) {

        if (typeof plotstyle !== 'undefined') {
            this.marginSize = plotstyle.marginSize;
            this.marginScaleY = plotstyle.marginScaleY;
            this.bigTick = plotstyle.bigTick;
            this.smallTick = plotstyle.smallTick;
            this.majorX = plotstyle.majorX;
            this.minorX = plotstyle.minorX;
            this.majorY = plotstyle.majorY;
            this.minorY = plotstyle.minorY;
            this.scaleFont = plotstyle.scaleFont;
            this.titleFont = plotstyle.titleFont;        
            this.titleNudgeX = plotstyle.titleNudgeX;
            this.titleNudgeY = plotstyle.titleNudgeY;
            this.xLabelNudgeX = plotstyle.xLabelNudgeX;
            this.xLabelNudgeY = plotstyle.xLabelNudgeY;
            this.yLabelNudgeX = plotstyle.yLabelNudgeX;
            this.yLabelNudgeY = plotstyle.yLabelNudgeY;
            this.axisLineWidth = plotstyle.axisLineWidth;
        }

        var i, j, majorTickSpacingX, minorTickSpacingX, majorTickSpacingY, minorTickSpacingY;

        //gridlines if requested
        if (typeof plotstyle !== 'undefined' && plotstyle.gridLines !== 0) {
            i = 0;
            this.context.beginPath();
            this.context.strokeStyle = 'grey';
            this.context.lineWidth = 1;
            while (i < this.canvas.width) {
                this.context.moveTo(i, 0);
                this.context.lineTo(i, this.canvas.height);
                i += plotstyle.gridLines;
            }
            i = 0;
            while (i < this.canvas.height) {
                this.context.moveTo(0, i);
                this.context.lineTo(this.canvas.width, i);
                i += plotstyle.gridLines;
            }
            this.context.stroke();
        }
        

        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.lineWidth = this.axisLineWidth;
        //axes
        this.context.moveTo(this.marginScaleY * this.marginSize, this.canvas.height - this.marginSize);
        this.context.lineTo(this.canvas.width - this.marginSize, this.canvas.height - this.marginSize);
        this.context.moveTo(this.marginScaleY * this.marginSize, this.canvas.height - this.marginSize);
        this.context.lineTo(this.marginScaleY * this.marginSize, this.marginSize);

        //x-axis tick marks
        majorTickSpacingX = (this.canvas.width - (1 + this.marginScaleY) * this.marginSize) / (this.majorX - 1);
        minorTickSpacingX = majorTickSpacingX / (this.minorX + 1);
        for (i = 0; i < this.majorX; i++) {
            this.context.moveTo(this.marginScaleY * this.marginSize + i * majorTickSpacingX, this.canvas.height - this.marginSize);
            this.context.lineTo(this.marginScaleY * this.marginSize + i * majorTickSpacingX, this.canvas.height - this.marginSize + this.bigTick);

            this.context.font = this.scaleFont;
            this.context.fillText(((this.xmax - this.xmin) / (this.majorX - 1) * i + this.xmin).toFixed(), this.marginScaleY * this.marginSize + i * majorTickSpacingX, this.canvas.height - this.marginSize + this.bigTick + 12);

            if (i < this.majorX - 1) {
                for (j = 0; j < this.minorX; j++) {
                    this.context.moveTo(this.marginScaleY * this.marginSize + i * majorTickSpacingX + (j + 1) * minorTickSpacingX, this.canvas.height - this.marginSize);
                    this.context.lineTo(this.marginScaleY * this.marginSize + i * majorTickSpacingX + (j + 1) * minorTickSpacingX, this.canvas.height - this.marginSize + this.smallTick);
                }
            }
        }

        //y-axis tick marks
        majorTickSpacingY = (this.canvas.height - 2 * this.marginSize) / (this.majorY - 1);
        minorTickSpacingY = majorTickSpacingY / (this.minorY + 1);
        for (i = 0; i < this.majorY; i++) {
            this.context.moveTo(this.marginScaleY * this.marginSize, this.canvas.height - this.marginSize - i * majorTickSpacingY);
            this.context.lineTo(this.marginScaleY * this.marginSize - this.bigTick, this.canvas.height - this.marginSize - i * majorTickSpacingY);

            this.context.font = this.scaleFont;
            this.context.textBaseline = "middle";
            this.context.textAlign = "right";
            this.context.fillText(((this.ymax - this.ymin) / (this.majorY - 1) * i + this.ymin).toFixed(), this.marginScaleY * this.marginSize - this.bigTick - 12, this.canvas.height - this.marginSize - i * majorTickSpacingY);

            if (i < this.majorY - 1) {
                for (j = 0; j < this.minorY; j++) {
                    this.context.moveTo(this.marginScaleY * this.marginSize, this.canvas.height - this.marginSize - i * majorTickSpacingY - (j + 1) * minorTickSpacingY);
                    this.context.lineTo(this.marginScaleY * this.marginSize - this.smallTick, this.canvas.height - this.marginSize - i * majorTickSpacingY - (j + 1) * minorTickSpacingY);
                }
            }
        }


        //titles  

        this.context.textBaseline = "middle";
        this.context.textAlign = "right";
        this.context.font = this.titleFont;
        this.context.fillText(this.xtitle, this.canvas.width - this.marginSize - minorTickSpacingX + this.xLabelNudgeX, this.canvas.height - this.marginSize / 2 + this.xLabelNudgeY);

        this.context.save();
        this.context.translate(this.marginSize / 2 + this.yLabelNudgeX, this.marginSize + minorTickSpacingY + this.yLabelNudgeY);
        this.context.rotate(-1 * Math.PI / 2);
        this.context.textBaseline = "bottom";
        this.context.fillText(this.ytitle, 0, 0);
        this.context.restore();

        this.context.textBaseline = "bottom";
        this.context.fillText(this.title, this.canvas.width - this.marginSize - minorTickSpacingX + this.titleNudgeX, this.marginSize + this.titleNudgeY);
        
        this.context.stroke();
    };
}

//-----PlotStyle class------------------------------------------------

function PlotStyle() {
    'use strict';

    var i;

    //base margin size, in pixels:
    this.marginSize = 70;
    //scale y-margin to accomodate tick mark labels & axis title
    this.marginScaleY = 1.5;

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

    //line colors
    this.color = 'black';
    
    //line weight
    this.lineWidth = 2;
    this.axisLineWidth = 2;
    
    //fill colors
    this.fill = 'white';

    //fonts
    this.scaleFont = '15px sans-serif';
    this.titleFont = 'italic 24px times new roman';

    //suppress axes and labels (for drawing multiple things on the same canvas)
    this.suppress = 0;
    
    //draw grid lines over the entire canvas with this spacing in pixels; set to 0 to turn off:
    this.gridLines = 0;
    
    //nudge title and label elements around this many pixels:
    this.titleNudgeX = 0;
    this.titleNudgeY = 0;
    this.xLabelNudgeX = 0;
    this.xLabelNudgeY = 0;
    this.yLabelNudgeX = 0;
    this.yLabelNudgeY = 0;
    
    //opacity
    this.opacity = 1;
    
}



//-----Legend Class------------------------------------------
function Legend(canvas, x, y) {

    this.canvas = document.getElementById(canvas);
    this.context = this.canvas.getContext("2d");

    //upper left hand corner of Legend in canvas coordinates
    this.x = x;
    this.y = y;
    
    this.entries = [];
    this.entryStyle = [];
    
    this.defaultStyle = new PlotStyle();
    
    this.add = function(label, plotstyle) {
        this.entries.push(label);
        if (typeof plotstyle !== 'undefined') {
            this.entryStyle.push(plotstyle);
        } else {
            this.entryStyle.push(this.defaultStyle);
        }
    };
    
    this.draw = function(style) {
        var border, textColor, font, i, opacity, thumbHeight, thumbWidth;
        
        font = typeof style !== 'undefined' ? style.font : '12px sans-serif';
        border = typeof style !== 'undefined' ? style.border : 5;
        opacity = typeof style !== 'undefined' ? style.opacity : 1;
        thumbWidth = typeof style !== 'undefined' ? style.thumbWidth : 20;
        thumbHeight = typeof style !== 'undefined' ? style.thumbHeight : 20;        
        textColor = typeof style !== 'undefined' ? style.textColor : 'black';

        this.context.textAlign = 'left';
        this.context.textBaseline = 'middle';
        
        for (i = 0; i < this.entries.length; i++) {
            //Duplicate the fill style for each element in the legend thumbnail:
            this.context.globalAlpha = this.entryStyle[i].opacity;
            this.context.fillStyle = this.entryStyle[i].fill;
            if (this.entryStyle[i].fill === 'rightCrosshatch') {
                this.context.fillStyle = rightCrosshatch(this.entryStyle[i].lineWidth, this.entryStyle[i].color);
            }
            if (this.entryStyle[i].fill === 'leftCrosshatch') {
                this.context.fillStyle = leftCrosshatch(this.entryStyle[i].lineWidth, this.entryStyle[i].color);
            }
            this.context.fillRect(this.x + border, this.y + border + i*(thumbHeight+5), thumbWidth, thumbHeight);
            
            //duplicate the border style for each element in the thumbnail:
            this.context.strokeStyle = this.entryStyle[i].color;
            this.context.lineWidth = this.entryStyle[i].lineWidth;
            this.context.globalAlpha = 1;
            this.context.strokeRect(this.x + border, this.y + border + i*(thumbHeight+5), thumbWidth, thumbHeight);
            
            //label the thumbnail:
            this.context.font = font;
            this.context.globalAlpha = opacity;
            this.context.fillStyle = textColor;            
            this.context.fillText(this.entries[i], this.x + border + thumbWidth + border, this.y + border + thumbHeight / 2 + i*(thumbHeight+5));
        }
        
    };
}

//-----LegendStyle Class------------------------------------
function LegendStyle() {

    this.font = '12px sans-serif';
    this.opacity = 1;
    this.border = 5;
    this.thumbWidth = 20;
    this.thumbHeight = 20;
    this.textColor = 'black';

}