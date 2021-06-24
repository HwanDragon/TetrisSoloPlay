class BoardExtension {
    
    // 특정위치의 조각과 board가 겹치는지 확인
    static isOverlaped(board, piece, posX, posY) {
        for (var y = posY; y < posY + piece.shape.length; y++) {
            for (var x = posX; x < posX + piece.shape[0].length; x++) {
                try {
                    // Piece의 shape중 빈 데이터가 아닌 부분과 Board에 블럭이 쌓여있는곳과 겹쳐있는지 확인
                    if ((piece.shape[y - posY][x - posX] != EmptyBlock) && (board.data[y][x] != EmptyBlock)) {
                            return true;    // Piece와 Board의 쌓인 조각이 겹쳐져있음
                    } 
                }
                catch(e) {

                }
            }
        }
        return false;
    }

    // 특정 조각이 board 밖으로 벗어나는지 확인
    static isEscapeBoard(board, piece, posX, posY) {
        for (var y = posY; y < posY + piece.shape.length; y++) {
            for (var x = posX; x < posX + piece.shape[0].length; x++) {
                try {
                    // Piece의  Shape중 빈 블럭이 아닌 부분이 보드 밖으로 벗어났는지 검사
                    if ((piece.shape[y - posY][x - posX] != EmptyBlock)) {
                            if (y > board.rowSize-1 || x > board.colSize-1 || y < 0 || x < 0 )
                                return true;
                    } 
                }
                catch(e) {

                }
            }
        }
        return false;
    }

    // 해당 위치에 조각이 있을 때 유효한지 판단
    static valid(board, piece, posX, posY) {
        if (BoardExtension.isOverlaped(board, piece, posX, posY) == true) {
            return false;
        }

        if (BoardExtension.isEscapeBoard(board, piece, posX, posY) == true) {
            return false;
        }
        return true;
    }

    // 블럭 미리보기 위치 반환
    static getPreviewPiecePos(board, piece, posX, posY) {
        var pos = new Position(posX, posY);
        while(BoardExtension.valid(board, piece, pos.x, pos.y) == true) {
            pos.y++;
        }
        pos.y--;
        return pos;
    }

    // 1줄 가득찬 라인 검사 (삭제될 라인)
    static getFullLineNumbers(board) {
        var lineNumbers = new Array;
        board.data.forEach(function(element, indexY) {
            var find = true;            
            element.forEach(value => {
                if (value == EmptyBlock) {
                    find = false;
                }
            });

            if (find == true) {
                lineNumbers.push(indexY);
            }
        });

        return lineNumbers;
    }
}