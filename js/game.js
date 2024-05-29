// Function wrapping prevents console from altering game variables
// window.app = (function() {
curMap = imperilledPrison

var saveLoaded = false

var alerts = [
    new GameAlert(0, 0, ["WASD To Move\n[Space] To Continue"], imperilledPrison, "MESSAGE"),

    // Chard Region
    new GameAlert(11, 44, ["Ruins of Western Chard Town:\n6 2 5 3 7 8 4 9 1"], mainMap, "SIGN"),
    new GameAlert(9, 53, ["Confounded Cave\nKEEP OUT!"], mainMap, "SIGN"),
    new GameAlert(1, 44, ["Got you! - Mike"], mainMap, "SIGN"),
    new GameAlert(70, 23, ["Sarah's Shop:\nOfficially open for business!"], mainMap, "SIGN"),
    new GameAlert(79, 43, ["Rowan's Dojo:\nNow accepting students!"], mainMap, "SIGN"),
    new GameAlert(10, 7, ["BOW??20! hSHDs1@???:\n?fdkj2!","SDHG9 dahf!!01 fdhk!@8 d,\nhjfdj sh>9 /rhd9:f hfu???jfnvjejdj..??."], mainMap, "DECIPHER", null, ["Chard Town's Secret:\nPART 2","Chard Town possesses an unfinished letter,\nPress the right key to make everything better..."]),
    new GameAlert(66, 10, ["Huh? It's locked.\nYou need the 'Steel Field Key'."], mainMap, "KEY", "Map Key"),

    // Confounded Cave
    new GameAlert(6, 53, ["Huh? It's locked.\nYou need the 'Confounded Cave Key'."], mainMap, "KEY", "Confounded Cave Key"),
    new GameAlert(6, 21, ["The buttons above will alter the walls,\nPress them correctly to open both halls..."], confoundedCave, "SIGN"),
    new GameAlert(28, 11, ["Huh? It's locked.\nYou need the 'Puzzle Key'."], confoundedCave, "KEY", "Puzzle Key"),

    // Glacia Region
    new GameAlert(182, 3, ["Glacia Village ---------->\n<---------- Steel Field\nIf text on the signs confuse and confound, it all becomes clearer if you flip it around."], mainMap, "SIGN"),
    //new GameAlert(253, 21, ["The queen does not wish to speak with commoners at this time.", "If you must enter the castle, this riddle you must use,\nthe entrance is at the entrance, between red and blue."], mainMap, "SIGN"),
    //new GameAlert(230, 18, ["If you've found the secret, but do not know how to go through,\ndo not be afraid to simply press 'q'."], mainMap, "SIGN"),
    new GameAlert(23, 5, ["The castle exit can be found at the bottom of the lowest floor."], queensCastle, "SIGN"),
    new GameAlert(176, 30, ["DO NOT ENTER\nWIND IS INCREDIBLY STRONG"], mainMap, "SIGN"),
    new GameAlert(183, 39, ["Shot from a bow, on the map you'll see,\nthe land forms a symbol to point where you should be."], mainMap, "SIGN"),
    new GameAlert(28, 23, ["Find the four brothers, have no fears,\nAs the light shines through, the answer appears.", "When a button is found, a brother is near.\nOnce you're finished, come back here."], galeCave, "SIGN"),
    new GameAlert(35, 11, ["Press space at the center, prepare for a fight,\nFor you're about to meet the Master of Night."], confoundedCave, "SIGN"),
    new GameAlert(44, 33, ["Warning: very cold past this point!", "Auras are recommended."], galeCave, "SIGN"),
    new GameAlert(1, 7, ["Caution: Strong wind!"], howlerHollow, "SIGN"),

    // Dropton Drylands
    new GameAlert(252, 67, ["Welcome to the Dropton Drylands!", "Not that it's dry here, it's just dry compared to being underwater..."], mainMap, "SIGN"),
    new GameAlert(224, 83, ["Dropton Water Wear:\nDropton's official partner for all water-related gear!"], mainMap, "SIGN"),

    // Dropton City/Town
    new GameAlert(38, 16, ["House under repair due to mysterious current...", "KEEP OUT!"], droptonCity, "SIGN"),
    new GameAlert(22, 34, ["Full Pass required for entry to Dropton Hall."], droptonCity, "SIGN"),
    new GameAlert(37, 21, ["Full Pass required for entry to Dropton Research Facility."], droptonTown, "SIGN"),

    // Abandoned Channel
    new GameAlert(2, 16, ["[riddle]", abandonedChannel, "SIGN"]),

    // Cryo Underground
	new GameAlert(24, 8, ["This mysterious substance will come with a curse,\nThe player will perish, the raft alone may traverse."], cryoUnderground, "SIGN"),

    // Drowned Room

    // Stoneheart Sanctuary
    new GameAlert(25, 12, ["If you ever get stuck, unsure what to do,\nMaybe one's not enough, a greater number will do."], stoneheartSanctuary, "SIGN"),
    new GameAlert(30, 11, ["WARNING!\nRock Switches may be rigged!"], stoneheartSanctuary, "SIGN"),
]

var teleports = [
	new Teleport(ctr(26), ctr(55), mainMap)
]
// Cool riddle to figure out the backwards text on some signs: If text on the signs confuse and confound, it all becomes clearer if you flip it around.

// var secrets = [ // (Last bool is the beam, meaning the secret is solved)
// 	[false, false, false, false] // Chard Town
// ]

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
    
    if (Math.abs(lighting - value) <= 45 / 2) {
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
            // scene = "CUTSCENE"
            noctosCutscene.begin()
            p.x = noctosRoom.enterX
            p.y = noctosRoom.enterY
            curMap = noctosRoom
        }
    },
    {
		x: 11,
		y: 24,
		map: howlerHollow,
		enterFunction: function(p) {
			saveGame()
			
			p.goTo(stormedRoom.enterX, stormedRoom.enterY)
			curMap = stormedRoom
			cutsceneFrame = 0
			scene = "STORMED BOSS CUTSCENE"
		}
	},
	{
		x: 42,
		y: 28,
		map: cryoUnderground,
		enterFunction: function(p) {
			saveGame()
			
			p.goTo(drownedRoom.enterX, drownedRoom.enterY)
			curMap = drownedRoom
			cutsceneFrame = 0
			// scene = "DROWNED BOSS CUTSCENE"
		}
	}
]

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
        } else if (this.type == "WANDERER SIGN") {
            ctx.fillStyle = "rgb(51, 37, 25)"
            ctx.fillRect(this.x * 75 - p.x + width / 2 + 27.5, this.y * 75 - p.y + height / 2 + 10, 20, 65)
            ctx.fillStyle = "rgb(31, 112, 242)"
            ctx.fillRect(this.x * 75 - p.x + width / 2 + 5, this.y * 75 - p.y + height / 2 + 5, 65, 35)    
        }
    } 
}

GameAlert.prototype.drawMessage = function () {
    if (curMap == this.map) { 

        if (this.lineNum == 0 && !this.showLines) {
            this.finishCooldown -= perSec(1)
        }
		
        if (this.showLines && this.lineNum < this.lines.length) {
			if (!dev) {
            	this.textCooldown -= perSec(1)
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
            // if (this.type == "SIGN" || this.type == "WANDERER SIGN") {
            //     ctx.fillStyle = "rgb(255, 255, 255)"
            //     ctx.roundRect(width / 2 - 75, height / 2 + 50, 150, 50, 10)
            //     ctx.fill()
            //     ctx.fillStyle = "rgb(0, 0, 0)"
            //     ctx.font = "15px serif"
            //     ctx.textAlign = "center"
            //     ctx.fillText("Press space to read", width / 2, height / 2 + 75)		
            // } else 
            if (this.type == "KEY") {
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
				p.x = ctr(this.x)
				p.y = ctr(this.y)
			}
		}
	
}
// GameAlert.prototype.changeAlert = function(signX, signY, signMap, newLines) {
// 	if (this.x == signX && this.y == signY && this.map == signMap) {
// 		lines = newLines;
// 	}
// }

//

var prisonGuard = new NPC(ctr(19), ctr(2), "Prison Guard", imperilledPrison, "R", [""], "uh yeah")

var oldMan = new NPC(b(5), b(1), "Old Man", johnHouse, "D", [
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
		addMission(aStrangeWorld)
	}
}, "after")

// oldMan.glasses = true // Default false

var john = new NPC(ctr(17), ctr(9), "John", mainMap, "D", [
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
], "Resident - Chard Town\nA curious child whose favorite spot is the Big Lake.") 

var larisa = new NPC(20 * 75, 40 * 75, "Larisa", mainMap, "D", [])

mike.action = function(p) {
    cameraStart(ctr(51), ctr(6), 25, "NPC", {
        npcName: mike,
        lineStop: 9
    })
    // Location of Mike's Mom's house
    p.questPoint = {
        x: 51,
        y: 8
    }
}
mike.actionLine = 7

var david = new NPC(ctr(16), ctr(16), "David Swimmer", mainMap, "D", [
    "In case you're wondering, yes, my last name is actually Swimmer.",
    "I don't know what my parents were thinking.",
    "But I do love to swim!",
    "This pond is kind of depressing though. I would love to find\na great big pond that I could swim in forever!"
], "Resident - Chard Town\nA socially awkward dude who loves to swim.\nUnfortunately, he's not great at it.", function() {
    addMission(davidsDreamPond)
}, "after")


var lyra = new NPC(ctr(6), ctr(1), "Lyra", lyraHouse, "D", [
    "`What happened to all of the cool weapons?\nAll the weapons nowadays are the same.",
    "`It sure would be nice to see something new for a change..."
])

var carol = new NPC(ctr(5), ctr(1), "Carol", carolHouse, "R", [
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

var ley = new NPC(ctr(17), ctr(29), "Ley", mainMap, "D", [
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
        npcName: ley,
        lineStop: 7
    })
    ley.action = function(p) {
        if (ley.firstInteraction) {
            addMission(leysGreatFear)    
        }
    }
    ley.actionLine = "after"
}, 5)

var sarahShopMenu = [
    {item: food.apple(), cost: 10, amount: 5},
    {item: food.cookie(), cost: 15, amount: 3},
    {item: food.steak(), cost: 30, amount: 1},
]

var sarah = new NPC(ctr(4), ctr(1), "Sarah", sarahsShop, "D", [
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
                mike.x = ctr(6)
                mike.y = ctr(4)
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

var rowan = new NPC(ctr(7), ctr(6), "Rowan", rowansDojo, "L", [
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

var wyatt = new NPC(ctr(2), ctr(3), "Wyatt", wyattHouse, "D", [
    "Hey there!",
    "I'm just a normal citizen here in Chard Town,\nwith nothing to hide!",
    "So you can, uh, leave now.",
    "...",
    "Bye."
], "Resident - Chard Town\n")

var hector = new NPC(ctr(17), ctr(57), "Hector", mainMap, "U", [
    "Yo, what's up?",
    "I'm working on building a door here for this so-called shop...",
    "...but we just ran out of materials!",
    "I'm thinking about asking somebody in charge for some more.",
    "Say, would you be down to donate some materials?",
    "I see you don't got any wood...\nWell, come back holding some if you're interested.",
], "Resident - Chard Town\n")

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
    // var old_man = npcs.searchByName("Old Man")
    if (oldMan.glasses) {
        wayne.lines = [
            "Use the key I gave you to head east, towards the next village!"
        ]

        // Location of Smith the Blacksmith's house
        p.giveItem(items.steelFieldKey, true)
        p.questPoint = {
            x: 130,
            y: 37
        }

        wayne.clearAction()
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

var blanche = new NPC(ctr(180), ctr(19), "Blanche", mainMap, "D", [
    "Oh, hello...",
    "Sorry, I'm just really worried.",
    "I was hanging out with my friend, Bianca, in the\nforest southeast of here.",
    "It's not this tiny little one here, it's a bigger\none that's further away.",
    "When we left, I thought she was following behind\nme, but she wasn't.",
    "Now I don't know where she is or if she's coming back...",
    "Hey, could you help me? All you'd have to do is\ngo into the forest and find her.",
    "I'm too scared to go again...\nBianca is much braver than I am."
], "Resident - Glacia Village", function() {
    addMission(blancheAndBianca)
}, "after")

var frioShop = [
    {item: food.cookie(), cost: 15, amount: 6},
    {item: food.glaciaPie(), cost: 45, amount: 2},
]

var frio = new NPC(ctr(4), ctr(2), "Frio", friosFoodFrenzy, "D", [
    "Hello, and welcome to Frio's Food Frenzy!",
    "I'm just a LITTLE bit short on stock, so\nthere's not as many options as usual.",
    "Nevertheless, here's what we have:",
], "", function() {
    ShopMenu.open(frioShop)
}, "after")

var piren = new NPC(ctr(192), ctr(33), "Piren", mainMap, 'L', [
    "Well hello there fellow Glacia resident!",
    "I'm glad somebody came over to talk to me.\nMy house is not in a great location for social interactions.",
    "...",
    "Oh, you want to know why this little area is so green?\nWell, I take care to shovel as much snow around my house.",
    "I've been getting sick of the snow recently, so I wanted\nto ensure that my home stays comfortable.",
    "Anyway, it's nice to be able to talk to someone.",
], "Resident - Glacia Village\ngug")

var nevada = new NPC(ctr(5), b(3), "Nevada", breezwayBuilds, "D", [
    "Why hello there!",
    "I've never seen you before!",
    "I'm Nevada, proud new owner of Breezeway Builds!\nThis store has been in the family for three generations!",
    "`And if you're wondering... no, unfortunately I'm not related to\nQueen Alaska...",
    "Anyways, how can I help you?",
    "...",
    "Wait, what?\nYou don't know what a breezeway is?",
    "Oh, it seems like you're VERY new here.",
    "I'm more of a builder than an explainer.\nYou might want to talk to Lonzo.",
    "He lives right next to me, to the east.",
    "You can come back here once you're done!"

], "Resident - Glacia Village", function () {
    nevada.lines = [
        "Sorry, you might wanna talk to Lonzo first\nto learn more about this stuff.",
        "Come back here when you're done!"
    ]
}, "after")

var lonzo = new NPC(ctr(222), ctr(11), "Lonzo", mainMap, "D", [
    "HEY! HEY YOU!",
    "Please help me!\nI fell asleep here and now I'm stuck!",
    "You see that swirly thing?\nIt will take you to me!"
], "hi")

// Action up to meeting the queen mission
lonzo.action = function () {
    lonzo.lines = [
    "*cough",
    "Wow. Thank you so much for saving me.",
    "That wind thing is called a breezeway if you didn't know.",
    "It's created exclusively in Glacia Village.\nPowered by the wastelands! I-",
    "OOPS! I'm so rude I didn't even\nintroduce myself. I'm...",
    "C&BP$wbo9#&W*CN#O(B(BVO!!!",
    "Sorry, I'm uh, Lonzo. What's your name?",
    "...",
    "Nice.",
    "Anyways, I better get going, so uh...",
    "...",
    "What did you say? ELEMENTAL MASTERS?",
    "Yes, yes! I keep telling everybody about them,\nbut nobody believes me!",
    "I can't believe this! This is the best day ever!",
    "OSD*#&HIFH#)*RW)DFIDHISH)Q*UE!!!",
    "Sorry. I can barely hold my excitement.\nCome meet in my house and I can talk to you more!",
    ]
    lonzo.action = function () {
        Screen.fadeOut(0.03, function() {
            lonzo.map = lonzoHouse
            lonzo.x = ctr(3)
            lonzo.y = ctr(1)
            lonzo.lines = [
                "Hello.",
                "Why don't you tell me what you know about these masters?",
                "...",
                "WHAT?! You fought the master of dark?\nAND BEAT IT?",
                "OFUHS(*#EEWJVQEGUDFS&T*!WI#E!!!",
                "If you're able to beat an enemy that great,\nit is certain you can help us.",
                "Recently, there has been a huge pick up of wind in\nWindy Wastelands.",
                "It is usually windy there, but it seems another source is causing it.",
                "I've been doing historical research,\nand evidence is showing that there might be some corrupt being living there!",
                "FHG(@#&OEHDHSDUG(SKDJ(@&E)!",
                "If we can locate it and take it down,\nwe think Glacia Village will be safe once and for all!",
                "This is huge. We must alert Queen Alaska!",
                "...",
                "WHAT?! YOU DON'T KNOW WHO THE QUEEN IS?!?!",
                "Well, I would love to introduce you to her,\nbut unfortunately the doors are shut.",
                "I had the key at one point, but I lost it!",
                "`She also said something about once I have the key, go between red and blue??",
                "Anyways, if you can help me find the key, that would be great!",
                "It should be around Glacia Village somewhere..."

            ]
            lonzo.action = function() {
                addMission(meetingTheQueen)
                lonzo.lines = [
                    "We need to find the key... and fast!",
                    "It should be somewhere here in Glacia Village...",
                    "`She also said something about once I have the key, go between red and blue??"
                ]
                lonzo.clearAction()
            }
            lonzo.actionLine = "after"
        })
    }
}
lonzo.actionLine = "after"

var guardAlfred = new NPC(ctr(19), ctr(7), "Castle Guard Alfred", queensCastle, "D", [
    "Hello. Welcome to the High Floor.",
    "Are you looking to meet with the Queen?",
    "...",
    "Ah yes. She's been waiting someone.\nShe made a wall around her throne that APPARENTLY\nopens only to this person.",
    "She's been hiding in there for a while now.\nHopefully, you're the person she's waiting for!",
    "The queen instructed us to tell visitors to stand on the white\nblock in front of her throne.",
    "So far, no visitor's presence opened the door,\nso we are starting to lose hope.",
    "Anyway, you may now proceed."
], "hi")

var queenAlaska = new NPC(ctr(42), ctr(3), "Queen Alaska", queensCastle, "L", [
    "Welcome! I am Queen Alaska, but you can just\ncall me Alaska.",
    "I see your presence triggered my special\nwall, which means you are the person I'm supposed to meet.",
    "So, is it true? Did you really venture into the Confounded Cave\nof Chard Town and defeat Noctos?",
    "...",
    "That's incredible. You know, another Elemental Master was\ncaptured here, in Glacia.",
    "Unfortunately, almost nobody knows that the Elemental Masters exist anymore!",
    "Anyway, legend says that it can be found\nsomewhere in Glacia. However, many past Queens have\nfailed to locate it.",
    "This leads me to believe that it's underground\nsomewhere. Specifically near Glacia Village.",
    "However, even if you do find where the prison is, it could be\nextremely dangerous to enter!",
    "Long ago, when the Elemental Masters were corrupted and\nrunning free, this specific one was notorious for causing\nannoying winds.",
    "While Noctos had its magical spear to bring it power\n(which " + badGuy + " gave it), this Master, known as Stormed\nwould use a powerful sword.",
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
    meetingTheQueen.finish()
    lonzo.x = ctr(252)
    lonzo.y = ctr(21)
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
        p.giveItem(items.windyWastelandsKey, true)

        lonzo.lines = [
            "Go to the Windy Wastelands using the key!",
            "Good...",
            "O(GV#YIWRE(*RCYOVWBYOZ*@Y&!!",
            "...luck!"
        ]

        lonzo.clearAction()
    }
    lonzo.actionLine = "after"
}, "after")

var fee = new NPC(ctr(46), ctr(16), "Fee", galeCave, "D", [
    "Lemme guess, you came to talk to me for a word of advice.",
    "I always just go with the flow...",
    "Also, have you seen three other people that look like me?\nThey're in this cave somewhere..."
], "hi")

var fi = new NPC(ctr(4), ctr(16), "Fi", galeCave, "D", [
    "Hey pal, want a word of advice?",
    "If you ever hit rock bottom, the only way is up.",
    "By the way, where'd fee, fo, and fum go?"
], "hi")

var fo = new NPC(ctr(5), ctr(9), "Fo", galeCave, "D", [
    "This cave has been dark for so long...",
    "In the meantime, I've made up a song.",
    "Red, Orange, Yellow then Blue, Indigo and Violet Too!",
    "Am I forgetting something?",
    "...",
    "Anyway, I've been looking for my brothers, but I can't see\nanything!"
], "hi")

var fum = new NPC(ctr(37), ctr(2), "Fum", galeCave, "D", [
    "HEY YOU! WHAT ARE YOU DOING?",
    "Hah, I'm just messin' with you.", "When things get heated, always stay calm.",
    "You have any idea why the cave is so dark?"
], "hi")

var muhammadShop = [
    {item: items.auraOfWarmth, cost: 25, amount: 2},
    {item: food.apple(), cost: 10, amount: 5},
]

var shopkeeperMuhammad = new NPC(58 * 75, ctr(33), "Shopkeeper Muhammad", galeCave, "L", [
    "Hello!",
    "Would you like to buy something? I sell food and auras,\nin case you need to deal with extreme temperatures.",
    "You could probably get better prices at some other aura shop, though.",
    "`ugh, why did I say that! Not a good business strategy!"
], "hi", function() {
    ShopMenu.open(muhammadShop)
}, "after")

var mildred = new NPC(ctr(6), 3 * 75, "Mildred", trailShop, "D", [
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
	"Do you need anything right now?\nLet me open the shop for you."
], "hi", function() {	
    ShopMenu.open([
        {item: items.shovel, cost: 12, amount: 2}
    ])
    mildred.lines = ["Glad you're back! Let me open up the shop menu for you."]		
}, "after")

var theWanderer = new NPC(60 * 75, 41 * 75, "The Wanderer", mainMap, "D",    [
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
	
], "hi", function() {
    if (theWanderer.firstInteraction) {
        addMission(theWanderersRiddles)
    }
    theWanderer.action = function (p) {

    }
}, "after")

var lostTraveler = new NPC(ctr(252), ctr(48), "Lost Traveler", mainMap, "D", [
    "yellow...",
    "purple...",
    "...yellow...purple...yellow...purple..."
])

var captainBora = new NPC(69420 * 75, 42069 * 75, "Captain Bora", mainMap, "D", [
    "Oh wow, hello!",
    "I didn't expect to see anyone here.",
    "I don't really know what happened, I was walking through the forest and got lost.",
    "Slowly, I felt like I was drifting off to sleep.\nNext thing I know, I'm awake and you're here!",
    "I don't even know how much time has passed.\nI suppose I should head back to Glacia.",
], "hi", function() {
    captainBora.curPath = [
        [251, 47],
        [251, 43],
        [252, 43],
        [252, 29],
        [227, 29],
        [227, 29],
        [227, 27],
        [254, 27],
        [254, 23],
    ]
}, "after")

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
    "Not only that, but the forest is the only way to\nreach Dropton from here!",
    "You'll be able to enter it at it's north end, and\nexit at it's south end. But be very careful!",
    "The forest has been known to mess with people's\nsenses of direction...",
    "Good luck, and stay safe out there."
], "[insert description]", function() {
    p.questPoint = {
        x: 252,
        y: 80
    }
}, "after")

var caruk = new NPC(227 * 75, ctr(90), "Caruk the Fisherman", mainMap, 'L', [
    "I am fisherger!",
], "[insert description]", function() {

}, "after")

var creek = new NPC(ctr(226), 87 * 75, "Creek", mainMap, 'U', [
    "Hello there kind sir!",
    "I'm setting up a shop, but it's not quite ready.",
    "Come back later when it's complete."
], "[insert description]", function() {

}, "after")

var coral = new NPC(ctr(5), 2 * 75, "Coral", coralsWatercolors, 'D', [
    "Hello, I'm Coral, and welcome to my watercolor shop.",
    "You know the big lake outside? I paint pictures of it so you can\nappreciate it when you're away!",
    "If you'd like to buy a painting, please let me know!"
], "A skilled artist who loves to paint lakes, especially Dropton Lake.", function() {
    ShopMenu.open(coralShop)
}, "after")

var coralShop = [
    {item: items.droptonLakePainting, cost: 80, amount: 1}
]

var blakeShop = [
    {item: items.aquaLung, cost: 100, amount: 1}
]

var blake = new NPC(ctr(8), 1 * 75 + 75 /* So he stands on the very edge of the block */, "Blake", droptonWaterWear, 'D', [
    "Hi there!",
    "Welcome to Dropton Water Wear!",
    "You don't appear to be a resident of Dropton.",
    "Can I interest you in some gear? It can allow you to \n swim underneath some bodies of water.",
], "[insert description]", function() {
    ShopMenu.open(blakeShop)
}, "after")

var ness = new NPC(ctr(13), ctr(13), "Ness", droptonTunnels, 'R', [
    "Welcome to the Dropton Tunnels!",
    "Are you new here or are you returning?",
    "...",
    "I see. I can let you in to the main city, but\nyou'll be denied entry to certain places until\nyou get a Full Pass.",
    "I'm not able to help you get one, but I'm sure\nsomebody in Dropton can."
], "[insert description]", function() {

}, "after")

var bay = new NPC(ctr(15), ctr(9), "Bay", droptonTunnels, 'D', [
    "Hi there!",
    "These tunnels are confusing, aren't they?",
    "Most of the paths don't do anything, they're only used in emergencies.",
    "But if you're heading to central Dropton City, take a left.",
    "If you're trying to get to Dropton Town, take a right.\nNot much happens there though...",
    "If you don't know where to go, you should take a\nleft and visit Dropton City."
], "[insert description]", function() {

}, "after")

var tyde = new NPC(ctr(33), ctr(16), "Tyde", droptonCity, 'U', [
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

var marina = new NPC(2 * 75 + 75, ctr(17), "Officer Marina", droptonCity, 'D', [
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

var ariel = new NPC(ctr(14), ctr(26), "Ariel", droptonCity, 'L', [
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

var raine = new NPC(47 * 75, ctr(38), "Raine", droptonCity, 'L', [
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

var rainesDad = new NPC(ctr(55), ctr(39), "Raine's Dad", droptonCity, 'L', [
    "Hello there, how are you?",
    "...",
    "Good. I work as a repairman, so as you can imagine, I'm pretty\nbusy these days.",
    "This is one of the few times I get a break, so I enjoy it while I can..."
], "Resident - Dropton City\nMuch more enjoyable to talk to than his son.", function() {

}, "after")

var caspianShop = [
    {item: food.apple(), cost: 5, amount: 5}
]

var caspian = new NPC(6 * 75, ctr(4), "Caspian", droptonTown, 'L', [
    "Hey there!",
    "I'm trying my best to help support Dropton, so I've\nset up a little shop!",
    "It's not much right now though...",
], "Resident - Dropton Town\nEnthusiastic little guy who wants to help Dropton.", function() {
    ShopMenu.open(caspianShop)
}, "after")

var loch = new NPC(ctr(40), ctr(28), "Loch", droptonCity, 'L', [
    "Hey there.",
    "This mysterious substance just recently formed around Dropton City's\nmain entrance.",
    "If we find a way to get rid of this ice, I'm pretty sure the\nflow of the water will get rid of this purple stuff.",
    "I tried to break as much as possible by hand, but it was too dangerous.",
    "Opening up this entrance would provide easy access to Dropton Dryalnds!",
    "If you have any ideas on how to fix this, it will be very helpful.\nI'll reward you too!"
], "ello", function() {
    addMission(theBlockedEntrance)
}, "after")

var delta = new NPC(ctr(18), ctr(11), "Delta", droptonTown, 'D', [
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
    addMission(deltasLostTreasure)
}, "after")

var presidentWells = new NPC(ctr(1), ctr(1), "President Wells", droptonResearchFacility, 'R', [
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
            presidentWells.x = ctr(1)
            presidentWells.y = ctr(1)

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
                                presidentWells.x = ctr(23)
                                presidentWells.y = ctr(35)
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
                                    cameraStart(39 * 75, ctr(4), 15, "NPC", {
                                        npcName: presidentWells,
                                        lineStop: 2
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
                                ariel.x = ctr(34)
                                ariel.y = ctr(2)
                                ariel.dir = 'R'
                                ariel.lines = [
                                    "What happened here?",
                                    "This clump of rocks was formed the last time the ground shook like this.",
                                    "But now it looks like it has opened up into some sort of cave!",
                                    "I never realized that there was anything below Dropton City.",
                                    "Hopefully something is done about it..."
                                ]

                                // Change Walter
                                walter.x = ctr(45)
                                walter.y = ctr(2)
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

var cascade = new NPC(6 * 75 + 75, ctr(2), "Dr. Cascade", droptonResearchFacility, 'R', [
    "Hmm...",
    "Let's see here, if I add some water...",
    "No, that won't work..."
], "[insert description]", function() {

}, "after")

var fred = new NPC(ctr(168), ctr(81), "Fred", mainMap, 'D', [
    "Oh hello there!",
    "Not many people come by here.",
    "My friend, Pierre, and I normally guard this place.",
    "But we fell asleep on the job, and when I woke up, he was gone!",
    "This just happened, so he can't have gone far...",
    "If you can help find Pierre, I'll let you through this gate for free!",
], "One of the guards in the Dropton Drylands. That's it.", function() {

}, "after")

var pierre = new NPC(ctr(180), ctr(101), "Pierre", mainMap, 'U', [
    "...",
    "...mmm...",
    "...want cake...",
    "...please...",
    "...mmph",
    "zzzZzzzZzzzZzzz",
], "Another one of the guards in the Dropton Drylands. He probably likes cake.", function() {
    if (p.weapon.name == "Cake") {
        pierre.lines = [
            "...",
            "*sniff*",
            "woah...",
            "*wakes up*\nAaah!",
            "Where am I? And what is that scrumptious smell?",
            "Oh! A cake! I don't know who you are, but could I have it?",
            "...",
            "Yay!!!",
            "*munch munch munch munch munch*\n*munch munch munch munch*",
            "...",
            "Oh, Fred is waiting for me?\nYeah, I probably should get back to my post.",
            "See ya later!! And thanks for the cake!"
        ]

        pierre.action = function() {
            pierre.lines = [
                "Thanks for the cake.",
                "I'm heading back to my friend Fred now."
            ]
            pierre.lookAtPlayer = true
            let path = pierre.pathTo(168, 79)
            path.push(function() {
                pierre.dir = 'D'

                pierre.lines = [
                    "I don't know what would've happened if you didn't wake me up...",
                    "At least I got cake."
                ]

                fred.lines = [
                    "Thank you so much for finding Pierre!",
                    "We'll try not to fall asleep this time.",
                    "...what's that?",
                    "Oh right. I'll open the gate right away."
                ]

                fred.action = function() {
                    fred.curPath = [
                        [168, 80],
                        [167, 80],
                        function() {
                            mainMap.changeBlock(166, 80, '(')
                        }
                    ]

                    fred.lines = [
                        "Thanks again for finding Pierre!"
                    ]

                    fred.clearAction()
                }
            })
            pierre.curPath = path
        }

        pierre.actionLine = "after"

        p.removeItem(food.cake())
    }
}, 0)

pierre.lookAtPlayer = false

var opal = new NPC(ctr(125), ctr(62), "Opal", mainMap, 'R', [
    "Hello there traveler!",
    "Welcome to Litholia!",
    "But uhhh, you came at a pretty inconvenient time.",
    "Litholia is a town made mostly out of rocks and stones,\nbut recently lava has been oozing out of the ground!",
    "There's normally some lava, but now there is waaaay too much!\nIt's very dangerous, and it makes it much harder to get around!",
    "So yeah, I'd be careful.",
    "Bye-bye!"
], "Resident - Litholia")

var jade = new NPC(ctr(4), ctr(2), "Jade", litholianHistoryCenter, 'U', [
    "Oh?",
    "I've never met you before...who are you?",
    "...",
    "Ah, ok. This is the Litholian History Center.\nIt's still under construction though.",
    "If you'd like to know about the history of Litholia,\nI'm the person to ask!",
], "Resident - Litholia\nVery knowledgable about the history of Litholia.", function() {
    jade.lines = [
        "Oh, you again!\nI assume you want to learn about Litholia's history.",
        "I could talk about it for hours, but I won't\nbore you with all the details.",
        "Litholia used to be connected to Steel Field to the North,\nbut then a wall was built between the two by Bouldered, Master of Land.",
        "And now, lava has been mysteriously seeping out of the ground!",
        "If it gets any worse, the people of Litholia will have to leave!!",
        "...",
        "*ahem. Sorry, about the yelling. It is true though.",
        "Well, that's your history lesson for today.",
    ]

    jade.clearAction()
}, "after")

var beryl = new NPC(ctr(104), ctr(72), "Beryl", mainMap, 'L', [
    "Oh, hi.",
    "Sorry, I'm really worried right now.",
    "I had this stress bracelet made of gems that I always wore,\nbut then some mean people started trying to steal it from me!",
    "So, I hid it in a safe chest until they went away. But then, some\nlava started seeping out of the ground, blocking my path!",
    "Now I don't know how to get back to the chest\nwith my bracelet...",
    "The chest is up north, right by the border between us and Steel Field.",
    "...",
    "You're looking for the leader of Litholia?\nWell, that would be King Jasper.",
    "He's off doing some business in, uh...",
    "Aw man! I can't remember anything without my bracelet!\nPlease, if you can, help me find it!"
], "Resident - Litholia\nVery reliant on her special bracelet. Without it, she it too worried to remember anything!", function() {
    addMission(berylsSpecialBracelet)
}, "after")

var kingJasper = new NPC(ctr(115), ctr(81), "King Jasper", mainMap, 'R', [
    "Welcome visitor!",
    "I am King Jasper, the King of Litholia!",
    "Based on President Wells' description of you,\nI presume you are the hero who saved Dropton!",
    "...",
    "Perfect! I was just talking to Mr. Wells about a famous Litholian legend.\nIt goes as follows:",
    "*As the island grows weak and the fortress appears,\nBring these words to a true hero's ears,",
    "*The bushes along the river that flows,\nAmong their numbers, a subtly shows,",
    "*Two on the left, the other side three,\nFrom there, point east, a strange group of trees,",
    "*These four wooded towers, with no shrubs beside,\nThe northern-most river, head inside.",
    "That fortress mentioned at the beginning could be the\nlarge stone building that emerged in Southern Litholia. Unfortunately, nobody knows\nwhat it is nor how to get inside it.",
    "So, it's possible that this riddle is telling us how to enter it!",
], "The King of Litholia.", function() {
    kingJasper.lines = [
        "We need to to help us decipher the following riddle:",
        "*As the island grows weak and the fortress appears,\nBring these words to a true hero's ears,",
        "*The bushes along the river that flows,\nAmong their numbers, a subtly shows,",
        "*Two on the left, the other side three,\nFrom there, point east, a strange group of trees,",
        "*These four wooded towers, with no shrubs beside,\nThe northern-most river, head inside.",
        "That fortress mentioned at the beginning could be the\nlarge stone building that emerged in Southern Litholia. Unfortunately, nobody knows\nwhat it is nor how to get inside it.",
        "Maybe the riddle tells us how to enter it!"
    ]
}, "after")

var npcs = []

for (var npc of NPC.all) {
    if (!npc.isModel) {
        npcs.push(npc)
    }
}

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
// Get Interactive by coords
var getInteractive = function (x, y, map) {
    for (var i in interactives) {
        if (interactives[i].cords.x == x && interactives[i].cords.y == y && interactives[i].map == map) {
            return interactives[i]
        }
    }
    return 
}
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


var interactives = [
    // Main Map

    new Toggle(mainMap, 116, 31, function() {
        curMap.changeBlock(121, 27, ")")
    }, function() {
        curMap.changeBlock(121, 27, "(")
    }),

    new Toggle(mainMap, 102, 3, function() {
        curMap.changeBlock(121, 28, ")")
    }, function() {
        curMap.changeBlock(121, 28, "(")
    }, ctr(121), ctr(28)),

    new Toggle(mainMap, 77, 5, function() {
        curMap.changeBlock(121, 29, ")")
    }, function() {
        curMap.changeBlock(121, 29, "(")
    }, ctr(121), ctr(29)),

    new Toggle(mainMap, 97, 11, function() {
        curMap.changeBlock(121, 30, ")")
    }, function() {
        curMap.changeBlock(121, 30, "(")
    }, ctr(121), ctr(30)),

    new RaftDispenser(mainMap, 257 * 75, 30 * 75, ctr(257), ctr(29)),

    new RaftDispenser(mainMap, 256 * 75, 66 * 75, ctr(255), ctr(66)),

    new Breezeway(mainMap, 181, 86, 181, 84),
    new Breezeway(mainMap, 181, 84, 181, 86),

    new RaftDispenser(mainMap, b(143), b(77), ctr(143), ctr(76)),

    new Toggle(mainMap, 139, 81, function() {
        curMap.switch(131, 63, "(", ")")
        curMap.changeBlock(141, 81, 'S')
    }, function() {
        curMap.switch(131, 63, "(", ")")
        curMap.changeBlock(141, 81, '_')
    }, ctr(131), ctr(63)),

    new Toggle(mainMap, 150, 73, function() {
        curMap.switch(130, 63, "(", ")")
        curMap.changeBlock(148, 74, 'S')
    }, function() {
        curMap.switch(130, 63, "(", ")")
        curMap.changeBlock(148, 74, '_')
    }, ctr(130), ctr(63)),

    new Toggle(mainMap, 131, 89, function() {
        curMap.switch(129, 63, "(", ")")
        curMap.changeBlock(133, 90, 'W')
    }, function() {
        curMap.switch(129, 63, "(", ")")
        curMap.changeBlock(133, 90, '.')
    }, ctr(129), ctr(63)),

    new RaftDispenser(mainMap, b(134), b(59), ctr(135), ctr(59)),

    new RockDispenser(mainMap, b(104), b(99), ctr(105), ctr(99)),

    new RockSwitch(mainMap, 97, 99, function() {
        curMap.changeBlocks([
            [105, 95],
            [106, 95],
            [105, 89],
            [106, 89]
        ], '(')
    }, function() {
        curMap.changeBlocks([
            [105, 95],
            [106, 95],
            [105, 89],
            [106, 89]
        ], ')')
    }/*, b(106), ctr(95)*/),

    new Breezeway(mainMap, 114, 99, 118, 95),
    new Breezeway(mainMap, 118, 95, 114, 99),

    // Confounded Cave

    new Toggle(confoundedCave, 5, 18, function() {
        curMap.changeBlock(9, 18, "S")
        curMap.changeBlock(10, 18, "_")
        curMap.changeBlock(9, 19, "_")
        curMap.changeBlock(10, 19, "S")
    }, function() {
        curMap.changeBlock(9, 18, "_")
        curMap.changeBlock(10, 18, "S")
        curMap.changeBlock(9, 19, "S")
        curMap.changeBlock(10, 19, "_")
    }),

    new Toggle(confoundedCave, 5, 19, function() {
        curMap.changeBlock(9, 19, "S")
        curMap.changeBlock(10, 19, "_")
        curMap.changeBlock(9, 20, "_")
        curMap.changeBlock(10, 20, "S")
    }, function() {
        curMap.changeBlock(9, 19, "_")
        curMap.changeBlock(10, 19, "S")
        curMap.changeBlock(9, 20, "S")
        curMap.changeBlock(10, 20, "_")
    }),

    new Toggle(confoundedCave, 6, 19, function() {
        curMap.changeBlock(10, 19, "S")
        curMap.changeBlock(11, 19, "_")
        curMap.changeBlock(10, 20, "_")
        curMap.changeBlock(11, 20, "S")
    }, function() {
        curMap.changeBlock(10, 19, "_")
        curMap.changeBlock(11, 19, "S")
        curMap.changeBlock(10, 20, "S")
        curMap.changeBlock(11, 20, "_")
    }),

    new Toggle(confoundedCave, 6, 12, function() {
        curMap.changeBlock(11, 22, ")")
        curMap.changeBlock(5, 14, "_")
        curMap.changeBlock(11, 16, ")")
        
    }, function() {
        curMap.changeBlock(11, 22, "(")
        curMap.changeBlock(11, 16, "(")
        curMap.changeBlock(5, 14, "S")
    }, ctr(11), ctr(19)),

    new Toggle(confoundedCave, 14, 12, function() {
        curMap.changeBlock(39, 22, ")")
    }, function() {
        curMap.changeBlock(39, 22, "(")
    }, ctr(39), ctr(22)),

    new Toggle(confoundedCave, 15, 8, function() {
        curMap.changeBlock(20, 0, ")")
    }, function() {
        curMap.changeBlock(20, 0, "(")
    }, ctr(20), ctr(0)),

    // Glacia Village
    new Breezeway(mainMap, 218, 11, 218, 9), // Pair up ones that connect to each other
    new Breezeway(mainMap, 218, 9, 218, 11),

    new Breezeway(mainMap, 167, 26, 168, 27),

    // Queen's Castle

    new Toggle(queensCastle, 2, 2, function() {
        curMap.changeBlock(1, 3, "!")
        curMap.changeBlock(3, 1, "~")
    }, function() {
        curMap.changeBlock(1, 3, "~")
        curMap.changeBlock(3, 1, "!")
    }),

    new Toggle(queensCastle, 2, 4, function() {
        curMap.changeBlock(1, 3, "~")
        curMap.changeBlock(3, 5, "!")
    }, function() {
        curMap.changeBlock(1, 3, "!")
        curMap.changeBlock(3, 5, "~")
    }),

    new Toggle(queensCastle, 4, 4, function() {
        curMap.changeBlock(1, 3, "~")
        curMap.changeBlock(3, 5, "~")
        curMap.changeBlock(5, 3, "!")
    }, function() {
        curMap.changeBlock(1, 3, "!")
        curMap.changeBlock(3, 5, "!")
        curMap.changeBlock(5, 3, "~")
    }),

    new Toggle(queensCastle, 4, 2, function() {
        curMap.changeBlock(1, 3, "!")
        curMap.changeBlock(5, 3, "!")
    }, function() {
        curMap.changeBlock(1, 3, "~")
        curMap.changeBlock(5, 3, "~")
    }),


    // Gale Cave
    new MultiToggle(galeCave, 49, 19, 50, 19, ["!", "~", "_", ",", "z"]), // Fee toggle

    new MultiToggle(galeCave, 2, 18, 1, 18, ["!", "~", "_", ",", "z"]), // Fi toggle

    new MultiToggle(galeCave, 11, 10, 12, 10, ["!", "~", "_", ",", "z"]), // Fo toggle

    new MultiToggle(galeCave, 40, 3, 41, 3, ["!", "~", "_", ",", "z"]), // Fum toggle

    new Toggle(galeCave, 27, 26, function() {
        curMap.changeBlock(18, 26, "_")
    }, function() {
        curMap.changeBlock(18, 26, "S")
    }),

    new Toggle(galeCave, 27, 25, function() {
        curMap.changeBlock(18, 25, "_")
    }, function() {
        curMap.changeBlock(18, 25, "S")
    }),

    new Toggle(galeCave, 27, 24, function() {
        curMap.changeBlock(18, 24, "_")
    }, function() {
        curMap.changeBlock(18, 24, "S")
    }),

    new Toggle(galeCave, 27, 23, function() {
        curMap.changeBlock(18, 23, "_")
    }, function() {
        curMap.changeBlock(18, 23, "S")
    }),

    new Toggle(galeCave, 19, 26, function() {}, function() {}),

    new Toggle(galeCave, 19, 24, function() {}, function() {}),

    // Encompassed Forst
    lostTravelerToggle,

    // Howler Hollow

    new Breezeway(howlerHollow, 6, 2, 9, 2), // Pair up ones that connect to each other
    new Breezeway(howlerHollow, 9, 2, 6, 2),

    new MultiToggle(howlerHollow, 12, 2, 15, 2, ['S', '!', '~', '$']),

    new Breezeway(howlerHollow, 12, 3, 15, 3),
    new Breezeway(howlerHollow, 15, 3, 12, 3),

    new Toggle(howlerHollow, 15, 9, function() {
        howlerHollow.switch(15, 10, '(', ')')
        howlerHollow.switch(16, 11, '(', ')')
    }, function() {
        howlerHollow.switch(15, 10, '(', ')')
        howlerHollow.switch(16, 11, '(', ')')
    }),

    new Breezeway(howlerHollow, 10, 11, 7, 11),
    new Breezeway(howlerHollow, 7, 11, 10, 11),

    new Toggle(howlerHollow, 6, 16, function() {
        howlerHollow.switch(14, 11, '(', ')')
        howlerHollow.switch(16, 11, '(', ')')

        // howlerHollow.changeBlock(14, 11, '(')
        // howlerHollow.changeBlock(16, 11, ')')
    }, function() {
        howlerHollow.switch(14, 11, '(', ')')
        howlerHollow.switch(16, 11, '(', ')')
    }, ctr(15), ctr(11)),

    new Toggle(howlerHollow, 25, 15, function() {
        howlerHollow.changeBlock(4, 4, ')')
        howlerHollow.changeBlock(5, 4, ')')
    }, function() {
        howlerHollow.changeBlock(4, 4, '(')
        howlerHollow.changeBlock(5, 4, '(')
    }, ctr(4), 5 * 75),

    new Breezeway(howlerHollow, 24, 10, 24, 6),
    new Breezeway(howlerHollow, 24, 6, 24, 10),

    new Breezeway(howlerHollow, 28, 1, 22, 1),
    new Breezeway(howlerHollow, 22, 1, 28, 1),

    new Breezeway(howlerHollow, 22, 8, 18, 20),
    new Breezeway(howlerHollow, 18, 20, 22, 8),

    new Toggle(howlerHollow, 18, 19, function() {
        howlerHollow.changeBlock(17, 20, ')')
    }, function() {
        howlerHollow.changeBlock(17, 20, '(')
    }),

    // Stormed Room

    new LockToggle(stormedRoom, 6, 7, function() {
        stormedRoom.changeBlock(10, 5, 'z')
    }),

    new LockToggle(stormedRoom, 20, 2, function() {
        stormedRoom.changeBlock(11, 5, 'z')
    }),

    new LockToggle(stormedRoom, 18, 11, function() {
        stormedRoom.changeBlock(12, 5, 'z')
    }),

     // Stormed Phase 2 Breezeways
    new Breezeway(stormedRoom, 13, 5, 12, 17),
    new Breezeway(stormedRoom, 12, 17, 13, 5),

    // Encompassed Labyrinth
    new LockToggle(encompassedLabyrinth, 16, 4, function() {
        Screen.shake(5, 5)
        setTimeout(() => {
            encompassedLabyrinth.bright = true
        }, 5000)
    }),

    // Dropton City
    new RaftDispenser(droptonCity, 2 * 75, 2 * 75, ctr(2), ctr(3)),

    // Abandoned Channel
    new LockToggle(abandonedChannel, 1, 16, function () {
        cascade.clearAction()

        curMap.changeBlock(6, 16, '~')
        curMap.changeBlock(7, 16, '~')
        curMap.changeBlock(1, 17, '~')
    }),

    new LockToggle(abandonedChannel, 22, 12, function () {
        //curMap.changeBlock(43, 19, '_')
    }, 43 * 75, 19 * 75),

    new LockToggle(abandonedChannel, 15, 21, function () {
        //curMap.changeBlock(43, 19, '_')
    }, 43 * 75, 19 * 75),

    new MultiToggle(abandonedChannel, 17, 21, 14, 21, ['S', 'W', '~', '_', '!']),

    new RaftDispenser(abandonedChannel, 6 * 75, 27 * 75, ctr(5), ctr(27)),

    new LockToggle(abandonedChannel, 26, 21, function () {
        //curMap.changeBlock(43, 19, '_')
    }, 43 * 75, 19 * 75),

    new LockToggle(abandonedChannel, 44, 11, function () {
        //curMap.changeBlock(43, 19, '_')
    }, 43 * 75, 19 * 75),

    // Cryo Underground

    new Toggle(cryoUnderground, 13, 6, function() {
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
    }),

    new Toggle(cryoUnderground, 21, 4, function() {
        curMap.changeBlock(17, 6, ')')
    }, function() {
        curMap.changeBlock(17, 6, '(')
    }, ctr(17), ctr(6)),

    new RaftDispenser(cryoUnderground, 5 * 75, 1 * 75, ctr(6), ctr(1)),

    new RaftDispenser(cryoUnderground, 1 * 75, 22 * 75, ctr(1), ctr(21)),

    new RaftDispenser(cryoUnderground, 22 * 75, 22 * 75, ctr(22), ctr(21)),

    new Toggle(cryoUnderground, 15, 27, function() {
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
    }),

    new RaftDispenser(cryoUnderground, 19 * 75, 10 * 75, ctr(20), ctr(10)),

    new RaftDispenser(cryoUnderground, 38 * 75, 1 * 75, ctr(39), ctr(1)),

    new RaftDispenser(cryoUnderground, 28 * 75, 19 * 75, ctr(28), ctr(20)),

    new Toggle(cryoUnderground, 46, 19, function() {
        curMap.changeBlock(47, 23, 'W')
        curMap.changeBlock(48, 23, 'W')

        curMap.changeBlock(46, 19, '!')
        curMap.changeBlock(46, 20, '!')
    }, function() {
        curMap.changeBlock(47, 23, 'z')
        curMap.changeBlock(48, 23, 'z')

        curMap.changeBlock(46, 19, 'z')
        curMap.changeBlock(46, 20, 'z')
    }, 48 * 75, ctr(23)),

    new Toggle(cryoUnderground, 28, 22, function () {
        
        curMap.changeBlock(29, 22, 'S')
        curMap.changeBlock(35, 22, '~')
    }, function () {
        
        curMap.changeBlock(29, 22, '~')
        curMap.changeBlock(35, 22, 'S')

    }),

    new Toggle(cryoUnderground, 34, 21, function () {
        
        curMap.changeBlock(29, 22, '~')
        curMap.changeBlock(35, 22, 'S')
    }, function () {
        curMap.changeBlock(29, 22, '!')
        curMap.changeBlock(35, 22, '!')
    }),

    new MultiToggle(cryoUnderground, 42, 22, 41, 22, ["!", "~", ",", "."]),

    new LockToggle(cryoUnderground, 48, 22, function() {
        curMap.changeBlock(44, 22, '~')
        //curMap.changeBlock(34, 22, '.')
    }),

    new RaftDispenser(cryoUnderground, 48 * 75, 32 * 75, ctr(47), ctr(32)),

    // Drowned Room
    new RaftDispenser(drownedRoom, 15 * 75, 25 * 75, ctr(15), ctr(24)),

    new RaftDispenser(drownedRoom, 5 * 75, 25 * 75, ctr(5), ctr(24)),

    new RaftDispenser(drownedRoom, 25 * 75, 25 * 75, ctr(25), ctr(24)),

    new RaftDispenser(drownedRoom, 5 * 75, 15 * 75, ctr(6), ctr(15)),

    new RaftDispenser(drownedRoom, 25 * 75, 15 * 75, ctr(24), ctr(15)),

    new RaftDispenser(drownedRoom, 5 * 75, 5 * 75, ctr(5), ctr(6)),

    new RaftDispenser(drownedRoom, 15 * 75, 5 * 75, ctr(15), ctr(6)),

    new RaftDispenser(drownedRoom, 25 * 75, 5 * 75, ctr(25), ctr(6)),

    // Fortune Field Water Tunnels
    new RaftDispenser(fortuneFieldWaterTunnel146_88, b(10), b(4), ctr(11), ctr(4)),

    new RaftDispenser(fortuneFieldWaterTunnel144_78, b(6), b(5), ctr(7), ctr(5)),

    new MultiToggle(fortuneFieldWaterTunnel144_78, 11, 3, 8, 4, ["!", "$", "S", "W"]),

    // Passageways of Litholian Legend
    new RaftDispenser(litholianLegendPassageways, b(38), b(1), ctr(37), ctr(1)),

    new RaftDispenser(litholianLegendPassageways, b(20), b(10), ctr(20), ctr(9)),

    // Stoneheart Fortress
    new RockDispenser(stoneheartFortress, b(11), b(2), ctr(12), ctr(2)),

    new RockSwitch(stoneheartFortress, 15, 2, function() {
        curMap.changeBlock(8, 1, '~')
    }, function() {
        curMap.changeBlock(8, 1, '!')
    }),

    new Breezeway(stoneheartFortress, 2, 8, 17, 3),
    new Breezeway(stoneheartFortress, 17, 3, 2, 8),

    new RockSwitch(stoneheartFortress, 10, 7, function() {
        curMap.changeBlock(10, 6, '(')
    }, function() {
        curMap.changeBlock(10, 6, ')')
    }),

    // Stoneheart Sanctuary
    new Rock(stoneheartSanctuary, ctr(18), ctr(12)), // Test rock
    new Rock(stoneheartSanctuary, ctr(21), ctr(15)), // Test rock

    new RockDispenser(stoneheartSanctuary, b(1), b(2), ctr(2), ctr(2)),

    new RaftDispenser(stoneheartSanctuary, b(18), b(3), ctr(18), ctr(2)),

    new RockSwitch(stoneheartSanctuary, 37, 2, function() {
        curMap.changeBlock(37, 4, '(')
    }, function() {
        curMap.changeBlock(37, 4, ')')
    }),

    new RockDispenser(stoneheartSanctuary, b(31), b(9), ctr(31), ctr(8)),

    new Toggle(stoneheartSanctuary, 18, 7, function() {
        curMap.changeBlock(16, 9, '!')
        curMap.changeBlocks([[16, 7], [16, 8]], '~')
    }, function() {
        curMap.changeBlock(16, 9, '~')
    }),

    new RaftDispenser(stoneheartSanctuary, b(6), b(9), ctr(6), ctr(8)),

    new RaftDispenser(stoneheartSanctuary, b(7), b(13), ctr(7), ctr(12)),

    new RockDispenser(stoneheartSanctuary, b(12), b(13), ctr(13), ctr(13)),

    new MultiToggle(stoneheartSanctuary, 15, 13, 13, 13, ['_', ',', '*', '!', '~']),

    new RaftDispenser(stoneheartSanctuary, b(14), b(11), ctr(13), ctr(11), ['_', ',', '*', '!', '~']),

    new RockSwitch(stoneheartSanctuary, 17, 16, function() {
        stoneheartSanctuary.switch(19, 16, ')', '(')
    }, function() {
        stoneheartSanctuary.switch(19, 16, ')', '(')
    }),

    new RockSwitch(stoneheartSanctuary, 18, 12, function() {
        stoneheartSanctuary.switch(20, 12, '~', '!')
        stoneheartSanctuary.switch(20, 14, '~', '!')

        stoneheartSanctuary.switch(23, 12, '~', '!')
        stoneheartSanctuary.switch(23, 14, '~', '!')
    }, function() {
        stoneheartSanctuary.switch(20, 12, '~', '!')
        stoneheartSanctuary.switch(20, 14, '~', '!')

        stoneheartSanctuary.switch(23, 12, '~', '!')
        stoneheartSanctuary.switch(23, 14, '~', '!')
    }),

    new RaftDispenser(stoneheartSanctuary, b(21), b(18), ctr(22), ctr(18)),

    new RockSwitch(stoneheartSanctuary, 22, 16, function() {
        curMap.switch(21, 17, '!', '~')
    }, function() {
        curMap.switch(21, 17, '!', '~')
    }),

    new RockSwitch(stoneheartSanctuary, 25, 13, function() {
        curMap.changeBlock(26, 14, '(')
    }, function() {
        curMap.changeBlock(26, 14, ')')
    }),

    new RockDispenser(stoneheartSanctuary, b(31), b(12), ctr(31), ctr(11)),

    // Bait (troll) switches
    new RockSwitch(stoneheartSanctuary, 34, 13, function() {
        stoneheartSanctuary.changeBlocks([[35, 12], [36, 12], [35, 13], [34, 14], [35, 15], [34, 16], [34, 17], [35, 17]], '!')
    }, function() {
        stoneheartSanctuary.changeBlocks([[35, 12], [36, 12], [35, 13], [34, 14], [35, 15], [34, 16], [34, 17], [35, 17]], '_')
    }),

    new RockSwitch(stoneheartSanctuary, 36, 15, function() {
        stoneheartSanctuary.changeBlocks([[35, 12], [36, 12], [35, 13], [34, 14], [35, 15], [34, 16], [34, 17], [35, 17]], '!')
    }, function() {
        stoneheartSanctuary.changeBlocks([[35, 12], [36, 12], [35, 13], [34, 14], [35, 15], [34, 16], [34, 17], [35, 17]], '_')
    }),

    new RockSwitch(stoneheartSanctuary, 35, 16, function() {
        stoneheartSanctuary.changeBlocks([[35, 12], [36, 12], [35, 13], [34, 14], [35, 15], [34, 16], [34, 17], [35, 17]], '!')
    }, function() {
        stoneheartSanctuary.changeBlocks([[35, 12], [36, 12], [35, 13], [34, 14], [35, 15], [34, 16], [34, 17], [35, 17]], '_')
    }),

    // Back to normal (lol)
    new RaftDispenser(stoneheartSanctuary, b(32), b(19), ctr(33), ctr(19)),

    new RockSwitch(stoneheartSanctuary, 35, 19, function() {
        stoneheartSanctuary.changeBlock(36, 19, '(')
    }, function() {
        stoneheartSanctuary.changeBlock(36, 19, ')')
    }),

    new Breezeway(stoneheartSanctuary, 37, 11, 37, 19),
    new Breezeway(stoneheartSanctuary, 37, 19, 37, 11),

    new Toggle(stoneheartSanctuary, 25, 21, function() {
        stoneheartSanctuary.changeBlock(23, 22, '!')
        stoneheartSanctuary.changeBlocks([[24, 22], [25, 22], [26, 22], [27, 22], [28, 22]], '~')
    }, function() {
        stoneheartSanctuary.changeBlock(23, 22, '~')
    }),

    new RockDispenser(stoneheartSanctuary, b(26), b(20), ctr(26), ctr(21)),

    new RockSwitch(stoneheartSanctuary, 24, 25, function() {
        stoneheartSanctuary.changeBlock(23, 24, '(')
    }, function() {
        stoneheartSanctuary.changeBlock(23, 24, ')')
    }),

    // Lithos Room
    new RockDispenser(lithosRoom, b(10), b(20), ctr(11), ctr(20)),

    new RockSwitch(lithosRoom, 19, 20, function() {
        lithosRoom.changeBlocks([
            [6, 13],
            [6, 14],
            [6, 15],
            [6, 16],

            [23, 13],
            [23, 14],
            [23, 15],
            [23, 16],
        ], '_')
        // lithosRoom.changeBlocks([
        //     [10, 14],
        //     [10, 15],
        //     [19, 14],
        //     [19, 15],
        // ], 'S')

        // lithosRoom.changeBlocks([
        //     [14, 14],
        //     [15, 14],
        //     [14, 15],
        //     [15, 15],
        // ], '~')

        // lithosRoom.changeBlocks([
        //     [13, 10],
        //     [14, 10],
        //     [15, 10],
        //     [16, 10]
        // ], '_')

        // lithosRoom.changeBlocks([
        //     [12, 7],
        //     [12, 8],
        //     [12, 9],
        //     [17, 7],
        //     [17, 8],
        //     [17, 9],
        // ], '$')
    }, function() {
        lithosRoom.changeBlocks([
            [6, 13],
            [6, 14],
            [6, 15],
            [6, 16],

            [23, 13],
            [23, 14],
            [23, 15],
            [23, 16],
        ], '!')
        // lithosRoom.changeBlocks([
        //     [10, 14],
        //     [10, 15],
        //     [19, 14],
        //     [19, 15],
        // ], '_')

        // lithosRoom.changeBlocks([
        //     [14, 14],
        //     [15, 14],
        //     [14, 15],
        //     [15, 15],
        // ], '!')

        // lithosRoom.changeBlocks([
        //     [13, 10],
        //     [14, 10],
        //     [15, 10],
        //     [16, 10]
        // ], '$')

        // lithosRoom.changeBlocks([
        //     [12, 7],
        //     [12, 8],
        //     [12, 9],
        //     [17, 7],
        //     [17, 8],
        //     [17, 9],
        // ], '%')
    })
]

/*
t - Toggle
mt - Multi-toggle
raft - Raft
rd - Raft Dispenser
*/

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

                addMission(missions[i])
            }
        }
    })
}



var models = {
    bosses: {
        noctos: new Noctos(noctosRoom, width / 2, height / 2),
        stormed: new Stormed(stormedRoom, width / 2, height / 2)
    },
    npcs: {
        oldMan: new NPC(0, 0, "Old Man", null, null, null, null),
		theWanderer: new NPC(width / 2, height / 2, "", null, null, null, null)
    }
}

for (var modelType in models) {
    for (var i in models[modelType]) {
        let model = models[modelType][i]

        model.isModel = true
    }
}

const p = new Player(ctr(25), ctr(10), npcs) // default x = width / 2, y = height / 2 helloooh

const c121_31 = new Chest(mainMap, 121, 31, [
    items.heatHandle
])

const c92_37 = new Chest(mainMap, 92, 37, [
    // items.confoundedCaveKey
    new TrillSum(100)
])

const c184_78 = new Chest(mainMap, 184, 78, [
    food.cake()
])

const c24_2 = new Chest(howlerHollow, 24, 2, [
    new Item("Puzzle Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
            
        if (p.on(15, 20) && curMap == howlerHollow) {
            curMap.changeBlock(14, 20, '_')
            
            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == this.name) {
                    p.inventory.splice(i, 1)
                }
            }
        }
    })
])

const c5_18 = new Chest(howlerHollow, 5, 18, [
    new Item("Puzzle Key", 0, function(x, y) {
        ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
    }, function(p) {
            
        if (p.on(16, 15) && curMap == howlerHollow) {
            curMap.changeBlock(17, 15, '_')
            
            for (var i in p.inventory) {
                var item = p.inventory[i]
                if (item.name == this.name) {
                    p.inventory.splice(i, 1)
                }
            }
        }
    })
])

const c14_3 = new Chest(confoundedCave, 14, 3, [
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

const c10_1 = new Chest(cryoUnderground, 10, 1, [
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

const c34_15 = new Chest(cryoUnderground, 34, 15, [
    new TrillSum(25)
])

const c4_41 = new Chest(droptonCity, 4, 41, [
    items.lightContainer
])

const c119_55 = new Chest(mainMap, 119, 55, [
    items.berylsBracelet
])

const chests = Chest.all

// Secrets

const droptonTunnelsEntrance = new Secret(270, 78, mainMap, function() {
    if (p.can.goUnderWater && keys.space) {
        Screen.fadeOut(0.01, function() {
            curMap = droptonTunnels
            p.goTo(ctr(14), ctr(14))
        })
    }
})

const fortuneFieldWaterEntrance146_88 = new Secret(146, 88, mainMap, function() {
    if (p.can.goUnderWater && keys.space) {
        Screen.fadeOut(0.01, function() {
            curMap = fortuneFieldWaterTunnel146_88
            p.goTo(ctr(9), ctr(6))
        })
    }
})

const fortuneFieldWaterEntrance144_78 = new Secret(144, 78, mainMap, function() {
    if (p.can.goUnderWater && keys.space) {
        Screen.fadeOut(0.01, function() {
            curMap = fortuneFieldWaterTunnel144_78
            p.goTo(ctr(9), ctr(5))
        })
    }
})

const fortuneFieldWaterEntrance148_102 = new Secret(148, 102, mainMap, function() {
    if (p.can.goUnderWater && keys.space) {
        Screen.fadeOut(0.01, function() {
            curMap = fortuneFieldWaterTunnel148_102
            p.goTo(ctr(26), ctr(10))
        })
    }
})

const litholianLegendWaterEntrance = new Secret(171, 66, mainMap, function() {
    if (p.can.goUnderWater && keys.space) {
        Screen.fadeOut(0.01, function() {
            curMap = litholianLegendPassageways
            p.goTo(ctr(37), ctr(2))

            Screen.fadeIn(0.01, function() {})
        })
    }
})

var secrets = Secret.all

var opacity = 1

// Noctos phase 2 cutscene variables
var spearSpeed = 1
var noctosColor = 0
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
            auraTimer: p.auraTimer,
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
        curMissions: [],
        commandsRun: [],
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
        if (npcs[i].name == "Old Man") {
            console.log(npcs[i].map)
        }
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

    commandsRun.forEach((command) => {
        SAVING.commandsRun.push(command)
    })

    console.log(SAVING.commandsRun)
    lset("commandsRun", JSON.stringify(SAVING.commandsRun))

    console.log("Saved game!")
}

function clearSave() {
    localStorage.clear()
}

// Turns off saves
// clearSave() // DEFAULT GONE

var dev = false // Allows player to fly around through objects without getting hurt, purely for development purposes
if (!!save) {
    dev = JSON.parse(dev)
}
// ONLY TURN THIS ON USING CONSOLE
// TO TURN DEV OFF, RELOAD


// Start position code (use to set variables and start game from a certain point) Remove all this code later
function startPos() {
    dev = true
    curMap = lithosRoom
    p.goTo(ctr(10), ctr(10))
    p.inventory = [items.spearOfNoctos, items.spearOfNoctos, food.apple(), food.apple(), items.auraOfWarmth, items.drownedsScythe, items.stormedsSword, items.aquaLung, food.cake()]
    p.updateSortedInventory()
    p.equipped = [items.aquaLung]

    abandonedChannel.changeBlock(47, 17, '_')
    abandonedChannel.changeBlock(47, 16, 'O')

    ariel.goTo(ctr(16), ctr(33))
    ariel.lines = [
        "Hi again!",
        "The earthquakes seem to have stopped!\nI don't know how, but I'm not complaining!"
    ]

    walter.goTo(ctr(35), ctr(10))
    walter.dir = 'D'
    walter.lines = [
        "The water's gotten so much calmer and more peaceful...",
        "Still, I'm curious where all that shaking was coming from.",
        "I wish President Wells would just tell everybody!"
    ]

    presidentWells.map = droptonCity
    presidentWells.goTo(ctr(42), ctr(3))
    presidentWells.dir = 'D'
    presidentWells.lines = [
        "For the last time, I'm not letting people--huh?",
        "Woah! It's you! You're back!",
        "And in one piece too! I'll be honest, I was\nstarting to doubt that you'd show up.",
        "I presume you are the reason the shaking stopped.\nI want to hear all about how you did it!",
        "Also, some character named Wayne showed up and\nclaimed he knew you. He said he had to tell you something\nimportant.",
        "I don't know if he's telling the truth or not, but\nhe should be waiting in the Dropton Tunnels."
    ]

    presidentWells.clearAction()

    wayne.map = droptonTunnels
    wayne.hasAquaLung = true
    wayne.goTo(ctr(28), ctr(23))
    wayne.lines = [
        "Aye matey! It's good to see you again!",
        "I hear you've been working with President Wells to help Dropton!",
        "The old man sent for me to get you. He's still in Chard Town\nand he has some important information that you 'need to know'.",
        "It is a long journey though. I would know, I had to\ntravel for such a long time to get here!",
        "There are rumors about a way to teleport around the island.\nApparently some anonymous man from Chard Town has found a way.",
        "Noobdy knows who he is, so he's known as The Wanderer.",
        "Anyway, I'd head over to Chard Town and talk to the Old Man. Otherwise,\nit means I came all this way for nothing!"
    ]
}

startPos()

var suspensiaInterval = setInterval(function() { // Makes suspensia spread into water
    if (scene == "GAME") {
        var w = []
        
        for (var i = 1; i < curMap.arr.length; i ++) {
            for (var j = 1; j < curMap.arr[i].length; j ++) {
                if (i != 0 && j != 0 && i < curMap.arr.length - 1 && j < curMap.arr[i].length - 1) {
                    var char = curMap.getBlock(j, i)
                    
                    if (char == '~') {
                        try {
                            if (curMap.getBlock(j + 1, i) == '^' ||
                            curMap.getBlock(j - 1, i) == '^' ||
                            curMap.getBlock(j, i + 1) == '^' ||
                            curMap.getBlock(j, i - 1) == '^') {
                                w.push([j, i])    
                            }
                        } catch (e) {

                        }
                    }
                }
            }
        }

        curMap.changeBlocks(w, '^')
    }
}, 1000)

var gameInterval = setInterval(function() {
    if (tabIsActive) {
        if (dev) {
            p.health = 15 // Constantly resets player health to 15
            for (var i in blocks) { 
                blocks[i].through = true
                blocks[i].speed = 17.5
                blocks[i].dps = 0
            }
        }
        
        elapsed ++
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(0, 0, width, height)
    
        for (var i in eventDelays) {
            eventDelays[i].timer -= perSec(1)
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
            ctx.translate(Math.floor((-1 * p.x) + (width / 2)), Math.floor((-1 * p.y) + (height / 2)))

            // Screen Shake
            ctx.translate(Math.floor(Screen.shakeOffset.x), Math.floor(Screen.shakeOffset.y))

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
                } else if (curMap == lonzoHouse) {
                    playMusic("Lonzo House")
                } else if (curMap == queensCastle) {
                    playMusic("Queen's Castle")
                } else if (curMap == galeCave) {
                    if (lighting < 1000) {
                        playMusic("Gale Cave Dark")
                    } else {
                        playMusic("Gale Cave Light")
                    }
                } else if (curMap == howlerHollow) {
                    playMusic("Howler Hollow")
                } else if (curMap == droptonTunnels) {
                    playMusic("Dropton City") // changeme later when we make new music
                } else if (curMap == droptonCity) {
                    playMusic("Dropton City")
                } else if (curMap == droptonTown) {
                    playMusic("Dropton City") // changeme later when we make new music
                } else if (curMap == cryoUnderground) {
                    playMusic("Cryo Underground")
                } else if (curMap == stoneheartSanctuary) {
                    playMusic("Stoneheart Sanctuary")
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
                    if (!interactives[i].drawOnTop) {
                        interactives[i].draw()
                    }

                    if (!!interactives[i].update) {
                        interactives[i].update()
                    }
                }
            }

            for (var i in interactives) { // Draws interactives that belong on a higher layer
                let inter = interactives[i]
                if (inter.drawOnTop && curMap == interactives[i].map) {
                    inter.draw()
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
                if (curMap.name == monsters[i].map && !monsters[i].isDead()) {
                    monsters[i].draw(p)
                    if (!!monsters[i].update && !(monsters[i] instanceof DrownedMinion)) {
                        monsters[i].update()
                    }

                    monsters[i].updatePlayerInfo()
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
                bossfight = false
                if (curMap == noctosRoom) {
                    Screen.fadeOut(0.005, function() {
                        noctosScale = 1
                        scene = "DARKENED BOSS CUTSCENE DEFEATED"
                    })
                } else if (curMap == stormedRoom) {
                    Screen.fadeOut(0.005, function() {
                        curMap = galeCave
                        p.x = ctr(44)
                        p.y = ctr(34)
                        p.giveItem(items.stormedsSword, true)

                        lonzo.map = mainMap
                        lonzo.x = ctr(158)
                        lonzo.y = ctr(50)
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

                        queenAlaska.x = ctr(253)
                        queenAlaska.y = ctr(23)
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

                        drQua.x = ctr(256)
                        drQua.y = ctr(23)

                        p.questPoint = {
                            x: 253,
                            y: 23
                        }

                        mainMap.changeBlock(257, 29, 'z')
                        alerts.push(new GameAlert(258, 29, ["SEGREME DNIW FO RETSAM WEN A SA SKAERB LLAW EHT"], mainMap, "SIGN"))
                    })
                } else if (curMap == drownedRoom) {
                    Screen.fadeOut(0.005, function() {
                        curMap = abandonedChannel
                        p.inRaft = false
                        p.canMove = true
                        p.goTo(ctr(47), ctr(19))
                        p.giveItem(items.drownedsScythe, true)

                        abandonedChannel.changeBlock(45, 19, '_') // This block prevents suspensia from coming in anymore
                        abandonedChannel.changeBlock(47, 17, '_')
                        abandonedChannel.changeBlock(47, 16, 'O')

                        ariel.goTo(ctr(16), ctr(33))
                        ariel.lines = [
                            "Hi again!",
                            "The earthquakes seem to have stopped!\nI don't know how, but I'm not complaining!"
                        ]

                        walter.goTo(ctr(35), ctr(10))
                        walter.dir = 'D'
                        walter.lines = [
                            "The water's gotten so much calmer and more peaceful...",
                            "Still, I'm curious where all that shaking was coming from.",
                            "I wish President Wells would just tell everybody!"
                        ]

                        presidentWells.map = droptonCity
                        presidentWells.goTo(ctr(42), ctr(3))
                        presidentWells.dir = 'D'
                        presidentWells.lines = [
                            "For the last time, I'm not letting people--huh?",
                            "Woah! It's you! You're back!",
                            "And in one piece too! I'll be honest, I was\nstarting to doubt that you'd show up.",
                            "I presume you are the reason the shaking stopped.\nI want to hear all about how you did it!",
                            "Also, some character named Wayne showed up and\nclaimed he knew you. He said he had to tell you something\nimportant.",
                            "I don't know if he's telling the truth or not, but\nhe should be waiting in the Dropton Tunnels."
                        ]

                        presidentWells.clearAction()

                        wayne.map = droptonTunnels
                        wayne.hasAquaLung = true
                        wayne.goTo(ctr(28), ctr(23))
                        wayne.lines = [
                            "Aye matey! It's good to see you again!",
                            "I hear you've been working with President Wells to help Dropton!",
                            "The old man sent for me to get you. He's still in Chard Town\nand he has some important information that you 'need to know'.",
                            "It is a long journey though. I would know, I had to\ntravel for such a long time to get here!",
                            "There are rumors about a way to teleport around the island.\nApparently some anonymous man from Chard Town has found a way.",
                            "Noobdy knows who he is, so he's known as The Wanderer.",
                            "Anyway, I'd head over to Chard Town and talk to the Old Man. Otherwise,\nit means I came all this way for nothing!"
                        ]

                        oldMan.goTo(ctr(28), ctr(16))
                        oldMan.lines = [
                            "Oh, you're back!",
                            "I assume Wayne made it to Dropton City, then.",
                            "...",
                            "And you destroyed the corrupted Drowned? That's amazing!",
                            "That means that the next location for you to head to is [insert location]."
                        ]
                    })
                }
            }
            
            
        
            for (var i in bosses) {
                if (curMap.name == bosses[i].map) {
                    // bosses[i].update()
                    bosses[i].healthBar()
                }
            }

            if (!p.isDead()) {
                p.shovel()
            }
            // if (curBoss != 0) {
            //     curBoss.update()
            //     curBoss.healthBar()
            // }
            
            p.draw()

            ctx.save()
            ctx.translate(Math.floor((-1 * p.x) + (width / 2) + Screen.shakeOffset.x), Math.floor((-1 * p.y) + (height / 2) + Screen.shakeOffset.y))
            curMap.drawNextLayer(p)
            ctx.restore()
    
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
            
            if (!p.isDead()) {
                p.move()
                p.collide()
                p.hitEnemies()

                p.breakBlock()
            }
            
    
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

                if (!!curMissions[i].initalize && !curMissions[i].initializedVariables) {
                    curMissions[i].initalize()
                    curMissions[i].initializedVariables = true
                }

                if (!!curMissions[i].solve && !curMissions[i].complete) {
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

            if (!keys.space) {
                p.spaceActioned = false
            }

            p.runSpaceAction()
        } else if (scene == "DARKENED BOSS CUTSCENE") {
            playMusic("Boss Cutscene")
            cutsceneFrame ++
            
            // ctx.fillStyle = "rgb(255, 50, 100)"
            ctx.save()
            ctx.translate(width / 2, height / 2)
            ctx.scale(noctosScale, noctosScale)
            ctx.translate(width / -2, height / -2)
            if (cutsceneFrame >= 360) {
                if (noctosScale > 2) {
                    ctx.translate(Math.random() * 10, Math.random() * 10)
                }
                noctosRoom.draw(p, "Player View")
            //     if (noctosScale <= 2) {
            //         noctosScale += 0.03
            //     }
                if (noctosScale <= 2) {
                    noctosScale += 0.05
                }
            }
            models.bosses.noctos.draw()
            ctx.restore()
            if (noctosScale > 2) {
                ctx.fillStyle = "rgb(150, 0, 0)"
                ctx.font = "100px serif"
                ctx.textAlign = "center"
                ctx.fillText(models.bosses.noctos.name, width / 2, height / 4)
            }
            
            if (cutsceneFrame < 360) {
                opacity -= 0.005
                ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")"
                ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
            }
    
            if (cutsceneFrame >= 535) {
                scene = "GAME"
                cutsceneFrame = 0
                noctosScale = 1
            }
        } else if (scene == "DARKENED BOSS CUTSCENE PHASE 2") {
            if (cutsceneFrame == 0) {
                noctosScale = 1.5
            }
            ctx.save()
            
            if (cutsceneFrame > 100 && cutsceneFrame < 575) {
                ctx.translate(Math.random() * 20, Math.random() * 10)
                noctosScale -= 0.001
            }
            
            ctx.translate(width / 2, height / 2)
            ctx.scale(noctosScale, noctosScale)
            ctx.translate(width / -2, height / -2)
            
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
            noctosRoom.draw(p, "Player View")
            
            ctx.translate(-1 * ((-1 * p.x) + (width / 2)), -1 * ((-1 * p.y) + (height / 2)))
            
            
            // Body
            ellipse(width/2, height/2, 150, 150, "rgb(0, 0, 0)")
        
            // Eyes
            ellipse(width/2 - 30, height/2 - 35, 30, 30, "rgb(" + (255 - (noctosColor / 2)) + ", 50, 100)")
            ellipse(width/2 + 30, height/2 - 35, 30, 30, "rgb(" + (255 - (noctosColor / 2)) + ", 50, 100)")
            
        
            // Arms
            ellipse(width/2 + 75, height/2, 40, 40, "rgb(" + (125 - noctosColor) + ", 25, 50)")
            ellipse(width/2 - 75, height/2, 40, 40, "rgb(" + (125 - noctosColor) + ", 25, 50)")
            
            
            if (cutsceneFrame > 100 && cutsceneFrame < 575 && spearSpeed > 0) {
                spearSpeed += 1 - (cutsceneFrame / 1000)
                noctosColor ++
                if (spearSize < 50) 
                spearSize += 0.15
            }
            
            ctx.translate(width/2 + 75, height/2)
            ctx.rotate(- Math.PI / 15 + (spearSpeed / 5))
            ctx.translate(-1 * (width/2 + 75), -1 * height/2)
    
    
            // Spear thing
            ctx.fillStyle = "rgb(" + (50 - noctosColor) + ", 50, 50)"
            
            
            ctx.fillRect(width/2 + 60, height/2 - 80, 16, 180) // Center x = 63
            if (cutsceneFrame > 700) {
                ellipse(width/2 + 68, height/2 - 90 - shootTriangle, 30, 30, "rgb(255 , 50, 100)")
            }
            ellipse(width/2 + 68, height/2 - 90, spearSize, spearSize, "rgb(" + (255 - noctosColor) + ", 50, 100)")
            ctx.beginPath()
            
            
            
            
            if (cutsceneFrame < 700) {
                triangle(width/2 + 50, height/2 - 80, width/2 + 68, height/2 - 115, width/2 + 86, height/2 - 80, "rgb(" + (255 - noctosColor) + ", 50, 100)")
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
                noctosScale = 0
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
                noctosScale += 0.001
                if (spearSize > 0) {
                    spearSize -= 1
                } else {
                    spearSize = 0
                }
                noctosColor += 0.3
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
                p.giveItem(items.spearOfNoctos, false)
                wayne.x = ctr(6)
                wayne.y = ctr(46)
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
                    "The Spear of Noctos??? How did you get that?",
                    "Did you really defeat the Noctos?",
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
                Screen.effects = []
            }
        
            if (cutsceneFrame > 750) {
                spearSpeed += 0.1
            }
        
            
            // old.draw()
            ctx.translate(width / 2, height / 2)
            ctx.scale(noctosScale, noctosScale)
            ctx.translate(width / -2, height / -2)
    
            ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
            noctosRoom.draw(p, "Player View")
            ctx.translate(-1 * ((-1 * p.x) + (width / 2)), -1 * ((-1 * p.y) + (height / 2)))
        
        
            
            if (cutsceneFrame < 750) {
                // Body
                ellipse(width/2, height/2, 150, 150, "rgb("+ noctosColor +", "+ noctosColor +", "+ noctosColor +")")
            
                // Eyes
                ellipse(width/2 - 30, height/2 - 35, 30, 30, "rgb("+ noctosColor +", 50, 100)")
                ellipse(width/2 + 30, height/2 - 35, 30, 30, "rgb("+ noctosColor +", 50, 100)")
                
            
                // Arms
                ellipse(width/2 + 75, height/2, 40, 40, "rgb("+ noctosColor +", 25, 50)")
                ellipse(width/2 - 75, height/2, 40, 40, "rgb("+ noctosColor +", 25, 50)")
            
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
            
            
            triangle(width/2 + 50, height/2 - 80, width/2 + 68, height/2 - 115, width/2 + 86, height/2 - 80, "rgb(" + (noctosColor) + ", 50, 100)")
            ctx.fillStyle = "rgb(0, 50, 50)"
            ctx.fillRect(width/2 + 60, height/2 - 80, 16, 180) // Center x = 63
            ellipse(width/2 + 68, height/2 - 90, spearSize, spearSize, "rgb(0, 50, 100)")
            ctx.beginPath()
            
            
            
            
            
            ctx.restore()
            
            ctx.fillStyle = "rgb(255, 255, 255, "+ fade +")"
            ctx.fillRect(0, 0, width, height)
            
            // if (cutsceneFrame >= 1200) {
                
                
            // }
            // noctosRoom.draw(p, "Player View")
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
                    cutsceneText = "Noctos is the Master of Night. However, the Noctos you battled is not the real one!"
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
                p.x = ctr(41)
                p.y = ctr(59)
                p.questPoint = {
                    x: 37,
                    y: 50
                }
    
                curMap.changeBlock(67, 10, "_") // Re-opens the path to Steel Field (in case it doesn't work for the save)
                curMap.changeBlock(138, 4, "_")
    
                // This code piece is a backup to move the old man into the correct spot, even though he should be there anyway
                oldMan.x = ctr(40)
                oldMan.y = ctr(59)
                oldMan.map = mainMap
                
                oldMan.lines = [
                    "Now go talk to Wayne. He'll tell you what\nto do next.",
                    "He should be around here somewhere."
                ]
                
                wayne.x = ctr(37)
                wayne.y = ctr(50)
                wayne.lines = [
                    "Hello!",
                    "I think the old man told you about this island's history,\nso I'll help you save it!",
                    "Long ago, Noctos and the other masters were corrupted and\nwreaked havoc upon this island!",
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
            ctx.scale(noctosScale, noctosScale)
            ctx.translate(width / -2, height / -2)
            if (cutsceneFrame >= 360) {
                if (noctosScale > 2) {
                    ctx.translate(Math.random() * 10, Math.random() * 10)
                }
                stormedRoom.draw(p, "Player View")
            //     if (noctosScale <= 2) {
            //         noctosScale += 0.03
            //     }
                if (noctosScale <= 2) {
                    noctosScale += 0.05
                }
            }
            models.bosses.stormed.draw()
            ctx.restore()
            if (noctosScale > 2) {
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
                noctosScale = 1
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
			if (Math.hypot((curCX - camera.cx), (curCY - camera.cy)) <= camera.cspeed) { // round to the nearest hundreth (really weird logic, but fixes camera never stopping)
                curCX = camera.cx
                curCY = camera.cy
				cameraMoving = false
			}

            if (camera.type == "NPC") { 
                if (camera.npcName.lineNum == camera.lineStop) {        
                    scene = "GAME"
                    cameraMoving = false
                    cameraEnd() 
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
        } else if (scene == "CUTSCENE") {
            if (!!curCutscene) {
                curCutscene.draw()
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
}, 1000 / 60)

// game()
// })();