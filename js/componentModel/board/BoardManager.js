class BoardManager extends BaseBoard {
    constructor() {
        super();
    }

    // 회전이 가능한지 확인 (왼쪽으로 2칸, 오른쪽으로 2칸, 위로 2칸, 아래로 2칸 - 다른 테트리스 게임 확인시 회전이 불가능한 경우 왼쪽/오른쪽/위쪽/아래로 위치를 변경하여 회전함)
    canRotate() {
        var tempPiece = PieceFactory.Copy(this.board.piece);
        var tempPos = new Position(this.board.piecePos.x, this.board.piecePos.y);
        tempPiece.rotate();

        // 이동 없이 회전 가능한지 확인
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 왼쪽으로 한칸 이동시 회전 가능한지 확인
        tempPos.set(this.board.piecePos.x - 1, this.board.piecePos.y);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 왼쪽으로 두칸 이동시 회전 가능한지 확인
        tempPos.set(this.board.piecePos.x - 2, this.board.piecePos.y);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 오른쪽으로 한칸 이동시 회전 가능한지 확인
        tempPos.set(this.board.piecePos.x + 1, this.board.piecePos.y);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 오른쪽으로 두칸 이동시 회전 가능한지 확인
        tempPos.set(this.board.piecePos.x + 2, this.board.piecePos.y);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 위로 한칸 이동시 회전 가능한지 확인
        tempPos.set(this.board.piecePos.x, this.board.piecePos.y - 1);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 위로 두칸 이동시 회전 가능한지 확인
        tempPos.set(this.board.piecePos.x, this.board.piecePos.y - 2);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 하단으로 한칸 이동하여 회전 가능한지 확인 (일자블럭이 최상단에서 회전할 때)
        tempPos.set(this.board.piecePos.x, this.board.piecePos.y + 1);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        // 하단으로 두칸 이동하여 회전 가능한지 확인 (일자블럭이 최상단에서 회전할 때)
        tempPos.set(this.board.piecePos.x, this.board.piecePos.y + 2);
        if(BoardExtension.valid(this.board, tempPiece, tempPos.x, tempPos.y) == true) return tempPos;

        return null;
    }

    // 테트리스 블럭 회전
    rotate() {
        this.board.piece.rotate();
    }

    // 테트리스 블럭 회전
    rotate(pos) {
        this.board.piecePos.set(pos.x, pos.y);
        this.board.piece.rotate();
    }

    // 테트리스 블럭 왼쪽으로 이동 가능한지 확인
    canMoveLeft() {
        var tempPiece = PieceFactory.Copy(this.board.piece);
        var posX = this.board.piecePos.x - 1;
        return BoardExtension.valid(this.board, tempPiece, posX, this.board.piecePos.y);
    }

    // 테트리스 블럭 왼쪽으로 이동
    moveLeft() {
        this.board.piecePos.x--;
    }

    // 테트리스 블럭 오른쪽으로 이동 가능한지 확인
    canMoveRight() {
        var tempPiece = PieceFactory.Copy(this.board.piece);
        var posX = this.board.piecePos.x + 1;
        return BoardExtension.valid(this.board, tempPiece, posX, this.board.piecePos.y);
    }

    // 테트리스 블럭 오른쪽으로 이동
    moveRight() {
        this.board.piecePos.x++;
    }

    // 블럭 드랍 가능 여부 반환
    canDrop() {
        var tempPiece = PieceFactory.Copy(this.board.piece);
        var posY = this.board.piecePos.y + 1;
        return BoardExtension.valid(this.board, tempPiece, this.board.piecePos.x, posY);
    }

    // Piece 한칸 아래로 내리기
    dropPiece() {
        this.board.piecePos.y++;
    }
}
