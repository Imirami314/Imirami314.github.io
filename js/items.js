function Item(name, damage, draw, use, desc, category) {
    this.name = name
    this.damage = damage
    this.x = null
    this.y = null
    this.use = use
    this.desc = desc || "[no description]"
    this.category = category || "MISC"
    this.draw = draw
}

function Chest(map, cordX, cordY, items) {
    this.map = map
    this.cords = {
        x: cordX,
        y: cordY
    }
    this.items = items
    this.opened = false
}

Chest.prototype.draw = function() {
    if (!this.opened) {
        ctx.fillStyle = "rgb(200, 200, 0)"
    } else {
        ctx.fillStyle = "rgb(0, 255, 0)"
    }
    ctx.fillRect(this.cords.x * 75, this.cords.y * 75, 50, 50)
}

Chest.prototype.open = function(p) {
    if (!this.opened && keys.space) {
        for (var i in this.items) {
            p.giveItem(this.items[i], true)
        }
        this.opened = true
    }
}

// Items
var items = {
    spearOfTheDarkened: new Item("Spear of the Darkened", 15, function(x, y) {
        ctx.drawImage(images.spearOfTheDarkened, x - 15, y - 15, 50, 15)
    }, function(p) {
        p.spearAttack()
    }, "A mystical spear you obtained after defeating Darkened, Master of Night.", "WEAPONS"),
    stormedsSword: new Item("Stormed's Sword", 25, function(x, y) {
        ctx.save()
        ctx.translate(x + 45, y + 45)
        ctx.rotate(Math.PI / 2) // Flip image vertically
        ctx.translate(- 45 - x, - 45 - y)
        ctx.drawImage(images.stormedSword, x - 15, y + 45, 25, 75)
        ctx.restore()
        

        //ellipse(x, y, 10, 10, "rgb(0, 0, 0)") // changeme to real image for Stormed's Sword
    }, function() {
        p.swordAttack()
    }, "A mystical sword you obtained after defeating Stormed, Master of Wind.", "WEAPONS"),
    oldMansGlasses: new Item("Old Man's Glasses", 0, function(x, y) {
            ctx.drawImage(images.oldMansGlasses, x - 15, y - 15, 35, 15)
        }, function(p) {
            
            var old_man = npcs.searchByName("Old Man")
            var mike = npcs.searchByName("Mike")
            var oldManDist = Math.hypot(p.x - old_man.x, p.y - old_man.y)
            
            if (oldManDist <= 100) {
                old_man.glasses = true
                mike.x = 59 * 75
                mike.y = 9 * 75
                mike.lines = [
                    "Hi!",
                    "Uh...",
                    "bye"
                ]
                old_man.lines = [
                    "Why thank you!",
                    "Wait a minute...",
                    "You seem familiar...",
                    "Could it really be?",
                    "You're the person I just needed to meet!\nOr am I hallucinating...",
                    "Surely you're not the legend who attempted to defeat " + badGuy + " before\n[the city] fell to ruin...",
                    "...",
                    "You are?! How did you end up stranded here?\n",
                    "Actually, now is not the time. " + badGuy + " is getting stronger every day.",
                    "I've been waiting for\nsomebody to help us from " + badGuy + " since you were unable to\ndefeat him last time...",
                    "Quick, go talk to Wayne.\nHe'll guide you around this island.",
                    "I don't know exactly where he is, but he's always swimming..."
                ]

                p.questPoint = {
                    x: 45,
                    y: 55
                }
                
                old_man.lineNum = 0
                old_man.talk(p)

                

                for (var i in p.inventory) {
                    var item = p.inventory[i]
                    if (item.name == this.name) {
                        p.inventory.splice(i, 1)
                    }
                }
            }
        }, "A pair of glasses that Mike gave you for the old man.", "MISC"),
    steelFieldKey: new Item("Steel Field Key", 0, function(x, y) {
            ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
        }, function(p) {
            if (p.cords.x == 66 && p.cords.y == 10) { // Map Lock from main village to steel field or whatever
                var itemFound = false
                for (var i in p.inventory) {
                    var item = p.inventory[i]
                    if (item.name == this.name) {
                        p.inventory.splice(i, 1)
                        itemFound = true
                    }
                }
                if (itemFound) {
                    curMap.changeBlock(67, 10, "_")
                } 
            }
        }),
    windyWastelandKey: new Item("Windy Wasteland Key", 0, function(x, y) {
            ctx.drawImage(images.confoundedCaveKey, x - 15, y - 15, 35, 15)
        }, function(p) {

            if (p.cords.x == 177 && p.cords.y == 31 && curMap == mainMap) {
                mainMap.changeBlock(177, 32, '_')
                
                for (var i in p.inventory) {
                    var item = p.inventory[i]
                    if (item.name == this.name) {
                        p.inventory.splice(i, 1)
                    }
                }
            }
        }, "A shiny key that constipates you.", "KEYS"), // changeme
    confoundedCaveKey: new Item("Confounded Cave Key", 0, function(x, y) {
        ctx.drawImage(images.confoundedCaveKey, x - 15, y - 15, 35, 15)
    }, function(p) {
            
        if (p.cords.x == 6 && p.cords.y == 53 && curMap == mainMap) {
            mainMap.changeBlock(6, 52, 'O')
            
            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == this.name) {
                    p.inventory.splice(i, 1)
                }
            }
        }
    }, "A dusty key with an inscription saying 'West'", "KEYS"),
    heatHandle: new Item("Heat Handle", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
        var smithDist = Math.hypot(p.x - smith.x, p.y - smith.y)
        
        if (smithDist <= 100) {
            smith.hasHandle = true
            smith.lines = [
                "Thank you. Appreciate it.",
                "...",
                "Alright, here's your weapon. Made it from that\n handle. Hope it works okay.",
                "...",
                "By the way, there's s'posed to be a key in this area somewhere. Everyone's talking\n'bout it, but nobody can be bothered to find it. Dunno what it does though...",
                "Anyway...",
                "See ya later."
            ]

            p.giveItem(items.steelSword, true)
            
            smith.lineNum = 0
            smith.talk(p)

            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == "Heat Handle") {
                    p.inventory.splice(i, 1)
                }
            }
        }
    }, "An odd fragment of a sword. Absorbs heat very easily.", "MISC"),
    steelSword: new Item("Steel Sword", 5, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
        
    }, "A weak, simple sword that is easy to use.", "WEAPONS"),
    
	auraOfWarmth: new Item("Aura of Warmth", 0,
    function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    },
    function(p) {
        p.speedMultiplier = 0.75
        p.resistances.cold = 1
    }, "A mysterious item that grants you a moderate resistance to cold places, but at the cost of some of your speed.", "MISC"),
	
	speedySnowPath: new Item("Speedy Snow Path", 0,
    function(x, y) {
        ctx.drawImage(images.speedySnowPath, x - 100, y - 56.3, 200, 112.6)
    },
    function(p) {
		
     //p.buildMode = true
		//p.bb = 'z'
    }, "[insert description]", "MISC"),

	decipherer: new Item("Decipherer", 0, 
	function(x, y) {
		ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
	}, function(p) {
		
	}, "[insert description]", "MISC"),
	chardTownBeam: new Item("Chard Town Beam", 0, 
	function(x, y) {
		ellipse(x, y, 10, 10, "rgb(0, 0, 0")
	}, function(p) {
		// var theWanderer = npcs.searchByName("The Wanderer")
		// var theWandererDist = Math.hypot(p.x - theWanderer.x, p.y - theWanderer.y)
		if (p.cords.x == 26 && p.cords.y == 55 && curMap == mainMap) {
			scene = "BEAM UNLOCKED"
			cutsceneFrame = 0
		}
	}, "Search for the place with no beginnings and no ends...", "MISC"),
	aquaLung: new Item("Aqua Lung", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function() {
        p.equip(this)

        p.can.goUnderWater = true
        ellipse(width / 2, height / 2, 75, 75, "rgb(0, 255, 255, 0.4)")
    }, "A special item that allows you to swim underwater and breathe.", "MISC"),

    queenAlaskasCrown: new Item("Queen Alaska's Crown", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function () {
        p.equip(this)
        if (curMap.getBlock(p.cords.x, p.cords.y) == "*") {
            p.speed = 10
        } 
        

        ellipse(width / 2, height / 2, 75, 75, "rgb(255, 255, 255, 0.4)")
        
    }, "A magical crown that instantly turns snow into speedy snow.", "MISC"),
    fullPass: new Item("Full Pass", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function() {
        // changeme to add functionality here
    }, "A special pass that lets you access more of Dropton!", "MISC")
} // Puzzle Keys are not included as they vary depending on where they came from

function Food(name, img, health, secs) {
    this.name = name
    this.img = img
    this.health = health
    this.healthAdded = 0
    this.secs = secs
    this.secsPassed = 0
    this.category = 'FOOD'
}

Food.prototype.draw = function(x, y) {
    if (this.img != "") {

    } else {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }
}

Food.prototype.use = function(p) {
    p.eat(this)
}

var food = {
    apple: function() {
        return new Food("Apple", "", 3, 10)
    }
}