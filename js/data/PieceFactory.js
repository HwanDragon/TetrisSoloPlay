class PieceFactory {
    // 랜덤한 테트리스 조각 생성
    static CreateRandomPiece() {
        var number = Math.floor(Math.random() * PieceCount);  // 0~6사이의 난수 발생
        var piece = this.CreatePiece(number);
        return piece;
    }

    // 테트로미노 블럭 생성
    static CreatePiece(number) {
        var piece;
        switch(number) {
            case 0 :
                piece = new IPiece();
                break;
            case 1:
                piece = new JPiece();
                break;
            case 2:
                piece = new LPiece();
                break;
            case 3:
                piece = new OPiece();
                break;
            case 4:
                piece = new SPiece();
                break;
            case 5:
                piece = new TPiece();
                break;
            case 6:
                piece = new ZPiece();
                break;
            default:
                piece = null;
                break;
        }
        return piece;
    }

    // 테트로미노 1주기에 맞는 도형 배열 셍성 (테트리스는 7개의 도형이 주기를 가지고 생성됨)
    static CreateOneCycleTetromino() {
        var numbers = new Array();
        while(numbers.length < PieceCount) {
            var number = Math.floor(Math.random() * PieceCount);
            var findSameNumber = false;
            for (var index = 0; index < numbers.length; index++) {
                if (number == numbers[index]) {
                    findSameNumber = true;
                }
            }
            
            if (findSameNumber == false) {
                numbers.push(number);
            }
        }

        var pieces = new Array();
        numbers.forEach(element => {
            pieces.push(this.CreatePiece(element));
        })
        
        return pieces;
    }
    
    static Copy(piece) {
        var ySize = piece.shape.length;
        var xSize = piece.shape[0].length;
        var tempShape = Array(ySize).fill(EmptyBlock).map(() => Array(xSize).fill(EmptyBlock));
        for (var y = 0; y < ySize; y++) {
            for (var x = 0; x < xSize; x++) {
                tempShape[y][x] = piece.shape[y][x];  // 배열복사 쉽게하는법 없나?
            }
        }

        return new Piece(tempShape);
    }
}