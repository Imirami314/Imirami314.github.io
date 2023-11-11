function Secret(x, y, map, action) {
    this.x = x
    this.y = y
    this.map = map
    this.action = action
}

Secret.prototype.activate = function() {
    this.action()
}