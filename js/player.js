function Player(x, y, npcs) {
    Entity.call(this, curMap, x, y)
    // this.x = x
    // this.y = y

    this.buildMode = false
    this.buildable = false
    this.bb = ','
    this.health = 10
    this.animatedHealth = 10
    this.cords = {}
    this.speed = 4 // Default 4 or 5
    this.speedMultiplier = 1
    this.dir = "D"
    this.canMove = true
    this.stoppedDir = ""
    this.blockOn = {}
    this.cordSave = {}
    this.doorCooldown = 0.1
    
    this.mapOn = false
    this.mapSwitchTimer = 0.3
    this.mapPan = {
        x: 0,
        y: 0
    }
    
    this.npcs = npcs
    this.npcInfoDisplay = false // When pressing 'n' and clicking on npc this becomes true
    
    this.loadSaveComplete = false

    this.moving = false

    this.curEating = []
    // this.eatCooldown = 0.5
    this.eatCooldown = new Cooldown(0.5)

    this.inventoryDisplay = false
    this.newItemAlert = false
    this.newItem = null

    this.inventory = [] // Default []
    this.itemsMode = "ALL"

    this.waterParticles = new ParticleSystem(width / 2, height / 2, 5, 50, 0, 0, 100)
    this.lavaParticles = new ParticleSystem(width / 2, height / 2, 1, 75, 50, 50, 50)
    this.windParticles = new ParticleSystem(width / 2, height / 2, 1, 50, 100, 200, 200, 200)
	this.suspensiaParticles = new ParticleSystem(width / 2, height / 2, 1, 100, 103, 52, 235)
	this.teleportParticles = new ParticleSystem(width / 2, height / 2, 5, 50, 144, 238, 200)
    this.stunParticles = new ParticleSystem(width / 2, height / 2, 5, 50, 255, 0, 0)
	// x, y, vx, vy, size, r, g, b
    this.area = ""
    this.region = null
    
    this.weaponIndex = 0
    this.weapon = this.inventory[this.weaponIndex]
    this.equipped = [] // Things that the player has equipped (e.g. Aqua Lung), Default []
    this.weaponShift = {
        x: 0,
        y: 0
    }
    this.weaponAngle = 0
    this.throwState = 1
    this.spearAttackState = 1
    this.swordAttackState = 1

    this.throwing = false
    this.spearHitting = false
    this.swordHitting = false
    this.hitting = false
    this.hitCooldown = 0.35

    this.tracking = []
    this.questPoint = {
        x: 15, // Default 15
        y: 8, // Default 8
        map: mainMap // Default mainMap
    }

    this.trills = 100 // Default 0

    this.resistances = {
        cold: 0, // Default 0
        heat: 0
    }

    this.can = {
        goUnderWater: false,
    }

    this.fullPass = false
    this.droptonDonations = 0 // Default 0

	this.inRaft = false
    //this.exitedRaft = false // short time after exiting raft

	this.decipher = false

    this.alertOpacity = 0
    this.curAlert = ""
    
}

Player.prototype = Object.create(Entity.prototype)

Player.prototype.draw = function() {
    this.mapSwitchTimer -= 1 / (66 + (2 / 3))
    this.particle = new Particle(this.blockOn.name, this.dir)
    this.doorCooldown -= 1 / (66 + (2 / 3))
    this.hitCooldown -= 1 / (66 + (2 / 3))
    this.eatCooldown.run()
    this.cords.x = Math.floor(this.x / 75) // This regulates it, because you don't start at x-cord 0, you start at x-cord 10
    this.cords.y = Math.floor(this.y / 75) // Same thing as x-cord, but height / 2 is about half of width / 2, so it's 5 instead of 10

    // Foods in this.curEating steadily give health
    for (var i in this.curEating) {
        var f = this.curEating[i]
        var healthInc = (f.health * (1 / f.secs)) / 66.67
        this.health += healthInc
        f.healthAdded += healthInc
        if (f.healthAdded >= f.health) {
            this.curEating.splice(i, 1)
            break
        }
        // f.secsPassed ++
        // if (f.secsPassed == f.secs) {
        //     this.curEating = []
        //     clearInterval(this.eatInterval)
        // }
    }

    // Load save for player
    if (!this.loadSaveComplete && save != null) {
        if (!!!this.region) {
            lighting = 5000
        }

        this.x = parseFloat(save.player.x)
        this.y = parseFloat(save.player.y)
        this.cordSave = save.player.cordSave
        this.health = save.player.health
        lighting = parseFloat(save.lighting)
        if (save.player.map != "Main Map") {
            for (var i in areas) {
                if (areas[i].name == save.player.map) {
                    curMap = areas[i]
                }
            }
        } else {
            curMap = mainMap
        }
        
        
        this.inventory = [] // Clearing inventory before save reload
        for (var i in save.player.inventory) {
            var s = save.player.inventory[i]
            console.log(s.name)
            for (var j in items) {
                if (items[j].name == save.player.inventory[i].name) {
                    this.inventory.push(items[j])
                }
            }

            for (var j in food) {
                if (food[j]().name == save.player.inventory[i].name) {
                    this.inventory.push(food[j]())
                }
            }
        }

        this.equipped = [] // Clearing equipped items before save reload
        for (var i in save.player.equipped) {
            var s = save.player.equipped[i]
            console.log(s.name)
            for (var j in items) {
                if (items[j].name == save.player.equipped[i].name) {
                    this.equipped.push(items[j])
                }
            }
        }

        this.weaponIndex = save.player.weaponIndex

        this.resistances = save.player.resistances || {
            cold: 0,
            heat: 0
        }

        this.trills = save.player.trills

        this.can = save.player.can

        this.droptonDonations = save.player.droptonDonations
        
        this.loadSaveComplete = true
    }

    if (this.blockOn.name == "water" && !this.inRaft) {
        this.waterParticles.create()
        this.waterParticles.draw()
    } else if (this.blockOn.name == "lava" && !this.inRaft) {
        this.lavaParticles.create()
        this.lavaParticles.draw()
    } else if (this.blockOn.name == "speedy snow") {
        this.windParticles.create()
        this.windParticles.draw()
    } else if (this.blockOn.name == "suspensia") {
		this.suspensiaParticles.create()
		this.suspensiaParticles.draw()
	} else if (this.blockOn.name == "teleport") {
		this.teleportParticles.create()
		this.teleportParticles.draw()
	} else if (this.blockOn.name == "stun") {
        this.stunParticles.create()
        this.stunParticles.draw()
    }

    switch (this.dir) {
        case "D":
            // Body
            ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

            // Eyes
            ellipse((width / 2) - 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
            ellipse((width / 2) + 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")

            ctx.save()

            // Rotation based on weapon angle
            ctx.translate(width / 2, height / 2)
            ctx.rotate(- this.weaponAngle)
            ctx.translate(- width / 2, - height / 2)
            // Rotation based on player dir
            ctx.translate(width / 2 - 30, height / 2 - 15)
            ctx.rotate(Math.PI / 2)
            ctx.translate(- width / 2, - height / 2)

            if (this.inventory.length >= 1) {
                try {
                    !!this.weapon ? this.weapon.draw(width / 2 + 15 + this.weaponShift.x, height / 2 + this.weaponShift.y) : 0
                } catch(error) {
                    console.log(error)
                }
            }
            ctx.restore()
            break
        case "R":
            // Body
            ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

            // Eyes
            ellipse((width / 2) + 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")

            ctx.save()
            // Rotation based on weapon angle
            ctx.translate(width / 2, height / 2)
            ctx.rotate(- this.weaponAngle)
            ctx.translate(- width / 2, - height / 2)
            if (this.inventory.length >= 1) {
                try {
                    !!this.weapon ? this.weapon.draw(width / 2 + 15 + this.weaponShift.x, height / 2 + this.weaponShift.y + 15) : 0
                } catch(error) {
                    console.log(error)
                }
            } 
            ctx.restore()
            break
        case "L": 
            ctx.save()
            ctx.translate(width / 2, height / 2)
            ctx.scale(-1, 1)
            ctx.rotate(- this.weaponAngle)
            ctx.translate(- width / 2, - height / 2)
            if (this.inventory.length >= 1) {
                try {
                    !!this.weapon ? this.weapon.draw(width / 2 + 15 + this.weaponShift.x, height / 2 + this.weaponShift.y + 15) : 0
                } catch(error) {
                    console.log(error)
                }
            }
            ctx.restore()

            // Body
            ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

            // Eyes
            ellipse((width / 2) - 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
            break
        case "U":
            ctx.save()
            ctx.translate(width / 2, height / 2)
            ctx.rotate(- this.weaponAngle)
            ctx.translate(- width / 2, - height / 2)
            ctx.translate(width / 2 + 30, height / 2 + 15)
            ctx.rotate(- Math.PI / 2)
            ctx.translate(- width / 2, - height / 2)
            if (this.inventory.length >= 1) {
                try {
                    !!this.weapon ? this.weapon.draw(width / 2 + 15 + this.weaponShift.x, height / 2 + this.weaponShift.y) : 0
                } catch(error) {
                    console.log(error)
                }
            }
            ctx.restore()

            // Body
            ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")
            // No eyes are shown in the up position
    }
    

    if (mouseClicked && !keys.e && !this.mapOn && !this.hitting) {
        try {
            this.weapon.use(this)
        } catch(error) {
            
        }
    }

    for (var i in this.equipped) {
        // Equipped items have a constantly running effect
        let e = this.equipped[i]
        e.use()
    }
}

Player.prototype.HUD = function() {
    ctx.strokeStyle = "rgba(0, 0, 0, 0)"
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.roundRect(40, 42.5, 120, 65, 10)
    ctx.fill()

    if (p.health > 0) {
        ctx.fillStyle = "rgb(0, 200, 0)"
        ctx.roundRect(50, 50, this.animatedHealth * 10, 50, 10)
        ctx.fill()
        ctx.stroke()
    }

    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.font = "20px serif"
    ctx.fillText("Trills: " + this.trills, 90, 25)

    // ctx.fillStyle = "rgb(0, 0, 0)"
    // ctx.fillRect(1285, 530, 100, 100)

    // Black backdrop for border
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(1192, 467, 153, 154)
    
    ctx.save()
    if (this.health < this.animatedHealth) {
        this.animatedHealth -= 0.75
    } else {
        this.animatedHealth = this.health
    }

    // Minimap
    if (!encompassedForest.inRegion) {
        ctx.save()
        ctx.translate(1365 - 100, 640 - 100)
        ctx.scale(0.1, 0.1)
        ctx.translate(-1 * p.x, -1 * p.y)

        // Border
        curMap.draw(p, "Snippet View")
        ellipse(this.x, this.y, 50, 50, "rgb(255, 0, 0)")
        ctx.restore()

        ctx.beginPath()
        ctx.strokeStyle = "rgb(0, 0, 0)"
        ctx.lineWidth = 8
        ctx.rect(1192, 464, 153, 157)
        ctx.stroke()
    } else {
        ctx.font = "100px serif"
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.fillText("?", 1260, 565)
    }
    
    //
    for (var i = 0; i < monsters.length; i ++) {
        if (curMap.name == monsters[i].map && !monsters[i].dead) {
            if (monsters[i].playerDist < 750 && monsters[i].agro) {
                ellipse(monsters[i].x, monsters[i].y, 50, 50, "rgb(0, 0, 0)")
            }
        }
    }
    ctx.restore()

    if (this.newItemAlert) { // Displays new item alert when you receive an item (sometimes)
        ctx.fillStyle = "rgb(150, 150, 150, 0.7)"
        ctx.roundRect(width / 8, height / 4, width * 3 / 4, height / 2, 15)
        ctx.fill()
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.textAlign = "center"
        ctx.font = "50px serif"
        ctx.fillText(this.newItem.name, width / 2, height / 3)
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.scale(3, 3)
        ctx.translate(- width / 2, - height / 2)
        this.newItem.draw(width / 2, height / 2)
        ctx.restore()
    }

    // Special
    if (this.droptonDonations > 0 && this.droptonDonations < 250) {
        ctx.fillStyle = "rgb(50, 200, 200)"
        ctx.roundRect(50, 125, 100, 50, 10)
        ctx.fill()
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.font = "20px serif"
        ctx.textAlign = "center"
        ctx.fillText(p.droptonDonations + "/250", 100, 155.5)
    }
}

Player.prototype.move = function() {
    if (!!this.inventory[this.weaponIndex]) {
        this.weapon = this.inventory[this.weaponIndex]
    } else {
        this.weaponIndex --
    }

    if (this.spearHitting || this.swordHitting) {
        this.hitting = true
    } else {
        this.hitting = false
    }
    
    if (this.spearHitting) {
        this.spearAttack()
    }

    if (this.swordHitting) {
        this.swordAttack()
    }
    
    if ((this.cords.x > 66 && this.cords.x < 138 && this.cords.y >= 1 && this.cords.y <= 12) || 
            (this.cords.x >= 92 && this.cords.x < 138 && this.cords.y >= 1 && this.cords.y <= 60)) {
        "Steel Field"
    } else if ((this.cords.x <= 66 && this.cords.x >= 0 && this.cords.y >= 0 && this.cords.y < 15) || 
                        (this.cords.x >= 0 && this.cords.x < 91 && this.cords.y >= 15 && this.cords.y <= 60)) {
        this.area = "Chard Town"
    } else if ((this.cords.x >= 138 && this.cords.x < 270 && this.cords.y >= 11 && this.cords.y < 31) ||
                        (this.cords.x >= 182 && this.cords.x < 270 && this.cords.y >= 1 && this.cords.y < 11)) {
        this.area = "Glacia Village"
    } else if (this.cords.x >= 138 && this.cords.y >= 32 && this.cords.x <= 224 && this.cords.y <= 50) {
        this.area = "Windy Wastelands"
		
        if (!p.has(items.stormedsSword)) { // Once player has defeated Stormed, wind will stop
            weather.wind.time += (1 / (66 + (2 / 3)))
            weather.wind.x = weather.wind.equation(weather.wind.time % 10)
            weather.wind.y = weather.wind.equation(weather.wind.time % 7)

            if (getBlockById(curMap.getBlock(Math.floor((this.x + weather.wind.x) / 75), Math.floor((this.y) / 75))).through) {
                this.x += weather.wind.x
            }
            if (getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + weather.wind.y) / 75))).through) {
                this.y += weather.wind.y
            }
        }
        
    } else if (this.cords.x >= 225 && this.cords.y >= 31 && this.cords.x <= 279 && this.cords.y <= 65) {
        this.area = "Encompassed Forest"
    } else {
        this.area = "NONE"

    }
    
    if (!this.mapOn && this.canMove && !mouseIsDown && !this.inRaft && !this.hitting) {
        if (keys.w && this.stoppedDir != "U" && getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y - this.speed) / 75))).through) {
            this.y -= this.speed
            this.dir = "U"
            this.stoppedDir = ""
            this.moving = true
        } 
        
        if (keys.a && this.stoppedDir != "L" && getBlockById(curMap.getBlock(Math.floor((this.x - this.speed) / 75), Math.floor(this.y / 75))).through) {
            this.x -= this.speed
            this.dir = "L"
            this.stoppedDir = ""
            this.moving = true
        } 
        
        if (keys.s && this.stoppedDir != "D" && getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + this.speed) / 75))).through) {
            this.y += this.speed
            this.dir = "D"
            this.stoppedDir = ""
            this.moving = true
        }
        
        if (keys.d && this.stoppedDir != "R" && getBlockById(curMap.getBlock(Math.floor((this.x + this.speed) / 75), Math.floor(this.y / 75))).through) {
            this.x += this.speed
            this.dir = "R"
            this.stoppedDir = ""
            this.moving = true
            
        }
    }

    if (!keys.w && !keys.a && !keys.s && !keys.d) {
        this.moving = false
    }

    // for (var i in bosses) {
    //     var boss = bosses[i]
    //     // var bDist = Math.hypot((this.x - b.x), (this.y - b.y))
    //     var bDist = entityDistance(this, curBoss)
    //     console.log(bDist)
    //     if (bDist <= 100 && mouseIsDown && !holding && this.hitCooldown <= 0 && b.hittable) {
    //         if (!!this.weapon.damage) {
    //             b.health -= this.weapon.damage
    //         } else {
    //             b.health -= 1
    //         }
    //         this.hitCooldown = 0.35
            
    //         switch (b.name) {
    //             case "Darkened":
    //                 b.tpHitCount ++
    //                 break
    //             case "Stormed":
    //                 if (b.phase == 2) {
    //                     b.windMode = false
    //                 }
    //                 break
    //         }
    //     }
    // }
    // var bDist = Math.hypot((this.x - b.x), (this.y - b.y))

    var bDist = entityDistance(this, curBoss)
    if (bDist <= 100 && mouseIsDown && !holding && this.hitCooldown <= 0 && curBoss.hittable) {
        if (!!this.weapon.damage) {
            curBoss.health -= this.weapon.damage
        } else {
            curBoss.health -= 1
        }
        this.hitCooldown = 0.35
        
        switch (curBoss.name) {
            case "Darkened":
                curBoss.tpHitCount ++
                break
            case "Stormed":
                if (curBoss.phase == 2) {
                    curBoss.windMode = false
                }
                break
        }
    }

    

    if (Math.abs(curMap.temperature) > this.resistances.cold) {
        this.health -= (1 / 66.6667) * (Math.abs(curMap.temperature) - this.resistances.cold)
    }

    if (curMap.temperature > this.resistances.heat) {
        this.health -= (1 / 66.6667) * (curMap.temperature - this.resistances.heat)    
    }
}

Player.prototype.collide = function() {
    var b = curMap.getBlock(this.cords.x, this.cords.y)
    if (b != "") {
        this.blockOn = getBlockById(b)
    }
    
    for (var i in chests) {
        if (this.cords.x == chests[i].cords.x && this.cords.y == chests[i].cords.y && chests[i].map == curMap) {
            chests[i].open(this)
        }
    }

    for (var i in interactives) {
        if (interactives[i].map == curMap) {
            interactives[i].activate()
        }
    }

    for (var i in secrets) {
        if (secrets[i].map == curMap && this.on(secrets[i].x, secrets[i].y)) {
            secrets[i].activate()
        }
    }

    if (this.doorCooldown <= 0) {
        if ((this.blockOn.name == "door" || this.blockOn.name == "hole") && keys.space) {
            fadeStarted = true
        }
        this.doorCooldown = 0.1
    }

    if (fadeStarted) {
        this.canMove = false
        ctx.fillStyle = "rgb(0, 0, 0, " + fadeOut +    ")"
        ctx.fillRect(0, 0, width, height)
        if ((areaSearchByCords(this.cords.x, this.cords.y) != 0) || (curMap != mainMap)) { // i have to go tho it is new time for chunky men!ok gluconate
            fadeOut += 0.05
        } else {
            fadeStarted = false
        }
        if (fadeOut >= 1) {
            if (curMap == mainMap) {
                this.cordSave.x = this.cords.x
                this.cordSave.y = this.cords.y
    
                var areaJoining = areaSearchByCords(this.cords.x, this.cords.y)
                curMap = areaJoining
                this.x = areaJoining.enterX
                this.y = areaJoining.enterY
            } else if (curMap != mainMap) {
                if (!!this.cordSave.x && !!this.cordSave.y) {
                    this.goTo(ctr(this.cordSave.x), ctr(this.cordSave.y))
                    this.cordSave = {}
                    curMap = mainMap
                } else {
                    console.log("No coordinates were saved upon area entry")
                }
            }
            fadeStarted = false
            fadeOut = 0
            this.canMove = true
        }
    }

    // Secret Entrances
    
    if (this.cords.x == 160 && this.cords.y == 4 && keys.q) {
        curMap = queensCastle
        this.x = 37.5
        this.y = 37.5
    }

    // Colliding with block properties
    if (typeof this.blockOn.dps == 'number') {
        this.speed = this.blockOn.speed * this.speedMultiplier

        // Special cases
        if (this.hasEquipped(items.aquaLung) && this.blockOn.id == '~') { // Swim faster with aqua lung
            this.speed *= 1.5
        }


        // Hurt player when standing on harmful block
        if (!this.inRaft) {
            this.health -= this.blockOn.dps / (66 + (2 / 3))
        } else {
            if (this.blockOn.id != "!") {
                this.health -= this.blockOn.dps / (66 + (2 / 3))
            }
        }
    }
    
    // if (this.inRaft && this.blockOn.id == "^") { // Raft doesn't save you from suspensia
        
    // }

    if (this.moving) {
        playSound(this.blockOn.sound, true)
        for (var i in blocks) {
            if (blocks[i] != this.blockOn) {
                stopSound(blocks[i].sound)
            }
        }
    } else {
        stopSound(this.blockOn.sound)
    }
}

/**
 * Sees if player has a certain item
 * @param {*} item Item to check
 * @returns true or false
 */
Player.prototype.has = function(item) {
    for (var i in this.inventory) {
        if (this.inventory[i] == item) {
            return true
        }
    }

    return false
}

Player.prototype.hasEquipped = function(item) {
    for (var i in this.equipped) {
        if (this.equipped[i] == item) {
            return true
        }
    }

    return false
}

Player.prototype.equip = function(item) {
    // Make sure it doesn't equip the same item multiple times
    let itemAlreadyEquipped = false
    for (var i in this.equipped) {
        let e = this.equipped[i]
        if (e == item) {
            itemAlreadyEquipped = true
        }
    }

    if (!itemAlreadyEquipped) {
        this.equipped.push(item)
    }
}

Player.prototype.dequip = function(item) {
    for (var i in this.equipped) {
        let e = this.equipped[i]
        if (e == item) {
            this.equipped.splice(i, 1)
        }
    }
}

/**
 * Gives the player an item
 * @param {*} item The item to give
 * @param {*} itemAlert Whether or not to display the new item panel
 */
Player.prototype.giveItem = function(item, itemAlert) {
    p.inventory.push(item)

    if (itemAlert) {
        this.newItemAlert = true
        this.newItem = item
        setTimeout(() => {
            this.newItemAlert = false
        }, 2000)
    }
}

Player.prototype.removeItem = function(item) {
    for (var i in this.inventory) {
        var itm = this.inventory[i]
        if (itm == item) {
            this.inventory.splice(i, 1)
            break
        } else {
            if (itm instanceof Food) {
                if (itm.name == item.name) {
                    this.inventory.splice(i, 1)
                }
            }
        }
    }
}

Player.prototype.eat = function(foodItem) {
    this.eatCooldown.onEnd(() => {
        for (var i in this.inventory) {
            var f = this.inventory[i]
            if (f == foodItem) {
                this.curEating.push(foodItem)
                this.inventory.splice(i, 1)
                break
            }
        }
    })
}

Player.prototype.hitEnemies = function() {
    var monsterThatWasHitNum = null
    // For monsters
    for (var i in monsters) {
        var m = monsters[i]
        var mDist = entityDistance(this, m)
        this.mAngle = Math.atan2((m.y - this.y), (m.x - this.x))
        if (mDist <= 150 && mouseIsDown && this.hitCooldown <= 0) {
            this.hitCooldown = 0.35
            if (!!this.weapon.damage) {
                m.health -= (this.weapon.damage || 1.5)
            } else {
                m.health -= 1
            }

            if (m.health <= 0 && !m.haveTrillsBeenAwarded) {
                this.trills += m.trillAward
                m.haveTrillsBeenAwarded = true
            }
            
            // Monster knockback
            // m.x += Math.cos(this.mAngle) * 25
            // m.y += Math.sin(this.mAngle) * 25
            m.move(Math.cos(this.mAngle) * 25, Math.sin(this.mAngle) * 25, true)
            
            // Tells monster that it is hit (doesn't work for some monsters idk why)
            m.isHit = true
            monsterThatWasHitNum = i
            // eventsDelay(
            //     function() {
            //         m.isHit = true
            //     },
            //     function() {
            //         m.isHit = false
            //     },
            // 0.5)
        }
    }

    if (monsterThatWasHitNum != null) {
        setTimeout(() => {
            monsters[monsterThatWasHitNum].isHit = false
            monsterThatWasHitNum = null
        }, 500)
    }
}

Player.prototype.manualMove = function(x, y) {
    if (getBlockInfoByCords(this.x + x, this.y).through) {
        this.x += x
    }

    if (getBlockInfoByCords(this.x, this.y + y).through) {
        this.y += y
    }
}

Player.prototype.getHit = function(dmg) {
    this.health -= dmg
}

Player.prototype.shovel = function () {
    // Path making
    if (!!this.weapon) {
        if (this.weapon.name == "Shovel") {
            this.buildMode = true
            this.bb = '-'
        } else {
            this.buildMode = false
        }
        if (this.buildMode) {
            if (this.blockOn.name == "shovel") { // if you're standing on a shovel block
                
                this.buildable = true
                ctx.fillStyle = "rgb(0, 255, 0, 0.5)"
                ctx.fillRect(p.cords.x * 75 - p.x + width / 2 , p.cords.y * 75 - p.y + height / 2, 75, 75)
                
            } else {
                this.buildable = false
                ctx.fillStyle = "rgb(255, 0, 0, 0.5)"
                ctx.fillRect(p.cords.x * 75 - p.x + width / 2 , p.cords.y * 75 - p.y + height / 2, 75, 75)
            
            }
        }
        
    }
    

    if (this.buildMode && this.buildable) {
        if (keys.b) {
            curMap.changeBlock(this.cords.x, this.cords.y, this.bb) // DEFAULT GONE
			keys.b = false
        }
    }
}

Player.prototype.displayMap = function() {
    if (this.mapOn) {
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(0, 0, width, height)
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.scale(mapScale, mapScale) 
        ctx.translate(width / -2, height / -2)
        ctx.translate(this.mapPan.x, this.mapPan.y)
        
        curMap.draw(p, "Map View")
        ellipse(this.x, this.y, 50, 50, "rgb(255, 0, 0)")
		
        for (var i in this.tracking) {
            var t = this.tracking[i]
            models.npcs.oldMan.x = t.x
            models.npcs.oldMan.y = t.y
            models.npcs.oldMan.draw()
            // ellipse(t.x, t.y, 75, 75, "rgb(0, 0, 0)"
        }

        // eiufhdglksdfjhg
        
        if (!!this.questPoint) {
            var questPointParticles = new ParticleSystem(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 10, 35 / mapScale, 0, 255, 0)

            questPointParticles.create()
            questPointParticles.draw()
            ellipse(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 35 / mapScale, 35 / mapScale, "rgb(0, 250, 45)")
            ellipse(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 25 / mapScale, 25 / mapScale, "rgb(0, 200, 40)")
            ellipse(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 10 / mapScale, 10 / mapScale, "rgb(0, 250, 45)")
            
        }
        
        ctx.restore()
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.roundRect(width / 2 - 60, height - 100, 50, 50, 5)
        ctx.fill()
        ctx.roundRect(width / 2 + 10, height - 100, 50, 50, 5)
        ctx.fill()
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.font = "50px serif"
        ctx.textAlign = "center"
        ctx.fillText("+", width / 2 - 35, height - 65)
        ctx.fillText("-", width / 2 + 35, height - 65)

		for (var i in teleports) {
			teleports[i].draw()
		}
		
        if (keys.w) {
            this.mapPan.y += 25 / mapScale
        }

        if (keys.a) {
            this.mapPan.x += 25 / mapScale
        }

        if (keys.s) {
            this.mapPan.y -= 25 / mapScale
        }

        if (keys.d) {
            this.mapPan.x -= 25 / mapScale
        }

        if (mouseIsDown) {
            if (mouseY > height - 100 && mouseY < height - 50) {
                if (mouseX > width / 2 - 60 && mouseX < width / 2 - 10 && mapScale < 0.45) { // Zoom in button
                    mapScale *= 1.03
                }
                
                if (mouseX > width / 2 + 10 && mouseX < width / 2 + 60 && mapScale > 0.13) { // Zoom out button
                    mapScale /= 1.03
                }
            }
        }
    }
}

Player.prototype.displayInventory = function() {
    ctx.fillStyle = "rgba(50, 50, 255, 0.9)"
    ctx.roundRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4, 10)
    ctx.fill()

    var subcategory = []

    for (var i in this.inventory) {
        try {
            var item = this.inventory[i]
            var mouseItemDist = Math.hypot(mouseX - ((i % 8) * 100 + width / 8 + 100), mouseY - (height / 8 + 100 * (Math.floor(i / 8) + 1)))
            if (this.itemsMode == 'ALL') {
                ellipse((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1), 90, 90, "rgba(0, 0, 255, 0.5)")

                item.draw((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1))
                if (mouseItemDist < 50) {
                    ctx.fillStyle = "rgb(0, 0, 0)"
                    ctx.textAlign = "center"
                    ctx.font = "50px serif"
                    ctx.fillText(item.name, width / 2, height / 2 + 120)
                    ctx.font = "15px serif"
                    fillTextMultiLine((item.desc || "") + "\nDamage: " + (item.damage || 0), width / 2, height / 2 + 150)
                    if (mouseIsDown) {
                        this.weaponIndex = i
                    }
                }
            } else if (item.category == this.itemsMode) {
                subcategory.push(item)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (subcategory.length > 0) {
        for (var i in subcategory) {
            try {
                var item = subcategory[i]
                var mouseItemDist = Math.hypot(mouseX - ((i % 8) * 100 + width / 8 + 100), mouseY - (height / 8 + 100 * (Math.floor(i / 8) + 1)))
                item.draw((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1))
                if (mouseItemDist < 50) {
                    ctx.fillStyle = "rgb(0, 0, 0)"
                    ctx.textAlign = "center"
                    ctx.font = "50px serif"
                    ctx.fillText(item.name, width / 2, height / 2 + 120)
                    ctx.font = "15px serif"
                    fillTextMultiLine(item.desc + "\nDamage: " + item.damage, width / 2, height / 2 + 150)
                    if (mouseIsDown) {
                        for (var j in this.inventory) {
                            if (this.inventory[j].name == item.name) {
                                this.weaponIndex = j
                                continue
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    var inventoryCategories = [
        {img: images.starIcon, itemsMode: "ALL"},
        {img: images.swordIcon, itemsMode: "WEAPONS"},
        {img: images.foodIcon, itemsMode: "FOOD"},
        {img: images.keyIcon, itemsMode: "KEYS"},
        {img: images.questionMarkIcon, itemsMode: "MISC"},
    ]

    for (var i in inventoryCategories) {
        var invCat = inventoryCategories[i]
        if (this.itemsMode == invCat.itemsMode) {
            // Deselected
            ctx.fillStyle = "rgb(25, 25, 175)"
        } else {
            // Selected
            ctx.fillStyle = "rgb(50, 50, 255)"
        }

        ctx.beginPath()
        ctx.lineWidth = 4
        ctx.strokeStyle = "rgb(0, 0, 0)"
        ctx.roundRect(width * 3 / 4 - 60 - i * 60, height / 8, 50, 50, 5)
        ctx.stroke()
        ctx.fill()
        ctx.drawImage(invCat.img, width * 3 / 4 - 50 - i * 60, height / 8 + 10, 30, 30)

        if (mouseIsDown && mouseRect(width * 3 / 4 - 60 - i * 60, height / 8, 50, 50)) {
            this.itemsMode = invCat.itemsMode
        }
    }

    // // Inventory/Food switcher
    // if (this.itemsMode == "INVENTORY") {
    //     // Deselected
    //     ctx.fillStyle = "rgb(25, 25, 175)"
    // } else {
    //     // Selected
    //     ctx.fillStyle = "rgb(50, 50, 255)"
    // }
    // ctx.lineWidth = 4
    // ctx.roundRect(width * 3 / 4 - 60, height / 8, 50, 50, 5)
    // ctx.fill()
    // ctx.stroke()
    // ctx.drawImage(images.foodIcon, width * 3 / 4 - 50, height / 8 + 10, 30, 30)

    // if (this.itemsMode == "BASKET") {
    //     // Deselected
    //     ctx.fillStyle = "rgb(25, 25, 175)"
    // } else {
    //     // Selected
    //     ctx.fillStyle = "rgb(50, 50, 255)"
    // }
    // ctx.roundRect(width * 3 / 4 - 120, height / 8, 50, 50, 5)
    // ctx.fill()
    // ctx.stroke()
    // ctx.lineWidth = 0
    // ctx.drawImage(images.inventoryIcon, width * 3 / 4 - 110, height / 8 + 10, 30, 30)

    // if (mouseIsDown) {
    //     if (mouseRect(width * 3 / 4 - 120, height / 8, 50, 50)) {
    //         this.itemsMode = "FOOD"
    //     }

    //     if (mouseRect(width * 3 / 4 - 60, height / 8, 50, 50)) {
    //         this.itemsMode = "ALL"
    //     }
    // }

    // Equipped items sidebar
    ctx.fillStyle = "rgba(25, 25, 255, 0.75)"
    ctx.roundRect(width * 3 / 4, height / 8, width / 8, height * 3 / 4, 10)
    ctx.fill()
    
    for (var i in this.equipped) {
        this.equipped[i].draw(width * 13 / 16, height / 8 + 100 + i * 100)
    }

    // Border
    ctx.strokeStyle = "rgb(0, 0, 0)"
    ctx.lineWidth = 4
    ctx.roundRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4, 10)
    ctx.stroke()
}

Player.prototype.swordAttack = function() {
    this.swordHitting = true

    if (this.swordAttackState == 1) {
        if (this.weaponAngle >= Math.PI / 2) {
            setTimeout(() => {
                this.swordAttackState = 2
            }, 75)
        } else {
            playSound("Sword", false)
            this.weaponAngle += Math.PI / 10 // First swing is slightly slower
        }
    } else if (this.swordAttackState == 2) {
        if (this.weaponAngle <= - Math.PI / 4) {
            if (mouseIsDown) {
                // Seamlessly start another attack
                this.swordAttackState = 1
            } else {
                // Finish attack
                setTimeout(() => {
                    this.weaponShift.x = 0
                    this.weaponAngle = 0
                    this.swordAttackState = 1
                    this.swordHitting = false
                }, 250)
            }
        } else {
            playSound("Sword", false)
            this.weaponShift.x = 30
            this.weaponAngle -= Math.PI / 8
        }
    }
}

Player.prototype.spearAttack = function() {
    this.spearHitting = true
	
    if (this.spearAttackState == 1) { // Initial jab with the spear
        this.weaponShift.x += 10
		playSound("Spear", false)
        if (this.weaponShift.x >= 50) {
            this.spearAttackState = 2
        }
    } else if (this.spearAttackState == 2) { // Pull back after inital hit
        this.weaponShift.x -= 3
        if (this.weaponShift.x <= 0) { // Reset everything
			
		
            this.weaponShift.x = 0
            this.spearAttackState = 1
            this.spearHitting = false
        }
    }
}

Player.prototype.breakBlock = function () {
    if (p.weapon.damage > 0 && this.hitting) {
       
    }
}

Player.prototype.displayNPCList = function () {
	ctx.fillStyle = "rgba(50, 50, 255, 0.5)"
    ctx.fillRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4)
	for (var i in npcs) {
        
        var mouseNPCDist = Math.hypot(mouseX - ((i % 9) * 100 + width / 9 + 100), mouseY - (height / 9 + 100 * (Math.floor(i / 9) + 1)))
    	if (npcs[i].talkedTo) {
        	npcs[i].drawFace((i % 9) * 100 + width / 9 + 100, height / 9 + 100 * (Math.floor(i / 9) + 1)) 	
		} else {
			ellipse((i % 9) * 100 + width / 9 + 100, height / 9 + 100 * (Math.floor(i / 9) + 1), 50, 50, "rgb(99, 133, 130)")
			ctx.fillStyle = "rgb(0, 0, 0)"
			ctx.textAlign = "center"
			ctx.font = "30px serif"
			ctx.fillText("?", (i % 9) * 100 + width / 9 + 100, height / 9 + 100 * (Math.floor(i / 9) + 1))
		}
		
        if (mouseNPCDist < 50) {
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.textAlign = "center"
			if (npcs[i].talkedTo) {
                ctx.font = "50px serif"
            	ctx.fillText(npcs[i].name, width / 2, height / 2 + 120)
                if (mouseIsDown && !this.npcInfoDisplay) {
					this.npcDisplayed = npcs[i]
					
                    this.npcInfoDisplay = true
					
					
                }
			} else {
				ctx.fillText("???", width / 2, height / 2 + 120)
				ctx.font = "20px serif"
				ctx.textAlign = "center"
				ctx.fillText("You haven't talked to this character yet.", width / 2, height / 2 + 160)
			}
        }

    	if (this.npcInfoDisplay) {
     		this.displayNPCInfo(this.npcDisplayed)
		} 
    }
}

Player.prototype.displayNPCInfo = function(n) {
    if (keys.b) {
        this.npcInfoDisplay = false
    } 
    console.log(this.npcInfoDisplay)
    ctx.fillStyle = "rgba(50, 50, 255, 0.5)" //"rgba(150, 60, 255)"
    ctx.fillRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4)

    // Draw scaled up NPC face
    ctx.save()
	ctx.translate(width / 4, height / 2)
	ctx.scale(5, 5)
    
	ctx.translate(-1 * width / 4, -1 * height / 2)
	n.drawFace(width / 4, height / 2)
    ctx.restore()

	ctx.fillStyle = "rgba(0, 0, 0)"
	ctx.font = "30px serif"
	ctx.fillText(n.name, width / 4, height * 3 / 4)
	ctx.font = "20px serif"
	ctx.textAlign = 'center'
	this.descNewLine = n.desc.indexOf("\n")
	ctx.fillText(n.desc.substring(0, this.descNewLine), width / 4, height * 3 / 4 + 30)
	ctx.textAlign = 'left'
	ctx.fillText(n.desc.substring(this.descNewLine, n.desc.length), width * 3 / 8, height / 2)


	ctx.textAlign = 'center'
}

Player.prototype.nearNPC = function () {
    for (var i in npcs) {
        if (npcs[i].map == curMap && entityDistance(p, npcs[i]) < 100 && npcs[i].lineNum == -1 && CUR_SHOP_MENU == 0) {
            return true
        }
    }
    return false
}

Player.prototype.nearSign = function () {
    for (var i in alerts) {
        if (alerts[i].type == "SIGN" || alerts[i].type == "WANDERER SIGN") {
           if (alerts[i].map == curMap && 
            p.cords.x == alerts[i].x &&
            p.cords.y == alerts[i].y &&
            !alerts[i].showLines) {
                return true
            }
        }
    }
    return false
}

Player.prototype.drawAlert = function () {
    if (!!this.blockOn.useDesc) {
        // ctx.roundRect(width / 2 - 100, height / 2 + 50, 200, 50, 10)
        // ctx.fill()
        this.curAlert = this.blockOn.useDesc
        if (this.alertOpacity <= 1) {
            this.alertOpacity += 0.1
        }
    } else if (this.nearNPC()) {
        this.curAlert = "Press space to speak"
        if (this.alertOpacity <= 1) {
            this.alertOpacity += 0.1
        }
    } else if (this.nearSign()) {
        this.curAlert = "Press space to read"
        if (this.alertOpacity <= 1) {
            this.alertOpacity += 0.1
        }
    } else {
        if (this.alertOpacity > 0) {
            this.alertOpacity -= 0.1
        }
    }

    ctx.fillStyle = "rgba(0, 0, 0, " + this.alertOpacity / 2 + ")"
    ctx.roundRect(width / 2 - width / 9, height - 80 - height / 20, width / 4.5, height / 10, 5)
    ctx.fill()
    ctx.fillStyle = "rgba(255, 255, 255, " + this.alertOpacity + ")"
    ctx.font = "30px serif"
    ctx.textAlign = "center"
    ctx.fillText(this.curAlert, width / 2, height - 75)

}