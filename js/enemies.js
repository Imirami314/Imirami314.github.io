function Enemy(map, spawnX, spawnY) {
    Entity.call(this, map, spawnX, spawnY)

    this.foundPath = false
    this.lastPath = []
    this.moveAngle = 0
    this.curAngle = 0
}

Enemy.prototype = Object.create(Entity.prototype)

Enemy.prototype.updatePlayerInfo = function() {
    this.pdx = p.x - this.x
    this.pdy = p.y - this.y
    this.dirCoefX = (this.pdx / Math.abs(this.pdx)) // Gives 1 or -1 depending on whether the player is to the left or right
    this.dirCoefY = (this.pdy / Math.abs(this.pdy)) // Gives 1 or -1 depending on whether the player is above or below
    this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
    this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) // Gives angle direction of player
}

Enemy.prototype.isStuck = function(dx, dy) {
    if (!getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through ||
    !getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
        return true
    }
}

Enemy.prototype.getClosestMonster = function() {
    var closest;
    var closestDist = 2147483648

    monsters.forEach((m) => {
        if (entityDistance(this, m) < closestDist && m != this) {
            closestDist = entityDistance(this, m)
            closest = m
        }
    })

    return closest
}

Enemy.prototype.pathToPlayer = function() {
    return this.pathTo(p.cords.x, p.cords.y)
}

Enemy.prototype.pathToHome = function() {
    return this.pathTo(Math.floor(this.spawnX / 75), Math.floor(this.spawnY / 75))
}

Enemy.prototype.movePathToPlayer = function() {
    this.movePathTo(p.cords.x, p.cords.y)
}

Enemy.prototype.movePathToHome = function() {
    this.movePathTo(Math.floor(this.spawnX / 75), Math.floor(this.spawnY / 75))
}

Enemy.prototype.movePathTo = function(cordX, cordY) {
    if (!!this.pathTo(cordX, cordY)[1] && this.pathTo(cordX, cordY).length > 0) {
        this.nextPoint = {
            x: this.pathTo(cordX, cordY)[1][0],
            y: this.pathTo(cordX, cordY)[1][1]
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
        
        this.move(dx * this.speed, dy * this.speed)
    }
}

class Boss extends Enemy {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)
    }

    healthBar() {
        ctx.fillStyle = "rgb(150, 0, 0)"
        ctx.font = "70px serif"
        ctx.textAlign = "center"
        ctx.fillText(this.name, width / 2, height / 9)
        
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
}

// Bosses

class Darkened extends Boss {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)

        this.name = "Darkened"
        this.damage = 10
        this.maxHealth = 250
        this.health = 250 // Default 250
        this.animatedHealth = 250

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

    draw() {
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
        // this.cords.x = Math.floor(this.x / 75)
        // this.cords.y = Math.floor(this.y / 75)
        // this.pdx = p.x - this.x
        // this.pdy = p.y - this.y
        // this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
        // this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) + (Math.PI) / 2 // Gives angle direction of player
        
        this.spikeX = this.x + Math.cos(this.playerAngle - Math.PI / 3.3) * 112
        this.spikeY = this.y + Math.sin(this.playerAngle - Math.PI / 3.3) * 112
        this.playerWandAngle = Math.atan2((p.y - this.spikeY), (p.x - this.spikeX))
    
        // this.move(this.speed * (p.x - this.x) / Math.abs(p.x - this.x), 0)
        // this.move(0, this.speed * (p.y - this.y) / Math.abs(p.y - this.y))
        
        
        if (this.map == curMap.name) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.playerAngle + Math.PI / 2)
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

    update() {
        this.draw()
        this.updatePlayerInfo()
        
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
    
            if (this.spikeShotCooldown <= 0 && !this.isDead()) {
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
        }
    }
}

class Stormed extends Boss {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)

        this.name = "Stormed"
        this.damage = 10
        this.maxHealth = 500
        this.health = 500 // Default 500
        this.animatedHealth = 500

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

        this.hasBuiltLavaWalls = false // Default false, keeps track of whether the phase 2 ice walls have been built yet
        this.isStunned = false // Default false

        this.absorbX = 0
        this.absorbY = 0
    }

    draw() {
        // this.playerDist = Math.hypot((this.x - p.x), (this.y - p.y))
        if (this.map == curMap.name) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.bodyAngle + Math.PI / 2) // DEFAULT ON
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

    update() {

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

        this.updatePlayerInfo()
        
        // Makes the angle pi instead of like 1835pi
        this.bodyAngle = this.bodyAngle % (Math.PI * 2)
        
        // Amount x and y to move at a certain angle
        this.xFactor = Math.cos(this.playerAngle)
        this.yFactor = Math.sin(this.playerAngle)
    
        if (this.hitting) { // Attack animation
            if (this.phase == 1) {
                this.swordRotation -= Math.PI / 50 // Rotates to the left
            } else if (this.phase == 3) {
                this.swordRotation -= Math.PI / 33.33 // Rotates to the left
            }
    
            // If sword even touches player at all, it deals damage
            if (Math.abs((this.playerAngle) - (this.bodyAngle + this.swordRotation + Math.PI / 2)) <= Math.PI / 10 && this.playerDist <= 150) {
                if (!this.hitRegistered) { // Prevents damage from being dealt more than once
                    p.getHit(3)
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
            if (this.phase == 3) {
                if (this.scaleFactor < 1) {
                    this.scaleFactor += 0.01
                } else {
                    this.scaleFactor = 1
                }
            }
            if (!this.hitting) { // Makes Stormed always face towards the player, but freeze when hitting
                this.bodyAngle = this.playerAngle
            }
            
            // Moves the boss, but prevents the boss from shaking while moving (moves only when not hitting)
            if (!this.hitting && this.playerDist > 100) {
                this.moving = true
                if (Math.abs(this.pdx) >= 10) {
                    this.x += this.dirCoefX * this.speed // Don't use move function so he can go through blocks
                    // this.move(this.dirCoefX * this.speed, 0)
                }
        
                if (Math.abs(this.pdy) >= 10) {
                    this.y += this.dirCoefY * this.speed
                    // this.move(0, this.dirCoefY * this.speed)
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
                    this.scaleFactor -= 0.01
                    if (this.scaleFactor <= 0) {
                        this.x = 17 * 75 + 37.5
                        this.y = 17 * 75 + 37.5
                        this.phase = 3
                    }
                    
                } else if (this.windMode) {
                    this.x = 13 * 75 + 37.5
                    this.y = 17 * 75 + 37.5
                    this.doWindMode()
                }
            } else {
                scene = "STORMED BOSS CUTSCENE PHASE 2"
                this.phase2Played = true
                this.windMode = true
                this.x = 13 * 75 + 37.5
                this.y = 17 * 75 + 37.5
                p.goTo(13 * 75 + 37.5, 21 * 75 + 37.5)
            }
        }
    }

    doWindMode() {
        if (!this.hasBuiltLavaWalls) {
            stormedRoom.changeBlocks([
                [11, 15], [11, 16], [11, 17], [11, 18], [11, 19],
                [12, 19], [13, 19], [14, 19], [15, 19],
                [15, 18], [15, 17], [15, 16], [15, 15],
                [12, 15], [13, 15], [14, 15],
            ], '!')
            this.hasBuiltLavaWalls = true
        }
        this.bodyAngle += Math.PI / 25
        p.manualMove(-1 * Math.cos(this.playerAngle - Math.PI / 2) * this.windPull, -1 * Math.sin(this.playerAngle - Math.PI / 2) * this.windPull) // Pulls the player towards Stormed
        if (this.windPull <= 8) { // Accelerate speed that player gets pulled in, caps at 8 pixels/frame
            this.windPull *= 1.01
        }
    
        if (this.windModeTimer <= -10) { // Wind mode lasts for 10 seconds
            this.resetWindMode()
        }
    }

    resetWindMode() {
        this.windModeTimer = 20
        this.windPull = 0.1
    }
}

class Drowned extends Boss {
    constructor(map, x, y) {
        super(map, x, y)

        this.name = "Drowned"
        this.damage = 10
        this.maxHealth = 900
        this.health = 400 // Default 900
        this.animatedHealth = 900

        this.speed = 1.5
        this.moving = false
        
        this.playerDist = 69420 // Direct distance from player (I set it to 69420 because it gets updated anyway)
        this.playerAngle = 0
        this.bodyAngle = 0
        this.bodyAngleChangeCounter = 0
        this.scaleFactor = 1
        this.scaleShift = 1
        this.swordRotation = 0

        this.phase = 1 // Default 1

        this.hitCooldown = 1
        this.hitting = false
        this.hittable = true // Can boss be hit
        this.beingHit = false // Is boss being hit
        this.hitRegistered = false // Keeps track of whether damage has already been dealth
        this.preppingAttack = false
        this.ringDamage = 1

        this.phase2Played = false // Check if phase 2 cutscene has played, Default false

        this.prepAngleCounter = 0 // Angle for where Drowned pulls back for a bit before hitting
        this.ringSize = 10
        this.ringOpacity = 1

        this.hasSummonedMinions = false
        this.numMinions = 0
        this.minionSummonTimer = 1
    }

    draw() {
	
        this.playerDist = Math.hypot((this.x - p.x), (this.y - p.y))
        if (this.map == curMap.name) {
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.bodyAngle + Math.PI / 2) // DEFAULT ON
            ctx.scale(this.scaleFactor * this.scaleShift, this.scaleFactor * this.scaleShift)
            ctx.translate(-1 * this.x, -1 * this.y)
    
            // Body
            if (this.phase == 1) {
                if (this.beingHit) {
                    ctx.save()
                    ctx.drawImage(images.drownedHurt, this.x - 75, this.y - 75, 150, 150)
                    ctx.restore()
                } else {
                    // Ring
                    ctx.beginPath()
                    ctx.strokeStyle = "rgba(0, 255, 255, " + this.ringOpacity + ")"
                    ctx.arc(this.x, this.y, this.ringSize / 2, 0, 2 * Math.PI, true)
                    ctx.lineWidth = 15
                    ctx.stroke()
    
                    if (!this.stunned) {
                        ctx.drawImage(images.drownedPhase1, this.x - 75, this.y - 75, 150, 150)
                    } else {
                        ctx.drawImage(images.drownedStunned, this.x - 75, this.y - 75, 150, 150)
                    }
                }
            } else if (this.phase == 2) {
                if (this.beingHit) {
                    ctx.save()
                    ctx.drawImage(images.drownedHurt, this.x - 75, this.y - 75, 150, 150)
                    ctx.restore()
                } else {
                    // Ring
                    ctx.beginPath()
                    if (this.phase == 1) {
                        ctx.strokeStyle = "rgba(0, 255, 255, " + this.ringOpacity + ")"
                    } else if (this.phase == 2){
                        ctx.strokeStyle = "rgba(191, 61, 217, " + this.ringOpacity + ")"
                    }
                    ctx.arc(this.x, this.y, this.ringSize / 2, 0, 2 * Math.PI, true)
                    ctx.lineWidth = 15
                    ctx.stroke()
    
                    ctx.drawImage(images.drownedPhase2, this.x - 75, this.y - 75, 150, 150)
                }
            }
    
            if (this.hitting) {
                // Arms and weapons
                ctx.drawImage(images.drownedScythe, this.x, this.y - 150, 105, 150) // Scythe
                if (this.phase == 1) {
                    ellipse(this.x - 85, this.y, 40, 40, "rgb(0, 50, 150)") // Left arm
                    ellipse(this.x + 85, this.y, 40, 40, "rgb(0, 50, 150)") // Right arm
                } else if (this.phase == 2) {
                    ellipse(this.x - 85, this.y, 40, 40, "rgb(150, 50, 150)") // Left arm
                    ellipse(this.x + 85, this.y, 40, 40, "rgb(150, 50, 150)") // Right arm
                }
            } else {
                ctx.drawImage(images.drownedScythe, this.x, this.y - 150, 105, 150) // Scythe
                if (this.phase == 1) {
                    ellipse(this.x - 85, this.y, 40, 40, "rgb(0, 50, 150)") // Left arm
                    ellipse(this.x + 85, this.y, 40, 40, "rgb(0, 50, 150)") // Right arm
                } else if (this.phase == 2) {
                    ellipse(this.x - 85, this.y, 40, 40, "rgb(150, 50, 150)") // Left arm
                    ellipse(this.x + 85, this.y, 40, 40, "rgb(150, 50, 150)") // Right arm
                }
            }
            
            ctx.restore()
            ctx.fillStyle = "rgb(0, 0, 0)"
        }
    }

    update() {
        this.draw()
        this.updatePlayerInfo()
        
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

        this.blockOn = curMap.getBlock(this.cords.x, this.cords.y)
        // this.cords.x = Math.floor(this.x / 75)
        // this.cords.y = Math.floor(this.y / 75)
        // this.pdx = p.x - this.x
        // this.pdy = p.y - this.y
        // this.dirCoefX = (this.pdx / Math.abs(this.pdx)) // Gives 1 or -1 depending on whether the player is to the left or right
        // this.dirCoefY = (this.pdy / Math.abs(this.pdy)) // Gives 1 or -1 depending on whether the player is above or below
        // this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
        // this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) + (Math.PI) / 2 // Gives angle direction of player
        
        // Makes the angle pi instead of like 1835pi
        this.bodyAngle = this.bodyAngle % (Math.PI * 2)
        
        // Amount x and y to move at a certain angle
        this.xFactor = Math.cos(this.playerAngle)
        this.yFactor = Math.sin(this.playerAngle)
    
        if (this.phase == 1) {
            this.phase1()
        } else if (this.phase == 2) {
            this.phase2()
        }
    }

    phase1() {
        if (!this.stunned) {
            if (!this.hitting && this.playerDist > 100 && !this.preppingAttack) {
                this.moving = true
                if (Math.abs(this.pdx) >= 10) {
                    this.move(this.dirCoefX * this.speed, 0)
                }
    
                if (Math.abs(this.pdy) >= 10) {
                    this.move(0, this.dirCoefY * this.speed)
                }
            }
            
            
    
            if (this.playerDist <= 200 && !this.preppingAttack) {
                setTimeout(() => {
                    this.hitting = true
                    this.preppingAttack = false
                }, 1500)
    
                this.preppingAttack = true
            }
        }
    
        if (this.preppingAttack) { // Slowly turn to indicate charging up attack
            this.bodyAngle += (Math.PI / 66.67) / 5
        }
    
        if (this.hitting && !this.stunned) { // Attack animation
            if (this.ringOpacity > 0) {
                this.ringSize += 20
                if (Math.abs(this.ringSize / 2 - this.playerDist) <= 10) {
                    p.getHit(this.ringDamage)
                }
                this.ringOpacity -= 2 / 66.67
            } else {
                this.hitting = false
                this.ringSize = 10
                this.ringOpacity = 1
            }
    
            if (this.bodyAngleChangeCounter < Math.PI * 2) {
                this.bodyAngle -= Math.PI / 10
                this.bodyAngleChangeCounter += Math.PI / 10
            }
        } else {
            // Stare at player
            if (!this.stunned && !this.preppingAttack) {
                this.bodyAngle = this.playerAngle
            }
            this.bodyAngleChangeCounter  = 0
        }
    
        if (this.blockOn == '!') {
            this.getStunned()
        }
    
        if (this.health <= this.maxHealth / 2) {
            this.phase = 2
            this.ringDamage = 1.15
            this.goTo(ctr(15), ctr(15))
    
            // Remove later when adding phase 2 cutscene
            curMap.changeBlocks([
                [14, 1],
                [16, 1],
                [14, 15],
                [15, 14],
                [16, 15],
                [15, 16]
            ], '~')
        }
    }

    phase2() {
        // alert(this.on(15, 15))
        if (this.on(15, 15) && this.numMinions < 3 && !this.hasSummonedMinions) {
            this.minionSummonTimer -= 1 / 66.67
            this.bodyAngle += Math.PI * 2 / 66.67
            if (this.minionSummonTimer <= 0) {
                this.summonMinion(this.x - 150 + this.numMinions * 150, this.y + 100)
                this.minionSummonTimer = 1
            }
        } else {
            this.hasSummonedMinions = true
            if (!this.hitting && this.playerDist > 100 && !this.preppingAttack) {
                this.moving = true
                if (Math.abs(this.pdx) >= 10) {
                    this.move(this.dirCoefX * this.speed, 0)
                }
    
                if (Math.abs(this.pdy) >= 10) {
                    this.move(0, this.dirCoefY * this.speed)
                }
            }
    
            this.activateMinions()
    
    
            // Attacks that Drowned itself does (just like phase 1)
            if (this.playerDist <= 200 && !this.preppingAttack) {
                setTimeout(() => {
                    this.hitting = true
                    this.preppingAttack = false
                }, 1500)
    
                this.preppingAttack = true
            }
    
            if (this.preppingAttack) { // Slowly turn to indicate charging up attack
                this.bodyAngle += (Math.PI / 66.67) / 5
            }
        
            if (this.hitting && !this.stunned) { // Attack animation
                if (this.ringOpacity > 0) {
                    this.ringSize += 20
                    if (Math.abs(this.ringSize / 2 - this.playerDist) <= 10) {
                        p.getHit(this.ringDamage)
                    }
                    this.ringOpacity -= 2 / 66.67
                } else {
                    this.hitting = false
                    this.ringSize = 10
                    this.ringOpacity = 1
                }
        
                if (this.bodyAngleChangeCounter < Math.PI * 2) {
                    this.bodyAngle -= Math.PI / 10
                    this.bodyAngleChangeCounter += Math.PI / 10
                }
            } else {
                // Stare at player
                if (!this.stunned && !this.preppingAttack) {
                    this.bodyAngle = this.playerAngle
                }
                this.bodyAngleChangeCounter  = 0
            }
        }
    
        this.displayMinions()
    }

    summonMinion(x, y) {
        var minion = new DrownedMinion("Drowned Room", x, y)
        monsters.push(minion)
        this.numMinions ++
    }

    displayMinions() {
        monsters.forEach((m) => {
            if (m instanceof DrownedMinion && !m.isDead()) {
                m.draw()
            }
        })
    }

    activateMinions() {
        monsters.forEach((m) => {
            if (m instanceof DrownedMinion && !m.isDead()) {
                m.update()
            }
        })
    }

    getStunned() {
        this.stunned = true
        this.stun()
    }

    stun() {
        setTimeout(() => {
            this.stunned = false
        }, 3000)
    }
}

// Monsters

class Splint extends Enemy {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)
        this.damage = 2
        this.maxHealth = 20
        this.health = 20
        this.speed = 2
        this.playerDist = 10000 // Gets updated by the draw method
        this.agroDist = 500
        this.deAgroDist = 1000
        this.agro = false
        
        this.weaponPos = 0
        this.hitting = false
        this.isHit = false
        this.hitCooldown = 1

        this.dead = false
        this.haveTrillsBeenAwarded = false
        this.trillAward = Math.round(Math.random() * 5)
    }

    draw() {
        // if (this.isDead() && !this.haveTrillsBeenAwarded) {
        //     var trillsChanceGenerator = Math.random() 
        //     if (trillsChanceGenerator <= 0.5) {
        //         p.trills += Math.round(Math.random() + 5)
        //     }

        //     alert("gogu")

        //     this.haveTrillsBeenAwarded = true
        // }

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

                if (this.playerDist >= this.deAgroDist * 1.5) { // Splint moves back to its home if the player gets far enough
                    this.movePathToHome()
                }
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

        if (this.isDead()) {
            for (var i in monsters) {
                if (monsters[i] == this) {
                    monsters.splice(i, 1)
                }
            }
        }
    }

    hit() {
        if (this.hitCooldown <= 0) {
            this.hitting = true
            if (this.hitting) {
                if (!this.isHit) {
                    this.weaponPos -= Math.PI / 45
                }

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
}

class Gale extends Enemy {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)
        this.damage = 2
        this.maxHealth = 20
        this.health = 20
        this.speed = 2
        this.playerDist = 10000 // Gets updated by the draw method
        this.agroDist = 500
        this.deAgroDist = 1000
        this.agro = false
        
        this.weaponPos = 0
        this.hitting = false
        this.isHit = false
        this.hitCooldown = 1

        this.dead = false
        this.wingsAwarded = false
        this.trillAward = Math.round(Math.random() * 3)
    }

    draw() {


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

                if (this.playerDist >= this.deAgroDist * 1.5) { // Splint moves back to its home if the player gets far enough
                    this.movePathToHome()
                }
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
                ellipse(this.x - 37.5, this.y - 37.5, 75, 75, "rgb(132, 211, 245)")
                //ctx.drawImage(images.splint, this.x - 37.5, this.y - 37.5, 75, 75)
            } else {
                ellipse(this.x - 37.5, this.y - 37.5, 75, 75, "rgb(132, 211, 245)")
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

        if (this.isDead()) {
            for (var i in monsters) {
                if (monsters[i] == this) {
                    monsters.splice(i, 1)
                }
            }
        }
    }

    onKill() {
        if (this.isDead() && !this.wingsAwarded) {
            p.giveItem(items.galeWing) 
            this.wingsAwarded = true
        } 
    }

    hit() {
        if (this.hitCooldown <= 0) {
            this.hitting = true
            if (this.hitting) {
                if (!this.isHit) {
                    this.weaponPos -= Math.PI / 45
                }

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
}

class Patroller extends Enemy {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)

        this.bodyAngle = 0
        this.health = 65

        this.projectiles = []
        this.projectileSpeed = 5
        this.shotCooldown = new Cooldown(1)
    }

    draw() {
        this.displayProjectiles()

        ctx.save()
        Rotate(this.x, this.y + 2, this.bodyAngle + (Math.PI) / 2)
        ctx.drawImage(images.patroller, this.x - 37.5, this.y - 39, 75, 78)
        ctx.restore()
    }

    update() {
        if (this.bodyAngle >= Math.PI) {
            this.bodyAngle = - Math.PI
        }

        this.shotCooldown.run()

        if (!this.canSeePlayer()) {
            this.bodyAngle += Math.PI / 66.67
        } else {
            if (this.shotCooldown.ended()) {
                this.shoot()
                this.shotCooldown.reset()
            }
        }
    }

    canSeePlayer() {
        if (this.playerDist <= 300 && Math.abs(this.bodyAngle - this.playerAngle) < Math.PI / 40) {
            return true
        }

        return false
    }

    shoot() {
        this.projectiles.push({
            x: this.x,
            y: this.y,
            dx: Math.cos(this.playerAngle) * this.projectileSpeed,
            dy: Math.sin(this.playerAngle) * this.projectileSpeed,
        })
    }

    drawProjectiles(proj) {
        ellipse(proj.x, proj.y, 20, 20, "rgb(0, 0, 0)") // changeme to image for patroller projectile
    }

    updateProjectiles(proj) {
        proj.x += proj.dx
        proj.y += proj.dy

        let projPlayerDist = Math.hypot(
            proj.x - p.x,
            proj.y - p.y
        )

        let projDist = entityDistance(this, proj)

        if (projPlayerDist <= 20) {
            p.getHit(1)

            this.projectiles.splice(this.projectiles.indexOf(proj), 1)
        }

        if (projDist >= 1000) {
            this.projectiles.splice(this.projectiles.indexOf(proj), 1)
        }
    }

    displayProjectiles() {
        this.projectiles.forEach((proj) => {
            this.drawProjectiles(proj)
            this.updateProjectiles(proj)
        })
    }
}

class DrownedMinion extends Enemy {
    constructor(map, spawnX, spawnY) {
        super(map, spawnX, spawnY)
        this.damage = 0.5
        this.maxHealth = 50
        this.health = 50

        this.speed = 2
        this.playerDist = 10000 // Gets updated by the draw method
        
        this.weaponPos = 0
        this.hitting = false
        this.isHit = false
        this.hitCooldown = 1
        this.armAngle = 0

        this.dead = false
    }

    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.playerAngle + Math.PI / 2)
        ctx.translate(- (this.x), - (this.y))
        ctx.drawImage(images.drownedMinion, this.x - 25, this.y - 27.25, 50, 54.5)
    
        // Arms
        ellipse(this.x - 25, this.y, 12.5, 12.5, "rgb(90, 30, 90)")
        ctx.translate(this.x , this.y)
        ctx.rotate(this.armAngle)
        ctx.translate(- this.x, - this.y)
        ellipse(this.x + 25, this.y, 12.5, 12.5, "rgb(90, 30, 90)") // Right arm (hitting arm)
        ctx.restore()
    }

    update() {
        this.updatePlayerInfo()
        if (this.health <= 0) {
            this.dead = true
        }
    
        // this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) + (Math.PI) / 2 // Gives angle direction of player
        // this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
        // this.pdx = p.x - this.x
        // this.pdy = p.y - this.y
        // this.dirCoefX = (this.pdx / Math.abs(this.pdx)) // Gives 1 or -1 depending on whether the player is to the left or right
        // this.dirCoefY = (this.pdy / Math.abs(this.pdy)) // Gives 1 or -1 depending on whether the player is above or below
        this.hitCooldown -= 1 / (66 + 2 / 3)
        
        if (!this.hitting) {
            if (Math.abs(this.pdx) >= 10) {
                console.log(this.speed)
                this.move(this.dirCoefX * this.speed, 0)
            }
    
            if (Math.abs(this.pdy) >= 10) {
                this.move(0, this.dirCoefY * this.speed)
            }
        }

        // this.move(0, this.dirCoefY * this.speed)
    
        if (this.playerDist <= 100) {
            this.hit()
        } else {
            this.hitting = false
        }
    }

    hit() {
        if (this.hitCooldown <= 0) {
            this.hitting = true
            if (this.hitting) {
                this.armAngle -= Math.PI / 28
                if (this.armAngle <= - Math.PI * 2 / 3) {
                    this.hitting = false
                    this.hitCooldown = 1
                    this.armAngle = 0
                    if (this.playerDist <= 100) { // Check if player is still in range to get hit
                        p.getHit(0.5)
                    }
                }
            }
        }
    }
}

const monsters = [
    new Splint("Main Map", 46 * 75, 18 * 75),
    new Splint("Main Map", 47 * 75, 18 * 75),
    new Splint("Main Map", 48 * 75, 18 * 75),
    new Splint("Main Map", 182 * 75, ctr(80)),
    new Splint("Main Map", 183 * 75, ctr(80)),
    new Splint("Main Map", 184 * 75, ctr(80)),
    new Splint("Main Map", ctr(163), ctr(91)),
    new Splint("Main Map", ctr(158), ctr(83)),
    new Splint("Main Map", ctr(153), ctr(77)),
    new Splint("Main Map", ctr(143), ctr(87)),
    new Splint("Main Map", ctr(154), ctr(89)),
    new Splint("Main Map", ctr(105), ctr(92)),
    new Splint("Main Map", ctr(106), ctr(92)),
    new Splint("Main Map", ctr(97), ctr(96)),
    new Splint("Main Map", ctr(114), ctr(96)),
    new Splint("Main Map", ctr(150), ctr(54)),
    new Splint("Main Map", ctr(151), ctr(54)),
    new Splint("Main Map", ctr(152), ctr(54)),
    new Splint("Main Map", ctr(164), ctr(63)),
    new Splint("Main Map", ctr(169), ctr(64)),
    new Splint("Main Map", ctr(159), ctr(67)),
    new Splint("Main Map", ctr(153), ctr(64)),
    new Splint("Main Map", ctr(147), ctr(63)),
    new Splint("Main Map", ctr(171), ctr(56)),

    new Gale("Main Map", ctr(169), ctr(20)),

    new Patroller("Main Map", ctr(115), ctr(72)),
    new Patroller("Main Map", ctr(100), ctr(93)),
    new Patroller("Main Map", ctr(111), ctr(93)),

    new Splint("Gale Cave", 50 * 75, 33 * 75),

    new Splint("The Cryo Underground", 17 * 75, 1 * 75),
    new Splint("The Cryo Underground", 18 * 75, 22 * 75),
    new Splint("The Cryo Underground", 22 * 75, 11 * 75),
    new Splint("The Cryo Underground", 43 * 75, 1 * 75),
    new Splint("The Cryo Underground", 45 * 75, 1 * 75),
    new Splint("The Cryo Underground", 28 * 75, 18 * 75),
]

const bosses = [
    new Darkened("Darkened Room", 712.5, 100),
    new Stormed("Stormed Room", 13 * 75 + 37.5, 17 * 75 + 37.5),
    new Drowned("Drowned Room", 15 * 75 + 37.5, 19 * 75 + 37.5),
]