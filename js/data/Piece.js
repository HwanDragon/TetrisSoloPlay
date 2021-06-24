class Piece {
    constructor(shape) {
        this.shape = shape;
        this.rotationIndex = 1; // 블럭 회전수 (초기형상 기억을 위해 사용)
    }

    setDisplayShape(shape) {
        // hold 사용시 hold화면에 보여질 블럭 모양
        // 기존 사용하던 블럭을 hold화면에 넣으면 회전이 된 상태로 들어가서 형상을 따로만듬
        this.displayShape = shape; 
    }

    // 블럭 회전
    rotate() {
        // 불변성을 위해 JSON으로 복사
        // 행과 열을 서로 바꾸는 반사행렬 처리
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] =  [this.shape[y][x], this.shape[x][y]];
            }
        }
        
        // 열 순서대로 뒤집는다.
        this.shape.forEach(row => row.reverse());

        this.rotationIndex++;
        if (this.rotationIndex > 4) {
            this.rotationIndex = 1;
        }
    }

    // 블럭 회전을 초기로 돌림
    initBlockRotation() {
        while(this.rotationIndex != 1) {
            this.rotate();
        }
    }
}

// 원래 클래스 파일로 따로 분리해야함
// 테트로미노 I 조각
class IPiece extends Piece {
    constructor() {
        var pieceIndex = 1;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}

// 테트로미노 J 조각
class JPiece extends Piece {
    constructor() {
        var pieceIndex = 2;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}

// 테트로미노 L 조각
class LPiece extends Piece {
    constructor() {
        var pieceIndex = 3;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}

// 테트로미노 O 조각
class OPiece extends Piece {
    constructor() {
        var pieceIndex = 4;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}

// 테트로미노 S 조각
class SPiece extends Piece {
    constructor() {
        var pieceIndex = 5;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}

// 테트로미노 T 조각
class TPiece extends Piece {
    constructor() {
        var pieceIndex = 6;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}

// 테트로미노 Z 조각
class ZPiece extends Piece {
    constructor() {
        var pieceIndex = 7;
        var model = Shapes[pieceIndex];
        super(model);
        this.setDisplayShape(DisplayShapes[pieceIndex]);
    }
}