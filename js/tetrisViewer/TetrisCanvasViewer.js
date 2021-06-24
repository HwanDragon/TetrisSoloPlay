

class TetrisCanvasViewer {
    constructor (canvas, frame) {
        this.style = undefined;
        this.board = undefined;
        this.frame = frame;
        this.canvas = canvas;
        this.isDrawBackground = true;
    }

    setStyle(style) {
        this.style = style;
    }

    setBoard(board) {
        this.board = board;
    }

    setFrame(frame) {
        this.frame = frame;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setIsDrawBackground(isDrawBackground) {
        this.isDrawBackground = isDrawBackground;
    }
    
    clear() {
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(this.frame.origin.x, this.frame.origin.y, this.frame.size.width, this.frame.size.height); 
    }

    draw() {
        if (this.isDrawBackground == true) {
            this.drawBackground();
        }
        this.drawBlock();
    }

    drawBlock() {
        var blockColSize = (this.frame.size.width / this.board[0].length);
        var blockRowSize = (this.frame.size.height / this.board.length);
        var ctx = this.canvas.getContext("2d");
        this.board.forEach((element, yIndex) => {
            element.forEach((value, xIndex) => {
                try {
                    var color = BlockTypeColor[value];
                    if (color != undefined) {
                        ctx.strokeStyle = BlockOutlineColor;    // 블럭 외곽선
                        ctx.fillStyle = color;  // 블록 채우기 색상
                        ctx.fillRect(this.frame.origin.x + (xIndex * blockColSize), this.frame.origin.y + (yIndex * blockRowSize), blockColSize, blockRowSize);
                        ctx.strokeRect(this.frame.origin.x + (xIndex * blockColSize), this.frame.origin.y + (yIndex * blockRowSize), blockColSize, blockRowSize);
                    }
                }
                catch(error) {
                }
            });
        });
    }

    drawBackground() {
        var blockColSize = (this.frame.size.width / this.board[0].length);
        var blockRowSize = (this.frame.size.height / this.board.length);
        var ctx = this.canvas.getContext("2d");
        this.board.forEach((element, yIndex) => {
            element.forEach((value, xIndex) => {
                try {
                    var color = BackgroundGridColor;
                    ctx.strokeStyle = color;
                    ctx.strokeRect(this.frame.origin.x + (xIndex * blockColSize), this.frame.origin.y + (yIndex * blockRowSize), blockColSize, blockRowSize);
                }
                catch(error) {
                }
            });
        });
    }
}