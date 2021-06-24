class Frame {
    constructor(x, y, width, height) {
        this.origin = new Origin(x, y);
        this.size = new Size(width, height);
    }
}

class Origin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}