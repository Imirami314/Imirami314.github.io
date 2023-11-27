function Enemy(map, spawnX, spawnY) {
    this.map = map
    this.spawnX = spawnX
    this.spawnY = spawnY
    this.x = spawnX
    this.y = spawnY
    this.cords = {
        x: this.x,
        y: this.y
    }

    this.foundPath = false
    this.lastPath = []
    this.moveAngle = 0
    this.curAngle = 0
}

Enemy.prototype.move = function(dx, dy) {
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)
    if (getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through) {
        this.y += dy
    }
    
    if (getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
        this.x += dx
    }
}

Enemy.prototype.isStuck = function(dx, dy) {
    if (!getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through ||
    !getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
        return true
    }
}

// Does not work - fix
/*Enemy.prototype.updatePath = function() {
    var monsterOnBlock = false
    for (var i = 0; i < mainMap.arr.length; i ++) {
        for (var j = 0; j < mainMap.arr[i].length; j ++) {
            var c = mainMap.arr[i].charAt(j)
            for (var m in monsters) {
                
                if (monsters[m].cords.x == j && monsters[m].cords.y == i &&
                    (monsters[m].cords.x != this.cords.x && monsters[m].cords.y != this.cords.y)) {
                    monsterOnBlock = true
                    break
                }
            }
            if (getBlockById(c).through) {
                if (monsterOnBlock) {
                    mainMap.grid.setWalkableAt(j, i, false)
                }  else {
                    mainMap.grid.setWalkableAt(j, i, true)
                }
            }
        }
    }
}*/

Enemy.prototype.pathToPlayer = function() {
    var curMapGrid = mainMap.grid.clone() // You need to clone before using findPath
    return finder.findPath(this.cords.x, this.cords.y, p.cords.x, p.cords.y, curMapGrid)
}

Enemy.prototype.movePathToPlayer = function() {
    if (!!this.pathToPlayer()[1] && this.pathToPlayer().length > 0) {
        this.nextPoint = {
            x: this.pathToPlayer()[1][0],
            y: this.pathToPlayer()[1][1]
        }

        var dx = this.nextPoint.x - this.cords.x
        var dy = this.nextPoint.y - this.cords.y
        
        this.moveAngle = Math.atan2(dy, dx)
        if (Math.abs(this.moveAngle - this.curAngle) > 0.1) {
            if (this.curAngle < this.moveAngle) {
                this.curAngle += 0.2
            } else {
                this.curAngle -= 0.2
            }
        }
        // if (dx != 0) {
            
        // } else {
        //     this.moveAngle = Math.PI / 2
        // }
     // console.log(Math.atan2(dy / dx))
        //console.log(this.moveAngle)
        this.move(dx * 3, dy * 3)
    }
}

// Bosses

function Darkened(map, spawnX, spawnY) {
    Enemy.call(this, map, spawnX, spawnY)
    this.name = "Darkened"
    this.damage = 10
    this.maxHealth = 250
    this.health = 250 // Default 250
	this.animatedHealth = 250
	
    this.cords = {
        x: 0,
        y: 0
    }
    this.speed = 2
    this.playerDist = 100000 // idk man
    this.playerAngle = 0
    this.tpTimer = 3
    this.scaleFactor = 1
    this.scaleShift = 1

    this.spearShift = 0

    this.phase = 1 // Default 1
    this.tpHitCount = 0
    this.tping = false

    this.hittable = true
    this.beingHit = false

    this.spikes = []

	this.phase2Played = false // Check if phase 2 cutscene has played

    this.spikeShotCooldown = 5
    this.spikeShotRoundCount = 0 // Long name lol
    this.stuck = false
}

Darkened.prototype = Object.create(Enemy.prototype)

Darkened.prototype.draw = function() {
	if (scene === "GAME") {
        if (this.phase == 1) {
		    playMusic("Darkened Battle")
        } else if (this.phase == 2) {
            playMusic("Darkened Battle Phase 2")
        }
	}
	
    // Makes it so the calculations don't divide by 0
    if ((p.x - this.x) == 0) {
        this.x -= 0.5
    }
    
    if ((p.y - this.y) == 0) {
        this.y -= 0.5
    }
    
    this.tpTimer -= 1 / (66 + (2 / 3))
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)
    this.pdx = p.x - this.x
    this.pdy = p.y - this.y
    this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
    this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) + (Math.PI) / 2 // Gives angle direction of player
    
    this.spikeX = this.x + Math.cos(this.playerAngle - Math.PI / 3.3) * 112
    this.spikeY = this.y + Math.sin(this.playerAngle - Math.PI / 3.3) * 112
    this.playerWandAngle = Math.atan2((p.y - this.spikeY), (p.x - this.spikeX))

    // this.move(this.speed * (p.x - this.x) / Math.abs(p.x - this.x), 0)
    // this.move(0, this.speed * (p.y - this.y) / Math.abs(p.y - this.y))
    
    
    if (this.map == curMap.name) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.playerAngle)
        ctx.scale(this.scaleFactor * this.scaleShift, this.scaleFactor * this.scaleShift)
        ctx.translate(-1 * this.x, -1 * this.y)
        
        // Speedy fade thing
        if (this.spearShift == 100 && !this.stuck) {
            ellipse(this.x, this.y + 10, 150, 150, "rgba(0, 0, 0, 0.3)")
            ellipse(this.x, this.y + 20, 150, 150, "rgba(0, 0, 0, 0.2)")
            ellipse(this.x, this.y + 45, 150, 150, "rgba(0, 0, 0, 0.1)")
        }

        // Body
		if (this.beingHit) {
            
			ellipse(this.x, this.y, 150, 150, "rgb(50, 0, 0)")
		} else {
        	ellipse(this.x, this.y, 150, 150, "rgb(0, 0, 0)")
		}
    
        // Eyes
        if (this.phase == 1 || this.beingHit) {
            ellipse(this.x - 30, this.y - 35, 30, 30, "rgb(255, 50, 100)")
            ellipse(this.x + 30, this.y - 35, 30, 30, "rgb(255, 50, 100)")
        } else if (this.phase == 2) {
            ellipse(this.x - 30, this.y - 35, 30, 30, "rgb(0, 50, 100)")
            ellipse(this.x + 30, this.y - 35, 30, 30, "rgb(0, 50, 100)")
        }
    
        // Arms
        if (this.phase == 1 || this.beingHit) {
            ellipse(this.x + 75, this.y, 40, 40, "rgb(125, 25, 50)")
            ellipse(this.x - 75, this.y, 40, 40, "rgb(125, 25, 50)")
        } else if (this.phase == 2) {
            ellipse(this.x + 75, this.y, 40, 40, "rgb(0, 25, 50)")
            ellipse(this.x - 75, this.y, 40, 40, "rgb(0, 25, 50)")
        }
        ctx.translate(this.x + 55, this.y)
        if (this.phase == 1) {
            ctx.rotate(- Math.PI / 10)
        } else if (this.phase == 2) {
            // ctx.rotate(- Math.PI / 15)
            ctx.rotate(0)
        }
        ctx.translate(-1 * (this.x + 55), -1 * this.y)
        ctx.translate(0, -1 * this.spearShift)
    
        // Spear thing
        if (this.phase == 1) {
            ctx.fillStyle = "rgb(110, 60, 30)"
        } else if (this.phase == 2) {
            ctx.fillStyle = "rgb(50, 50, 50)"
        }
        
        ctx.fillRect(this.x + 60, this.y - 80, 16, 180) // Center x = 63
        ctx.beginPath()
        
        if (this.phase == 1) {
            triangle(this.x + 50, this.y - 80, this.x + 68, this.y - 115, this.x + 86, this.y - 80, "rgb(255, 50, 100)")
        } else if (this.phase == 2) {
            ellipse(this.x + 68, this.y - 90, 30, 30, "rgb(0, 50, 100)")
            // for (var i = 0; i < 6; i ++) {
            //     triangle(this.x + 50, this.y - 80 + i * 15, this.x + 68, this.y - 115 + i * 15, this.x + 86, this.y - 80 + i * 15, "rgb(0, 50, 100)")
            // }
        }

        if (this.spikes.length == 0) {
            
        }
        
        ctx.restore()
        ctx.fillStyle = "rgb(0, 0, 0)"
        // ctx.fillText((this.playerWandAngle / Math.PI) + "pi", this.x + 200, this.y + 200)

        for (var i in this.spikes) {
            var s = this.spikes[i]
            if (s.moving) {
                ellipse(s.x, s.y, 30, 30, "rgb(255, 50, 100)")
            }
        }
    }
}

Darkened.prototype.update = function() {
    this.draw()
    
    if (this.health <= this.maxHealth / 2) {
        this.phase = 2
		if (!this.phase2Played) {
			scene = "DARKENED BOSS CUTSCENE PHASE 2"
			this.phase2Played = true
		}
    }

    if (this.phase == 1) {
        if (!this.tping) {
            if (this.tpTimer <= 0) {
                // this.move((p.x - this.x) / (33 + (1 / 3)), (p.y - this.y) / 100)
                this.spearShift = 100
                this.stuck = this.isStuck(this.speed * (p.x - this.x) * 5 / Math.abs(p.x - this.x), this.speed * (p.y - this.y) * 5 / Math.abs(p.y - this.y))
                this.move(this.speed * (p.x - this.x) * 5 / Math.abs(p.x - this.x), this.speed * (p.y - this.y) * 5 / Math.abs(p.y - this.y))
                if (this.playerDist <= 225) {
                    p.getHit(3)
                    this.tpTimer = 3
                }
                if (this.tpTimer <= -0.2) {
                    this.tpTimer = 3
                }
            } else {
                if (this.spearShift > 0) {
                    this.spearShift --
                }
            }
        
            if (this.tpHitCount % 10 == 0 && this.tpHitCount != 0) {
                this.tping = true
                this.tpHitCount ++
            }
        } else if (this.tping || this.playerDist >= 900) {
            this.scaleFactor -= 1 / (66 + (2 / 3))
            if (this.scaleFactor > 0) {
                this.scaleShift = 1
                this.tpTimer = 3
            } else {
                if (this.scaleShift != -1) {
                    this.x = Math.random() * curMap.getDimensions().x * 75
                    this.y = Math.random() * curMap.getDimensions().y * 75
                }
                this.scaleShift = -1
            }
    
            if (Math.abs(this.scaleFactor) >= 1) {
                this.scaleFactor = 1
                this.scaleShift = 1
                this.tping = false
            }
        }
    } else if (this.phase == 2) {
        this.spikeShotCooldown -= 1 / (66 + (2 / 3))

        if (this.tping) {
            if (this.playerDist >= 300) {
                this.move(this.speed * (p.x - this.x) * 10 / Math.abs(p.x - this.x), this.speed * (p.y - this.y) * 10 / Math.abs(p.y - this.y))
            } else {
                this.tping = false
            }
        }

        if (this.spikeShotCooldown <= 0 && !this.dead) {
            this.spikes.push({
                x: this.spikeX,
                y: this.spikeY,
                dx: Math.cos(this.playerWandAngle) * 10,
                dy: Math.sin(this.playerWandAngle) * 10,
                moving: true
            })
            this.spikeShotRoundCount ++
            if (this.spikeShotRoundCount == 5) {
                this.spikeShotCooldown = 3.5
                this.tping = true
                this.spikeShotRoundCount = 0
            } else {
                this.spikeShotCooldown = 0.4
            }
        }
        
        for (var i in this.spikes) {
            var s = this.spikes[i]
            if (s.moving) {
                s.x += s.dx
                s.y += s.dy
                if (Math.hypot(s.x - p.x, s.y - p.y) <= 30) {
                    p.getHit(2)
                    this.spikes.splice(i, 1)
                }
            }
        }
        
        // alert(this.spikes.length)
    }
}

Darkened.prototype.healthBar = function() {
	ctx.fillStyle = "rgb(150, 0, 0)"
	ctx.font = "70px serif"
    ctx.textAlign = "center"
    ctx.fillText("Darkened", width / 2, height / 9)
	
    ctx.fillStyle = "rgb(100, 100, 100)"
    ctx.roundRect(width / 8, height / 8, width * 3 / 4, 25, 10)
	ctx.fill()
    if (this.health > 0) {
        ctx.fillStyle = "rgb(150, 0, 0)"
        ctx.roundRect(width / 8, height / 8, (width * 3 / 4) * (this.animatedHealth / this.maxHealth), 25, 5)
    	ctx.fill()
    }

	if (this.health < this.animatedHealth && this.health > 0) {
		this.animatedHealth --
        this.beingHit = true
	} else {
        this.beingHit = false
    }
		
}

function Stormed(map, spawnX, spawnY) {
    Enemy.call(this, map, spawnX, spawnY)
    this.name = "Stormed"
    this.damage = 10
    this.maxHealth = 500
    this.health = 500 // Default 500
	this.animatedHealth = 500
	
    this.cords = {
        x: 0,
        y: 0
    }
    this.speed = 2
    this.moving = false
    
    this.playerDist = 69420 // Direct distance from player (I set it to 69420 because it gets updated anyway)
    this.playerAngle = 0
    this.bodyAngle = 0
    this.scaleFactor = 1
    this.scaleShift = 1
    this.swordRotation = 0

    this.phase = 1 // Default 1
    this.windMode = false // Default false
    this.windModeTimer = 20 // Countdown until windMode begins
    this.windPull = 0.1 // How fast the wind pulls the player towards the boss

    this.hitCooldown = 1
    this.hitting = false
    this.hittable = true // Can boss be hit
    this.beingHit = false // Is boss being hit
    this.hitRegistered = false // Keeps track of whether damage has already been dealth

	this.phase2Played = false // Check if phase 2 cutscene has played, Default false

    //Unused
    this.phase2MapChanged = false // Check if Stormed changed the landscape so he doesn't do it over and over again in phase 2, Default false

    this.hasBuiltIceWalls = false // Default false, keeps track of whether the phase 2 ice walls have been built yet
    this.isStunned = false // Default false

	this.absorbX = 0
	this.absorbY = 0
}

Stormed.prototype = Object.create(Enemy.prototype)

Stormed.prototype.draw = function() {
	
	this.playerDist = Math.hypot((this.x - p.x), (this.y - p.y))
    if (this.map == curMap.name) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.bodyAngle) // DEFAULT ON
        ctx.scale(this.scaleFactor * this.scaleShift, this.scaleFactor * this.scaleShift)
        ctx.translate(-1 * this.x, -1 * this.y)

        // Body
        if (this.phase == 1) {
            if (this.beingHit) {
                ctx.save()
                ctx.drawImage(images.stormedPhase2, this.x - 75, this.y - 75, 150, 150)
                //ctx.translate(Math.random() * 20, Math.random() * 20)
                ctx.restore()
            } else {
                ctx.drawImage(images.stormedPhase1, this.x - 75, this.y - 75, 150, 150)
            }
        } else if (this.phase == 2 || this.phase == 3) {
            ctx.drawImage(images.stormedPhase2, this.x - 75, this.y - 75, 150, 150)
        }

        if (this.hitting) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.translate(Math.random() * 5, Math.random() * 5)
            ctx.rotate(this.swordRotation)
            ctx.translate(- (this.x), - (this.y))
            ellipse(this.x + 75, this.y, 40, 40, "rgb(60, 245, 245)") // Right arm
            
            ctx.translate(this.x + 75, this.y)
            ctx.rotate(Math.PI / 2)
            ctx.translate(- (this.x + 75), - (this.y))
            ctx.drawImage(images.stormedSword, this.x + 50, this.y - 150, 50, 150) // Sword
            ctx.restore()
        } else {
            ellipse(this.x - 75, this.y, 40, 40, "rgb(60, 245, 245)") // Left arm
            ellipse(this.x + 75, this.y, 40, 40, "rgb(60, 245, 245)") // Right arm
            ctx.drawImage(images.stormedSword, this.x + 50, this.y - 150, 50, 150) // Sword
        }
        
        ctx.restore()
        ctx.fillStyle = "rgb(0, 0, 0)"
    }
}

Stormed.prototype.update = function() {

	// Particles (Wind)
    this.windParticles = new ParticleSystem(this.x, this.y, 10, 500, 100, 100, 100)
	if (this.windMode) {
		this.windParticles.create()
		this.windParticles.draw()
	} // Particles behind stormed
	
    this.draw()
	
    // Makes it so the calculations don't divide by 0
    if ((p.x - this.x) == 0) {
        this.x -= 0.5
    }
    
    if ((p.y - this.y) == 0) {
        this.y -= 0.5
    }

    // Update information for the boss
    this.hitCooldown -= 1 / 66.67
    if (this.phase == 2) {
        this.windModeTimer -= 1 / 66.67
    }
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)
    this.pdx = p.x - this.x
    this.pdy = p.y - this.y
    this.dirCoefX = (this.pdx / Math.abs(this.pdx)) // Gives 1 or -1 depending on whether the player is to the left or right
    this.dirCoefY = (this.pdy / Math.abs(this.pdy)) // Gives 1 or -1 depending on whether the player is above or below
    this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
    this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) + (Math.PI) / 2 // Gives angle direction of player
    
    // Makes the angle pi instead of like 1835pi
    this.bodyAngle = this.bodyAngle % (Math.PI * 2)
    // this.playerAngle = this.playerAngle % (Math.PI * 2)
    // this.swordRotation = this.swordRotation % (Math.PI * 2)
    
    // Amount x and y to move at a certain angle
    this.xFactor = Math.cos(this.playerAngle)
    this.yFactor = Math.sin(this.playerAngle)

    if (this.hitting) { // Attack animation
        if (this.phase == 1) {
            this.swordRotation -= Math.PI / 50 // Rotates to the left
        } else if (this.phase == 3) {
            this.swordRotation -= Math.PI / 33.33 // Rotates to the left
        }

        // Hurts the player on hit, but only if Stormed is facing the right direction
        // if (Math.abs(this.playerAngle - this.bodyAngle) <= Math.PI / 2 && this.playerDist <= 150) {
        //     p.getHit(5)
        // }

        // If sword even touches player at all, it deals damage
        if (Math.abs((this.playerAngle) - (this.bodyAngle + this.swordRotation + Math.PI / 2)) <= Math.PI / 10 && this.playerDist <= 150) {
            if (!this.hitRegistered) { // Prevents damage from being dealt more than once
                p.getHit(5)
                this.hitRegistered = true
            }
        }
        
        if (this.swordRotation <= - Math.PI) { // Ends hit when it gets far enough
            this.swordRotation = 0 // Reset sword position
            this.hitCooldown = 1
            this.hitting = false
            this.hitRegistered = false
        }
    }

    if (this.windModeTimer <= 0) {
        this.windMode = true
        // Wind mode is on until windModeTimer reaches a certain negative number, then it resets and wind mode ends
    }

    if (this.phase == 1 || this.phase == 3) {
        if (!this.hitting) { // Makes Stormed always face towards the player, but freeze when hitting
            this.bodyAngle = this.playerAngle
        }
        
        // Moves the boss, but prevents the boss from shaking while moving (moves only when not hitting)
        if (!this.hitting && this.playerDist > 100) {
            this.moving = true
            if (Math.abs(this.pdx) >= 10) {
                this.move(this.dirCoefX * this.speed, 0)
            }
    
            if (Math.abs(this.pdy) >= 10) {
                this.move(0, this.dirCoefY * this.speed)
            }
        } else {
            this.moving = false
        }
        
        
        
        // If the player is close enough, hit them if the hit is recharged
        if (this.playerDist <= 150 && this.hitCooldown <= 0) {
            this.hitting = true
        }

        if (this.health <= this.maxHealth / 2 && !this.phase2Played) {
			cutsceneFrame = 0
            this.phase = 2
        }
    } else if (this.phase == 2) {
        if (this.phase2Played) {
            if (!this.windMode) {
                
            } else if (this.windMode) {
                this.doWindMode()

            }
        } else {
            scene = "STORMED BOSS CUTSCENE PHASE 2"
            this.phase2Played = true
            this.windMode = true
            this.x = 13 * 75 + 37.5
            this.y = 15 * 75 + 37.5
            p.goTo(13 * 75 + 37.5, 21 * 75 + 37.5)
        }
    }
}

Stormed.prototype.doWindMode = function() {
    if (!this.hasBuiltIceWalls) {
        // Builds ice wall around Stormed at the start of windMode
        curMap.changeBlock(this.cords.x - 1, this.cords.y - 1, 'I')
        curMap.changeBlock(this.cords.x, this.cords.y - 1, 'I')
        curMap.changeBlock(this.cords.x + 1, this.cords.y - 1, 'I')
        curMap.changeBlock(this.cords.x - 1, this.cords.y, 'I')
        curMap.changeBlock(this.cords.x + 1, this.cords.y, 'I')
        curMap.changeBlock(this.cords.x - 1, this.cords.y + 1, 'I')
        curMap.changeBlock(this.cords.x, this.cords.y + 1, 'I')
        curMap.changeBlock(this.cords.x + 1, this.cords.y + 1, 'I')
        this.hasBuiltIceWalls = true
    } else {
        // Check if any of the walls are broken
        if (curMap.getBlock(this.cords.x - 1, this.cords.y - 1) == '~' ||
                curMap.getBlock(this.cords.x, this.cords.y - 1) == '~' ||
                curMap.getBlock(this.cords.x + 1, this.cords.y - 1) == '~' ||
                curMap.getBlock(this.cords.x - 1, this.cords.y) == '~' ||
                curMap.getBlock(this.cords.x + 1, this.cords.y) == '~' ||
                curMap.getBlock(this.cords.x - 1, this.cords.y + 1) == '~' ||
                curMap.getBlock(this.cords.x, this.cords.y + 1) == '~' ||
                curMap.getBlock(this.cords.x + 1, this.cords.y + 1) == '~') {
            // this.beStunned()
            this.phase = 3
            this.windMode = false
        }
    }
    this.bodyAngle += Math.PI / 25
    p.manualMove(-1 * Math.cos(this.playerAngle - Math.PI / 2) * this.windPull, -1 * Math.sin(this.playerAngle - Math.PI / 2) * this.windPull) // Pulls the player towards Stormed
    if (this.windPull <= 8) { // Accelerate speed that player gets pulled in, caps at 8 pixels/frame
        this.windPull *= 1.01
    }

    if (this.playerDist <= 85) { // If the player gets sucked in too much, they take damage
        p.health -= 1 / 6.66 // (10dps)
    }

    if (this.windModeTimer <= -10) { // Wind mode lasts for 10 seconds
        this.resetWindMode()
    }
}

Stormed.prototype.resetWindMode = function() {
    this.windModeTimer = 20
    this.windPull = 0.1
}

// Stormed.prototype.beStunned = function () {
//     this.windMode = false
//     this.resetWindMode()
// }

Stormed.prototype.healthBar = function() {
	ctx.fillStyle = "rgb(150, 0, 0)"
	ctx.font = "70px serif"
    ctx.textAlign = "center"
    ctx.fillText("Stormed", width / 2, height / 9)
	
    ctx.fillStyle = "rgb(100, 100, 100)"
    ctx.roundRect(width / 8, height / 8, width * 3 / 4, 25, 10)
	ctx.fill()
    if (this.health > 0) {
        ctx.fillStyle = "rgb(150, 0, 0)"
        ctx.roundRect(width / 8, height / 8, (width * 3 / 4) * (this.animatedHealth / this.maxHealth), 25, 5)
    	ctx.fill()
    }

	if (this.health < this.animatedHealth && this.health > 0) {
		this.animatedHealth --
        this.beingHit = true
	} else {
        this.beingHit = false
    }
		
}

// Monsters

function Splint(map, spawnX, spawnY) { // Idk what to call it man
    Enemy.call(this, map, spawnX, spawnY)
    this.damage = 2
    this.maxHealth = 20
    this.health = 20
    this.cords = {
        x: 0,
        y: 0
    }
    this.speed = 1
    this.playerDist = 10000 // Gets updated by the draw method
    this.agroDist = 500
    this.deAgroDist = 3500
    this.agro = false
    // this.pathToPlayer = null;
    
    this.weaponPos = 0
    this.hitting = false
    this.isHit = false
    this.hitCooldown = 1

    this.dead = false
}

Splint.prototype = Object.create(Enemy.prototype)

Splint.prototype.draw = function(p) {
    this.cords.x = Math.floor(this.x / 75)
    this.cords.y = Math.floor(this.y / 75)
    this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
    this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x))

    if (this.health <= 0 && !this.dead) {
        this.dead = true
        var trillsChanceGenerator = Math.random() 
        if (trillsChanceGenerator <= 0.15) {
            p.trills += Math.round(Math.random() + 5)
        }
    }

    if (this.agro && this.playerDist >= 90 && !this.hitting) {
        // this.move(Math.cos(this.playerAngle) * 2, Math.sin(this.playerAngle) * 2)
        //this.updatePath()
        this.movePathToPlayer()
    }

    if (this.playerDist < 100 && this.hitCooldown <= 0) {
        this.hit()
    } else {
        this.hitCooldown -= 1 / (66 + 2 / 3)
    }

    if (this.hitting) { // Once hit is started, it finishes even if player is out of range
        this.hit()
    }
    
    if (this.map == curMap.name) {
        if (this.playerDist <= this.agroDist) {
            this.agro = true
        }

        if (this.playerDist >= this.deAgroDist) {
            this.agro = false
        }
        ctx.save()
        ctx.translate(this.x, this.y)
        if (this.agro) {
            if (this.playerDist <= 100) {
                ctx.rotate(this.playerAngle - Math.PI / 2)
            } else {
                ctx.rotate(this.curAngle - Math.PI / 2)
            }
        }
        ctx.translate(- (this.x), - (this.y))
        if (!this.isHit) {
            ctx.drawImage(images.splint, this.x - 37.5, this.y - 37.5, 75, 75)
        } else {
            ctx.drawImage(images.splintHurt, this.x - 37.5, this.y - 37.5, 75, 75)
        }
        ctx.translate(this.x, this.y)
        if (this.agro) {
            ctx.rotate(this.weaponPos)
        }
        ctx.translate(- (this.x), - (this.y))
        ellipse(this.x - 32, this.y - 10, 25, 25, "rgb(40, 40, 40)")
        ellipse(this.x - 32, this.y + 10, 25, 25, "rgb(40, 40, 40)")
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(this.x - 35.5, this.y - 60, 10, 70)
        ctx.restore()
    }

    if (this.hitCooldown > 0) { // Re-adjust weapon position after a hit
        if (this.weaponPos < 0) {
            this.weaponPos += Math.PI / 66
        } else {
            this.weaponPos = 0
        }
    }

    if (this.dead) {
        for (var i in monsters) {
            if (monsters[i] == this) {
                monsters.splice(i, 1)
            }
        }
    }
}

Splint.prototype.hit = function() {
    if (this.hitCooldown <= 0) {
        this.hitting = true
        if (this.hitting) {
            this.weaponPos -= Math.PI / 28
            if (this.weaponPos <= -1 * Math.PI) {
                this.hitting = false
                this.hitCooldown = 1
                if (this.playerDist <= 100) {
                    p.getHit(2)
                }
            }
        }
    }
}


var monsters = [
    new Splint("Main Map", 4 * 75, 4 * 75),
    new Splint("Main Map", 46 * 75, 18 * 75),
    new Splint("Main Map", 47 * 75, 18 * 75),
    new Splint("Main Map", 48 * 75, 18 * 75),
    new Splint("Gale Cave", 50 * 75, 33 * 75)
]

// for (var i = 0; i < 500; i ++) {
//     monsters.push(new Splint("Main Map", mainMap.getDimensions().x * Math.random() * 75, mainMap.getDimensions().y * Math.random() * 75))
// }

var bosses = [
    new Darkened("Darkened Room", 712.5, 100),
    new Stormed("Stormed Room", 13 * 75 + 37.5, 19 * 75 + 37.5)
]