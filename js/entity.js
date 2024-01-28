class Entity {
    static all = []

    constructor(map, x, y) {
        this.map = map
        this.spawnX = x
        this.spawnY = y
        this.x = x
        this.y = y

        this.cords = {
            x: Math.floor(this.x / 75),
            y: Math.floor(this.y / 75),
        }
    }

    goTo(x, y) {
        this.x = x
        this.y = y
    }

    on(cordX, cordY) {
        if (this.cords.x == cordX && this.cords.y == cordY) {
            return true
        }
    
        return false
    }

    setMap(map) {
        this.map = map
    }

    move(dx, dy) {
        this.cords.x = Math.floor(this.x / 75)
        this.cords.y = Math.floor(this.y / 75)
        if (getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
            this.x += dx
        }

        if (getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through) {
            this.y += dy
        }
    }

    
}