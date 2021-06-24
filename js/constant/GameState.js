/*
    게임 상태
 */
var GameState = Object.freeze(
    {
        Non : 0,    // 아무상태도 아님
        Death : 1,  // 죽은 상태
        Playing : 2,    // 게임중
        Wating : 3,     // 대기상태
        Practice : 4,   // 연습모드
    }
);
