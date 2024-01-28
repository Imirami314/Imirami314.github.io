function Entity(map, x, y) {
    this.map = map
    this.spawnX = x
    this.spawnY = y
    this.x = x
    this.y = y

    this.cords = {
        x: Math.floor(this.x / 75),
        y: Math.floor(this.y / 75),
    }

    Entity.all.push(this)
}

Entity.all = []

Entity.getAllOfType = function(type) {
    let allOfType = []
    Entity.all.forEach((e) => {
        if (e instanceof type) {
            allOfType.push(e)
        }
    })

    return allOfType
}

Entity.prototype.goTo = function(x, y) {
    this.x = x
    this.y = y
}

Entity.prototype.on = function(cordX, cordY) {
    if (this.cords.x == cordX && this.cords.y == cordY) {
        return true
    }

    return false
}

Entity.prototype.in = function(x1, y1, x2, y2) {
    if (this.cords.x >= x1 && this.cords.x <= x2 && this.cords.y >= y1 && this.cords.y <= y2) {
        return true
    }

    return false
}

Entity.prototype.move = function(dx, dy, hitBlocks) {
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)

    if (hitBlocks) {
        if (getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
            this.x += dx
        }

        if (getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through) {
            this.y += dy
        }
    } else {
        this.x += dx
        this.y += dy
    }
}

Entity.prototype.isDead = function() {
    return (this.health <= 0)
}