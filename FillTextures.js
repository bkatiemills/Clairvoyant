//Clairvoyant fill textures-----------------------

function rightCrosshatch(lineWidth, color) {
        var i, rch, rchContext, rightCrosshatch

        rch = document.createElement('canvas');
        rch.width = 50;
        rch.height = 50;
        rchContext = rch.getContext('2d');
        rchContext.lineWidth = lineWidth;
        rchContext.strokeStyle = color;
        for (i = 0; i < 10; i++) {
            rchContext.moveTo(0, i*5);
            rchContext.lineTo(i*5, 0);
                
            rchContext.moveTo(i*5, 50);
            rchContext.lineTo(50, i*5);
        }
        rchContext.stroke();
        rightCrosshatch = rchContext.createPattern(rch, "repeat");
        
        return rightCrosshatch;
}

function leftCrosshatch(lineWidth, color) {
        var i, lch, lchContext, leftCrosshatch

        lch = document.createElement('canvas');
        lch.width = 50;
        lch.height = 50;
        lchContext = lch.getContext('2d');
        lchContext.lineWidth = lineWidth;
        lchContext.strokeStyle = color;
        for (i = 0; i < 10; i++) {
            lchContext.moveTo(i*5, 0);
            lchContext.lineTo(50, 50-i*5);
                
            lchContext.moveTo(0, i*5);
            lchContext.lineTo(50-i*5, 50);
        }
        lchContext.stroke();
        leftCrosshatch = lchContext.createPattern(lch, "repeat");
        
        return leftCrosshatch;
}