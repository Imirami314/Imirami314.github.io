function Item(name, damage, draw, use, desc) {
    this.name = name
    this.damage = damage
    this.x = null
    this.y = null
    this.use = use
    this.desc = desc || "[no description]"
    this.draw = draw
    this.opened = false
}

function Chest(map, cordX, cordY, items) {
    this.map = map
    this.cords = {
        x: cordX,
        y: cordY
    }
    this.items = items
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
            p.inventory.push(this.items[i])
        } // fanny lu
        this.opened = true
    }
}

// Items
var items = {
    spearOfTheDarkened: new Item("Spear of the Darkened", 15, function(x, y) {
        ctx.drawImage(images.spearOfTheDarkened, x - 15, y - 15, 50, 15)
    }, function(p) {
        p.spearAttack()
    }),
    stormedsSword: new Item("Stormed's Sword", 25, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)") // changeme to real image for Stormed's Sword
    }, function() {
        // changeme to animation for sword attack
    }, "A mystical sword you obtained after defeating Stormed,\nMaster of Wind"),
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
        }, "A pair of glasses that Mike gave you for the old man."),
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
            }, "A shiny key that constipates you."),
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
    }, "A dusty key with an inscription saying 'West'"),
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

            // Name should change lol
            p.inventory.push(new Item("Steel Sword", 5, function(x, y) {
                ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
            }, function(p) {
                
            }))
            
            smith.lineNum = 0
            smith.talk(p)

            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == "Heat Handle") {
                    p.inventory.splice(i, 1)
                }
            }
        }
    }),
    steelSword: new Item("Steel Sword", 5, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
        
    }),
    
	auraOfWarmth: new Item("Aura of Warmth", 0,
    function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    },
    function(p) {
        p.speedMultiplier = 0.75
        p.resistances.cold = 1
    }, "A mysterious item that channels the power of the island's elements.\nWhen used, it minorly drains the user's speed to grant a moderate resistance to low temperatures."),
	
	speedySnowPath: new Item("Speedy Snow Path", 0,
    function(x, y) {
        ctx.drawImage(images.speedySnowPath, x - 100, y - 56.3, 200, 112.6)
    },
    function(p) {
		
     //p.buildMode = true
		//p.bb = 'z'
    }, ""),

	decipherer: new Item("Decipherer", 0, 
	function(x, y) {
		ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
	}, function(p) {
		
	}, ""),
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
	}, "Search for the place with no beginnings and no ends...")
	
} // Puzzle Keys are not included as they vary depending on where they came from