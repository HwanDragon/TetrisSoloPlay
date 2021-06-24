const PieceInitX = 3;   // 블럭 초기 x위치
const PieceInitY = 0;   // 블럭 초기 y위치
const BoradRowSize = 20;    // 보드 행 사이즈
const BoradColSize = 10;    // 보드 컬럼 사이즈

class BaseBoard {
    // board는 테트리스 판을 의미 (2차원 배열)
    constructor() {
        this.attckLines = undefined;    // 추후 사용
        this.board = new Board(BoradRowSize, BoradColSize);
    }

    // Board 초기화
    clear() {
        for (var y = 0; y < this.board.rowSize; y++) {
            for (var x = 0; x < this.board.colSize; x++) {
                this.board.data[y][x] = EmptyBlock;
            }
        }
    }

    // 블럭 위치 초기화
    initPiecePos() {
        this.board.piecePos.set(PieceInitX, PieceInitY);
    }

    // 새로운 조각 추가
    setNewPiece(piece) {
        this.initPiecePos();
        var isEmptySpace = true;   // 일자블럭이 한칸 아래에서 시작해서 블럭 가장 위졲이 공백이면 한칸 올려서 시작
        for (var index = 0; index < piece.shape[0].length; index++) {
            if (piece.shape[0][index] != EmptyBlock) {
                isEmptySpace = false;
            }
        }

        if (isEmptySpace == true) {
            this.board.piecePos.set(PieceInitX, PieceInitY - 1);
        }

        this.board.piece = piece;
        if (BoardExtension.isOverlaped(this.board, this.board.piece, this.board.piecePos.x, this.board.piecePos.y) == true) {
            return false;   
        }
        return true;
    }

    getDisplayBoard() {
        var pos = BoardExtension.getPreviewPiecePos(this.board, this.board.piece, this.board.piecePos.x, this.board.piecePos.y);
        return this.board.getDisplayData(pos);
    }

    // 라인 지우기
    removeLines(yPosArray) {
        var temp = new Array;

        // 삭제해야 할 행 빈 블럭으로 채우기
        yPosArray.forEach(element => {
            for(var x = 0; x < this.board.data[element].length; x++) {
                this.board.data[element][x] = EmptyBlock;
            }
        });

        // 삭제된 행을 제외한 나머지행 temp에 집어넣기
        for (var y = this.board.rowSize - 1; y >= 0; y--) {
            var findDeleteRow = false;
            yPosArray.forEach(index => {
                if (index == y) {
                    findDeleteRow = true;
                }
            });

            if (findDeleteRow == false) {
                temp.unshift(this.board.data[y]);
            }
        }

        // 삭제된 행도 추가하여 행 개수 맞춰주기
        yPosArray.forEach(element => {
            temp.unshift(this.board.data[element]);
        });

        this.board.data = temp;
    }

    // 상대가 공격했을 떄 생기는 하단 라인
    createAttckLine(lineCount) {
        var emptyBlockPos = Math.floor(Math.random() * this.board.colSize);  // 0 ~ (colSize - 1) 사이의 난수 발생
        var attackLine = Array(this.board.colSize).fill(AttackBlock);
        attackLine[emptyBlockPos] = 0;

        for (var index = 0; index < lineCount; index++) {
            this.board.data.push(attackLine);
        }
    }

    // Piece를 Board에 채움
    fixPiece () {
        for (var y = this.board.piecePos.y; y < this.board.piecePos.y + this.board.piece.shape.length; y++) {
            for (var x = this.board.piecePos.x; x < this.board.piecePos.x + this.board.piece.shape[0].length; x++) {
                try {
                    if (this.board.piece.shape[y - this.board.piecePos.y][x - this.board.piecePos.x] != EmptyBlock) // Piece의 shape중 빈 데이터가 아닌 부분만 채워넣음
                        this.board.data[y][x] = this.board.piece.shape[y - this.board.piecePos.y][x - this.board.piecePos.x];
                }
                catch(e) {
                }
            }
        }
    }
}
