const startButton = document.getElementById("start_button");
const mainCanvas = document.getElementById("main_display_canvas");
const otherUserCanvas = document.getElementById("other_users_canvas");
const holdBlockCanvas = document.getElementById("hold_display_canvas");
const nextBlockCanvas = document.getElementById("next_display_canvas");

var tetris = new Tetris();

function onClickStart(event) {
    startButton.blur();
    tetrisActive();
    tetris.start();
}

function init() {
    startButton.addEventListener("click", onClickStart);
}

// 테트리스 키보드 이벤트 활성화
function tetrisActive() {
    document.addEventListener('keydown', onClickKeyDown);
    document.addEventListener('keyup', onClickKeyUp);
    document.addEventListener('keypress', onClickKeyPress);
}

// 테트리스 키보드 이벤트 비활성화 (추후 채팅 및 기타 설정시 사용)
function tetrisDeactive() {
    document.removeEventListener('keydown', onClickKeyDown);
    document.removeEventListener('keyup', onClickKeyUp);
    document.removeEventListener('keypress', onClickKeyPress);
}

// Key Down 이벤트 발생시 호출
function onClickKeyDown(event) {
    tetris.onReceivedKeyDown(event.keyCode);
}

function onClickKeyUp(event) {
    tetris.onReceivedKeyUp(event.keyCode);
}

function onClickKeyPress(event) {
    Debug.console("[app::onClickKeyPress]");
    tetris.onReceivedKeyPress(event.keyCode);
}


// 초기화 실행
init();

if (mainCanvas) {
    mainCanvas.width = MainCanvasWidth;
    mainCanvas.height = MainCanvasHeight;
}

if (otherUserCanvas) {
    otherUserCanvas.width = OtherUserCanvasWidth;
    otherUserCanvas.height = OtherUserCanvasHeight;
}

if (holdBlockCanvas) {
    holdBlockCanvas.width = HoldBlockCanvasWidth;
    holdBlockCanvas.height = HoldBlockCanvasHeight;
}

if (nextBlockCanvas) {
    nextBlockCanvas.width = NextBlockCanvasWidth;
    nextBlockCanvas.height = NextBlockCanvasHeight;
}

var test = new Board();
console.log(test);