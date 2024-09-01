function Item(name, damage, draw, use, desc, category, range) {
    this.name = name
    this.damage = damage
    this.x = null
    this.y = null
    this.use = use
    this.desc = desc || "[no description]"
    this.category = category || "MISC"
    this.range = range ?? 100;
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

    Chest.all.push(this)
}

Chest.all = []

Chest.prototype.draw = function() {
    if (!this.opened) {
        ctx.drawImage(images.chestClosed, b(this.cords.x), b(this.cords.y), 75, 75)
        ctx.fillStyle = "rgb(200, 200, 0)"
    } else {
        ctx.drawImage(images.chestOpen, b(this.cords.x), b(this.cords.y), 75, 75)
        ctx.fillStyle = "rgb(0, 255, 0)"
    }
    //ctx.fillRect(ctr(this.cords.x), ctr(this.cords.y), 50, 50)
    
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
const items = {
    spearOfNoctos: new Item("Spear of Noctos", 15, function(x, y) {
        ctx.drawImage(images.spearOfNoctos, x - 15, y - 15, 50, 15)
    }, function(p) {
        p.spearAttack()
    }, "A mystical spear you obtained after defeating Noctos, Master of Night.", "WEAPONS", 125),
    stormedsSword: new Item("Stormed's Sword", 25, function(x, y) {
        ctx.save()
        ctx.translate(x + 45, y + 45)
        ctx.rotate(Math.PI / 2) // Flip image vertically
        ctx.translate(- 45 - x, - 45 - y)
        ctx.drawImage(images.stormedSword, x - 15, y + 45, 25, 75)
        ctx.restore()
    }, function() {
        p.swordAttack()
    }, "A mystical sword you obtained after defeating Stormed, Master of Wind.", "WEAPONS", 100),
    hydrosScythe: new Item("Hydros's Scythe", 20, function(x, y) {
        ctx.save()
        ctx.translate(x + 45, y + 45)
        ctx.rotate(Math.PI / 2) // Flip image vertically
        ctx.translate(- 45 - x, - 45 - y)
        ctx.drawImage(images.hydrosScythe, x - 30, y + 45, 33.3, 90)
        ctx.restore()
    }, function() {
        p.swordAttack()
    }, "A mystical scythe you obtained after defeating Hydros, Master of Water.", "WEAPONS", 150),
    lithosArm: new Item("Lithos's Arm", 35, function(x, y) {
        ctx.drawImage(images.rock, x - 27.5, y - 27.5, 55, 55);
    }, function() {
        p.swordAttack();  
    }, "A mystical, well, arm that you obtained after defeating Lithos, Master of Stone", "WEAPONS", 90),
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

                aStrangeWorld.setInstructions("You've given the Old Man his glasses, and he recognizes you as the legend who once\nbattled " + badGuy + "! Now, he asks you to look for Wayne, an avid swimmer who is somewhere in Chard Town.");
                
                old_man.lineNum = 0
                old_man.talk(p)

                wayne.lines = [
                    "Aye matey!",
                    "The old man probably asked you to talk\nto me.",
                    "You need to get off this island ASAP and go back to where\n" + badGuy + " is.",
                    "I've given you a key to get out of this little village\nplace, but this island is much bigger\nthan you might think.",
                    "This key should get you further east.\nFollow the trail, and you'll reach the next village.",
                    "From there, you're going to want to talk to Smith The Blacksmith.\nHe'll get you geared up!",
                    "Good luck, you're gonna need it.\nAnd don't worry! I'll be around."
                ]

                wayne.action = function() {
                    wayne.lines = [
                        "Use the key I gave you to head east, towards the next village!"
                    ]
                    
                    p.giveItem(items.steelFieldKey, true);
                    aStrangeWorld.setInstructions("You located Wayne in a small pool and he gave you a special key.\nAccording to him, the key will open the lock in Northern Chard Town which will let you into Steel Field!\nOnce you get there, be careful. It's not the safest place ever...");

                    wayne.clearAction();
                }
                wayne.actionLine = "after";

                p.removeItem(this);
            }
        }, "A pair of glasses that Mike gave you for the old man.", "MISC"),
    steelFieldKey: new Item("Steel Field Key", 0, function(x, y) {
        ctx.drawImage(images.steelFieldKey, x - 15, y - 10, 35, 12.5)
    }, function(p) {
        if (p.cords.x == 66 && p.cords.y == 10) { // Map Lock from main village to steel field or whatever
            p.removeItem(this);
            curMap.changeBlock(67, 10, "_")
            aStrangeWorld.finish();
            setTimeout(() => {
                addMission(secretsOfSteelField);
            }, 3500);
        }
    }, "A key that allows you to enter Steel Field. Be careful!", "KEYS"),
    castleKey: new Item("Castle Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function (p) {
        if (p.cords.x == 160 && p.cords.y == 4) {
            // curMap = queensCastle
            // p.x = 37.5
            // p.y = 37.5
            mainMap.changeBlock(160, 4, 'O');
            meetingTheQueen.setInstructions("Finally, you have located the secret entrance to the Queen's Castle. All that's left is to\nenter the castle and make your way to wherever Queen Alaska is.");
            p.removeItem(this);
        }
    }, "A key to the Queen's Castle.", "KEYS"),
    windyWastelandsKey: new Item("Windy Wastelands Key", 0, function(x, y) {
        ctx.drawImage(images.confoundedCaveKey, x - 15, y - 15, 35, 15)
    }, function(p) {

        if (p.cords.x == 177 && p.cords.y == 31 && curMap == mainMap) {
            mainMap.changeBlock(177, 32, '_')
            
            p.removeItem(this);
        }
    }, "A shiny key that Lonzo entrusted to you.", "KEYS"), // changeme
    confoundedCaveKey: new Item("Confounded Cave Key", 0, function(x, y) {
        ctx.drawImage(images.confoundedCaveKey, x - 15, y - 15, 35, 15)
    }, function(p) {
            
        if (p.cords.x == 6 && p.cords.y == 53 && curMap == mainMap) {
            mainMap.changeBlock(6, 52, 'O');
            p.removeItem(this);
        }
    }, "A heavy, dusty key with an inscription saying 'Go west to CT'", "KEYS"),
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
                "You know, you seem like a nice, trustworthy guy.\nLemme tell you something, if that's okay.",
                "Just a little while ago, I found a key left on the ground.\nI've looked everywhere throughout Steel Field, but I can't find its use!",
                "It even has a little inscription on it, but I can't figure out what it means.",
                "I suspect that this key is from a region outside of Steel Field.\nBecause you come from a different region, I thought I'd give it to you.",
                "But keep it safe. If I hear you've lost it, I'll have some very\nstrong beef with you.",
                "And you do not want beef with a guy who makes weapons.",
                "So, do we have a deal?",
                "...",
                "Great. Let me open that chest for you."
            ]

            smith.action = function() {
                p.giveItem(items.steelSword, true)

                smith.curPath = [
                    [5, 1],
                    function() {
                        smithHouse.changeBlock(6, 1, '_');
                    }
                ];

                smith.lines = [
                    "Hope you enjoy that sword.",
                    "It's not great, but it should do.",
                    "And don't lose that key!"
                ]
                smith.clearAction()
            }

            smith.actionLine = "after"
            
            smith.lineNum = 0
            // smith.talk(p)

            p.removeItem(this);
            secretsOfSteelField.setInstructions("At last, you have a weapon. It's not very strong, but it's better\nthan nothing! Smith also gifted you a special key he found.\nHowever, he doesn't know where to use it, and he doesn't understand the\ncryptic inscription on it either.");
        }
    }, "An odd fragment of a sword. Absorbs heat very easily.", "MISC"),
    steelSword: new Item("Steel Sword", 5, function(x, y) {
        ctx.drawImage(images.steelSword, x - 15, y - 15, 40, 20)
    }, function(p) {
        p.swordAttack()
    }, "A weak, simple sword that is easy to use.", "WEAPONS"),
	auraOfWarmth: new Item("Aura of Warmth", 0,
    function(x, y) {
        ctx.drawImage(images.auraOfWarmth, x - 20, y - 20, 40, 40)
    },
    function() {
        //p.speedMultiplier *= 0.75
        p.resistances.cold = 1

        p.auraTimer = 600
        setTimeout(() => {
            p.auraTimer = null
            p.speedMultiplier *= 4 / 3
        }, 600 * 1000)

        p.removeItem(this)
    }, "A mysterious item that grants you a moderate resistance to cold places, but at the cost of some of your speed.", "MISC"),
	
	shovel: new Item("Shovel", 0,
    function(x, y) {
        ctx.drawImage(images.speedySnowPath, x - 100, y - 56.3, 200, 112.6)
    },
    function(p) {
		
     //p.buildMode = true
		//p.bb = 'z'
    }, "[insert description]", "MISC"),
    galeWing: new Item("Gale Wing", 0,
    function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {

    }),
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
            theWanderersRiddles.finish()
            // FINISH LINES
            theWanderer.lines = ["Wow, what a sight to see. This water is incredible!"]
            theWanderer.action = function () {
                alerts.push(new GameAlert(205, 24, ["In this minuscule forest with puddles and trees,\nComplete the pattern and set the next step free."], mainMap, "WANDERER SIGN"))
                theWanderer.action = function () {} // clears action   
            }
            theWanderer.actionLine = "after"
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
    deltasKey: new Item("Delta's Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function() {
        if (p.on(4, 43)) {
            curMap.changeBlock(4, 42, '_')
            p.removeItem(this)
        }
    }, "A random key that Delta found on the ground. Look for the hidden chest!", "KEYS"),
    fullPass: new Item("Full Pass", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function() {
        // Doors that the Full Pass opens
        if (curMap == droptonCity) { // Dropton Hall
            if (p.on(21, 33)) {
                curMap.changeBlock(21, 32, '(')
            }
        } else if (curMap == droptonTown) {
            if (p.on(38, 21)) { // Dropton Research Facility
                curMap.changeBlock(38, 20, '(')
            }
        }
    }, "A special pass that lets you access more of Dropton!", "MISC"),
    lightContainer: new Item("Light Container", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function() {
        interactives.forEach((inter) => {
            if (inter.constructor.name == "LightGate") {
                if (p.on(inter.x, inter.y)) {
                    inter.activateGate();

                    p.removeItem(this);
                }
            }
        });
        // changeme to add more functionality
    }, "A small vial made of glass, yet much shinier. What could it be used for?", "MISC"),
    droptonLakePainting: new Item("Dropton Lake Painting", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
        var d = npcs.searchByName("David Swimmer")
        var davidDist = Math.hypot(p.x - d.x, p.y - d.y)
        if (davidDist <= 100) {
            david.lines = ["Oh my- is that...\nit's incredible!",
            "Do you know where this place is? Surely it isn't real.",
            "...", "Dropton Drylands? Huh. Never heard of it.",
            "You said it was to the southeast? Well then...",
            "I better leave RIGHT NOW! See you later!"]
            david.action = function () {
                david.curPath = [[]]
                davidsDreamPond.finish()
            }
            david.actionLine = "after"
            d.lineNum = 0
            d.talk(p)
        }

        p.removeItem(this);
    }, "A painting by Coral featuring the stunning lake of Dropton.", "MISC"),
    berylsBracelet: new Item("Beryl's Bracelet", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }),
    mineraGroveKey: new Item("Minera Grove Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)"); // changeme to Minera Grove Key image
    }, function(p) {
        if (mouseIsDown && curMap == mainMap && p.on(83, 76)) {
            p.removeItem(this);
            mainMap.changeBlock(82, 76, '_');
        }
    }, "Yet another special key given to you by Wayne. It should allow you to\ncross the western border of Litholia into Minera Grove.", "KEYS"),
    rangerPermit: new Item("Ranger Permit", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)"); // changeme to Ranger Permit image
    }, function(p) {
        // changeme to add future restricted areas
        if (p.on(61, 61)) {
            mainMap.changeBlock(61, 60, ',');
        }

        if (p.on(79, 54)) {
            mainMap.changeBlock(80, 54, ',');
        }

        if (p.on(79, 81)) {
            mainMap.changeBlock(80, 81, ',');
        }
    }, "A permit that allows you to enter the restricted areas of Minera Grove.\nTechnically, this makes you an official ranger!", "MISC"),
    skywayCell: new Item("Skyway Cell", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)"); // changeme to Skyway Cell image
    }, function(p) {
        interactives.forEach((inter) => {
            if (p.on(inter.x, inter.y)) {
                inter.setCharged(true);

                p.removeItem(this);
            }
        });
    }, "A special container that contains the required fuel to power a Skyway.\nThis cell is valid for one use.", "MISC"),
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
        ctx.drawImage(this.img, x - 20, y - 25, 40, 50)
    } else {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }
}

Food.prototype.use = function(p) {
    p.eat(this)
    playSound("Eat");
}

const food = {
    apple: function() {
        return new Food("Apple", images.apple, 3, 15)
    },
    steak: function() {
        return new Food("Steak", "", 7, 60)
    },
    cookie: function() {
        return new Food("Cookie", "", 5, 30)
    },
    cake: function() {
        return new Food("Cake", "", 10, 120)
    },
    glaciaPie: function() {
        return new Food("Glacia Pie", "", 10, 10)
    },
}

class TrillSum {
    constructor(amount) {
        this.amount = amount;
        this.name = this.amount + " Trills";
    }

    draw() {
        // changeme: Add image for trills later
    }
}