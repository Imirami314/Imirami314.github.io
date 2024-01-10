// Function wrapping prevents console from altering game variables
// (function() {
curMap = mainMap

var saveLoaded = false

var alerts = [
    new GameAlert(0, 0, ["WASD To Move\n[Space] To Continue"], imperilledPrison, "MESSAGE"),
    new GameAlert(9, 53, ["Confounded Cave\nKEEP OUT!"], mainMap, "SIGN"),
    new GameAlert(1, 44, ["Got you! - Mike"], mainMap, "SIGN"),
    new GameAlert(70, 23, ["Sarah's Shop:\nOfficially open for business!"], mainMap, "SIGN"),
    new GameAlert(79, 43, ["Rowan's Dojo:\nNow accepting students!"], mainMap, "SIGN"),
    new GameAlert(182, 3, ["Glacia Village ---------->\n<---------- Steel Field\nIf text on the signs confuse and confound, it all becomes clearer if you flip it around."], mainMap, "SIGN"),
    new GameAlert(66, 10, ["Huh? It's locked.\nYou need the 'Steel Field Key'."], mainMap, "KEY", "Map Key"),
    new GameAlert(6, 53, ["Huh? It's locked.\nYou need the 'Confounded Cave Key'."], mainMap, "KEY", "Confounded Cave Key"),
    new GameAlert(6, 21, ["The buttons above will alter the walls,\nPress them correctly to open both halls..."], confoundedCave, "SIGN"),
    new GameAlert(28, 11, ["Huh? It's locked.\nYou need the 'Puzzle Key'."], confoundedCave, "KEY", "Puzzle Key"),
    new GameAlert(253, 21, ["The queen does not wish to speak with commoners at this time.", "If you must enter the castle, this riddle you must use,\nthe entrance is at the entrance, between red and blue."], mainMap, "SIGN"),
    new GameAlert(230, 18, ["If you've found the secret, but do not know how to go through,\ndo not be afraid to simply press 'q'."], mainMap, "SIGN"),
    new GameAlert(23, 5, ["The castle exit can be found at the bottom of the lowest floor."], queensCastle, "SIGN"),
    new GameAlert(176, 30, ["DO NOT ENTER\nWIND IS INCREDIBLY STRONG"], mainMap, "SIGN"),
    new GameAlert(183, 39, ["Shot from a bow, on the map you'll see,\nthe land forms a symbol to point where you should be."], mainMap, "SIGN"),
    new GameAlert(28, 23, ["Find the four brothers, have no fears,\nAs the light shines through, the answer appears.", "When a button is found, a brother is near.\nOnce you're finished, come back here."], galeCave, "SIGN"),
    new GameAlert(35, 11, ["Press space at the center, prepare for a fight,\nFor you're about to meet the Master of Night."], confoundedCave, "SIGN"),
    new GameAlert(44, 33, ["Warning: very cold past this point!", "Auras are recommended."], galeCave, "SIGN"),
	new GameAlert(10, 7, ["BOW??20! hSHDs1@???:\n?fdkj2!","SDHG9 dahf!!01 fdhk!@8 d,\nhjfdj sh>9 /rhd9:f hfu???jfnvjejdj..??."], mainMap, "DECIPHER", null, ["Chard Town's Secret:\nPART 2","Chard Town possesses an unfinished letter,\nPress the right key to make everything better..."]),
	new GameAlert(24, 8, ["This mysterious substance will come with a curse,\nThe player will perish, the raft alone may traverse."], cryoUnderground, "SIGN"),
    new GameAlert(252, 67, ["Welcome to the Dropton Drylands!", "Not that it's dry here, it's just dry compared to being underwater..."], mainMap, "SIGN"),
    new GameAlert(79, 43, ["Dropton Water Wear:\nDropton's official partner for all water-related gear!"], mainMap, "SIGN"),
    new GameAlert(38, 16, ["House under repair due to mysterious current...", "KEEP OUT!"], droptonCity, "SIGN"),
    new GameAlert(22, 34, ["Full Pass required for entry to Dropton Hall."], droptonCity, "SIGN"),
    new GameAlert(37, 21, ["Full Pass required for entry to Dropton Research Facility."], droptonTown, "SIGN")
]

var teleports = [
	new Teleport(26 * 75 + 37.5, 55 * 75 + 37.5, mainMap)
]
// Cool riddle to figure out the backwards text on some signs: If text on the signs confuse and confound, it all becomes clearer if you flip it around.

var secrets = [ // (Last bool is the beam, meaning the secret is solved)
	[false, false, false, false] // Chard Town
]

var curCamera = null;


/**
 * Starts camera motion
 * @param {*} cx X-coordinate to move camera to
 * @param {*} cy Y-coordinate to move camera to
 * @param {*} cspeed Speed to move camera to location
 * @param {*} type Type of camera being used (Options: "NPC", "AUTO")
 * @param {*} lineStop Dialogue line to terminate camera
 */
function cameraStart(cx, cy, cspeed, type, config) {
    curCamera = new Camera(cx, cy, cspeed, type, config)
}

/**
 * Ends the camera motion
 */
function cameraEnd() {

}

var lighting = 5000 // Between 0 and 5000

/**
 * Sets lighting value, but instead of immediately changing it, it eases into it
 * @param {} value New lighting value
 */
function setLighting(value) {
    if (lighting < value) {
        lighting += 45
    } else if (lighting > value) {
        lighting -= 45
    }
    
    if (Math.abs(lighting - value) <= 15) {
        lighting = value
        return
    }
}
var lightingSize = 45

var SAVE_MENU = false

var weather = {
    wind: {
        activated: true,
        x: 1,
        y: 0,
        time: 0,
        equation: function(t) {
            //return (0.25) * Math.pow(t, 2) + (0.25) * t + 0.25
            return Math.sin(t) * 1.35
        }
    }
}

var cutsceneText = ""

var bossDoors = [
    {
        x: 31,
        y: 15,
        map: confoundedCave,
        enterFunction: function(p) {
            saveGame()
            p.x = darkenedRoom.enterX
            p.y = darkenedRoom.enterY
            curMap = darkenedRoom
            scene = "DARKENED BOSS CUTSCENE"
        }
    },
	{
		x: 42,
		y: 28,
		map: cryoUnderground,
		enterFunction: function(p) {
			saveGame()
			
			p.x = stormedRoom.enterX
			p.y = stormedRoom.enterY
			curMap = stormedRoom
			cutsceneFrame = 0
			scene = "STORMED BOSS CUTSCENE"
		}
	}
]

function Player(x, y, npcs) {
    this.x = x
    this.y = y
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

Player.prototype.draw = function() {
    this.mapSwitchTimer -= 1 / (66 + (2 / 3))
    this.particle = new Particle(this.blockOn.name, this.dir)
    this.doorCooldown -= 1 / (66 + (2 / 3))
    this.hitCooldown -= 1 / (66 + (2 / 3))
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

	// Path making
    if (!!this.weapon) {
        if (this.weapon.name == "Speedy Snow Path") {
        this.buildMode = true
        this.bb = 'z'
        } else {
        this.buildMode = false
        }
        if (this.buildMode) {
            if (this.blockOn.name == "trail" || this.blockOn.name == "water" || this.blockOn.name == "lava" || this.blockOn.name == "speedy snow" || this.blockOn.name == "door" || this.blockOn.name == "lock" || curMap != mainMap) {
            this.buildable = false
            ctx.fillStyle = "rgb(255, 0, 0, 0.5)"
            ctx.fillRect(p.cords.x * 75 - p.x + width / 2 , p.cords.y * 75 - p.y + height / 2, 75, 75)
                
            } else {
            this.buildable = true
            ctx.fillStyle = "rgb(0, 255, 0, 0.5)"
            ctx.fillRect(p.cords.x * 75 - p.x + width / 2 , p.cords.y * 75 - p.y + height / 2, 75, 75)
            }
        }
    }

     // Body
    ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

    switch (this.dir) {
        case "D":

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

            // No eyes are shown in the up position
    }
    

    if (mouseIsDown && !keys.e && !this.mapOn && !this.hitting) {
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

// full of chub

Player.prototype.HUD = function() {
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.roundRect(40, 42.5, 120, 65, 10)
    ctx.fill()

    if (p.health > 0) {
        ctx.fillStyle = "rgb(0, 200, 0)"
        ctx.roundRect(50, 50, this.animatedHealth * 10, 50, 10)
        ctx.fill()
    }

    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.font = "20px serif"
    ctx.fillText("Trills: " + this.trills, 40, 25)

    // ctx.fillStyle = "rgb(0, 0, 0)"
    // ctx.fillRect(1285, 530, 100, 100)
    
    ctx.save()
    if (this.health < this.animatedHealth) {
        this.animatedHealth -= 0.75
    } else {
        this.animatedHealth = this.health
    }
    
    ctx.translate(1365 - 100, 640 - 100)
    ctx.scale(0.1, 0.1)
    ctx.translate(-1 * p.x, -1 * p.y)

    // tried adding a border but looks goofy fix
    // ctx.fillStyle = 'rgb(0, 0, 0)'
    // ctx.fillRect(this.x - 900, this.y - 900, 1800, 1800)
    curMap.draw(p, "Snippet View")
    
    
    ellipse(this.x, this.y, 50, 50, "rgb(255, 0, 0)")
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


/**
 * Check if player is on a block at certain coordinates
 * @param {number} x The x coordinate to check
 * @param {number} y The y coordinate to check
 */
Player.prototype.on = function(x, y) {
    if (this.cords.x == x && this.cords.y == y) {
        return true
    }
}

/**
 * Teleports player to specific location
 * @param {*} x IN PIXELS
 * @param {*} y IN PIXELS
 */
Player.prototype.goTo = function(x, y) {
    this.x = x
    this.y = y
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

    for (var i in bosses) {
        var b = bosses[i]
        var bDist = Math.hypot((this.x - b.x), (this.y - b.y))
        if (bDist <= 100 && mouseIsDown && !holding && this.hitCooldown <= 0 && b.hittable) {
            if (!!this.weapon.damage) {
                b.health -= this.weapon.damage
            } else {
                b.health -= 1
            }
            this.hitCooldown = 0.35
            
            switch (b.name) {
                case "Darkened":
                    b.tpHitCount ++
                    break
            }
        }
    }

    if (this.buildMode && this.buildable) {
        if (keys.b) {
            curMap.changeBlock(this.cords.x, this.cords.y, this.bb) // DEFAULT GONE
			keys.b = false
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
                
                this.x = areaJoining.enterX
                this.y = areaJoining.enterY
                curMap = areaJoining
            } else if (curMap != mainMap) {
                if (!!this.cordSave.x && !!this.cordSave.y) {
                    curMap = mainMap
                    this.x = this.cordSave.x * 75 + 37.5
                    this.y = this.cordSave.y * 75 + 37.5
                    this.cordSave = {}
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
        }
    }
}

Player.prototype.eat = function(foodItem) {
    for (var i in this.inventory) {
        var f = this.inventory[i]
        if (f == foodItem) {
            this.curEating.push(foodItem)
            this.inventory.splice(i, 1)
            break
        }
    }

    // this.eatInterval = setInterval(() => {
    //     if (this.curEating.length > 0) {
            
    //     }
    // }, 1000)
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
            
            // Monster knockback
            m.x += Math.cos(this.mAngle) * 25
            m.y += Math.sin(this.mAngle) * 25
            
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

    // if (this.itemsMode == 'ALL') {
    //     for (var i in this.inventory) {
    //         try {
    //             var item = this.inventory[i]
    //             var mouseItemDist = Math.hypot(mouseX - ((i % 8) * 100 + width / 8 + 100), mouseY - (height / 8 + 100 * (Math.floor(i / 8) + 1)))
    //             item.draw((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1))
    //             if (mouseItemDist < 50) {
    //                 ctx.fillStyle = "rgb(0, 0, 0)"
    //                 ctx.textAlign = "center"
    //                 ctx.font = "50px serif"
    //                 ctx.fillText(item.name, width / 2, height / 2 + 120)
    //                 ctx.font = "15px serif"
    //                 fillTextMultiLine(item.desc + "\nDamage: " + item.damage, width / 2, height / 2 + 150)
    //                 if (mouseIsDown) {
    //                     this.weaponIndex = i
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // } else if (this.itemsMode == 'FOOD') {
    //     for (var i in this.basket) {
    //         try {
    //             var foodItem = this.basket[i]
    //             var mouseItemDist = Math.hypot(mouseX - ((i % 8) * 100 + width / 8 + 100), mouseY - (height / 8 + 100 * (Math.floor(i / 8) + 1)))
    //             foodItem.draw((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1))
    //             if (mouseItemDist < 50) {
    //                 ctx.fillStyle = "rgb(0, 0, 0)"
    //                 ctx.textAlign = "center"
    //                 ctx.font = "50px serif"
    //                 ctx.fillText(foodItem.name, width / 2, height / 2 + 120)
    //                 // ctx.font = "15px serif"
    //                 // ctx.fillText(foodItem.desc + "\nDamage: " + item.damage, width / 2, height / 2 + 150)
    //                 if (mouseIsDown) {
    //                     this.eat(foodItem)
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }

    var subcategory = []

    for (var i in this.inventory) {
        try {
            var item = this.inventory[i]
            var mouseItemDist = Math.hypot(mouseX - ((i % 8) * 100 + width / 8 + 100), mouseY - (height / 8 + 100 * (Math.floor(i / 8) + 1)))
            if (this.itemsMode == 'ALL') {
                item.draw((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1))
                if (mouseItemDist < 50) {
                    ctx.fillStyle = "rgb(0, 0, 0)"
                    ctx.textAlign = "center"
                    ctx.font = "50px serif"
                    ctx.fillText(item.name, width / 2, height / 2 + 120)
                    ctx.font = "15px serif"
                    fillTextMultiLine(item.desc + "\nDamage: " + item.damage, width / 2, height / 2 + 150)
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

        ctx.lineWidth = 4
        ctx.roundRect(width * 3 / 4 - 60 - i * 60, height / 8, 50, 50, 5)
        ctx.fill()
        ctx.stroke()
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

// Player animations
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
        if (npcs[i].map == curMap && entityDistance(p, npcs[i]) < 100 && npcs[i].lineNum == -1) {
            return true
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
    } else {
        if (this.alertOpacity > 0) {
            this.alertOpacity -= 0.1
        }
    }
    
    ctx.fillStyle = "rgba(255, 255, 255, " + this.alertOpacity + ")"
    ctx.font = "30px serif"
    ctx.textAlign = "center"
    ctx.fillText(this.curAlert, width / 2, height - 75)
}

function GameAlert(x, y, lines, map, type, item, decipherLines) {
    this.x = x
    this.y = y
    this.lines = lines
    this.map = map
    this.type = type
    this.item = item // items you need to see a specific message (key)
	this.decipherLines = decipherLines // lines once deciphered

    this.showLines = false

    this.finishCooldown = 1
    this.lineNum = 0
    this.textCooldown = 1
    this.nextIndicator = false // To indicate you can move on to next line in speech
    this.nextIndicatorY = 0 // Animation effect
    this.nextIndicatorDir = "D"
    this.hasItem = false
    this.showKeyAlert = true

	this.playerRead = false
    
}

GameAlert.prototype.draw = function () {
    if (curMap == this.map) {
        if (this.type == "SIGN") {
            ctx.fillStyle = "rgb(51, 37, 25)"
            ctx.fillRect(this.x * 75 - p.x + width / 2 + 27.5, this.y * 75 - p.y + height / 2 + 10, 20, 65)
            ctx.fillStyle = "rgb(102, 74, 50)"
            ctx.fillRect(this.x * 75 - p.x + width / 2 + 5, this.y * 75 - p.y + height / 2 + 5, 65, 35)
        }
    } 
}

GameAlert.prototype.drawMessage = function () {
    if (curMap == this.map) { 

        if (this.lineNum == 0 && !this.showLines) {
            this.finishCooldown -= 1 / (66 + 2/3)
        }
		
        if (this.showLines && this.lineNum < this.lines.length) {
			if (!dev) {
            	this.textCooldown -= 1 / (66 + 2/3)
			} else {
				this.textCooldown -= 1 / 20
			}
            if (this.textCooldown <= 0) {
                this.nextIndicator = true
                if (this.nextIndicatorDir == "D") {
                    this.nextIndicatorY += 0.5
                } else    {
                    this.nextIndicatorY -= 0.5
                }
                
                if (this.nextIndicatorY >= 10) {
                    this.nextIndicatorDir = "U"
                }
        
                if (this.nextIndicatorY <= 0) {
                    this.nextIndicatorDir = "D"
                }
            }
			if (this.type == "MESSAGE") {
				ctx.fillStyle = "rgba(0, 0, 0, 0.60)"
			} else {
				ctx.fillStyle = "rgba(255, 255, 255, 0.60)"
			}
            ctx.roundRect(width / 4, height * 3 / 4 - 10, width / 2, height / 4, 10)
            ctx.fill()
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.font = "15px serif"
            ctx.textBaseline = 'middle'
            ctx.font = "20px serif"
            ctx.textAlign = 'center'
			
			if (this.type != "DECIPHER" && this.type != "MESSAGE" && this.type.substring(0, 3) != "NPC") {
            	fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 60)
			} else if (this.type == "MESSAGE") {
				ctx.fillStyle = "rgb(255, 255, 255)"
				fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 60)
            } else if (this.type.substring(0, 3) == "NPC") { // sort of confusing, but if this.type starts with "NPC"
                ctx.fillStyle = "rgb(0, 0, 0)"
				fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 60)
                ctx.font = "15px serif"
                ctx.textAlign = 'left'
                ctx.fillStyle = "rgb(0, 0, 0)"
                ctx.fillText(this.type.substring(3, this.type.length), width / 4 + 10, height * 3 / 4 + 5)
    			ctx.textBaseline = 'middle'

				// Small or big text
                ctx.font = "20px serif"
                ctx.textAlign = 'center'
			
            } else if (this.type == "DECIPHER" && p.weapon.name != "Decipherer") {
				ctx.fillStyle = "rgb(250, 0, 0)"
				fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 60)
			} else {
				ctx.fillStyle = "rgb(1, 50, 32)"
				fillTextMultiLine(this.decipherLines[this.lineNum], width / 2, (height * 3 / 4) + 60)
			}
		
            if (this.nextIndicator == true) {
                if (this.type == "MESSAGE") {
                    triangle(width / 2 - 10, height - 60 + this.nextIndicatorY, width/2 + 10, height - 60 + this.nextIndicatorY, width/2, height - 40 + this.nextIndicatorY, "rgb(255, 255, 255)")	
                } else {
                    triangle(width / 2 - 10, height - 60 + this.nextIndicatorY, width/2 + 10, height - 60 + this.nextIndicatorY, width/2, height - 40 + this.nextIndicatorY, "rgb(0, 0, 0)")	
                }
                
            }
    
            if (this.textCooldown <= 0 && keys.space) {
                this.lineNum ++
                this.nextIndicator = false;
                this.textCooldown = 1
				
            }
    		
            if (this.type != "MESSAGE" && this.type.substring(0,3) != "NPC" && this.lineNum == this.lines.length && keys.space) {
                this.showLines = false
                this.lineNum = 0
				this.playerRead    = true
				p.canMove = true
				
            }
        }

		if (this.type == "MESSAGE" || this.type.substring(0, 3) == "NPC") {
			if (this.lineNum < this.lines.length) {
				this.showLines = true
				p.canMove = false
			} else {
				this.showLines = false
				p.canMove = true
			}
			console.log(this.lineNum)
			
		}
    }
    
    if (p.cords.x == this.x && p.cords.y == this.y) {
        if (!this.showLines && curMap == this.map) {
            if (this.type == "SIGN") {
                ctx.fillStyle = "rgb(255, 255, 255)"
                ctx.roundRect(width / 2 - 75, height / 2 + 50, 150, 50, 10)
                ctx.fill()
                ctx.fillStyle = "rgb(0, 0, 0)"
                ctx.font = "15px serif"
                ctx.textAlign = "center"
                ctx.fillText("Press space to read", width / 2, height / 2 + 75)		
            } else if (this.type == "KEY") {
                for (var i in p.inventory) {
                    var item = p.inventory[i]
                    if (item.name == this.item) {
                        this.hasItem = true
                    }
                }
                if (this.showKeyAlert) {
                    if (!this.hasItem) {
                        ctx.fillStyle = "rgb(255, 255, 255)"
                        ctx.roundRect(width / 2 - 80, height / 2 + 50, 160, 50, 10)
                        ctx.fill()
                        ctx.fillStyle = "rgb(0, 0, 0)"
                        ctx.font = "15px serif"
                        ctx.textAlign = "center"
                        ctx.fillText("Press space to examine", width / 2, height / 2 + 75)	
                    } else {
                        ctx.fillStyle = "rgb(255, 255, 255)"
                        ctx.roundRect(width / 2 - 80, height / 2 + 50, 160, 50, 10)
                        ctx.fill()
                        ctx.fillStyle = "rgb(0, 0, 0)"
                        ctx.font = "15px serif"
                        ctx.textAlign = "center"
                        ctx.fillText("Click to unlock", width / 2, height / 2 + 75)	
                        
                    }
                }

                if (mouseIsDown && this.hasItem) {
                    this.showKeyAlert = false
                }
            } else if (this.type == "EXAMINE" || this.type == "DECIPHER") {
				
                    
				ctx.fillStyle = "rgb(255, 255, 255)"
				ctx.roundRect(width / 2 - 80, height / 2 + 50, 160, 50, 10)
				ctx.fill()
				ctx.fillStyle = "rgb(0, 0, 0)"
				ctx.font = "15px serif"
				ctx.textAlign = "center"
				ctx.fillText("Press space to examine", width / 2, height / 2 + 75)	
                
			}
        }

        if (this.type != "KEY" || (this.type == "KEY" && !this.hasItem)) {
            if (this.lineNum == 0 && !this.showLines && keys.space && this.lineNum != this.lines.length && this.finishCooldown <= 0) {
                this.showLines = true
                this.lineNum = 0
                this.finishCooldown = 1
                p.canMove = false
				
            }
            
            if (keys.space && this.textCooldown <= 0) {
                this.lineNum ++;		
            }
        }
    }

}

function Teleport(x, y, map) {
	this.x = x
	this.y = y
	this.map = map
}

Teleport.prototype.draw = function () {
		console.log(p.mapPan.x * mapScale)
		
		ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.scale(mapScale, mapScale) 
        ctx.translate(width / -2, height / -2)
        ctx.translate(p.mapPan.x, p.mapPan.y)
        
        
        ellipse(this.x, this.y, 50, 50, "rgb(0, 255, 255)")
		
		
		ctx.restore()
		
		if (mouseIsDown) {
			
			if (mouseX > this.x * 75 + p.mapPan.x && mouseX < this.x * 75 + (75 * mapScale) && mouseY > this.y * 75 && mouseY < this.y * 75 + (75 * mapScale)) {
				alert("click specific")
				p.x = this.x * 75 + 37.5
				p.y = this.y * 75 + 37.5
			}
		}
	
}
// GameAlert.prototype.changeAlert = function(signX, signY, signMap, newLines) {
// 	if (this.x == signX && this.y == signY && this.map == signMap) {
// 		lines = newLines;
// 	}
// }

//

var prisonGuard = new NPC(19 * 75 + 37.5, 2 * 75 + 37.5, "Prison Guard", imperilledPrison, "R", [""], "uh yeah")

var oldMan = new NPC(5*75, 1*75, "Old Man", johnHouse, "D", [
    "Huh? Who is there?",
    "Sorry, I can't see you very well.\nOld age has ruined my vision.",
    "Actually, could you do me a favor?\nFetch me my glasses, will you?",
    "One of the children near the big lake has taken them.",
    "Please go now."
], "yay", function(p) {
    // Original location of mike
    p.questPoint = {
        x: 27,
        y: 44
    }

	if (oldMan.firstInteraction) {
		curMissions.push(aStrangeWorld)
	}
}, "after")

// oldMan.glasses = true // Default false

var john = new NPC(17 * 75 + 37.5, 9 * 75 + 37.5, "John", mainMap, "D", [
    "Hi! You're that prison guy, aren't you?",
    "You know, ever since you suddenly woke up, \nyou've become a bit of a celebrity. At least for a few of us.",
    "We had heard about somebody stuck in the Imperilled Prison, but we never knew\nwhy. To be honest, we never thought you'd get out.",
    "If I were you, I'd speak to the old man. He's very knowledgable\nabout this stuff.",
    "And yes, I don't know his real name. He refuses to tell anyone, so\nwe just call him the old man.",
    "I've been taking care of him recently as his age is getting to him.\nHe's in my house right now.",
    "Anyway, I'll see you later!"
], "", function(p) {

}, "after")

var ron = new NPC(150, 300, "Ron", ronHouse, "D", [
    "*sigh*",
    "Hey, what are you looking at?",
    "...",
    "Yeah I know, my house is gross.\nNot sure why I chose my house to be stone.",
    "If I were to choose again, I would've made it wood.",
    "It's really expensive though.\n100 wood planks! In the end it isn't really worth it."
], "hi", function(p) {
    
}, 0)

var mike = new NPC(28 * 75, 44 * 75, "Mike", mainMap, "L", [
    "Hi.",
    "Who are you?",
    "...",
    "Oh, you're that dude who escaped from that prison thing!",
    "...",
    "You're looking for a pair of glasses?",
    "I found one on the ground. But first, I need to you\nto do me a big favor.",
    "My mom is a journalist, so she knows about your escape,\nor whatever it is.",
    "She's been trying to get a hold of you for an interview for\nages! I'm sure she'd love it if you paid her a visit.",
    "So, yeah. If you want these glasses, that's what you\ngotta do for me in return.",
], "Resident - Chard Town\nA curious child whose favorite spot is the Big Lake.", function(p) {
    cameraStart(51 * 75 + 37.5, 6 * 75 + 37.5, 25, "NPC", {
        lineStop: 9
    })
    // Location of Mike's Mom's house
    p.questPoint = {
        x: 51,
        y: 8
    }
}, 7)

var david = new NPC(16 * 75 + 37.5, 16 * 75 + 37.5, "David Swimmer", mainMap, "D", [
    "In case you're wondering, yes, my last name is actually Swimmer.",
    "I don't know what my parents were thinking.",
    "But I do love to swim!",
    "This pond is kind of depressing though. I would love to find\na great big pond that I could swim in forever!"
], "Resident - Chard Town\nA socially awkward dude who loves to swim.\nUnfortunately, he's not great at it.", function() {
    curMissions.push(davidsDreamPond)
}, "after")


var lyra = new NPC(6 * 75 + 37.5, 1 * 75 + 37.5, "Lyra", lyraHouse, "D", [
    "`What happened to all of the cool weapons?\nAll the weapons nowadays are the same.",
    "`It sure would be nice to see something new for a change..."
])

var carol = new NPC(5 * 75 + 37.5, 1 * 75 + 37.5, "Carol", carolHouse, "R", [
    "AAAH!",
    "`how did he get in my house how did he get in my house\nhow did he get in my house...",
    "*ahem",
    "Hello!",
    "Um, who exactly ARE you?",
    "...",
    "Okay then...",
    "∑∑∑∑∑∑ G! πππππππ"
], "Resident - Chard Town\nA passionate gardener. Slightly scared of strangers ever\nsince somebody stole her purse.", function() {
    
}, "after")

var ley = new NPC(17 * 75 + 37.5, 29 * 75 + 37.5, "Ley", mainMap, "D", [
    "...",
	"AHHH!",
	"`Gee... I didn't think anyone would find me here...",
    "Everyday I go for a walk,\nbut today I saw some creatures outside my house...",
    "...and I'm too scared to go over there!",
    "You see them? Over there?",
    "Could you please get rid of all of them?",
    "...",
    "Thank you! Let me know once you're done\nso I can go over there again!"
], "Resident - Chard Town\nA coward at times, but loves both the outdoors and spending time at home.", function(p) {
    cameraStart(44 * 75, 19 * 75, 15, "NPC", {
        lineStop: 7
    })
    ley.action = function(p) {
        if (ley.firstInteraction) {
            curMissions.push(leysGreatFear)    
        }
    }
    ley.actionLine = "after"
}, 5)

var sarahShopMenu = [
    {item: food.apple(), cost: 10, amount: 5},
    {item: food.cookie(), cost: 15, amount: 3},
    {item: food.steak(), cost: 30, amount: 1},
]

var sarah = new NPC(4 * 75 + 37.5, 1 * 75 + 37.5, "Sarah", sarahsShop, "D", [
    "Hello there, uh...",
    "`what was it again? Oh yeah!",
    "Hello there, good sir! I'm opening a\nshop here in Chard Town!",
    "Right now I just sell food, but one day I'll\nbe making billions of trills!",
    "Want to buy something? You'd be my very first customer!"
], "Resident - Chard Town\nAn aspiring businesswoman with big ambitions. Everybody starts small, though.", function(p) {
    ShopMenu.open(sarahShopMenu)
}, "after")

var mikesMom = new NPC(300, 300, "Mike's Mom", mikeHouse, "R", [
    "Wait.",
    "Are you that guy who was stuck in that prison for all this time?",
    "...",
    "Woah! I've been trying to interview you for so long, and you just\nturn up at my house!",
    "Unfortunately, you turned up at an inconvenient time for me. I've got to do\nreports all over Chard Town today.",
    "Well, anyway, at least I got to meet you. I was starting to believe you didn't exist!",
    "Maybe we can conduct an interview later.",
    "Oh! By the way, have you seen my son? I let him play by the lake, but\nhe hasn't come home yet.",
    "...",
    "You have seen him? That's a relief. Could you please tell him to come back home?",
    "...",
    "Thank you!"
], "Resident - Chard Town\nMike's Mother. An enthusiastic journalist who loves meeting new people and making new friends.", function(p) {
    mike.lines = [
        "Hi.",
        "Did you talk to my mom?",
        "...",
        "Thanks.",
        "...",
        "She was busy? That's okay. I appreciate you for trying.",
        "Here, you can have the glasses. I don't know why\nyou need them, but whatever.",
        "...",
        "Fine, I'll go back home."
    ]
    mike.action = function(p) {
        p.giveItem(items.oldMansGlasses, true)
        // Location of the Old Man's house to give him the glasses
        p.questPoint = {
            x: 15,
            y: 8
        }
        mike.lines = [
            "Hi!",
            "Uh...",
            "Bye..."
        ]

        mike.actionLine = -2

        mike.curPath = [ // Walk back to his house
            [11, 44],
            [11, 37],
            [14, 34],
            [14, 31],
            [23, 31],
            [23, 10],
            [51, 10],
            [51, 8],
            function() {
                mike.map = mikeHouse
                mike.x = 6 * 75 + 37.5
                mike.y = 4 * 75 + 37.5
                mike.dir = 'L'
            }
        ]
    }
    mike.actionLine = "after"
    // Second location of mike to get the glasses
    p.questPoint = {
        x: 27,
        y: 44
    }

	
}, 0)

var rowan = new NPC(7 * 75 + 37.5, 6 * 75 + 37.5, "Rowan", rowansDojo, "L", [
    "Welcome to my dojo!",
    "Want to to learn some tips on combat?",
    "...",
    "Perfect!",
    "Tip #1: Some weapons are faster than others, and are only useful in\nvery specific situations. Choose them wisely!",
    "Tip #2: When fighting monsters, you can quickly go near them to bait\nthem into hitting.",
    "Then, get out of their range. This will leave you with an opening to\nattack before they can hit you again!",
    "Hopefully these tips will prove themselves helpful to you. And hopefully,\none day, my dojo will have real students!",
    "See ya."
], "Resident - Chard Town\nA skilled fighter who wants to teach the world! He doesn't have any students yet, though.", function(p) {
    
}, "after")

var wayne = new NPC(48 * 75, 55 * 75, "Wayne", mainMap, "D", [
    "Aye matey! What brings you to this foreign land?",
    "I'm Wayne, fearless sailor of the seven seas!",
    "Well that's what I've told everyone anyways.\nI actually just swim a lot.",
    "I'm sure you've heard of the mysterious cavern\nnear the big lake.",
    "...",
    "You haven't? Huh, I would have thought somebody\nhas told you about this.",
    "However, It hasn't been open for years,\nno one knows how to get in nor what's inside...",
    "By the way, what's your name, pirate?",
    "...",
    "Oh! In that case, have you talked to that old guy?",
    "He wanted to meet you and tell you something\napparently..."
], "Resident - Chard Town\nHe is always outdoors, and loves to raft and swim whenever he gets the chance.", function(p, npc) {
    var old_man = npcs.searchByName("Old Man")
    if (old_man.glasses) {
        wayne.lines = [
            "Use the key I gave you to head east, towards the next village!"
        ]

        // Location of Smith the Blacksmith's house
        p.giveItem(items.steelFieldKey, true)
        p.questPoint = {
            x: 130,
            y: 37
        }

        wayne.action = function() {}
    }
}, "after")

var smith = new NPC(4 * 75, 1 * 75, "Smith the Blacksmith", smithHouse, "D", [
    "Hey!",
    "Who are you??",
    "...",
    "Kay. I'm guessin' you here to get some cool stuff.",
    "I normally give a little somethin' to people who\ncome here, but I'm gonna need you to get me somethin' too.",
    "Could you fetch me a Heat Handle? I need it if you want me to help you.",
    "See ya!"
], "Resident - Steel Field\nEveryone's go to blacksmith. Go to him if you want a weapon made quick for a low price.")

var rick = new NPC(9 * 75, 2 * 75, "Rick Ashley", rickHouse, "L", [
    "I'm feeling lonely.",
    "Everyone I've ever met has either given me up...",
    "...or let me down.",
    "constipated shrub"
], "Resident - Steel Field\nHe, uh, doesn't really do anything.")

var rocky = new NPC(119 * 75, 17 * 75, "Rocky", mainMap, "R", [
    "Hi.",
    "Are you a traveler?",
    "...",
    "Nice.",
    "...",
    "So uh...",
    "Yyyyyyup.",
    "...",
    ".....",
    "ok...",
    "uh, bye."
], "hi", function(p, npc) {
    this.curPath = [
        [119, 3],
        [134, 3],
        [134, 9],
        function() {
            rocky.lines = [
                "I love lava."
            ]
        }
    ]
}, "after")

var kori = new NPC(178 * 75, 13 * 75, "Kori", mainMap, "L", [
    "Hi.",
    "Just watering my, uh, trees.",
    "By the way, I've never seen you before.",
    "There aren't a whole lot of people in Glacia Village\nso we all really know everybody.",
    "Where are you coming from, then?",
    "...",
    "Huh. That's weird.",
    "Anyways, I'll see you later!"
], "hi")

var isa = new NPC(2 * 75 + 75, 7 * 75, "Isa", glaciaCenter, "R", [
    "Hello, welcome to the Glacia center.",
    "There's not much to do here though...",
    "Hey, you don't look like you're from around here.",
    "What do you need?",
    "...",
    "Masters? Locked away? Haha!",
    "I don't get it.",
    "...",
    "Wait, you're not joking?",
    "Oh, uh, I can't help you then. Maybe ask Lonzo.\nHe knows a lot of weird, uh, stuff.",
    "Everybody thinks he's crazy, but uh, I would ask him.\nSee you later."
], "hi")

var lonzo = new NPC(3 * 75 + 37.5, 1 * 75 + 37.5, "Lonzo", lonzoHouse, "D", [
    "*cough",
    "Hello. Who might you be?",
    "...",
    "nice.",
    "What do you need?",
    "...",
    "Elemental masters? Ah yes, yes, I\nkeep telling everybody about them, but nobody believes\nme!",
    "It makes me sag.",
    "Sad, I mean.",
    "Anyway, the master of wind is locked around this\narea somewhere.",
    "I know that from the time I snuck into the\nqueen's lair to use the toilet. But\nthat's a whole different story.",
    "You should ask the queen, but she...",
    "C&BP$wbo9#&W*CN#O(B(BVO!!!",
    "...she doesn't make much contact with the outside world, so\nher lair might be tough to get into.",
    "I think I fell down on my way out of it so I\ndon't remember where it is. But it's somewhere\nto the east, and...",
    "zzz", 
    "zzzzzzzzzzz..."
], "hi")

var guardAlfred = new NPC(19 * 75 + 37.5, 7 * 75 + 37.5, "Castle Guard Alfred", queensCastle, "D", [
    "Hello. Welcome to the High Floor.",
    "Are you looking to meet with the Queen?",
    "...",
    "Ah yes. She's been waiting someone.\nShe made a wall around her throne that APPARENTLY\nopens only to this person.",
    "She's been hiding in there for a while now.\nHopefully, you're the person she's waiting for!",
    "The queen instructed us to tell visitors to stand on the white\nblock in front of her throne.",
    "So far, no visitor's prescence opened the door,\nso we are starting to lose hope.",
    "Anyway, you may now proceed."
], "hi")

var queenAlaska = new NPC(42 * 75 + 37.5, 3 * 75 + 37.5, "Queen Alaska", queensCastle, "L", [
    "Welcome! I am Queen Alaska, but you can just\ncall me Alaska.",
    "I see your prescence triggered my special\nwall, which means you are the person I'm supposed to meet.",
    "So, is it true? Did you really venture into the Confounded Cave\nof Chard Town and defeat Darkened?",
    "...",
    "That's incredible. You know, another Elemental Master was\ncaptured here, in Glacia.",
    "Unfortunately, almost nobody knows that the Elemental Masters exist anymore!",
    "Anyway, legend says that it can be found\nsomewhere in Glacia. However, many past Queens have\nfailed to locate it.",
    "This leads me to believe that it's underground\nsomewhere. Specifically near Glacia Village.",
    "However, even if you do find where the prison is, it could be\nextremely dangerous to enter!",
    "Long ago, when the Elemental Masters were corrupted and\nrunning free, this specific one was notorious for causing\nannoying winds.",
    "While Darkened had its magical spear to bring it power\n(which " + badGuy + " gave it), this Master, known as Stormed\nwould use a powerful sword.",
    "Its strong control over wind and weather meant that\nthe people of Glacia were be best suited to\ncapture this beast.",
    "The leaders of this island's regions, like me,\nhave attempted to locate and take down these corrupted masters.",
    "However, the borders between the regions made this\nvery difficult. So, we need you to take the Masters out one at a time.",
    badGuy + " provided the Masters with weapons in the\norder of the Sacred Star.",
    "So, by looking at the connection points,\nwe believe you should defeat the Masters in the\nfollowing order: Night, Wind, Sea, Land and Day.",
	"Although I wish that I could tell you where this prison is,\nI'm going to have to leave it up to you.",
    "However, we suspect it could be somewhere in the perilous Windy Wastelands.\nIf you do go there, please be extremely careful.",
    "I'll call Lonzo to help you out. He'll be waiting for you at\nthe front of this castle.",
	"Good luck my friend! You're definitely going to need it."
], "hi", function(p) {
    lonzo.x = 252 * 75 + 37.5
    lonzo.y = 21 * 75 + 37.5
    lonzo.map = mainMap
    lonzo.lines = [
        "Hey there again!",
        "I've been looking for you. Nice job making\nit inside the queen's castle!",
        "Did you...",
        "B$(8N(#c7b9BC@7@%B??",
        "...sorry. Did you talk to her?",
        "...",
        "Nice! Anyway, she announced to the village that\nyou would be venturing into the Windy Wastelands.",
        "I found the key there a while ago buried in the snow.\nHowever, the Wastelands are incredibly dangerous, so I never\nhad any reason to go there.",
        "The queen's been telling me to keep it safe, and now I\nknow why!",
        "Anyway, here you goat.",
        "Go*."
    ]
    lonzo.action = function(p) {
        p.giveItem(items.windyWastelandKey, true)
    }
    lonzo.actionLine = "after"
}, "after")

var fee = new NPC(46 * 75 + 37.5, 16 * 75 + 37.5, "Fee", galeCave, "D", [
    "Lemme guess, you came to talk to me for a word of advice.",
    "I always just go with the flow...",
    "Also, have you seen three other people that look like me?\nThey're in this cave somewhere..."
], "hi")

var fi = new NPC(4 * 75 + 37.5, 16 * 75 + 37.5, "Fi", galeCave, "D", [
    "Hey pal, want a word of advice?",
    "If you ever hit rock bottom, the only way is up.",
    "By the way, where'd fee, fo, and fum go?"
], "hi")

var fo = new NPC(5 * 75 + 37.5, 9 * 75 + 37.5, "Fo", galeCave, "D", [
    "This cave has been dark for so long...",
    "In the meantime, I've made up a song.",
    "Red, Orange, Yellow then Blue, Indigo and Violet Too!",
    "Am I forgetting something?",
    "...",
    "Anyway, I've been looking for my brothers, but I can't see\nanything!"
], "hi")

var fum = new NPC(37 * 75 + 37.5, 2 * 75 + 37.5, "Fum", galeCave, "D", [
    "HEY YOU! WHAT ARE YOU DOING?",
    "Hah, I'm just messin' with you.", "When things get heated, always stay calm.",
    "You have any idea why the cave is so dark?"
], "hi")

var muhammadShop = [
    {item: items.auraOfWarmth, cost: 12, amount: 2}
]

var shopkeeperMuhammad = new NPC(58 * 75, 33 * 75 + 37.5, "Shopkeeper Muhammad", galeCave, "L", [
    "Hello!",
    "Would you like to purchase some auras?\nWe use all-natural ingredients.",
    "By the way, if you're ever short on money, try killing\nsome Splints, monsters notorious for stealing.",
    "If I remember correctly, there used to be plenty\nover at the Crooked Coast, south of Chard Town.",
    "I don't know if they are still there, but\nit's worth checking out."
], "hi", function() {
    ShopMenu.open(muhammadShop)
}, "after")

var mildred = new NPC(6 * 75 + 37.5, 2 * 75 + 37.5, "Mildred", trailShop, "D", [
	"Oh, hello there.",
	"In my 50 years of business, I haven't seen you once before!",
	"...",
	"You come all the way from chard town? Oh boy.",
	"Well, I'm sure you've heard of trail mixes before...",
	"...",
	"WHAT! YOU HAVEN'T?!?!",
	"`Wow... what a strange fellow...",
	"Anyways. I'm happy to tell you about them.",
	"Trail mixes are a great way to add paths to the outside world.",
	"And for the large trails you see today?\nMany paths have been built with materials from my store!",
	"And now YOU can become a trailblazer as well!",
	"We have three trail mixes.\nOur shop menu will provide you with all the information you need.",
	"Whenever you need more trails, just come talk to me!",
	"Good luck trailing, young fella!"
], "hi", function() {		
		mildred.lines = ["Glad you're back! Let me open up the shop menu for you."]	
		mildred.action = function() {
	        ShopMenu.open([
	        	{item: items.speedySnowPath, cost: 12, amount: 2}
	 		])
	    }
	    mildred.actionLine = "after"
		
}, "after") 

var theWanderer = new NPC (60 * 75, 41 * 75, "The Wanderer", mainMap, "D",    [
	"`...",
	"Hey kid...",
	"`I haven't seen you around before...",
	"`But something in my mind tells me that you're special.",
	"`Want to learn how to... teleport?",
	"...",
	"Ahh. Now I've gotten your attention.",
	"Each location on this island has an enigma, a mystery.\nSolving it will give you incredible powers, according to what I've read in ancient tales.",
	"I've read dozens upon dozens of books about this land,\nand also encountered a very, very special item.",
	"...",
	"What. You think I'm going to tell you for free? Haha.",
	"First, I need to make sure you are worthy of this treasure.",
	"If you solve this riddle, I'll tell you more about this item.\nAre you up for the challenge?",
	"...",
	"`Good.",
	"The puzzle I give will set your wishes free,\nonce you decipher it, come straight back to me...",
	"The riddle I'll give is one that is from an very ancient text\nthat originated from this area.",
	"You ready?",
	"`Although first difficult to arrive at this sea,\nThe bottom right corner is the right place to be.",
	"Find the location, then return here.\nGood luck!",
	
], "hi", function () {
    if (theWanderer.firstInteraction) {
        curMissions.push(theWanderersRiddles)
    }
    theWanderer.action = function (p) {
        
        
    }
		
	
}, "after")

var lostTraveler = new NPC (252 * 75 + 37.5, 48 * 75 + 37.5, "Lost Traveler", mainMap, "D", [
    "Oh yeahhhh",
    "oh yeahh"
])


// Starts outside of the map because he doesn't exist until later in the game
var drQua = new NPC(69420 * 75, 42069 * 75, "Dr. Qua", mainMap, 'L', [
    "Hello there!",
    "You must be who Queen Alaska was talking about!",
    "I'd only heard rumors about you until now. However...",
    "We really do need your help.",
    "Our city has been struck by many strong currents,\nand they've been very threatening to the people living there.",
    "Usually I would be asking my captains to help,\nbut they were sent on a mission, and...",
    "Unfortunately they got lost and have been missing for a few days now.",
    "We've closed off the forest since then.\nWe don't want to lose anyone else.",
    "We need a way to go into the forest safely, and bring back our captains!\nThey'll know what to do!",
    "In the forest's west entrance, you'll meet a guard.\nYou should talk to her.",
    "Good luck, and stay safe out there."
], "[insert description]", function() {
    p.questPoint = {
        x: 252,
        y: 80
    }
}, "after")

var caruk = new NPC(227 * 75, 90 * 75 + 37.5, "Caruk the Fisherman", mainMap, 'L', [
    "I am fisherger!",
], "[insert description]", function() {

}, "after")

var creek = new NPC(226 * 75 + 37.5, 87 * 75, "Creek", mainMap, 'U', [
    "Hello there kind sir!",
    "I'm setting up a shop, but it's not quite ready.",
    "Come back later when it's complete."
], "[insert description]", function() {

}, "after")

var coral = new NPC(5 * 75 + 37.5, 2 * 75, "Coral", coralsWatercolors, 'D', [
    "Hello, I'm coral, and welcome to my watercolor shop.",
    "You know the big lake outside? I paint pictures of it so you can\nappreciate it when you're away!",
    "If you'd like to buy a painting, please let me know!"
], "coral reef changeme", function () {
    ShopMenu.open(coralShop)
}, "after")

var coralShop = [
    {item: items.droptonLakePainting, cost: 80, amount: 1}
]

var blakeShop = [
    {item: items.aquaLung, cost: 100, amount: 1}
]

var blake = new NPC(8 * 75 + 37.5, 1 * 75 + 75 /* So he stands on the very edge of the block */, "Blake", droptonWaterWear, 'D', [
    "Hello there!",
    "Welcome to Dropton Water Wear!",
    "You don't appear to be a resident of Dropton.",
    "Can I interest you in some gear? It can allow you to \n swim underneath some bodies of water.",
], "[insert description]", function() {
    ShopMenu.open(blakeShop)
}, "after")

var ness = new NPC(13 * 75 + 37.5, 13 * 75 + 37.5, "Ness", droptonTunnels, 'R', [
    "Welcome to the Dropton Tunnels!",
    "Are you new here or are you returning?",
    "...",
    "I see. I can let you in to the main city, but\nyou'll be denied entry to certain places until\nyou get a Full Pass.",
    "I'm not able to help you get one, but I'm sure\nsomebody in Dropton can."
], "[insert description]", function() {

}, "after")

var bay = new NPC(15 * 75 + 37.5, 9 * 75 + 37.5, "Bay", droptonTunnels, 'D', [
    "Hi there!",
    "These tunnels are confusing, aren't they?",
    "Most of the paths don't do anything, they're only used in emergencies.",
    "But if you're heading to central Dropton City, take a left.",
    "If you're trying to get to Dropton Town, take a right.\nNot much happens there though...",
    "If you don't know where to go, you should take a\nleft and visit Dropton City."
], "[insert description]", function() {

}, "after")

var tyde = new NPC(33 * 75 + 37.5, 16 * 75 + 37.5, "Tyde", droptonCity, 'U', [
    "*sniff*",
    "Hi...",
    "You look like you're from the surface.",
    "Sorry you have to see me like this.",
    "A couple days ago, the water started flowing really fast, kind of\nlike the wind you guys have on the surface.",
    "Except it was REALLY scary!",
    "...and my house got destroyed. I'm just waiting for the construction\npeople to fix it."
], "[insert description]", function() {

}, "after")

var walter = new NPC(23 * 75 + 75 / 2, 32 * 75 + 75 / 2, "Walter", droptonCity, 'L', [
    "Hello there!",
    "You don't seem like a water dude. You look\nlike a surface dude.",
    "Have you heard about the strange currents destroying\nthis place?",
    "...",
    "You're here to help? Thank the lord, I've been waiting for\nsomebody to do something about it.",
    "I'd suggest you talk to our president. He's out in Dropton Town\nright now doing some business. I'm sure he'd be very glad to meet you.",
    "Until we meet again!"
])

var marina = new NPC(2 * 75 + 75, 17 * 75 + 37.5, "Officer Marina", droptonCity, 'D', [
    "Hey.",
    "The Pass Office is closed right now. Sorry\nabout the inconvenience.",
    "Dropton is short on money due to all the repairs,\nso we're shut down for the time being.",
    "If you could support to the city of Dropton by buying from shops,\nthat would help a lot!",
    "I will warn you, though, that the shops are a good deal more expensive.",
    "So, as a bonus, we are offering a Full Pass to anyone\nwho contributes at least 250 trills!",
    "If you're short on trills, I heard people up in the drylands\nhave some problems going on. Maybe you can help them out!",
    "So, if you need one, this is your chance!",
], "A Dropton Pass Officer. Unfortunately the Pass Office is closed right now because\nDropton is short on money.", function() {

}, "after")

var ariel = new NPC(14 * 75 + 37.5, 26 * 75 + 37.5, "Ariel", droptonCity, 'L', [
    "Hello there!",
    "You seem to be from the surface!",
    "Unfortunately, you came to visit Dropton City at a\nreally bad time.",
    "The city desperately needs funding, and while I appreciate\nthe efforts to fundraise...",
    "...that Raine kid who's doing it is so ANNOYING!",
    "He just...he makes me want to scream! No wonder this town is broke!",
    "`I probably shouldn't have said that so loud...",
    "Anyway, I'd steer clear of that kid. He's a real menace.",
    "He lives somewhere on the eastern side on Dropton City,\nbut I'm not sure where exactly.",
    "Alright, this has been a nice chat. Bye!"
], "Resident - Dropton City\nProbably has anger issues. Does not like 'that Raine kid'.", function() {

}, "after")

var raine = new NPC(47 * 75, 38 * 75 + 37.5, "Raine", droptonCity, 'L', [
    "Ayo!",
    "GIVE ME MONEY!!!!",
    "To fIx ThE hOUsEs!!!!",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "GIVE IT NOW I PROMISE I WON't STEAL IT!!!!!!",
    "EEEEEEEEEEEEÊEEEEEEEEEEEEÊEEEEEEEEEEEE",
    "QOBV*YIUROS(*BIVSYOH(EBWYOESITVSYBUOIYUYBOI&!!!!!!!!",
    "MONEYMONEYMONEYMONEYMONEYMONEYMONEYMONEYMONEYMONEYMONEY",
    "...",
    "Dad?",
    "I'm not THAT loud!!",
    "...ugh, fine. I'll stop",
    "Bye-bye random person."
], "Resident - Dropton City\nReally annoying kid that nobody wants to go near.", function() {
    rainesDad.curPath = [
        [55, 40],
        [49, 40],
        [49, 38],
        [48, 38]
    ]

    rainesDad.lines = [
        "*sigh",
        "`I wish my son was quieter...",
        "...",
        "Oh, hi, didn't see you there.",
        "If you still want to support Dropton, I'd suggest heading\non over to Dropton Town.",
        "There are plenty of shops there which would allow you to help us out.",
        "Thank you so much, and I apologize about my son."
    ]

    raine.action = function() {
        raine.curPath = [
            [49, 38],
            [49, 40],
            [52, 40],
        ]
    }
    raine.actionLine = "after"
}, 4)

var rainesDad = new NPC(55 * 75 + 37.5, 39 * 75 + 37.5, "Raine's Dad", droptonCity, 'L', [
    "Hello there, how are you?",
    "...",
    "Good. I work as a repairman, so as you can imagine, I'm pretty\nbusy these days.",
    "This is one of the few times I get a break, so I enjoy it while I can..."
], "Resident - Dropton City\nMuch more enjoyable to talk to than his son.", function() {

}, "after")

var caspianShop = [
    {item: food.apple(), cost: 5, amount: 5}
]

var caspian = new NPC(6 * 75, 4 * 75 + 37.5, "Caspian", droptonTown, 'L', [
    "Hey there!",
    "I'm trying my best to help support Dropton, so I've\nset up a little shop!",
    "It's not much right now though...",
], "Resident - Dropton Town\nEnthusiastic little guy who wants to help Dropton.", function() {
    ShopMenu.open(caspianShop)
}, "after")

var loch = new NPC(40 * 75 + 37.5, 28 * 75 + 37.5, "Loch", droptonCity, 'L', [
    "Hey there.",
    "This mysterious substance just recently formed around Dropton City's\nmain entrance.",
    "...",
    "Wait, you know about this stuff?",
    "Anyways, if we find a way to get rid of this ice, I'm pretty sure the\nflow of the water will get rid of this purple stuff.",
    "I tried to break as much as possible by hand, but it was too dangerous.",
    "Opening up this entrance would provide easy access to Dropton Dryalnds!",
    "If you have any ideas on how to fix this, it will be very helpful.\nI'll reward you too!"
], "ello", function() {
    curMissions.push(theBlockedEntrance)
}, "after")

var delta = new NPC(18 * 75 + 37.5, 11 * 75 + 37.5, "Delta", droptonTown, 'D', [
    "Hi! Could you help me with something?",
    "I found this treasure chest in Dropton City, but I didn't have the key.",
    "Then, I found the key many days later on the ground!",
    "There's just one problem...I don't remember where the treasure chest was.",
    "I just know that it was on the south side of the city, and it had walls around it.",
    "Can you help me find it?",
    "...",
    "Thanks! Here's the key so that you can unlock it when you find it.",
    "I'm counting on you!"
], "[insert description]", function() {
    p.giveItem(items.deltasKey, true)
    curMissions.push(deltasLostTreasure)
}, "after")

var presidentWells = new NPC(1 * 75 + 37.5, 1 * 75 + 37.5, "President Wells", droptonResearchFacility, 'R', [
    "Oh hello there!",
    "...erm, who are you?",
    "...",
    "Ah yes! I remember now. You've become quite famous, you know.",
    "As I'm sure you've heard, something mysterious is going on.",
    "Unfortunately, I can't talk about this here.",
    "Meet me at Dropton Hall, in Dropton City."
], "[insert description]", function() {
    presidentWells.curPath = [
        [1, 4],
        [4, 4],
        function() {
            presidentWells.map = droptonHall
            presidentWells.x = 1 * 75 + 37.5
            presidentWells.y = 1 * 75 + 37.5

            presidentWells.lines = [
                "Hello again! Great to see that you made it.",
                "Can I trust you with something important?",
                "...",
                "Okay. You must know about the strong currents destroying Dropton, right?",
                "Well, everybody believes that it has to do with hydrothermal vents.\nBut I suspect that it's something else.",
                "You see, we have always believed that we sat at the bottom of this lake.\nBut right before the currents came, I felt a strong rumble.",
                "I figured it came from the surface, but nobody there seemed to have felt a thing!",
                "Not just that, but in testing, the hydrothermal vents weren't able to generate such forces.",
                "...sorry, that was a lot.",
                "Anyway, I'll need you to help me investigate."
            ]

            presidentWells.action = function() {
                Screen.shake(5, 3)
                setTimeout(() => {
                    presidentWells.lines = [
                        "What was that??",
                        "Quick, we need to make sure everyone is safe!"
                    ]

                    presidentWells.lineNum = 0 // Starts talking automatically

                    presidentWells.action = function() {
                        presidentWells.curPath = [
                            [1, 5],
                            [7, 5],
                            [7, 6],
                            function() {
                                presidentWells.x = 23 * 75 + 37.5
                                presidentWells.y = 35 * 75 + 37.5
                                presidentWells.map = droptonCity

                                presidentWells.lines = [
                                    "Did you hear? Something is happening on the north side of Dropton City!",
                                    "I haven't got a clue what it is, but everybody seems to be rushing to\nsee it!",
                                    "So, I'm going to need your help. Can you head over there\nand see what's going on?",
                                    "I'll check the rest of the city, and make sure that everybody is okay.",
                                    "Good luck!",
                                ]
                                presidentWells.actionLine = 1
                                presidentWells.action = function() {
                                    cameraStart(39 * 75, 4 * 75 + 37.5, 15, "NPC", {
                                        lineStop: 3
                                    })
                                }

                                // Open weird crack thing at the top of Dropton City
                                droptonCity.changeBlock(36, 0, 'S')
                                droptonCity.changeBlock(36, 2, 'S')
                                droptonCity.changeBlock(37, 3, 'S')
                                droptonCity.changeBlock(39, 1, 'O')
                                droptonCity.changeBlock(41, 1, '_')
                                droptonCity.changeBlock(41, 2, '_')
                                droptonCity.changeBlock(42, 2, '_')
                                droptonCity.changeBlock(41, 3, 'S')
                                
                                // Change Ariel
                                ariel.x = 34 * 75 + 37.5
                                ariel.y = 2 * 75 + 37.5
                                ariel.dir = 'R'
                                ariel.lines = [
                                    "What happened here?",
                                    "This clump of rocks was formed the last time the ground shook like this.",
                                    "But now it looks like it has opened up into some sort of cave!",
                                    "I never realized that there was anything below Dropton City.",
                                    "Hopefully something is done about it..."
                                ]

                                // Change Walter
                                walter.x = 45 * 75 + 37.5
                                walter.y = 2 * 75 + 37.5
                                walter.dir = 'L'
                                walter.lines = [
                                    "Oh my goodness...",
                                    "I've never seen this before! There's a cave underneath Dropton!",
                                    "The president better get over here quick!"
                                ]
                            }
                        ]
                    }
                }, 5250)
            }
        }
    ]
}, "after")

var cascade = new NPC(6 * 75 + 75, 2 * 75 + 37.5, "Dr. Cascade", droptonResearchFacility, 'R', [
    "Hmm...",
    "Let's see here, if I add some water...",
    "No, that won't work..."
], "[insert description]", function() {

}, "after")

var npcs = [prisonGuard, oldMan, john, ron, mike, mikesMom, david, lyra, carol, ley, sarah, rowan, wayne, smith, rick, rocky, kori, isa, lonzo, guardAlfred, queenAlaska, fee, fi, fo, fum, shopkeeperMuhammad, mildred, theWanderer, lostTraveler, drQua, caruk, creek, coral, blake, ness, bay, tyde, walter, marina, ariel, raine, rainesDad, caspian, loch, delta, presidentWells, cascade]
var shopMenus = [muhammadShop, blakeShop, caspianShop]

npcs.searchByName = function(name) {
    for (var i in this) {
        var npc = this[i]
        if (npc.name == name) {
            return npc
        }
    }
}

if (!!save) {
    for (var i in save.npcActions) { // Load save for NPC actions
        var actn = save.npcActions[i].action
        var nm = save.npcActions[i].name
        npcs.searchByName(nm).action = eval("(" + actn + ")")
    }

    for (var i in save.npcPathActions) { // Load save for NPC path actions
        var actn = save.npcPathActions[i].pathAction
        var nm = save.npcPathActions[i].name
        var nindex = parseFloat(save.npcPathActions[i].index)
        npcs.searchByName(nm).curPath[nindex] = eval("(" + actn + ")")
    }    
}

// Main Map

var t116_31 = new Toggle(mainMap, 116, 31, function() {
    curMap.changeBlock(121, 27, ")")
}, function() {
    curMap.changeBlock(121, 27, "(")
})

var t102_3 = new Toggle(mainMap, 102, 3, function() {
    curMap.changeBlock(121, 28, ")")
}, function() {
    curMap.changeBlock(121, 28, "(")
}, 121 * 75 + 37.5, 28 * 75 + 37.5)

var t77_5 = new Toggle(mainMap, 77, 5, function() {
    curMap.changeBlock(121, 29, ")")
}, function() {
    curMap.changeBlock(121, 29, "(")
}, 121 * 75 + 37.5, 29 * 75 + 37.5)

var t97_11 = new Toggle(mainMap, 97, 11, function() {
    curMap.changeBlock(121, 30, ")")
}, function() {
    curMap.changeBlock(121, 30, "(")
}, 121 * 75 + 37.5, 30 * 75 + 37.5)

var rd257_30 = new RaftDispenser(mainMap, 257 * 75, 30 * 75, 257 * 75 + 37.5, 29 * 75 + 37.5)

var rd256_66 = new RaftDispenser(mainMap, 256 * 75, 66 * 75, 255 * 75 + 37.5, 66 * 75 + 37.5)

// Confounded Cave

var t5_18 = new Toggle(confoundedCave, 5, 18, function() {
    curMap.changeBlock(9, 18, "S")
    curMap.changeBlock(10, 18, "_")
    curMap.changeBlock(9, 19, "_")
    curMap.changeBlock(10, 19, "S")
}, function() {
    curMap.changeBlock(9, 18, "_")
    curMap.changeBlock(10, 18, "S")
    curMap.changeBlock(9, 19, "S")
    curMap.changeBlock(10, 19, "_")
})

var t5_19 = new Toggle(confoundedCave, 5, 19, function() {
    curMap.changeBlock(9, 19, "S")
    curMap.changeBlock(10, 19, "_")
    curMap.changeBlock(9, 20, "_")
    curMap.changeBlock(10, 20, "S")
}, function() {
    curMap.changeBlock(9, 19, "_")
    curMap.changeBlock(10, 19, "S")
    curMap.changeBlock(9, 20, "S")
    curMap.changeBlock(10, 20, "_")
})

var t6_19 = new Toggle(confoundedCave, 6, 19, function() {
    curMap.changeBlock(10, 19, "S")
    curMap.changeBlock(11, 19, "_")
    curMap.changeBlock(10, 20, "_")
    curMap.changeBlock(11, 20, "S")
}, function() {
    curMap.changeBlock(10, 19, "_")
    curMap.changeBlock(11, 19, "S")
    curMap.changeBlock(10, 20, "S")
    curMap.changeBlock(11, 20, "_")
})

var t6_12 = new Toggle(confoundedCave, 6, 12, function() {
    curMap.changeBlock(11, 22, ")")
    curMap.changeBlock(5, 14, "_")
    curMap.changeBlock(11, 16, ")")
    
}, function() {
    curMap.changeBlock(11, 22, "(")
    curMap.changeBlock(11, 16, "(")
    curMap.changeBlock(5, 14, "S")
}, 11 * 75 + 37.5, 19 * 75 + 37.5)

var t14_12 = new Toggle(confoundedCave, 14, 12, function() {
    curMap.changeBlock(39, 22, ")")
}, function() {
    curMap.changeBlock(39, 22, "(")
}, 39 * 75 + 37.5, 22 * 75 + 37.5)

var t15_8 = new Toggle(confoundedCave, 15, 8, function() {
    curMap.changeBlock(20, 0, ")")
}, function() {
    curMap.changeBlock(20, 0, "(")
}, 20 * 75 + 37.5, 0 * 75 + 37.5)

// Queen's Castle

var t2_2 = new Toggle(queensCastle, 2, 2, function() {
    curMap.changeBlock(1, 3, "!")
    curMap.changeBlock(3, 1, "~")
}, function() {
    curMap.changeBlock(1, 3, "~")
    curMap.changeBlock(3, 1, "!")
})

var t2_4 = new Toggle(queensCastle, 2, 4, function() {
    curMap.changeBlock(1, 3, "~")
    curMap.changeBlock(3, 5, "!")
}, function() {
    curMap.changeBlock(1, 3, "!")
    curMap.changeBlock(3, 5, "~")
})

var t4_4 = new Toggle(queensCastle, 4, 4, function() {
    curMap.changeBlock(1, 3, "~")
    curMap.changeBlock(3, 5, "~")
    curMap.changeBlock(5, 3, "!")
}, function() {
    curMap.changeBlock(1, 3, "!")
    curMap.changeBlock(3, 5, "!")
    curMap.changeBlock(5, 3, "~")
})

var t4_2 = new Toggle(queensCastle, 4, 2, function() {
    curMap.changeBlock(1, 3, "!")
    curMap.changeBlock(5, 3, "!")
}, function() {
    curMap.changeBlock(1, 3, "~")
    curMap.changeBlock(5, 3, "~")
})


// Gale Cave
var mt49_19 = new MultiToggle(galeCave, 49, 19, 50, 19, ["!", "~", "_", ",", "z"]) // Fee toggle

var mt2_18 = new MultiToggle(galeCave, 2, 18, 1, 18, ["!", "~", "_", ",", "z"]) // Fi toggle

var mt11_10 = new MultiToggle(galeCave, 11, 10, 12, 10, ["!", "~", "_", ",", "z"]) // Fo toggle

var mt40_3 = new MultiToggle(galeCave, 40, 3, 41, 3, ["!", "~", "_", ",", "z"]) // Fum toggle

var t27_26 = new Toggle(galeCave, 27, 26, function() {
    curMap.changeBlock(18, 26, "_")
}, function() {
    curMap.changeBlock(18, 26, "S")
})

var t27_25 = new Toggle(galeCave, 27, 25, function() {
    curMap.changeBlock(18, 25, "_")
}, function() {
    curMap.changeBlock(18, 25, "S")
})

var t27_24 = new Toggle(galeCave, 27, 24, function() {
    curMap.changeBlock(18, 24, "_")
}, function() {
    curMap.changeBlock(18, 24, "S")
})

var t27_23 = new Toggle(galeCave, 27, 23, function() {
    curMap.changeBlock(18, 23, "_")
}, function() {
    curMap.changeBlock(18, 23, "S")
})

var t19_26 = new Toggle(galeCave, 19, 26, function() {}, function() {})

var t19_24 = new Toggle(galeCave, 19, 24, function() {}, function() {})

// Howler Hollow

var bw6_2 = new Breezeway(howlerHollow, 6, 2, 9, 2) // Pair up ones that connect to each other
var bw9_2 = new Breezeway(howlerHollow, 9, 2, 6, 2)

var t12_2 = new Toggle(howlerHollow, 12, 2, function() {
    howlerHollow.changeBlock(15, 2, '$')
}, function() {
    howlerHollow.changeBlock(15, 2, '.')
})

var bw12_3 = new Breezeway(howlerHollow, 12, 3, 15, 3)
var bw15_3 = new Breezeway(howlerHollow, 15, 3, 12, 3)

// Stormed Room

var rd6_2 = new RaftDispenser(stormedRoom, 6 * 75, 2 * 75, 6 * 75 + 37.5, 3 * 75 + 37.5)
var rd13_9 = new RaftDispenser(stormedRoom, 13 * 75, 9 * 75, 14 * 75 + 37.5, 9 * 75 + 37.5)
var rd20_10 = new RaftDispenser(stormedRoom, 20 * 75, 10 * 75, 20 * 75 + 37.5, 11 * 75 + 37.5)
var rd12_20 = new RaftDispenser(stormedRoom, 12 * 75, 20 * 75, 12 * 75 + 37.5, 21 * 75 + 37.5)

// Encompassed forest

var lostTogglePositions = [
    [254, 49],
    [253, 46],
    [250, 47],
    [251, 50]
]
var lostToggleCurPos = 0

var lostTravelerToggle = new Toggle(mainMap, lostTogglePositions[lostToggleCurPos][0], lostTogglePositions[lostToggleCurPos][1],
function() {
    // changeme to add functionality
}, function() {
    // changeme to add functionality
})

// Encompassed Labyrinth
var t16_4 = new Toggle(encompassedLabyrinth, 16, 4, function() {

}, function() {

})

// Dropton City
var rd2_2 = new RaftDispenser(droptonCity, 2 * 75, 2 * 75, 2 * 75 + 37.5, 3 * 75 + 37.5)

// The Cryo Underground

var t13_6 = new Toggle(cryoUnderground, 13, 6, function() {
    curMap.changeBlock(15, 4, ')')
    curMap.changeBlock(15, 5, ')')
    curMap.changeBlock(11, 5, '(')
    curMap.changeBlock(12, 5, '(')
    curMap.changeBlock(14, 6, '(')
}, function() {
    curMap.changeBlock(15, 4, '(')
    curMap.changeBlock(15, 5, '(')
    curMap.changeBlock(11, 5, ')')
    curMap.changeBlock(12, 5, ')')
    curMap.changeBlock(14, 6, ')')
})

var t21_4 = new Toggle(cryoUnderground, 21, 4, function() {
    curMap.changeBlock(17, 6, ')')
}, function() {
    curMap.changeBlock(17, 6, '(')
})

var raft12_20 = new Raft(cryoUnderground, 12 * 75, 20 * 75)

var rd1_22 = new RaftDispenser(cryoUnderground, 1 * 75, 22 * 75, 1 * 75 + 37.5, 21 * 75 + 37.5)

var rd22_22 = new RaftDispenser(cryoUnderground, 22 * 75, 22 * 75, 22 * 75 + 37.5, 21 * 75 + 37.5)

var t15_27 = new Toggle(cryoUnderground, 15, 27, function() {
    curMap.changeBlock(18, 23, '!')
    curMap.changeBlock(19, 23, '!')
    
    curMap.changeBlock(18, 27, 'W')
    curMap.changeBlock(19, 27, 'W')

    curMap.changeBlock(18, 24, '!')
    curMap.changeBlock(19, 24, '!')
    curMap.changeBlock(18, 25, '!')
    curMap.changeBlock(19, 25, '!')
    curMap.changeBlock(18, 26, '!')
    curMap.changeBlock(19, 26, '!')
}, function() {
    curMap.changeBlock(18, 23, 'W')
    curMap.changeBlock(19, 23, 'W')
    
    curMap.changeBlock(18, 27, 'z')
    curMap.changeBlock(19, 27, 'z')

    curMap.changeBlock(18, 24, 'z')
    curMap.changeBlock(19, 24, 'z')
    curMap.changeBlock(18, 25, 'z')
    curMap.changeBlock(19, 25, 'z')
    curMap.changeBlock(18, 26, 'z')
    curMap.changeBlock(19, 26, 'z')
})

var rd19_10 = new RaftDispenser(cryoUnderground, 19 * 75, 10 * 75, 20 * 75 + 37.5, 10 * 75 + 37.5)

var rd38_1 = new RaftDispenser(cryoUnderground, 38 * 75, 1 * 75, 39 * 75 + 37.5, 1 * 75 + 37.5)

// var t48_1 = new Toggle(cryoUnderground, 48, 1, function() {
//     curMap.changeBlock(47, 1, 'z')
//     curMap.changeBlock(41, 1, 'z')
// }, function() {
//     curMap.changeBlock(47, 1, 'W')
//     curMap.changeBlock(41, 1, 'W')
// })

var rd28_19 = new RaftDispenser(cryoUnderground, 28 * 75, 19 * 75, 28 * 75 + 37.5, 20 * 75 + 37.5)

var t46_19 = new Toggle(cryoUnderground, 46, 19, function() {
    curMap.changeBlock(47, 23, 'W')
    curMap.changeBlock(48, 23, 'W')

    curMap.changeBlock(46, 19, '!')
    curMap.changeBlock(46, 20, '!')
}, function() {
    curMap.changeBlock(47, 23, 'z')
    curMap.changeBlock(48, 23, 'z')

    curMap.changeBlock(46, 19, 'z')
    curMap.changeBlock(46, 20, 'z')
})

var t28_22 = new Toggle(cryoUnderground, 28, 22, function () {
	
	curMap.changeBlock(29, 22, 'S')
	curMap.changeBlock(35, 22, '~')
}, function () {
	
	curMap.changeBlock(29, 22, '~')
	curMap.changeBlock(35, 22, 'S')

})

var t34_21 = new Toggle(cryoUnderground, 34, 21, function () {
	
	curMap.changeBlock(29, 22, '~')
	curMap.changeBlock(35, 22, 'S')
}, function () {
	curMap.changeBlock(29, 22, '!')
	curMap.changeBlock(35, 22, '!')
})

var m42_22 = new MultiToggle(cryoUnderground, 42, 22, 41, 22, ["!", "^", "~", ",", "."])

var l48_22 = new LockToggle(cryoUnderground, 48, 22, function() {
	curMap.changeBlock(44, 22, '~')
	//curMap.changeBlock(34, 22, '.')
})

var rd48_32 = new RaftDispenser(cryoUnderground, 48 * 75, 32 * 75, 47 * 75 + 37.5, 32 * 75 + 37.5)

// Abandoned Channel
var l1_16 = new LockToggle(abandonedChannel, 1, 16, function () {
    cascade.lines = ["Uh oh.", "Baba"]
    //cascade.lineNum = 0
    cascade.action = function () {} // clears action
    // cameraStart(44 * 75, 8 * 75, 10, "NPC", {
    //     lineStop: 1
    // })
    curMap.changeBlock(6, 16, '~')
    curMap.changeBlock(7, 16, '~')
    curMap.changeBlock(1, 17, '~')

})

var t15_9 = new Toggle(howlerHollow, 15, 9, function() {
    howlerHollow.changeBlock(15, 10, ')')
    howlerHollow.changeBlock(16, 11, '(')
}, function() {
    howlerHollow.changeBlock(15, 10, '(')
    howlerHollow.changeBlock(16, 11, ')')
})

var bw10_11 = new Breezeway(howlerHollow, 10, 11, 7, 11)
var bw7_11 = new Breezeway(howlerHollow, 7, 11, 10, 11)


/*
t - Toggle
mt - Multi-toggle
raft - Raft
rd - Raft Dispenser
*/

var interactives = [
    t116_31,
    t102_3,
    t77_5,
    t97_11,
    t5_18,
    t5_19,
    t6_19,
    t6_12,
    t14_12,
    t15_8,
    t2_2,
    t2_4,
    t4_4,
    t4_2,
	mt49_19,
	mt2_18,
	mt11_10,
	mt40_3,
    t27_26,
    t27_25,
    t27_24,
    t27_23,
    t19_26,
    t19_24,

    // Howler Hollow
    bw6_2,
    bw9_2,
    t12_2,
    bw12_3,
    bw15_3,
    t15_9,
    bw10_11,
    bw7_11,

    rd257_30,
    rd256_66,
    lostTravelerToggle,
    t16_4,
    rd2_2,
    t13_6,
    t21_4,
    raft12_20,
    rd1_22,
    rd22_22,
    t15_27,
    rd19_10,
    rd38_1,
    rd28_19,
    t46_19,
	t28_22,
	t34_21,
	m42_22,
	l48_22,
    rd6_2,
    rd13_9,
    rd20_10,
    rd12_20,
    rd48_32,
    l1_16,
]


// Load save for interactives
if (!!save) {
    for (var i in save.interactives) {
        var inter = save.interactives[i]
        
        if (!!interactives[i]) {
            if (!!inter.toggleState) { // Check if it is a Toggle using a unique property
                    interactives[i].toggleState = inter.toggleState
            }
            
            if (!!inter.toggleNum) { // Check if it is a MultiToggle
                interactives[i].toggleNum = inter.toggleNum
            }
    
            if (!!inter.enterRaftCooldown) { // Check if it is a Raft
                interactives[i].x = inter.x
                interactives[i].y = inter.y
                // interactives[i].map = inter.map
            }

            if (!!inter.dsx) { // Check if it is a Raft Dispenser
                interactives[i].x = inter.x
                interactives[i].y = inter.y
                interactives[i].dsx = inter.dsx
                interactives[i].dsy = inter.dsy
            }
        } else { // If a new interactive has been created over the course of the game
            if (!!inter.enterRaftCooldown) { // Check if it is a Raft
                for (var i in areas) {
                    var a = areas[i]
                    if (inter.map.name == a.name) { // Search through all maps to find the correct one
                        inter.map = a
                    }
                }
                
                if (inter.map != "Main Map") {
                    interactives.push(new Raft(areaSearchByName(inter.map), inter.x, inter.y))
                // interactives[i].map = inter.map
                } else {
                    interactives.push(new Raft(mainMap, inter.x, inter.y))
                }
            }
        }
    }
}

// Load save for missions
if (!!save) {
    save.curMissions.forEach((mission) => {
        for (var i in missions) {
            if (missions[i].name == mission.name) {
                var savedMission = missions[i]
                savedMission.curNode = mission.curNode
                savedMission.newMission = mission.newMission
                savedMission.complete = mission.complete
                savedMission.completionPopup = mission.completionPopup

                curMissions.push(missions[i])
            }
        }
    })
}



var models = {
    bosses: {
        darkened: new Darkened(darkenedRoom, width / 2, height / 2),
        stormed: new Stormed(stormedRoom, width / 2, height / 2)
    },
    npcs: {
        oldMan: new NPC(0, 0, "Old Man", null, null, null, null),
		theWanderer: new NPC(width / 2, height / 2, "", null, null, null, null)
    }
}

var p = new Player(2 * 75, 2 * 75, npcs) // default x = width / 2, y = height / 2 helloooh

var c121_31 = new Chest(mainMap, 121, 31, [
    items.heatHandle
])

var c92_37 = new Chest(mainMap, 92, 37, [
    items.confoundedCaveKey
])

var c14_3 = new Chest(confoundedCave, 14, 3, [
    new Item("Puzzle Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
            
        if (p.cords.x == 28 && p.cords.y == 11 && curMap == confoundedCave) {
            curMap.changeBlock(29, 11, '_')
            
            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == this.name) {
                    p.inventory.splice(i, 1)
                }
            }
        }
    })
])

var c10_1 = new Chest(cryoUnderground, 10, 1, [
    new Item("Puzzle Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
        if (p.cords.x == 1 && p.cords.y == 14 && curMap == cryoUnderground) {
            curMap.changeBlock(1, 15, 'z')
            
            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == this.name) {
                    p.inventory.splice(i, 1)
                }
            }
        }
    })
])

var c4_41 = new Chest(droptonCity, 4, 41, [
    items.lightContainer
])

var chests = [
    // Main Map
    c121_31, // Heat Handle
    c92_37, // Confounded Cave Key
    
    // Confounded Cave
    c14_3, // Puzzle Key

    // Cryo Underground
    c10_1,
    // Dropton City,
    c4_41,
]

// Secrets

var droptonTunnelsEntrance = new Secret(270, 78, mainMap, function() {
    if (p.can.goUnderWater && keys.space) {
        Screen.fadeOut(0.01, function() {
            curMap = droptonTunnels
            p.goTo(14 * 75 + 37.5, 14 * 75 + 37.5)
        })
    }
})

var secrets = [droptonTunnelsEntrance]

var opacity = 1

// Darkened phase 2 cutscene variables
var spearSpeed = 1
var darkenedColor = 0
var spearSize = 0 // changes triangle into circle
var shootTriangle = 0
var fade = 0

// Stormed phase 2 cutscene variables
var stormedRoomChanged = false

// beam cutscene variables

function saveGame() {
    var SAVING = {
        player: {
            x: p.x,
            y: p.y,
            cordSave: p.cordSave,
            health: p.health,
            map: curMap.name,
            inventory: [],
            equipped: [],
            weaponIndex: p.weaponIndex,
            resistances: p.resistances,
            trills: p.trills,
            can: p.can,
            droptonDonations: p.droptonDonations,
        },
        npcs: [],
        npcActions: [],
        npcPathActions: [],
        maps: [],
        interactives: [],
        lighting: lighting,
        dev: dev,
        curMissions: []
    }

    SAVING.maps.push({
        name: "Main Map",
        changes: mainMap.changes
    })

    for (var i in areas) {
        var a = areas[i]
        SAVING.maps.push({
            name: a.name,
            changes: a.changes
        })
    }

    for (var j in p.inventory) {
        var i = p.inventory[j]
        SAVING.player.inventory.push(i)
    }

    for (var j in p.equipped) {
        var i = p.equipped[j]
        SAVING.player.equipped.push(i)
    }

    for (var i in npcs) {
        var n = npcs[i]
        SAVING.npcs.push(npcs[i])
        if (!!npcs[i].action) {
            SAVING.npcActions.push({
                name: npcs[i].name,
                action: npcs[i].action.toString()
            })
        }

        if (!!npcs[i].curPath && npcs[i].curPath != 0) { // Save npc path actions
            for (var j in npcs[i].curPath) {
                console.log(typeof npcs[i].curPath[j] == "function")
                if (typeof npcs[i].curPath[j] == "function") {
                    SAVING.npcPathActions.push({
                        name: npcs[i].name,
                        pathAction: npcs[i].curPath[j].toString(),
                        index: j
                    })

                    console.log({
                        name: npcs[i].name,
                        pathAction: npcs[i].curPath[j].toString(),
                        index: j
                    })
                }
            }
        }
    }

    for (var i in interactives) {
        var inter = interactives[i]
        SAVING.interactives.push(inter)
    }

    lset("player", JSON.stringify(SAVING.player))
    
    for (var i in npcs) {
        var n = npcs[i]
        if (!!n.map) {
            n.map = n.map.name // Change npcs map attribute to the map name
        }
        lset(n.name, JSON.stringify(n)) // Saves map name to save storage

        // Reverts npcs map attribute to the actual map
        if (n.map != "Main Map") {
            n.map = areaSearchByName(n.map)
        } else {
            n.map = mainMap
        }
    }
    
    
    lset("npcActions", JSON.stringify(SAVING.npcActions))
    lset("npcPathActions", JSON.stringify(SAVING.npcPathActions))

    lset("maps", JSON.stringify(SAVING.maps))

    for (var i in interactives) {
        var intr = interactives[i]
        if (!!intr.map) {
            intr.map = intr.map.name // Change interactive's map attribute to the map name
        }
    }
    lset("interactives", JSON.stringify(SAVING.interactives)) // Saves map name to save storage
    for (var i in interactives) {
        if (interactives[i].map != "Main Map") {
            interactives[i].map = areaSearchByName(interactives[i].map) // Reverts interactive's map attribute to the actual map
        } else {
            interactives[i].map = mainMap
        }
    }

    curMissions.forEach((mission) => {
        SAVING.curMissions.push(mission)
    })
    lset("curMissions", JSON.stringify(SAVING.curMissions))
    
    lset("lighting", SAVING.lighting)
    lset("dev", dev)

    console.log("Saved game!")
}

function clearSave() {
    localStorage.clear()
}

// Turns off saves
// clearSave() // DEFAULT GONE

var dev = false // Allows player to fly around through objects without getting hurt, purely for development purposes
if (!!save) {
    dev = JSON.parse(save.dev)
}
// ONLY TURN THIS ON USING CONSOLE
// TO TURN DEV OFF, RELOAD

// var chung = finder.findPath(153, 45, 185, 48, mainMap.grid)

// for (var i in chung) {
//     var ch = chung[i]
//     mainMap.changeBlock(ch[0], ch[1], ",")
// }


// Start position code (use to set variables and start game from a certain point) Remove all this code later
function startPos() {
    dev = true
    curMap = droptonCity
    p.goTo(39 * 75, 5 * 75)
    p.inventory = [items.spearOfTheDarkened, food.apple(), items.auraOfWarmth, items.stormedsSword]
    p.equipped = [items.aquaLung]
    p.droptonDonations = 100

    lonzo.map = mainMap
    lonzo.x = 158 * 75 + 37.5
    lonzo.y = 50 * 75 + 37.5
    lonzo.dir = "L"
    lonzo.lines = [
        "Hello! It's been a while!",
        "I don't know how, but the wind cleared up here\nso it's safe!",
        "Anyway, did you succeed?",
        "...",
        "(*)B@V#BV@#(*(BVP&WBY(*(BU!!!!!!1",
        "Sorry about that. I can't believe you actually\ndid it!",
        "By the way, Queen Alaska asked me to go find you.\nShe wanted to talk to you.",
        "I'm sure she'll be delighted to hear that you were successful!"
    ]

    queenAlaska.x = 253 * 75 + 37.5
    queenAlaska.y = 23 * 75 + 37.5
    queenAlaska.dir = 'R'
    queenAlaska.map = mainMap
    queenAlaska.lines = [
        "Wow, it's really you! You came back!",
        "How did it go?",
        "...",
        "Wow! Interesting. I guess that beast was the reason that Windy Wastelands\nwas so, well... windy.",
        "I'm very impressed that you took down that hideous monster.\nThat was no easy feat.",
        "I was just taking with Dr. Qua, a dear friend of mine, from Dropton Town.\nHe says that his city has been experiencing very odd conditions lately.",
        "Their city has been experiencing significant currents,\nsome of which have even destroyed buildings.",
        "I appreciate what you have done for us very much, but I'm afraid\nthe problems aren't over just yet.",
        "But since you have done so much for our village, I'm not leaving you empty-handed.",
        "I would like to give you my crown.\nIt has been passed down through many generations.",
        "This isn't any ordinary crown. This crown has very special powers that lets you\nmake the floor below you freeze, creating Speedy Snow!",
        "I know that you'll find this much more useful than me.",
        "Again, thank you for everything you've done.",
        "Now, Do you mind speaking with Dr. Qua?\nHe has some important intel."
    ]
    queenAlaska.action = function() {
        p.giveItem(items.queenAlaskasCrown)
    }
    queenAlaska.actionLine = "after"

    drQua.x = 256 * 75 + 37.5
    drQua.y = 23 * 75 + 37.5

    p.questPoint = {
        x: 253,
        y: 23
    }
    

    mainMap.changeBlock(257, 29, 'z')
    alerts.push(new GameAlert(258, 29, ["SEGREME DNIW FO RETSAM WEN A SA SKAERB LLAW EHT"], mainMap, "SIGN"))

    // Abandoned channel is open
    presidentWells.x = 23 * 75 + 37.5
    presidentWells.y = 35 * 75 + 37.5
    presidentWells.map = droptonCity

    presidentWells.lines = [
        "Did you hear? Something is happening on the north side of Dropton City!",
        "I haven't got a clue what it is, but everybody seems to be rushing to\nsee it!",
        "So, I'm going to need your help. Can you head over there\nand see what's going on?",
        "I'll check the rest of the city, and make sure that everybody is okay.",
        "Good luck!",
    ]
    presidentWells.actionLine = 1
    presidentWells.action = function() {
        cameraStart(39 * 75, 4 * 75 + 37.5, 15, "NPC", {
            lineStop: 3
        })
    }

    // Open weird crack thing at the top of Dropton City
    droptonCity.changeBlock(36, 0, 'S')
    droptonCity.changeBlock(36, 2, 'S')
    droptonCity.changeBlock(37, 3, 'S')
    droptonCity.changeBlock(39, 1, 'O')
    droptonCity.changeBlock(41, 1, '_')
    droptonCity.changeBlock(41, 2, '_')
    droptonCity.changeBlock(42, 2, '_')
    droptonCity.changeBlock(41, 3, 'S')
    
    // Change Ariel
    ariel.x = 34 * 75 + 37.5
    ariel.y = 2 * 75 + 37.5
    ariel.dir = 'R'
    ariel.lines = [
        "What happened here?",
        "This clump of rocks was formed the last time the ground shook like this.",
        "But now it looks like it has opened up into some sort of cave!",
        "I never realized that there was anything below Dropton City.",
        "Hopefully something is done about it..."
    ]

    // Change Walter
    walter.x = 45 * 75 + 37.5
    walter.y = 2 * 75 + 37.5
    walter.dir = 'L'
    walter.lines = [
        "Oh my goodness...",
        "I've never seen this before! There's a cave underneath Dropton!",
        "The president better get over here quick!"
    ]
}

startPos()


var gameInterval = setInterval(function() {
    if (tabIsActive) {
        if (dev) {
            p.health = 100 // Constantly resets player health to 100
            for (var i in blocks) { 
                blocks[i].through = true
                blocks[i].speed = 25
                blocks[i].dps = 0
            }
        }
        
        elapsed ++
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(0, 0, width, height)
    
        for (var i in eventDelays) {
            eventDelays[i].timer -= 1 / (66 + 2 / 3)
            var e = eventDelays[i]
            if (e.timer > 0) {
                e.f1()
            } else {
                e.f2()
            }
        }

		if (document.readyState == "complete" && !readyStateConfirmed) {
            readyStateConfirmed = true
		}
        
        if (scene == "LOADING") {
			
			console.log(scene)
			ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.font = "200px serif"
            ctx.fillText("Loading", width / 3, height / 2)
		} else if (scene == "GAME") {
            Screen.update()
            ctx.save()
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))

            // Screen Shake
            ctx.translate(Screen.shakeOffset.x, Screen.shakeOffset.y)

            curMap.draw(p, "Player View")
            if (!!curMap.solve) {
                curMap.solve()
            }
            
            // Default gone
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.font = "20px serif"
            ctx.fillText(p.cords.x + " , " + p.cords.y + " , " + p.canMove, p.x, p.y - 50)
            
        
            if (mouseIsDown) {
                playing = true
            }
            
            // Music
            if (playing) {
                if (curMap == mainMap) {
                
                    if (p.area == "Chard Town") {
                        //playMusic("Chard")
                    } else if (p.area == "Steel Field") {
                        // playMusic("Steel Field")
                    } else if (p.area == "Glacia Village") {
                        // playMusic("Glacia Village")
                    } else if (p.area == "Windy Wastelands") {
                        // playSound("Speedy Snow Walking", true)
                        // playMusic("Windy Wastelands")
                    } else if (p.area == "NONE") {
                        //playMusic("Adventure") // DEFAULT ON
                    }
                } else if (curMap == confoundedCave) {
                    playMusic("Puzzle")
                } else if (curMap == queensCastle) {
                    playMusic("Queen's Castle")
                } else if (curMap == galeCave) {
                    if (lighting < 1000) {
                        playMusic("Gale Cave Dark")
                    } else {
                        playMusic("Gale Cave Light")
                    }
                } else if (curMap == cryoUnderground) {
                    playMusic("Cryo Underground")
                } else if (curMap == stormedRoom) {
                    playMusic("Darkened Battle") // Default ??? Need to make music for Stormed
                } else if (curMap == droptonTunnels) {
                    playMusic("Dropton City") // changeme later when we make new music
                } else if (curMap == droptonCity) {
                    playMusic("Dropton City")
                } else if (curMap == droptonTown) {
                    playMusic("Dropton City") // changeme later when we make new music
                }
            }
            
            // Queen's Crown
            if (p.hasEquipped(items.queenAlaskasCrown) && p.blockOn.name == "snow") {
                if (p.moving) {
                    playSound("Speedy Snow Walking", true)
                }
                for (var i = 0; i < 3; i ++) {
                    for (var j = 0; j < 3; j ++) {
                        if (getBlockInfoByCords(p.cords.x * 75 - 75 + (75 * i), p.cords.y * 75 - 75 + (75 * j)).id == "*") {
                            ctx.drawImage(images.speedySnow, p.cords.x * 75 - 75 + (75 * i), p.cords.y * 75 - 75 + (75 * j), 75, 75) 
                        }
                    }
                }
                
            }
          
            for (var i in chests) {
                if (curMap == chests[i].map) {
                    chests[i].draw()
                }
            }
        
            for (var i in interactives) {
                if (curMap == interactives[i].map) {
                    interactives[i].draw()
                    if (!!interactives[i].update) {
                        interactives[i].update()
                    }
                }
            }

            for (var i in npcs) {
                if (!!npcs[i].map) {
                    if (curMap.name == npcs[i].map.name) {
                        
                        npcs[i].draw()
                    }
                }
            }
    
            for (var i in bossDoors) {
                var b = bossDoors[i]
                if (keys.space && p.cords.x == b.x && p.cords.y == b.y && b.map == curMap) {
                    b.enterFunction(p)
                }
            }
        
            for (var i in monsters) {
                if (curMap.name == monsters[i].map && !monsters[i].dead) {
                    monsters[i].draw(p)
                }
            }
        
            for (var i in bosses) {
                if (curMap.name == bosses[i].map) {
                    curBoss = bosses[i]
                    if (curBoss.health > 0) {
                        curBoss.update()
                    }
                }
            }
    
            
            
            ctx.restore()
    
            for (var i = 0; i < alerts.length; i ++) {
                alerts[i].draw()
            }

            if (!!curCamera) {
                curCamera.draw()
            }

            
            if (curBoss.health <= 0) {
                if (curMap == darkenedRoom) {
                    Screen.fadeOut(0.005, function() {
                        darkenedScale = 1
                        scene = "DARKENED BOSS CUTSCENE DEFEATED"
                    })
                } else if (curMap == stormedRoom) {
                    Screen.fadeOut(0.005, function() {
                        curMap = galeCave
                        p.x = 44 * 75 + 37.5
                        p.y = 34 * 75 + 37.5
                        p.giveItem(items.stormedsSword, true)

                        lonzo.map = mainMap
                        lonzo.x = 158 * 75 + 37.5
                        lonzo.y = 50 * 75 + 37.5
                        lonzo.dir = "L"
                        lonzo.lines = [
                            "Hello! It's been a while!",
                            "I don't know how, but the wind cleared up here\nso it's safe!",
                            "Anyway, did you succeed?",
                            "...",
                            "(*)B@V#BV@#(*(BVP&WBY(*(BU!!!!!!1",
                            "Sorry about that. I can't believe you actually\ndid it!",
                            "By the way, Queen Alaska asked me to go find you.\nShe wanted to talk to you.",
                            "I'm sure she'll be delighted to hear that you were successful!"
                        ]

                        queenAlaska.x = 253 * 75 + 37.5
                        queenAlaska.y = 23 * 75 + 37.5
                        queenAlaska.dir = 'R'
                        queenAlaska.map = mainMap
                        queenAlaska.lines = [
                            "Wow, it's really you! You came back!",
                            "How did it go?",
                            "...",
                            "That's great! I was just taking with Dr. Qua from Dropton Town\nabout how they, too, have been experiencing odd conditions lately.",
                            "Their underwater city has been experiencing significant currents,\nsome of which even destroy buildings.",
                            "I appreciate what you have done for us very much, but I'm afraid\nthere is more for you to take care of over there."
                        ]
                        queenAlaska.action = function() {}

                        drQua.x = 256 * 75 + 37.5
                        drQua.y = 23 * 75 + 37.5

                        p.questPoint = {
                            x: 253,
                            y: 23
                        }

                        mainMap.changeBlock(257, 29, 'z')
                        alerts.push(new GameAlert(258, 29, ["SEGREME DNIW FO RETSAM WEN A SA SKAERB LLAW EHT"], mainMap, "SIGN"))
                    })
                }
            }
        
            
        
            for (var i in bosses) {
                if (curMap.name == bosses[i].map) {
                    // bosses[i].update()
                    bosses[i].healthBar()
                }
            }
    
            // if (curBoss != 0) {
            //     curBoss.update()
            //     curBoss.healthBar()
            // }
            
            p.draw()

            ctx.save()
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
            curMap.drawNextLayer(p)
            ctx.restore()
    
            // Play toggle cutscenes
            for (var i in interactives) {
                if (interactives[i].constructor.name == "Toggle") {
                    var inter = interactives[i]
                    if (inter.cutscene != null) {
                        inter.toggleCutscene(inter.cutscene.x, inter.cutscene.y)
                    }
                }
            }
    
            // Display lighting pixels
            if (lighting < 5000) {
                for (var i = 0; i < (width / lightingSize) + 1; i ++) {
                    for (var j = 0; j < (height / lightingSize) + 1; j ++) {
                        var lightingCalc = Math.hypot((i * lightingSize - lightingSize / 2) - width / 2, (j * lightingSize - lightingSize / 2) - height / 2) / lighting
                        ctx.fillStyle = "rgba(0, 0, 0, " + lightingCalc + ")"
                        ctx.fillRect((i - 1) * lightingSize, (j - 1) * lightingSize, lightingSize * 2, lightingSize * 2)
                    }
                }
            }
            
            p.move()
            p.collide()
            p.hitEnemies()
            
    
            // DEFAULT ON
            for (var i in regions) {
                regions[i].update()
            }
    
            if (keys.slash) {
                if (!bossfight) {
                    if (p.blockOn.dps == 0) {
                        saveGame()
                        SAVE_MENU = true
                    }
                } else {
                    console.log("Could not save as bossfight is set to true")
                }
            }
    
            if (SAVE_MENU) {
                ctx.fillStyle = "rgb(0, 0, 0)"
                ctx.fillRect(width - 200, 0, 200, 100)
                ctx.fillStyle = "rgb(255, 255, 255)"
                ctx.fillText("Game saved.", width - 100, 50)
                var SAVE_MENU_TIMER = setTimeout(function() {
                    SAVE_MENU = false
                }, 1500)
            }
    
            // Alert to open door, talk to NPC, etc
            p.drawAlert()

            // NPCS speech bubbles
            
            for (var i in npcs) {
                if (!!npcs[i].map) {
                    if (curMap.name == npcs[i].map.name) {
                        
                            npcs[i].talk(p, npcs)
                    }
                }
            }
            
            // Block Alert bubbles
            for (var i = 0; i < alerts.length; i ++) {
                alerts[i].drawMessage()
            }

            

            p.HUD()

            if (keys.e) {
                p.displayInventory()
            }
            
            if (keys.n) {
                p.displayNPCList()	
            }

            p.displayMap()
            
            if (p.health <= 0) {
                Screen.fadeOut(0.01, function() {
                    scene = "DEATH"
                })
            }
            
            for (var i in curMissions) {
                curMissions[i].alert("NEW")

                if (!!curMissions[i].solve) {
                    curMissions[i].solve()
                }

                if (curMissions[i].complete) {
                    curMissions[i].alert("COMPLETE")
                }
            }
            
            
            
            if (keys.shift) {
                // Screen.fadeOut(255, 255, 255, 0.01)
                p.mapPan.x = (- p.x + width / 2)
                p.mapPan.y = (- p.y + height / 2)
                if (p.mapSwitchTimer <= 0) {
                    if (!p.mapOn) {
                        p.mapOn = true
                    } else {
                        p.mapOn = false
                    }
                    p.mapSwitchTimer = 0.3
                }
            }
    
            if (CUR_SHOP_MENU != 0) {
                ShopMenu(CUR_SHOP_MENU)
            }

            // Screen fade cover
            ctx.fillStyle = "rgb(0, 0, 0, " + Screen.fade + ")"
            ctx.fillRect(0, 0, width, height)
            
        } else if (scene == "DARKENED BOSS CUTSCENE") {
            playMusic("Boss Cutscene")
            cutsceneFrame ++
            
            // ctx.fillStyle = "rgb(255, 50, 100)"
            ctx.save()
            ctx.translate(width / 2, height / 2)
            ctx.scale(darkenedScale, darkenedScale)
            ctx.translate(width / -2, height / -2)
            if (cutsceneFrame >= 360) {
                if (darkenedScale > 2) {
                    ctx.translate(Math.random() * 10, Math.random() * 10)
                }
                darkenedRoom.draw(p, "Player View")
            //     if (darkenedScale <= 2) {
            //         darkenedScale += 0.03
            //     }
                if (darkenedScale <= 2) {
                    darkenedScale += 0.05
                }
            }
            models.bosses.darkened.draw()
            ctx.restore()
            if (darkenedScale > 2) {
                ctx.fillStyle = "rgb(150, 0, 0)"
                ctx.font = "100px serif"
                ctx.textAlign = "center"
                ctx.fillText(models.bosses.darkened.name, width / 2, height / 4)
            }
            
            if (cutsceneFrame < 360) {
                opacity -= 0.005
                ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")"
                ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
            }
    
            if (cutsceneFrame >= 535) {
                scene = "GAME"
                cutsceneFrame = 0
                darkenedScale = 1
            }
        } else if (scene == "DARKENED BOSS CUTSCENE PHASE 2") {
            if (cutsceneFrame == 0) {
                darkenedScale = 1.5
            }
            ctx.save()
            
            if (cutsceneFrame > 100 && cutsceneFrame < 575) {
                ctx.translate(Math.random() * 20, Math.random() * 10)
                darkenedScale -= 0.001
            }
            
            ctx.translate(width / 2, height / 2)
            ctx.scale(darkenedScale, darkenedScale)
            ctx.translate(width / -2, height / -2)
            
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
            darkenedRoom.draw(p, "Player View")
            
            ctx.translate(-1 * ((-1 * p.x) + (width / 2)), -1 * ((-1 * p.y) + (height / 2)))
            
            
            // Body
            ellipse(width/2, height/2, 150, 150, "rgb(0, 0, 0)")
        
            // Eyes
            ellipse(width/2 - 30, height/2 - 35, 30, 30, "rgb(" + (255 - (darkenedColor / 2)) + ", 50, 100)")
            ellipse(width/2 + 30, height/2 - 35, 30, 30, "rgb(" + (255 - (darkenedColor / 2)) + ", 50, 100)")
            
        
            // Arms
            ellipse(width/2 + 75, height/2, 40, 40, "rgb(" + (125 - darkenedColor) + ", 25, 50)")
            ellipse(width/2 - 75, height/2, 40, 40, "rgb(" + (125 - darkenedColor) + ", 25, 50)")
            
            
            if (cutsceneFrame > 100 && cutsceneFrame < 575 && spearSpeed > 0) {
                spearSpeed += 1 - (cutsceneFrame / 1000)
                darkenedColor ++
                if (spearSize < 50) 
                spearSize += 0.15
            }
            
            ctx.translate(width/2 + 75, height/2)
            ctx.rotate(- Math.PI / 15 + (spearSpeed / 5))
            ctx.translate(-1 * (width/2 + 75), -1 * height/2)
    
    
            // Spear thing
            ctx.fillStyle = "rgb(" + (50 - darkenedColor) + ", 50, 50)"
            
            
            ctx.fillRect(width/2 + 60, height/2 - 80, 16, 180) // Center x = 63
            if (cutsceneFrame > 700) {
                ellipse(width/2 + 68, height/2 - 90 - shootTriangle, 30, 30, "rgb(255 , 50, 100)")
            }
            ellipse(width/2 + 68, height/2 - 90, spearSize, spearSize, "rgb(" + (255 - darkenedColor) + ", 50, 100)")
            ctx.beginPath()
            
            
            
            
            if (cutsceneFrame < 700) {
                triangle(width/2 + 50, height/2 - 80, width/2 + 68, height/2 - 115, width/2 + 86, height/2 - 80, "rgb(" + (255 - darkenedColor) + ", 50, 100)")
            }
            
            if (cutsceneFrame > 700) {
                shootTriangle += 20
            }
        
            if (shootTriangle > 500) {
                shootTriangle = 0
                
            }
    
            if (cutsceneFrame > 900) {
                fade += 0.5
            }
    
            if (cutsceneFrame >= 1100) {
                scene = "GAME"
                fade = 0
                cutsceneFrame = 0
                darkenedScale = 0
            }
            
            ctx.restore()
            ctx.fillStyle = "rgb(0, 0, 0, " + fade / 10 + ")"
            ctx.fillRect(0, 0, width, height)
            cutsceneFrame ++
        } else if (scene == "DARKENED BOSS CUTSCENE DEFEATED") {
            //cutsceneFrame = 1100
            //console.log(cutsceneFrame)
            cutsceneFrame ++
            
            ctx.save()
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillRect(0, 0, width, height) 
        
            if (cutsceneFrame > 100 && cutsceneFrame < 575) {
                darkenedScale += 0.001
                if (spearSize > 0) {
                    spearSize -= 1
                } else {
                    spearSize = 0
                }
                darkenedColor += 0.3
            }
    
            if (spearSize <= 0) {
                spearSize = 0
            }
    
            
        
            if (cutsceneFrame > 100 && cutsceneFrame < 750) {
                ctx.translate(Math.random() * 5, Math.random() * 5)
            }
        
            if (cutsceneFrame > 575 && cutsceneFrame < 800) {
                if (fade < 1) {
                    fade += 0.01
                }	
            }
        
            if (cutsceneFrame > 800) {
                scene = "GAME"
                fade = 0
                curMap = mainMap
                p.x = 6 * 75
                p.y = 54 * 75
                p.giveItem(items.spearOfTheDarkened, false)
                wayne.x = 6 * 75 + 37.5
                wayne.y = 46 * 75 + 37.5
                lighting = 5000
                wayne.actionLine = "after"
                wayne.action = function(p) {
                    this.curPath = [
                        [6, 32],
                        [8, 32],
                        [9, 31],
                        [9, 19],
                        [7, 17],
                        [7, 11],
                        [10, 8],
                        [12, 8],
                        function () {
                            // wayne.lines = [
                            //     "ayo"
                            // ]
                            wayne.action = function() {
                                
                            }
                        }
                    ]
                }
                wayne.lines = [
                    "Aye matey!", 
                    "It looks like you defeated whatever treacherous thing was inside\nthat cave, huh?", 
                    "The old man wanted to talk to you about something.\nHe should be outside his house."
                ]
                
                oldMan.x = 19 * 75 + mainMap.blockSize / 2
                oldMan.y = 8 * 75 + mainMap.blockSize / 2
                oldMan.map = mainMap
                oldMan.lines = [
                    "You're back! Wait...",
                    "What's this you're holding?",
                    "...",
                    "The Spear of the Darkened??? How did you get that?",
                    "Did you really defeat the Darkened?",
                    "...",
                    "Wow!! I was planning on telling you more first, but\nyou've already gone and done it!",
                    "I still have a lot to tell you though.\nFollow me and I'll tell you more...",
                    "Here's a special tracker in case you get lost.\nYou should be able to see me on your map with it!"
                ]
                oldMan.action = function(p) {
                    p.tracking.push(this)
                    oldMan.lines = [
                        "Follow me..."
                    ]
                    this.curPath = [
                        [20, 9],
                        [44, 9],
                        [44, 59],
                        [40, 59],
                        function() {
                            oldMan.lines = [
                                "Now I will tell you about " + badGuy + "'s history."
                            ]
                            oldMan.action = function(p) {
                                cutsceneFrame = 0
                                scene = "SACRED STAR CUTSCENE"
                            }
                            oldMan.actionLine = "after"
                        }
                    ]
                }
                oldMan.actionLine = "after"
                
                wayne.talkedTo = false
                cutsceneFrame = 0
        
            }
        
            if (cutsceneFrame > 750) {
                spearSpeed += 0.1
            }
        
            
            // old.draw()
            ctx.translate(width / 2, height / 2)
            ctx.scale(darkenedScale, darkenedScale)
            ctx.translate(width / -2, height / -2)
    
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
            darkenedRoom.draw(p, "Player View")
            ctx.translate(-1 * ((-1 * p.x) + (width / 2)), -1 * ((-1 * p.y) + (height / 2)))
        
        
            
            if (cutsceneFrame < 750) {
                // Body
                ellipse(width/2, height/2, 150, 150, "rgb("+ darkenedColor +", "+ darkenedColor +", "+ darkenedColor +")")
            
                // Eyes
                ellipse(width/2 - 30, height/2 - 35, 30, 30, "rgb("+ darkenedColor +", 50, 100)")
                ellipse(width/2 + 30, height/2 - 35, 30, 30, "rgb("+ darkenedColor +", 50, 100)")
                
            
                // Arms
                ellipse(width/2 + 75, height/2, 40, 40, "rgb("+ darkenedColor +", 25, 50)")
                ellipse(width/2 - 75, height/2, 40, 40, "rgb("+ darkenedColor +", 25, 50)")
            
            }
            //ctx.save()
            ctx.translate(width/2 + 75, height/2)
            
        
            if (cutsceneFrame > 100    && cutsceneFrame < 750 && spearSpeed > 0) {
                spearSpeed += 0.01 + (cutsceneFrame / 1000)
            
            } /*else {
                spearSpeed ++
            }*/
            
            
         
            ctx.rotate(- Math.PI / 15 + (spearSpeed / 5))
            
            
            ctx.translate(-1 * (width/2 + 75), -1 * height/2)
            //ctx.translate(0, -1 * this.spearShift)
        
            // Spear thing
            
            
            triangle(width/2 + 50, height/2 - 80, width/2 + 68, height/2 - 115, width/2 + 86, height/2 - 80, "rgb(" + (darkenedColor) + ", 50, 100)")
            ctx.fillStyle = "rgb(0, 50, 50)"
            ctx.fillRect(width/2 + 60, height/2 - 80, 16, 180) // Center x = 63
            ellipse(width/2 + 68, height/2 - 90, spearSize, spearSize, "rgb(0, 50, 100)")
            ctx.beginPath()
            
            
            
            
            
            ctx.restore()
            
            ctx.fillStyle = "rgb(255, 255, 255, "+ fade +")"
            ctx.fillRect(0, 0, width, height)
            
            // if (cutsceneFrame >= 1200) {
                
                
            // }
            // darkenedRoom.draw(p, "Player View")
        } else if (scene == "SACRED STAR CUTSCENE") {
            cutsceneFrame ++
            playMusic("Sacred Star Cutscene")
            if (cutsceneFrame >= 0 && cutsceneFrame < 700) {
                ctx.fillStyle = "rgb(255, 255, 255)"
                ctx.fillRect(0, 0, width, height)
                ctx.drawImage(images.sacredStar, width / 2 - width/6 - cutsceneFrame / 30, height / 2 - height * 3/8 - cutsceneFrame / 10, width/3 + cutsceneFrame / 15, width/3 + cutsceneFrame / 15)
    
                if (cutsceneFrame < 350) {
                    cutsceneText = "This island is made up of five core elements. The elements make up what we call the Sacred Star."
                } else {
                    cutsceneText = "These elements are Wind, Land, Sea, Day, and Night. Each one of these has its own master."
                }
            } else if (cutsceneFrame >= 700 && cutsceneFrame < 2050) {
                ctx.save()
                ctx.scale(0.5, 0.5)
                ctx.translate(0 * 75 - (cutsceneFrame - 700) * 2, -10 * 75)
                confoundedCave.draw(p, "Cutscene View", 0 * 75 + (cutsceneFrame - 700) * 2, 10 * 75, 0.5)
                ctx.restore()
                if (cutsceneFrame < 1150) {
                    cutsceneText = "Darkened is the Master of Night. However, the Darkened you battled is not the real one!"
                } else if (cutsceneFrame >= 1150 && cutsceneFrame < 1600) {
                    cutsceneText = badGuy + " provided the original masters with weapons to make them more powerful."
                } else if (cutsceneFrame >= 1600 && cutsceneFrame < 2050) {
                    cutsceneText = "Over time, however, these weapons corrupted the Masters and turned them against the island."
                }
            } else if (cutsceneFrame >= 2050 && cutsceneFrame < 3850) {
                // music[curMusicNum].audio.volume -= 0.002
                // console.log(music[curMusicNum].audio.volume)
                ctx.save()
                ctx.scale(0.3, 0.3)
                ctx.translate(0 * 75 - (cutsceneFrame - 2050) * 2, -10 * 75)
                mainMap.draw(p, "Cutscene View", 0 * 75 + (cutsceneFrame - 2050) * 2, 10 * 75, 0.3)
                ctx.restore()
                if (cutsceneFrame >= 2050 && cutsceneFrame < 2500) {
                    cutsceneText = "When the time is right, " + badGuy + " will use the power of the Masters for anything he wants!"
                } else if (cutsceneFrame >= 2500 && cutsceneFrame < 2950) {
                    cutsceneText = "If this happens, the elements will no longer remain here, and the island will be destroyed!"
                } else if (cutsceneFrame >= 2950 && cutsceneFrame < 3400) {
                    cutsceneText = "When you battled " + badGuy + " you proved that you could handle the power of the weapons without being corrupted."
                } else if (cutsceneFrame >= 3400 && cutsceneFrame < 3850) {
                    // musicFading = true
                    // if (musicFading) {
                    //     music[curMusicNum].audio.volume -= 0.002
                    //     console.log(music[curMusicNum].audio.volume)
                    // }
                    
                    cutsceneText = "So, we need you to battle the Masters, take their weapons, defeat " + badGuy + " and save the island!"
                }
                
            } else {
                scene = "GAME"
                p.x = 41 * 75 + 37.5
                p.y = 59 * 75 + 37.5
                p.questPoint = {
                    x: 37,
                    y: 50
                }
    
                curMap.changeBlock(67, 10, "_") // Re-opens the path to Steel Field (in case it doesn't work for the save)
                curMap.changeBlock(138, 4, "_")
    
                // This code piece is a backup to move the old man into the correct spot, even though he should be there anyway
                oldMan.x = 40 * 75 + 37.5
                oldMan.y = 59 * 75 + 37.5
                oldMan.map = mainMap
                
                oldMan.lines = [
                    "Now go talk to Wayne. He'll tell you what\nto do next.",
                    "He should be around here somewhere."
                ]
                
                wayne.x = 37 * 75 + 37.5
                wayne.y = 50 * 75 + 37.5
                wayne.lines = [
                    "Hello!",
                    "I think the old man told you about this island's history,\nso I'll help you save it!",
                    "Long ago, Darkened and the other masters were corrupted and\nwreaked havoc upon this island!",
                    "Although the islanders could not defeat them, they were able\ntemporarily imprison them.",
                    "Before they could do this, however, the masters built borders between\ndifferent regions of this island. This made it tougher for\nus islanders to work together.",
                    "These borders were designed to open for their masters. But, since you conquered\none of the them, we suspect these borders may open for you.",
                    "So, I've marked a spot on your map for where we believe\n the border was placed a long time ago. If you are\nable to pass, it should take you straight into Glacia Village.",
                    "You'll have more work to do there.",
                    "Be quick though, as the masters won't be imprisoned forever. For all we know\nthey could escape right now!",
                    "I wish you the best of luck!"
                ]
    
                // 137, 4
                alerts.push(new GameAlert(137, 4, ["SEGREME THGIN FO RETSAM WEN A SA SNEPO REDROB EHT"], mainMap, "SIGN"))
                
                wayne.action = function(p) {
                    // Location of Glacia Village entry
                    p.questPoint = {
                        x: 135 * 75,
                        y: 4 * 75
                    }
                }
                wayne.actionLine = "after"
		
            }
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillRect(0, height * 5 / 6, width, height / 6)
            ctx.textAlign = "center"
            ctx.font = "25px serif"
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillText(cutsceneText, width / 2, height * 11 / 12)
            
        } else if (scene == "STORMED BOSS CUTSCENE") {
			
			playMusic("Boss Cutscene")
		
            cutsceneFrame ++
            
            // ctx.fillStyle = "rgb(255, 50, 100)"
            ctx.save()
            ctx.translate(width / 2, height / 2)
            ctx.scale(darkenedScale, darkenedScale)
            ctx.translate(width / -2, height / -2)
            if (cutsceneFrame >= 360) {
                if (darkenedScale > 2) {
                    ctx.translate(Math.random() * 10, Math.random() * 10)
                }
                stormedRoom.draw(p, "Player View")
            //     if (darkenedScale <= 2) {
            //         darkenedScale += 0.03
            //     }
                if (darkenedScale <= 2) {
                    darkenedScale += 0.05
                }
            }
            models.bosses.stormed.draw()
            ctx.restore()
            if (darkenedScale > 2) {
                ctx.fillStyle = "rgb(150, 0, 0)"
                ctx.font = "100px serif"
                ctx.textAlign = "center"
                ctx.fillText(models.bosses.stormed.name, width / 2, height / 4)
            }
            
            if (cutsceneFrame < 360) {
                opacity -= 0.005
                ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")"
                ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
            }
    
            if (cutsceneFrame >= 535) {
                scene = "GAME"
                cutsceneFrame = 0
                darkenedScale = 1
            }
		} else if (scene == "STORMED BOSS CUTSCENE PHASE 2") {
            cutsceneFrame ++
            
            // ctx.fillStyle = "rgb(255, 50, 100)"
            ctx.save()
            ctx.translate(width / 2, height / 2)
            ctx.scale(0.75, 0.75)
            ctx.translate(width / -2, height / -2)
            stormedRoom.draw(p, "Cutscene View", 0, 0, 0.25)
            models.bosses.stormed.draw()
            ctx.restore()

            if (lighting > 750) { // Make the room darker
                lighting -= 2;
            }
            
            // Makes stormed pulse as the phase 2 image
            if (cutsceneFrame > 100 && cutsceneFrame <= 500) {
                models.bosses.stormed.bodyAngle += 0.25
                if (cutsceneFrame % 30 > 0 && cutsceneFrame % 30 <= 10) {
                    models.bosses.stormed.phase = 2
                } else {
                    models.bosses.stormed.phase = 1
                }
            } else if (cutsceneFrame > 500 && cutsceneFrame <= 600) {
                models.bosses.stormed.bodyAngle = 0
                models.bosses.stormed.phase = 2
            } else if (cutsceneFrame > 600) {
                scene = "GAME"
            }

            // if (cutsceneFrame > 300) {
            //     if (!stormedRoomChanged) {
            //         // Covers all of stormedRoom in water
            //         for (var i in curMap.arr) {
            //             for (var j in curMap.arr[i]) {
            //                 curMap.changeBlock(j, i, '~');
            //             }
            //         }

            //         stormedRoomChanged = true
            //     }
            // }
        } else if (scene == "BEAM UNLOCKED") {
			 ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.fillRect(0, 0, width, height)

			cutsceneFrame ++
			
			ctx.save()
	
			
			ctx.scale(0.75, 0.75)
			
			ctx.translate((-1 * 13.5 * 75), (-1 * 50 * 75))

			if (cutsceneFrame > 100) {
            	ctx.translate(Math.random() * 5, Math.random() * 5)
			}
			curMap.draw(p, "Cutscene View", 13.5 * 75, 50 * 75, 0.75)


			// models.npcs.theWanderer.x = width /2 + 3 * 56 // 56 is ~ 75 * 0.75
			// models.npcs.theWanderer.y = height /2
     //     	models.npcs.theWanderer.draw()
			
			ctx.restore()

			ctx.save()
			
			ctx.save()
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
			theWanderer.draw()
			ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
			ctx.restore()
			for (var i = 0; i < 9; i ++) {

				if (cutsceneFrame == 190 + (i * 10)) {
					mainMap.changeBlock(26, 51 + i, ",")
					mainMap.changeBlock(22 + i, 55, ",")
				}
				if (cutsceneFrame == 200 + (i * 10)) {
					mainMap.changeBlock(26, 51 + i, "+")
					mainMap.changeBlock(22 + i, 55, "+")
				}

				
			}

			for (var i = 0; i < 5; i ++) {
				if (cutsceneFrame == 300 + (i * 5)) {
					mainMap.changeBlock(24 + i, 53 + i, "+")
					mainMap.changeBlock(28 - i, 53 + i, "+")
				}
			}

			for (var i = 0; i < 4; i ++) {
				if (cutsceneFrame == 400 + (i * 5)) {
					switch (i) {
						case 0:
							mainMap.changeBlock(23, 54, "+")
							mainMap.changeBlock(25, 52, "+")
							break
						case 1:
							mainMap.changeBlock(23, 56, "+")
							mainMap.changeBlock(27, 52, "+")
							break
						case 2:
							mainMap.changeBlock(29, 54, "+")
							mainMap.changeBlock(25, 58, "+")
							break
						case 3:
							mainMap.changeBlock(27, 58, "+")
							mainMap.changeBlock(29, 56, "+")
							break
							
					}
				}
			}
			

			if (cutsceneFrame > 500) {
				scene = "GAME"
			}
		} else if (scene == "CAMERA") { 
			//console.log(camera.cx)
			ctx.save()
			
			ctx.translate((-1 * curCX) + (width / 2), (-1 * curCY) + (height / 2))
			curMap.draw(p, "Camera View")
			for (var i in npcs) {
				if (!!npcs[i].map) {
					if (curMap.name == npcs[i].map.name) {
						
						npcs[i].draw()
					}
				}
			}

            for (var i in interactives) {
                if (curMap == interactives[i].map) {
                    interactives[i].draw()
                    if (!!interactives[i].update) {
                        interactives[i].update()
                    }
                }
            }

			for (var i in monsters) {
                if (curMap.name == monsters[i].map && !monsters[i].dead) {
                    monsters[i].draw(p)
                }
            }
            
            // Draw player at actual location, not just center
            ctx.translate(p.x - width / 2, p.y - height / 2)
            p.draw()
            ctx.translate(- (p.x - width / 2), - (p.y - height / 2))
     
			ctx.translate((-1 * curCX) + (width / 2), (-1 * curCY) + (height / 2))
			ctx.restore()

            if (lighting < 5000) {
                for (var i = 0; i < (width / lightingSize) + 1; i ++) {
                    for (var j = 0; j < (height / lightingSize) + 1; j ++) {
                        var lightingCalc = Math.hypot((i * lightingSize - lightingSize / 2) - width / 2, (j * lightingSize - lightingSize / 2) - height / 2) / lighting
                        ctx.fillStyle = "rgba(0, 0, 0, " + lightingCalc + ")"
                        ctx.fillRect((i - 1) * lightingSize, (j - 1) * lightingSize, lightingSize * 2, lightingSize * 2)
                    }
                }
            }

			for (var i in npcs) {
                if (!!npcs[i].map) {
                    if (curMap.name == npcs[i].map.name) {
                        	npcs[i].talk(p, npcs)
                    }
                }
            }
            
            for (var i in alerts) {
                alerts[i].drawMessage()
            }
		
			if (curCX < camera.cx) {
				curCX += camera.cspeed
			}
	
			if (curCX > camera.cx) {
				curCX -= camera.cspeed
			}
	
			if (curCY < camera.cy) {
				curCY += camera.cspeed
			}
	
			if (curCY > camera.cy) {
				curCY -= camera.cspeed
			}
            
			console.log("x: " + Math.round(curCX / 100) + " " + Math.round(finalCX / 100) + " y: " + Math.round(curCY / 100) + " " + Math.round(finalCY / 100))
			if (Math.hypot((curCX - camera.cx), (curCY - camera.cy)) <= camera.cspeed) { // round to the nearest hundreth
                curCX = camera.cx
                curCY = camera.cy
				cameraMoving = false
			}

            if (camera.type == "NPC") {
				for (i in npcs) {
					if (npcs[i].lineNum == camera.lineStop) {
						if (keys.space) {
							scene = "GAME"
                            cameraEnd()
						}
					}
				}
			}

            if (camera.type == "AUTO") {
                if (!camera.stopTimerSet) {
                    setTimeout(() => {
                        scene = "GAME"
                        cameraEnd()
                    }, camera.time)
                    camera.stopTimerSet = true
                }
			}
		} else if (scene == "DEATH") {
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.textAlign = "center"
            ctx.fillText("it seems you have acquired death good sire", width / 2, height / 2 - 100)
            ctx.fillText("click to continue", width / 2, height / 2 + 50)
            if (mouseIsDown) {
                location.reload()
                scene = "GAME"
            }
        }
    }
}, 15)
// })();