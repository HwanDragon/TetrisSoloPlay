class Board {
    constructor(rowSize, colSize) {
        // 테트리스 조각 초기화
        this.piece = undefined; // 테트로미노 조각
        this.piecePos = new Position(PieceInitX, PieceInitY);   // Piece의 위치정보를 나타냄

        // Board 생성
        this.rowSize = rowSize;
        this.colSize = colSize;
        this.data = Array(rowSize).fill(EmptyBlock).map(() => Array(colSize).fill(EmptyBlock));    // 테트리스 데이터가 쌓일 2차원 배열(현재 조종중인 Piece 제외)
        this.displayData = Array(rowSize).fill(EmptyBlock).map(() => Array(colSize).fill(EmptyBlock));    // 보드 + 조각 (this.board + this.piece) -> 없어도 되는데 깊은 2차원배열 깊은 복사가 안됨...
    }

    setPiecePos(posX, posY) {
        this.piecePos.set(posX, posY);
    }

    // 실제 화면에 보여줄 보드 데이터 반환 (this.data와 piece정보로 생성)
    getDisplayData(previewPiecePos) {
        // 쉽게 배열값 카피하는 방법이 없나?
        for (var y = 0; y < this.rowSize; y++) {
            for (var x = 0; x < this.colSize; x++) {
                this.displayData[y][x] = this.data[y][x];
            }
        }

        // 복사한 보드에 블럭 미리보기 데이터 채워넣어 반환
        for (var y = previewPiecePos.y; y < previewPiecePos.y + this.piece.shape.length; y++) {
            for (var x = previewPiecePos.x; x < previewPiecePos.x + this.piece.shape[0].length; x++) {
                try {
                    if (this.piece.shape[y - previewPiecePos.y][x - previewPiecePos.x] != EmptyBlock) // Piece의 shape중 빈 데이터가 아닌 부분만 채워넣음
                        this.displayData[y][x] = this.piece.shape[y - previewPiecePos.y][x - previewPiecePos.x] + PreviewPieceAddValue;
                }
                catch(e) {

                }
            }
        }

        // 복사한 보드에 현재 Piece 데이터 채워넣어 반환
        for (var y = this.piecePos.y; y < this.piecePos.y + this.piece.shape.length; y++) {
            for (var x = this.piecePos.x; x < this.piecePos.x + this.piece.shape[0].length; x++) {
                try {
                    if (this.piece.shape[y - this.piecePos.y][x - this.piecePos.x] != EmptyBlock) // Piece의 shape중 빈 데이터가 아닌 부분만 채워넣음
                        this.displayData[y][x] = this.piece.shape[y - this.piecePos.y][x - this.piecePos.x];
                }
                catch(e) {

                }
            }
        }
        return this.displayData;
    }
}