function Interactive(map, x, y, key, name, draw, action) {
    this.map = map
    this.x = x
    this.y = y
    this.key = key
    this.name = name
    this.draw = draw
    this.action = action
    this.cutsceneOn = false
}

/**
 * Create toggle
 * @param {*} map Map to place toggle
 * @param {*} x x block coordinate
 * @param {*} y y block coordinate
 * @param {*} action1 function to run when block is toggled back to yellow state
 * @param {*} action2 function to run when block is toggled into purple state
 * @param {*} cameraX OPTIONAL: x position to send the camera to for the mini cutscene
 * @param {*} cameraY OPTIONAL: y position to send the camera to for the mini cutscene
 */
function Toggle(map, x, y, action1, action2, cameraX, cameraY) {
    this.map = map
    this.x = x
    this.y = y
    this.toggleCooldown = 0.5
    this.action1 = action1
    this.action2 = action2
    this.cameraX = cameraX
    this.cameraY = cameraY

   //  this.cutscene = null
    this.toggleState = 1

    this.cords = {
        x: this.x,
        y: this.y
    }
}

Toggle.prototype.draw = function() {
    this.cords.x = this.x // creating coords for consistency on finding toggles
    this.cords.y = this.y
    this.toggleCooldown -= 1 / (66 + (2 / 3))
    if (getBlockInfoByCords(this.x * 75, this.y * 75).id != 'I' && getBlockInfoByCords(this.x * 75, this.y * 75).id != 'i') {
        if (this.toggleState == 2) {
            ellipse(ctr(this.x), ctr(this.y), 55, 55, "rgb(100, 10, 175)")
        } else {
            ellipse(ctr(this.x), ctr(this.y), 55, 55, "rgb(255, 255, 0)")
        }
    }
}

Toggle.prototype.activate = function() {
    if (!p.inRaft && keys.space && this.toggleCooldown <= 0 && p.cords.x == this.x && p.cords.y == this.y) {
        playSound("Toggle")
        if (!!this.cameraX && !!this.cameraY) {
            cameraStart(this.cameraX, this.cameraY, 100, "AUTO", {
                time: 3250
            })
            
            if (this.toggleState == 2) {
                this.toggleState = 1
                setTimeout(() => {
                    this.action1()
                }, 1500)
            } else {
                this.toggleState = 2
                setTimeout(() => {
                    this.action2()
                }, 1500)
            }
        } else {
            if (this.toggleState == 2) {
                this.toggleState = 1
                this.action1()
            } else {
                this.toggleState = 2
                this.action2()
            }
        }
        
        this.toggleCooldown = 0.5
    }
}

function MultiToggle(map, x, y, changeX, changeY, blocks) {
	this.map = map;
	this.x = x;
	this.y = y;
	this.toggleCooldown = 0.5
	this.changeX = changeX;
	this.changeY = changeY;
	this.blocks = blocks;
	this.toggleNum = 0 // Hasn't been pressed yet

    this.cords = {
        x: this.x,
        y: this.y
    }
    

    
}

MultiToggle.prototype.draw = function () {
    this.cords.x = this.x // creating coords for consistency on finding toggles
    this.cords.y = this.y

	this.toggleCooldown -= 1 / (66 + (2 / 3))
	ellipse(ctr(this.x), ctr(this.y), 55, 55, "rgb(66, 135, 245)")
	
	if (this.toggleNum != 0 && this.toggleNum != this.blocks.length) {
		ctx.fillStyle = 'rgb(0, 0, 0)'
		ctx.fillText(this.toggleNum, ctr(this.x), ctr(this.y))
	}
	
}

MultiToggle.prototype.activate = function () {
	if (keys.space && this.toggleCooldown <= 0 && p.cords.x == this.x && p.cords.y == this.y) {
		if (this.toggleNum > this.blocks.length - 1) {
			this.toggleNum = 0
		}
		this.toggleNum ++
		this.toggleCooldown = 0.5
		this.map.changeBlock(this.changeX, this.changeY, this.blocks[this.toggleNum - 1])
	}
}

function LockToggle(map, x, y, action) { // Can only press this toggle once
	this.map = map;
	this.x = x;
	this.y = y;
	this.action = action
	this.locked = false
	
    this.cords = {
        x: this.x,
        y: this.y
    }
}

LockToggle.prototype.draw = function() {
    this.cords.x = this.x
    this.cords.y = this.y
    if (!this.locked) {
        ellipse(ctr(this.x), ctr(this.y), 55, 55, "rgb(255, 0, 0)")
    } else {
        ellipse(ctr(this.x), ctr(this.y), 55, 55, "rgb(0, 255, 0)")
    }
}

LockToggle.prototype.activate = function() {
    if (keys.space && p.cords.x == this.x && p.cords.y == this.y && !this.locked) {
        this.action()
		
		this.locked = true
    }
}

/**
 * An interactive that quickly transports a player to another location
 * @param {*} map Map that the Breezeway is in
 * @param {*} x The x BLOCK coordinate that it is on
 * @param {*} y The y BLOCK coordinate that it is on
 * @param {*} tpx The x BLOCK coordinate to teleport to
 * @param {*} tpy The y BLOCK coordinate to teleport to
 */
function Breezeway(map, x, y, tpx, tpy) {
    this.map = map
    this.x = x
    this.y = y
    this.tpx = tpx
    this.tpy = tpy

    this.centerRotation = 0

    this.cooldown = 1
    this.cords = {
    x: this.x,
        y: this.y
    }
}

Breezeway.prototype.draw = function() {

    this.cords.x = this.x
    this.cords.y = this.y

    this.centerRotation += Math.PI / 66.67

    ctx.drawImage(images.breezewayBase, this.x * 75, this.y * 75, 75, 75)
    ctx.drawImage(images.breezewayCenter, this.x * 75, this.y * 75, 75, 75)
}

Breezeway.prototype.update = function() {
    this.cooldown -= 1 / 66.67
}

Breezeway.prototype.activate = function() {
    if (keys.space && p.on(this.x, this.y) && this.cooldown <= 0) {
        
        setTimeout(() => {
            p.goTo(ctr(this.tpx), ctr(this.tpy))
        }, 1500)

        cameraStart(ctr(this.tpx), ctr(this.tpy), 15, "AUTO", {
            time: 3250
        })

        this.cooldown = 1
    }
}


function Raft(map, x /* Pixels */, y /* Pixels */) {
    this.map = map
    this.x = x // X and Y are the position of the center of the raft
    this.y = y
    this.hasPlayer = false
    this.speedCap = 5.5 // Default 5.5
    this.velocity = {
        x: 0,
        y: 0
    }

    this.enterRaftCooldown = 0.3 // Starts at 0.3, but it resets to 1 each time
}

Raft.prototype.draw = function() {
    ctx.fillStyle = "rgb(75, 55, 25)"
    ctx.fillRect(this.x - 35, this.y - 35, 70, 70)

}

Raft.prototype.move = function() {
    if (this.hasPlayer) {
        if (keys.w) {
            p.dir = 'U'
            this.velocity.y -= perSec(4)
        }
        
        if (keys.a) {
            p.dir = 'L'
            this.velocity.x -= perSec(4)
        }
        
        if (keys.s) {
            p.dir = 'D'
            this.velocity.y += perSec(4)
        }
        
        if (keys.d) {
            p.dir = 'R'
            this.velocity.x += perSec(4)
        }

        // Put a cap on velocity so it doesn't get too fast
        if (this.velocity.x > this.speedCap) {
            this.velocity.x = this.speedCap
        }

        if (this.velocity.x < -1 * this.speedCap) {
            this.velocity.x = -1 * this.speedCap
        }

        if (this.velocity.y > this.speedCap) {
            this.velocity.y = this.speedCap
        }

        if (this.velocity.y < -1 * this.speedCap) {
            this.velocity.y = -1 * this.speedCap
        }
    }

    if ((this.hasPlayer && !keys.w && !keys.a && !keys.s && !keys.d) || !this.hasPlayer) { // Slows down the raft
        this.velocity.x *= 0.99 // Runs 66.67 times every second so...
        this.velocity.y *= 0.99

        if (Math.abs(this.velocity.x) < 0.2 && Math.abs(this.velocity.y) < 0.2) { // Make it so that the raft doesn't keep moving infinitely small amounts
            this.velocity.x = 0
            this.velocity.y = 0
        }
    }

    

    // Check if block is solid, bounces if so
    if (!getBlockInfoByCords(this.x + this.velocity.x, this.y).through) {
        console.log("raft bounce x")
        this.hitIce()
        this.x -= this.velocity.x * 2
        this.velocity.x *= -0.6
    }
    
    if (!getBlockInfoByCords(this.x, this.y + this.velocity.y).through) {
        console.log("raft bounce y")
        this.hitIce()
        this.y -= this.velocity.y * 2
        this.velocity.y *= -0.6
    }

    // Make sure raft is on water, lava, or speedy snow
    if (getBlockInfoByCords(this.x, this.y).id != "~" &&
            getBlockInfoByCords(this.x, this.y).id != "!" &&
            getBlockInfoByCords(this.x, this.y).id != "^") {
        if (getBlockInfoByCords(this.x, this.y).id != "z") {
            this.x -= this.velocity.x * 2.5
            this.y -= this.velocity.y * 2.5

            this.velocity.x = 0
            this.velocity.y = 0
        } else { // Deceleration is way slower on speedy snow
            this.velocity.x *= 0.998
            this.velocity.y *= 0.998
        }
    }
    
}

Raft.prototype.update = function() {
    this.enterRaftCooldown -= 1 / 66.67
    
    this.draw()
    this.move()

    this.x += this.velocity.x
    this.y += this.velocity.y

    if (this.hasPlayer) { // Keep player's position in the boat until they get out
        p.x = this.x
        p.y = this.y
    }
}

Raft.prototype.activate = function() {
    var playerDist = Math.hypot(this.x - p.x, this.y - p.y)
    if (keys.space && playerDist <= 75 && this.enterRaftCooldown <= 0) {
        if (!this.hasPlayer && !p.inRaft) {
            this.hasPlayer = true
            p.inRaft = true
            p.canMove = false
        } else if (this.hasPlayer && p.inRaft) {
            this.hasPlayer = false
            p.inRaft = false
            p.canMove = true
            
        }
        this.enterRaftCooldown = 1
    }
}

Raft.prototype.hitIce = function() {
    // Gets the id of the block that the raft WILL be on, on the next frame
    var nextPositionBlock = getBlockInfoByCords(this.x + this.velocity.x, this.y + this.velocity.y).id

    // Gets the block coordinates that the raft WILL be on, next frame
    var nextCords = {
        x: Math.floor((this.x + this.velocity.x) / 75),
        y: Math.floor((this.y + this.velocity.y) / 75),
    }
    console.log("x: " + this.velocity.x + " y: " + this.velocity.y)
    console.log(nextPositionBlock)
    if (Math.hypot(this.velocity.x, this.velocity.y) >= 2.5) { // must be at certain speed
        if (nextPositionBlock == 'i') {
            curMap.changeBlock(nextCords.x, nextCords.y, '~')
        }

        if (nextPositionBlock == 'I') {
            curMap.changeBlock(nextCords.x, nextCords.y, 'i')
            playSound("Ice Cracks")
        }
    }
    console.log(curMap.getBlock(Math.floor(this.x / 75), Math.floor(this.y / 75)))
}


/**
 * Create raft dispenser
 * @param {*} map Map to put raft dispenser
 * @param {*} x x coordinate (pixels)
 * @param {*} y y coordinate (pixels)
 * @param {*} dsx x coordinate to place raft upon use (pixels)
 * @param {*} dsy y coordinate to place raft upon use (pixels)
 */
function RaftDispenser(map, x, y, dsx, dsy) {
    this.map = map
    this.x = x
    this.y = y

    
    this.dsx = dsx // x cord where the raft is dispensed
    this.dsy = dsy // y cord where the raft is dispensed

    this.cords = {
        x: 0,
        y: 0
    }

    this.cooldown = 1

	this.showAlert = false

	this.animateX = 0
	this.animateY = 0
	this.dispensed = false
}

RaftDispenser.prototype.draw = function() {
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)
    // Dispenser thing component
    ctx.fillStyle = "rgb(205, 125, 50)"
    ctx.fillRect(this.x, this.y, 75, 75)
	
    // Raft component
    ctx.fillStyle = "rgb(75, 55, 25)"
    ctx.fillRect(this.x + 5 + this.animateX, this.y + 5 + this.animateY, 65, 65 - (this.cooldown * 65))

	// Dispenser lid
	ctx.fillStyle = "rgba(205, 125, 50, 0.5)"
    ctx.fillRect(this.x, this.y, 75, 75)

	
	if (this.showAlert) {
		ctx.fillStyle = "rgb(255, 255, 255)"
		ctx.roundRect(p.x - 75, p.y + 50, 150, 50, 10)
		ctx.fill()
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.font = "15px serif"
		ctx.textAlign = "center"
		ctx.fillText("Press space to dispense", p.x, p.y + 75)	
	}
}

RaftDispenser.prototype.update = function() {
	if (this.cooldown > 0) {
    	this.cooldown -= 1 / (66 + (2 / 3))
	}	
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)
    this.draw()

	if (this.enableAnimation) {
		if (this.x + this.animateX + 37.5 < this.dsx) {
			this.animateX += 2.5
		} else if (this.x + this.animateX + 37.5 > this.dsx) {
			this.animateX -= 2.5
		} else if (this.y + this.animateY + 37.5 < this.dsy) {
			this.animateY += 2.5
		} else if (this.y + this.animateY + 37.5 > this.dsy) {
			this.animateY -= 2.5
		} else {
			this.dispensed = true
		}
	}
}

RaftDispenser.prototype.activate = function() {
    if (p.cords.x == this.cords.x &&
        p.cords.y == this.cords.y && 
        this.cooldown <= 0) {
		
		if (keys.space) {
			if ((this.x - (this.dsx - 37.5) == 0) || (this.y - (this.dsy - 37.5) == 0)) {
				this.enableAnimation = true
			}
		}
		
		this.showAlert = true
    } else {
		this.showAlert = false
	}

	if (this.dispensed == true) {
		interactives.push(new Raft(this.map, this.dsx, this.dsy))
		this.cooldown = 1
		this.enableAnimation = false
		this.dispensed = false
		this.animateX = 0
		this.animateY = 0
	}
}

class Rock {
    static MAX_SIZE = 100
    static DISSOLVE_SPEED = 175 // Per sec
    constructor(map, x, y) {
        this.map = map
        this.spawnX = x
        this.spawnY = y
        this.x = x
        this.y = y
        this.size = Rock.MAX_SIZE

        this.setPosOffset = false
        this.posOffset = {}

        this.pushDir = ''
        this.pushSpeedPerSec = 150
        this.rotate = 20
        
        this.drawOnTop = true
    }

    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotate * Math.PI / 180)
        ctx.translate(-1 * (this.x), -1 * (this.y))
        ctx.drawImage(images.rock, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)

        ctx.restore()
        
    }

    activate() {
        this.checkDissolve()
        this.playerDist = entityDistance(this, p)
        if (this.playerDist < 100 && !this.isDissolved()) {
            if (keys.space) {
                p.canMove = false
                p.dir = this.getPushDir()
                switch (this.getPushDir()) {
                    case 'U':
                        if (getBlockInfoByCords(this.x, this.y - perSec(this.pushSpeedPerSec) - 10).through && getBlockInfoByCords(p.x, p.y - perSec(this.pushSpeedPerSec) - 10).through) {
                            if (keys.w) {
                                p.manualMove(0, - perSec(this.pushSpeedPerSec))
                                this.y -= perSec(this.pushSpeedPerSec)
                            } else if (keys.s) {
                                p.manualMove(0, perSec(this.pushSpeedPerSec))
                                this.y += perSec(this.pushSpeedPerSec)
                            }
                        }
                        break
                    case 'D':
                        if (getBlockInfoByCords(this.x, this.y + perSec(this.pushSpeedPerSec) + 10).through && getBlockInfoByCords(p.x, p.y + perSec(this.pushSpeedPerSec) + 10).through) {
                            if (keys.w) {
                                p.manualMove(0, - perSec(this.pushSpeedPerSec))
                                this.y -= perSec(this.pushSpeedPerSec)
                            } else if (keys.s) {
                                p.manualMove(0, perSec(this.pushSpeedPerSec))
                                this.y += perSec(this.pushSpeedPerSec)
                            }
                        }
                        break
                    case 'L':
                        if (getBlockInfoByCords(this.x - perSec(this.pushSpeedPerSec) - 10, this.y).through && getBlockInfoByCords(p.x - perSec(this.pushSpeedPerSec) - 10, p.y).through) {
                            if (keys.a) {
                                p.manualMove(- perSec(this.pushSpeedPerSec), 0)
                                this.x -= perSec(this.pushSpeedPerSec)
                                this.rotate --
                            } else if (keys.d) {
                                p.manualMove(perSec(this.pushSpeedPerSec), 0)
                                this.x += perSec(this.pushSpeedPerSec)
                                this.rotate ++
                            }
                            
                        }
                        break
                    case 'R':
                        if (getBlockInfoByCords(this.x + perSec(this.pushSpeedPerSec) + 10, this.y).through && getBlockInfoByCords(p.x + perSec(this.pushSpeedPerSec) + 10, p.y).through) {
                            if (keys.a) {
                                p.manualMove(- perSec(this.pushSpeedPerSec), 0)
                                this.x -= perSec(this.pushSpeedPerSec)
                                this.rotate --
                            } else if (keys.d) {
                                p.manualMove(perSec(this.pushSpeedPerSec), 0)
                                this.x += perSec(this.pushSpeedPerSec)
                                this.rotate ++
                            }
                        }
                        break
                }
            } else {
                p.canMove = true
            }
            
        }
    }

    getPushDir() {
        let horizontalDist = Math.abs(p.x - this.x)
        let verticalDist = Math.abs(p.y - this.y)
        if (p.x <= this.x) {
            if (p.y >= this.y) {
                if (horizontalDist > verticalDist) {
                    return 'R'
                } else {
                    return 'U'
                }
            } else if (p.y < this.y) {
                if (horizontalDist > verticalDist) {
                    return 'R'
                } else {
                    return 'D'
                }
            }
        } else if (p.x > this.x) {
            if (p.y >= this.y) {
                if (horizontalDist > verticalDist) {
                    return 'L'
                } else {
                    return 'U'
                }
            } else if (p.y < this.y) {
                if (horizontalDist > verticalDist) {
                    return 'L'
                } else {
                    return 'D'
                }
            }
        }
    }

    checkDissolve() {
        if (curMap.getBlock(Math.floor(this.x / 75), Math.floor(this.y / 75)) == '~') {
            this.dissolve()
        }
    }

    dissolve() {
        this.size -= perSec(Rock.DISSOLVE_SPEED)
        if (this.size <= 0) {
            p.canMove = true
            interactives.splice(interactives.indexOf(this), 1)
        }
    }

    isDissolved() {
        if (this.size <= 0) {
            return true
        }

        return false
    }
}

class RockSwitch {
    constructor(map, blockX, blockY, onAction, offAction, cameraX, cameraY) {
        this.map = map
        this.x = b(blockX)
        this.y = b(blockY)
        this.cords = {
            x: blockX,
            y: blockY
        }
        this.onAction = onAction
        this.offAction = offAction
        this.cameraX = cameraX
        this.cameraY = cameraY


        this.state = 'off'
        this.lastRockStatus = false // Whether the rock was on in the last frame
    }

    draw() {
        if (this.state == 'off') ctx.drawImage(images.rockSwitchOff, this.x, this.y, 75, 75)
        else ctx.drawImage(images.rockSwitchOn, this.x, this.y, 75, 75)
    }

    activate() {
        if (this.isRockOn() != this.lastRockStatus) {
            this.lastRockStatus = this.isRockOn()

            if (!!this.cameraX && !!this.cameraY) {
                cameraStart(this.cameraX, this.cameraY, 100, "AUTO", {
                    time: 3250
                })

                setInterval(() => {
                    this.doSwitchAction()
                }, 1500)
            } else {
                this.doSwitchAction()
            }
        }
    }

    isRockOn() {
        for (let inter of interactives) {
            if (inter instanceof Rock) {
                let interDist = Math.hypot(this.x + 37.5 - inter.x, this.y + 37.5 - inter.y)
                if (interDist < 35) {
                    return true
                }
            }
        }

        return false
    }

    doSwitchAction() {
        if (this.state == 'on') {
            this.state = 'off'
            this.offAction()
        } else if (this.state == 'off') {
            this.state = 'on'
            this.onAction()
        }
    }
}

class RockDispenser {
    constructor(map, x, y, dsx, dsy) {
        this.map = map
        this.x = x
        this.y = y

        
        this.dsx = dsx // x cord where the rock is dispensed
        this.dsy = dsy // y cord where the rock is dispensed

        this.cords = {
            x: 0,
            y: 0
        }

        this.cooldown = 1

        this.showAlert = false

        this.animateX = 0
        this.animateY = 0
        this.dispensed = false
    }

    draw() {
        this.cords.x = Math.floor(this.x / 75)
        this.cords.y = Math.floor(this.y / 75)
        // Dispenser thing component
        ctx.fillStyle = "rgb(100, 100, 100)"
        ctx.fillRect(this.x, this.y, 75, 75)
        
        // Raft component
        ctx.fillStyle = "rgb(200, 200, 200)"
        ctx.fillRect(this.x + 5 + this.animateX, this.y + 5 + this.animateY, 65, 65 - (this.cooldown * 65))

        // Dispenser lid
        ctx.fillStyle = "rgba(50, 50, 50, 0.5)"
        ctx.fillRect(this.x, this.y, 75, 75)

        
        if (this.showAlert) {
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.roundRect(p.x - 75, p.y + 50, 150, 50, 10)
            ctx.fill()
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.font = "15px serif"
            ctx.textAlign = "center"
            ctx.fillText("Press space to dispense", p.x, p.y + 75)	
        }
    }

    update() {
        if (this.cooldown > 0) {
            this.cooldown -= 1 / (66 + (2 / 3))
        }	
        this.cords.x = Math.floor(this.x / 75)
        this.cords.y = Math.floor(this.y / 75)
        this.draw()
    
        if (this.enableAnimation) {
            if (this.x + this.animateX + 37.5 < this.dsx) {
                this.animateX += 2.5
            } else if (this.x + this.animateX + 37.5 > this.dsx) {
                this.animateX -= 2.5
            } else if (this.y + this.animateY + 37.5 < this.dsy) {
                this.animateY += 2.5
            } else if (this.y + this.animateY + 37.5 > this.dsy) {
                this.animateY -= 2.5
            } else {
                this.dispensed = true
            }
        }
    }

    activate() {
        if (p.cords.x == this.cords.x &&
            p.cords.y == this.cords.y && 
            this.cooldown <= 0) {
            
            if (keys.space) {
                if ((this.x - (this.dsx - 37.5) == 0) || (this.y - (this.dsy - 37.5) == 0)) {
                    this.enableAnimation = true
                }
            }
            
            this.showAlert = true
        } else {
            this.showAlert = false
        }
    
        if (this.dispensed == true) {
            interactives.push(new Rock(this.map, this.dsx, this.dsy))
            this.cooldown = 1
            this.enableAnimation = false
            this.dispensed = false
            this.animateX = 0
            this.animateY = 0
        }
    }
}