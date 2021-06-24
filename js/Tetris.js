const displayArea = document.getElementById("display_area");
const otherUsersArea = document.getElementById("other_users_area");

const LevelUpTime = 5 * 1000;    // 10초마다 테트리스 레벨 증가
const NextBlockCount = 5;   // 다음에 나올 블럭 개수 5개까지 보여줌
const MaxBottomMoveTime = 4 * 1000;  // 블럭 하단에 장애물이 있어 내려가지 못할 때 특정시간동안 움직일수 있게 하기위해 선언
const MaxDropWatingTime = 0.7 * 1000;   // 블럭이 하단에 도착했을 때 사용자 편의성을 위해 잠시 대기함
const GameTimerInterval = 0.005 * 1000;  // Game Timer 5ms 마다 호출

class Tetris {
    constructor() {
        this.tetrisCanvasViewer = new TetrisCanvasViewer(mainCanvas, new Frame(0, 0, MainCanvasWidth, MainCanvasHeight));   // 실제 게임역을 그릴 viewer
        this.nextBlockCanvasViewer = new TetrisCanvasViewer(nextBlockCanvas, new Frame(0, 0, NextBlockCanvasWidth, NextBlockCanvasHeight)); // 다음에 나올 블록 영역을 그릴 viewer
        this.holdBlockViewer = new TetrisCanvasViewer(holdBlockCanvas, new Frame(0, 0, HoldBlockCanvasWidth, HoldBlockCanvasHeight));   // 홀드한 블럭을 그릴 viewer
        this.holdBlockViewer.setIsDrawBackground(false);    // Background 를 그리지 않음
        this.boardManager = new BoardManager();
        this.init();
        this.pieces = new Array();  // 테트리스 블록 저장소
        this.gameTimer = undefined;
    }

    // 게임 리셋
    reset() {
        this.boardManager.clear();
        this.init();
    }

    // 초기화
    init() {
        this.pieces = [];
        this.addOneCyclePiece();
        this.gameState = GameState.Wating; // 게임 상태
        this.score = 0; // 점수
        this.dropTime = undefined; // 특정 시간마다 블럭을 1칸씩 내리기위해 시간 저장
        this.dropWatingTime = undefined;    // 블럭이 하단으로 더이상 내려갈 수 없을 때 잠시 대기(사용자 편의성)
        this.bottomMoveTime = undefined;    // 하단에 장애물이 있어 내려가지 못할 때 방향키를 조작시 특정 시간동안 움직일수 있게 하기위해 선언
        this.animationId = undefined;   // animation id
        this.levelTime = undefined // 10초마다 레벨을 1씩 증가시키기 위한 타이머
        this.level = MinLevel;  // 현재 테트리스 레벨
        this.holdPiece = undefined; // 테트리스 hold Piece
        this.useHold = false;   // 홀드 기능을 사용 했는지 여부

        // 아래 변수들은 Piece의 움직임을 직접 관리하기위해 선언한 변수들
        this.acceleration = MinPieceMoveLevel;
        this.isRotated = false; // KeyDown 이벤트가 여러번 들어올 때 한번만 회전시키기 위하여 선언
        this.isMovingToLeft = false;    // 왼쪽으로 움직이고있는중
        this.isMovingToRight = false;   // 오른쪽으로 움직이고 있는중
        this.movingLeftTime = undefined;
        this.movingRightTime = undefined;
        this.movingDropTime = undefined;
        this.isMovingDrop = false;    // 아래로 움직이는중
        this.lastKeyCode = undefined;   // 오른쪽과 왼쪽이 동시에 눌린 상태일 때 마지막으로 누른값을 저장
        if (this.gameTimer != undefined) {
            clearInterval(this.gameTimer);
            this.gameTimer = undefined;
        }
    }

    // 한 사이클에 해당하는 테트로미노 블럭 생성하기 (테트리스는 한 주기의 테트로미노 블록이 주기적으로 나온다)
    addOneCyclePiece() {
        var array = PieceFactory.CreateOneCycleTetromino();
        array.forEach(element => {
            this.pieces.push(element);
        });
    }

    // 게임 시작
    start() {
        this.reset();
        if (this.animationId != undefined) {
            cancelAnimationFrame(this.animationId);
        }
        this.dropWatingTime = Date.now();
        this.levelTime = Date.now();
        this.dropTime = Date.now();
        this.setRandomPiece();
        this.gameState = GameState.Playing;
        this.animate();
        this.gameTimer = setInterval(() => this.gameTimer2(), GameTimerInterval);
    }

    // Game Timer
    gameTimer2() {
        // 하단버튼을 누르고 있거나 회전중인 경우 경우 블록이 자동으로 내려가지 않음
        if (this.isMovingDrop == false || this.isRotated == true) {
            // 특정 시간마다 블럭을 1칸씩 아래로 내림
            var levelDiff = levels.find((item) => item.level === this.level).timeDiff;  // 현재 레벨에 해당하는 시간 가져오기
            if((Date.now() - this.dropTime) > levelDiff) {
                this.dropTime = Date.now();
                if (this.boardManager.canDrop() == false) {
                    if (this.isMovingToLeft == true || this.isMovingToRight == true) {
                        // 블록 하단에 무언가 있는데 블록을 조정중이면 특정시간동안 움직일 수 있게 설정
                        if ((Date.now() - this.bottomMoveTime) > MaxBottomMoveTime) {
                            this.bottomMoveTime = Date.now();
                            this.drop();
                        }
                    } else {
                        if ((Date.now() - this.dropWatingTime) > MaxDropWatingTime) {
                            this.drop();
                        }
                    }
                } else {
                    this.bottomMoveTime = Date.now();
                    this.drop();
                }
            }  
        }

        // 레벨 증가
        var levelUpTimeDiff = Date.now() - this.levelTime
        if (levelUpTimeDiff > LevelUpTime) {
            if (this.level < MaxLevel)
                this.level++;

            this.levelTime = Date.now();
        }

        // 아래
        if (this.isMovingDrop == true) {
            this.dropTime = Date.now();
            if (this.boardManager.canDrop() == true) {
                // 드랍이 가능한 경우 하단으로 그냥 드랍
                if ((Date.now() - this.movingDropTime) > PieceMoveTime[MaxPieceMoveLevel]) {
                    this.movingDropTime = Date.now();
                    this.drop();
                }
            } else {
                // 블록이 하단으로 더이상 불가능한경우 잠시동안 기다려줌
                if ((Date.now() - this.dropWatingTime) > MaxDropWatingTime) {
                    this.drop();
                }
            }
        }

        // 위(회전)
        if (this.isRotated == true) {
            this.dropTime = Date.now();
        }
        
        
        if ((this.isMovingToLeft == true) && this.isMovingToRight == false) {   // 왼쪽
            if ((Date.now() - this.movingLeftTime) > PieceMoveTime[this.acceleration]) {
                this.movingLeftTime = Date.now();
                this.moveLeft();
                if (this.acceleration < MaxPieceMoveLevel) {
                    this.acceleration++;
                }
            }
        } else if ((this.isMovingToLeft == false) && (this.isMovingToRight == true)) { // 오른쪽
            if ((Date.now() - this.movingRightTime) > PieceMoveTime[this.acceleration]) {
                this.movingRightTime = Date.now();
                this.moveRight();
                if (this.acceleration < MaxPieceMoveLevel) {
                    this.acceleration++;
                }
            }
        } if ((this.isMovingToLeft == true) && (this.isMovingToRight == true)) {    // 왼쪽과 오른쪽이 동시에 눌린 상태
            switch(this.lastKeyCode) {
                case Key.RIGHT: // 오른쪽 이동
                    if ((Date.now() - this.movingRightTime) > PieceMoveTime[this.acceleration]) {
                        this.movingRightTime = Date.now();
                        this.moveRight();
                        if (this.acceleration < MaxPieceMoveLevel) {
                            this.acceleration++;
                        }
                    }
                    break;
                case Key.LEFT:  // 왼쪽이동
                    if ((Date.now() - this.movingLeftTime) > PieceMoveTime[this.acceleration]) {
                        this.movingLeftTime = Date.now();
                        this.moveLeft();
                        if (this.acceleration < MaxPieceMoveLevel) {
                            this.acceleration++;
                        }
                    }
                    break;
            }
        }
    }
    
    // 애니메이션 Timer
    animate(){
        if (this.gameState != GameState.Playing) {
            return;
        }

        // 화면 그리기
        this.mainDisplayDraw();
        //this.otherUSerDisplayDraw();
        this.holdBlockDraw();
        this.nextBlockDraw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // 화면 그리기
    mainDisplayDraw() {
        var boardData = this.boardManager.getDisplayBoard();
        this.tetrisCanvasViewer.clear();
        this.tetrisCanvasViewer.setBoard(boardData);
        this.tetrisCanvasViewer.draw();
    }

    otherUSerDisplayDraw() {
        // 아래 코드는 테스트
        var boardData = this.boardManager.getDisplayBoard();
        var otherUserView = new TetrisCanvasViewer(otherUserCanvas, new Frame(15, 0, OtherUserCanvasWidth / 5, OtherUserCanvasHeight - 100));
        otherUserView.setFrame(new Frame(15, 0, OtherUserCanvasWidth / 5, OtherUserCanvasHeight - 100));
        otherUserView.setIsDrawBackground(true);
        otherUserView.setCanvas(otherUserCanvas);
        otherUserView.clear();
        otherUserView.setBoard(boardData);
        otherUserView.draw();

        otherUserView.setFrame(new Frame((OtherUserCanvasWidth / 5) + 30, 0, (OtherUserCanvasWidth / 5), OtherUserCanvasHeight - 100));
        otherUserView.setIsDrawBackground(true);
        otherUserView.setCanvas(otherUserCanvas);
        otherUserView.clear();
        otherUserView.setBoard(boardData);
        otherUserView.draw();
    }

    // 홀드한 블럭 그리기
    holdBlockDraw() {
        this.holdBlockViewer.clear();
        if (this.holdPiece == undefined) {
            return;
        }
        this.holdBlockViewer.setIsDrawBackground(false);
        this.holdBlockViewer.setBoard(this.holdPiece.displayShape); // 홀드한 블럭의 형상을 넘겨줌
        this.holdBlockViewer.draw();
    }

    // 다음에 나올 블럭 영역 그리기
    nextBlockDraw() {
        var boardData = new Array();
        for(var index = 0; index < NextBlockCount; index++) {
            var tempPiece = this.pieces[index];
            for (var row = 0; row < tempPiece.displayShape.length; row++) {
                boardData.push(tempPiece.displayShape[row]);    // 다음에 나올 블록을 추가
            }
        }

        this.nextBlockCanvasViewer.clear();
        this.nextBlockCanvasViewer.setBoard(boardData);
        this.nextBlockCanvasViewer.draw();
    }

    // 새로운 Piece 추가
    setRandomPiece() {
        this.useHold = false;
        var piece = this.pieces.shift();
        if (this.boardManager.setNewPiece(piece) == false){
            this.gameState = GameState.Death;
            this.gameOver();
        }

        if (this.pieces.length <= PieceCount){
            this.addOneCyclePiece();
        }
    }

    // 게임 종료
    gameOver() {
        cancelAnimationFrame(this.animationId);
        if (this.gameTimer != undefined) {
            clearInterval(this.gameTimer);
            this.gameTimer = undefined;
        }
        alert('Game Finished');
    }

    // 아래로 1칸 이동
    drop() {
        if (this.boardManager.canDrop() == true) {
            this.boardManager.dropPiece();
        } else {
            this.boardManager.fixPiece();
            var lines = BoardExtension.getFullLineNumbers(this.boardManager.board);
            if (lines.length > 0) {
                this.boardManager.removeLines(lines);
            }
            this.setRandomPiece();
        }
        this.dropWatingTime = Date.now();
    }

    // Piece 왼쪽으로 이동
    moveLeft() {
        if (this.boardManager.canMoveLeft() == true) {
            this.boardManager.moveLeft();
        }
    }

    // Piece 오른쪽으로 이동
    moveRight() {
        if (this.boardManager.canMoveRight() == true) {
            this.boardManager.moveRight();
        }
    }

    // 키가 눌렸을때 이벤트
    onReceivedKeyDown(keyType) {
        if (this.gameState != GameState.Playing) {
            return;
        }

        switch(keyType) {
            case Key.SPACE: {
                while(this.boardManager.canDrop() == true) {
                    this.boardManager.dropPiece();
                }
                this.boardManager.fixPiece();
                var lines = BoardExtension.getFullLineNumbers(this.boardManager.board);
                if (lines.length > 0) {
                    this.boardManager.removeLines(lines);
                }
                this.setRandomPiece();
            }
                break;
            case Key.LEFT:
                if (this.isMovingToRight == true) { // 있어야하나?
                    this.isMovingToLeft = true;
                    this.movingLeftTime = Date.now();
                    if (this.lastKeyCode == undefined) {
                        this.acceleration = MinPieceMoveLevel;  // 가속도 초기화
                        this.lastKeyCode = Key.LEFT;
                    }
                    return;
                }
                if (this.isMovingToLeft == false) {
                    this.isMovingToLeft = true;
                    this.moveLeft();
                    this.movingLeftTime = Date.now();
                }
                break;
            case Key.RIGHT :
                if (this.isMovingToLeft == true) {  // 있어야하나?
                    this.isMovingToRight = true;
                    this.movingRightTime = Date.now();
                    if (this.lastKeyCode == undefined) {
                        this.acceleration = MinPieceMoveLevel;  // 가속도 초기화
                        this.lastKeyCode = Key.RIGHT;
                    }
                    return;
                }
                if (this.isMovingToRight == false) {
                    this.isMovingToRight = true;
                    this.moveRight();
                    this.movingRightTime = Date.now();
                }
                break;
            case Key.UP:
                if (this.isRotated == false) {
                    var pos = this.boardManager.canRotate();
                    if (pos != null) {
                        this.boardManager.rotate(pos);
                        this.isRotated = true;
                    }
                }
                break;
            case Key.DOWN:
                if (this.isMovingDrop == false) {
                    this.isMovingDrop = true;
                    this.drop();
                    this.movingDropTime = Date.now();
                }
                break;
            default :
                break;
        }
    }

    onReceivedKeyUp(keyType) {
        if (this.gameState != GameState.Playing) {
            return;
        }

        switch(keyType) { 
            case Key.UP:
                this.isRotated = false;
                break;
            case Key.LEFT:
                this.isMovingToLeft = false;
                this.lastKeyCode = undefined;
                this.acceleration = MinPieceMoveLevel;
                break;
            case Key.RIGHT:
                this.isMovingToRight = false;
                this.lastKeyCode = undefined;
                this.acceleration = MinPieceMoveLevel;
                break;
            case Key.DOWN:
                this.isMovingDrop = false;
                break;
            default :
            break;
        }
    }

    onReceivedKeyPress(keyType) {
        if (this.gameState != GameState.Playing) {
            return;
        }
        switch(keyType) { 
            case Key.HOLD:
            case Key.HOLD2:
                if (this.useHold == false) {
                    this.useHold = true;

                    if (this.holdPiece == undefined) {
                        // 홀드 기능을 처음 사용할 경우
                        this.holdPiece = this.boardManager.board.piece;
                        this.holdPiece.initBlockRotation();
                        this.setRandomPiece();
                    } else {
                        // 홀드 블럭이 이미 있을 경우

                        // 블럭이 회전되어있을경우 초기상태로 돌림
                        this.boardManager.board.piece.initBlockRotation();
                        this.holdPiece.initBlockRotation();

                        // 홀드블럭과 기존 블럭을 바꿈
                        var temp = this.holdPiece;
                        this.holdPiece = this.boardManager.board.piece;
                        this.boardManager.board.piece = temp;
                        this.boardManager.initPiecePos();
                    }
                }
                break;
        }
    }
}