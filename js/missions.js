function Mission(name, type, desc, instructions, solve) {
	this.name = name
	this.type = type
	// this.nodes = nodes
    this.desc = desc;
    this.instructions = instructions;
	// this.num = num
    // this.initialize = initialize
	this.solve = solve

    // this.initializedVariables = false

	// this.curNode = 0
	
	this.newMission = true
	this.newMissionFrame = 0

	this.complete = false
	this.completionPopup = false

	Mission.all.push(this)
}

Mission.all = []

Mission.prototype.drawDesc = function () {
	ctx.fillStyle = "rgb(0, 0, 0)"
	ctx.textBaseline = 'middle'
	ctx.font = "20px serif"
	ctx.textAlign = 'center'
	ctx.fillText(this.type + "mission - " + this.name, 50, this.num * 20, width / 2, height / 2)
}

Mission.prototype.setDesc = function(newDesc) {
    this.desc = newDesc;
}

Mission.prototype.setInstructions = function(newInstructions) {
    this.instructions = newInstructions;
}

Mission.prototype.addInstructions = function(newInstructions) {
    this.instructions += newInstructions;
}

Mission.prototype.alert = function(t) {
	this.newMissionFrame ++
	if (this.newMission && t == "NEW") {
		playSound("New Mission", false)
		ctx.fillStyle = "rgba(200, 200, 200, 0.5)"
     	ctx.fillRect(0, height / 8 - 75, width, 150)
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.font = "75px serif"
		ctx.textAlign = 'center'
		ctx.fillText(this.name, width / 2, height / 8 - 25)
		ctx.font = "30px serif"
		ctx.fillText("New " + this.type + " Mission", width / 2, height / 8 + 50)
		setTimeout(() => { 
			this.newMission = false
		}, 3000)
	} else if (this.completionPopup && t == "COMPLETE") {
		playSound("Mission Complete", false)
		ctx.fillStyle = "rgba(200, 200, 200, 0.5)"
     	ctx.fillRect(0, height / 8 - 75, width, 150)
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.font = "75px serif"
		ctx.textAlign = 'center'
		ctx.fillText(this.name, width / 2, height / 8 - 25)
		ctx.font = "30px serif"
		ctx.fillText("Completed!", width / 2, height / 8 + 50)
		setTimeout(() => { 
			this.completionPopup = false
		}, 3000)
	}
}

Mission.prototype.finish = function() {
    if (!this.complete) {
        this.complete = true
        this.completionPopup = true
    }
}

// MAIN MISSIONS
var aStrangeWorld = new Mission("A Strange World", "Main", "You've awoken in a new, yet familiar world. There's a lot to explore, but you need to start somewhere.", "The Old Man of Chard Town has asked you to fetch his glasses from some kid near the big lake.")

aStrangeWorld.solve = function () {
	
}

var meetingTheQueen = new Mission("Meeting The Queen", "Main", "[insert description]", "[insert instructions]")

meetingTheQueen.initalize = function () {
    this.enableBuy = false

}

meetingTheQueen.solve = function () {
    // Change Nevada Lines
    
        if (nevada.firstInteraction) {
            nevada.firstInteraction = false
            nevada.lines = [
                "Why hello there!",
                "I've never seen you before!",
                "I'm Nevada, proud new owner of Breezeway Builds!\nThis store has been in the family for three generations!",
                "`And if you're wondering... no, unfortunately I'm not related to\nQueen Alaska...",
                "Anyways, how can I help you?",
                "...",
                "Oh you must be new here.\nYou might want to talk to Lonzo first-",
                "...",
                "Oh? You already talked with him?\nWhat did he say?",
                "...",
                "Oh... not much, huh?",
                "Well, I guess I'll do the explaining.",
                "Breezeways are created by harnessing the power of the Windy Wastelands.",
                "Since there is so much excess wind, scientists have found ways to harness\nits power with the help of wind enemies, or Gales!",
                "Using breezeways will give you the ability to teleport short distances!",
                "So that's about it! Need anything else?",
                "...",
                "Wait what did Lonzo say? Something about a key?",
                "...",
                "Yes, I actually might know something about it. Follow me..."    

            ]
            nevada.action = function() {
                Screen.fadeOut(0.05, function() {
                    nevada.map = mainMap
                    nevada.x = ctr(169)
                    nevada.y = ctr(25)
                    nevada.dir = "R"
        
                    curMap = mainMap
                    p.x = ctr(170)
                    p.y = ctr(25)
                    p.dir = "L"
                    
        
                    nevada.lines = [
                        "See this over here?",
                        "There is a breezeway that used to be connected to the river that is no longer\nfunctioning after the other breezeway broke.",
                        "And it looks like there is something floating in the water!",
                        "I would be able to fix it, but unfortunately I am out of materials.",
                        "To make a breezeway, I'm gonna need 10 gale wings.",
                        "I usually do charge 100 trills as well, but\nsince it's your first time I'll only charge 50!",
                        "If you can get me all the materials, I'll start construction RIGHT away!"
                    ]
                    nevada.remote = true
            
                    meetingTheQueen.enableBuy = true
        
                })
               
                nevada.clearAction()
            }
        } else {
            runOnce(() => {
                //alert("uh yeah")
                nevada.lines = [
                    "Hey again!",
                    "You talked to Lonzo?",
                    "...",
                    "Great! What did he say?",
                    "...",
                    "Oh... not much, huh?",
                    "Well, I guess I'll do the explaining.",
                    "Breezeways are created by harnessing the power of the Windy Wastelands.",
                    "Since there is so much excess wind, scientists have found ways to harness\nits power with the help of wind enemies, or Gales!",
                    "Using breezeways will give you the ability to teleport short distances!",
                    "So that's about it! Need anything else?",
                    "...",
                    "Wait what did Lonzo say? Something about a key?",
                    "...",
                    "Yes, I actually might know something about it. Follow me..."    
                ]
            
                
                nevada.action = function() {
                    Screen.fadeOut(0.05, function() {
                        nevada.map = mainMap
                        nevada.x = ctr(169)
                        nevada.y = ctr(25)
                        nevada.dir = "R"
            
                        curMap = mainMap
                        p.x = b(171)
                        p.y = ctr(25)
                        p.dir = "L"
                        
            
                        nevada.lines = [
                            "See this over here?",
                            "There is a breezeway that used to be connected to the river that is no longer\nfunctioning after the other breezeway broke.",
                            "And it looks like there is something floating in the water!",
                            "I would be able to fix it, but unfortunately I am out of materials.",
                            "To make a breezeway, I'm gonna need 10 gale wings.",
                            "I usually do charge 100 trills as well, but\nsince it's your first time I'll only charge 50!",
                            "If you can get me all the materials, I'll start construction RIGHT away!"
                        ]
                        nevada.remote = true
                        saveGame()  

                        nevada.action = function () {
                            meetingTheQueen.enableBuy = true  
                            nevada.clearAction()
                        }
                        nevada.actionLine = "after"
                        
            
            
                    })
                    
                }

            })
            
        }
        nevada.actionLine = "after"
    
    
    // Fix once shop allows for non-trills?
    if (meetingTheQueen.enableBuy && p.has(items.galeWing, 10) && p.trills >= 50) {
        
        runOnce(() => {
            nevada.lines = [
                "Hi there, how's it going?",
                "...",
                "WOW! You got 10 gale wings and 50 trills? Great!",
                "I'll get started on the breezeway right away!"
            ]

            nevada.action = function() {
                Screen.fadeOut(0.05, function() {
                    interactives.push(new Breezeway(mainMap, 168, 27, 167, 26))
                    nevada.lines = [
                        "Tada! It's all done!",
                        "Now, why don't you try getting the item in the water?"
                    ]
                    nevada.remote = true
                    saveGame()
                })
                nevada.clearAction()
            }
            nevada.actionLine = "after"
            
        })
    }

    if (curMap == mainMap && keys.space && p.on(164, 23) && !p.has(items.castleKey)) {

        p.giveItem(items.castleKey, true)    
        nevada.lines = ["Look at that!\nIt was the key!", "This is great! We must let Lonzo know!", "Go ahead and do the honors.\nI couldn't have done this without you!"]
        lonzo.lines = [
            "Hey there!",
            "Any luck on finding the key?",
            "...",
            "WHAT?!?! YOU FOUND IT!",
            "KDHF*&#)EUDUH(EWD)SDOSODDOS!!!",
            "Thank you so much! This is great!",
            "Now, like I said before, I don't fully remember where\nthe secret entrance to the castle is...",
            "I hate asking for another favor, but I remember\nthe Queen saying it was between red and blue.",
            "Not sure if that will help at all, but maybe you can find something!"
        ]
        lonzo.action = function() {
            lonzo.lines = [
                "Hmm... the key... red and blue...",
                "Sorry, I still can't remember.\nPlease help me find it!"
            ]
            lonzo.clearAction()
        }
        lonzo.actionLine = "after"
        setTimeout(() => {
            nevada.remote = true
            cameraStart(nevada.x, nevada.y, 5, "NPC", {
                npcName: nevada,
                lineStop: -1
            })
        }, 1000)
        saveGame()

    }


    
}

// ABILITY MISSIONS
var theWanderersRiddles = new Mission("The Wanderer's Riddles", "Ability", "[insert description]", "[insert instructions]")

theWanderersRiddles.solve = function () {
	if (getGameAlertInfoByCords(10, 7, mainMap).playerRead) {	// makes sure message is correct			
		secrets[0][0] = true
	}
	
	if (secrets[0][3] == true) {
		theWanderer.x = ctr(28)
		theWanderer.y = ctr(55)
		theWanderer.lines = [
			"`...", "You probably didn't expect me to be here already.",
			"Congratulations on finding such a rare and mysterious item.\nI've only seen these items in ancient scrolls.",
			"You are now on the final step of teleportation.", "Sit in the center of the magical ring,\nPlace the beam and the water will spring."
		]
	} else if (secrets[0][2] == true) {
		theWanderer.lines = ["I sense that you've almost completed Chard Town's secret..."]
	} else if (secrets[0][1] == true) {
		theWanderer.action = function() {} //resets action to nothing
		theWanderer.lines = ["Go back to the first location.\nThe second riddle awaits you!"]	

		if (p.cords.x == 63 && p.cords.y == 20 && keys.x) {
			if (mainMap.getBlock(63, 20) != "@") {
				mainMap.changeBlock(63, 20, "@")
				if (getGameAlertInfoByCords(63, 20, mainMap) == null) {
					alerts.push(new GameAlert(63, 20, ["Chard Town's Secret\nPART 3", "From this exact point, travel north and west.\nInside do the opposite, to reach the final chest."], mainMap, "EXAMINE"))
				}
				
				secrets[0][2] = true
				saveGame()
			}
		}
	} else if (secrets[0][0] == true) {
		
		theWanderer.lines = [
			"...",
			"What? You found it already?",
			"Impressive.", "Now, you might be wondering why all of the words\nwere jumbled up.", 
			"Ancient texts like these require a very special item.\nA decipherer...",
			"When the decipherer is held in your hand, you can read indecipherable texts!",
			"I've given you 3 decipherers,\nwhich from my research should be enough to complete Chard Town's riddle.",
			"Now quick, go back to the first location.\nThe second riddle will be waiting for you."
	
		]
		theWanderer.action = function(p) {
			
			p.giveItem(items.decipherer, true)
			secrets[0][1] = true
		}
		theWanderer.actionLine = "after"
		
	}
}

// Wanderer riddle with specific locations will be specified as initials
var theWanderersRiddlesGV = new Mission("The Wanderer's Riddles - Glacia Village", "Ability", "[insert description]", "[insert instructions]")

theWanderersRiddlesGV.solve = function () {
    // console.log(getBlockInfoByCords(202 * 75, 24 * 75).id)
    if (curMap == mainMap && getBlockInfoByCords(202 * 75, 24 * 75).id == "-") { // Default WATER
        
    }
}


// REWARD MISSIONS 
var leysGreatFear = new Mission("Ley's Great Fear", "Reward", "Ley lives in Chard Town, and he is terrified of monsters.\nSomehow, you managed to find him hiding from a group of monsters near his house.\nNow, he's begging you to kill them for him!", "The monsters in question are directly northeast of his house.\nAlthough it might be dangerous, Ley promises to reward you if you are successful!")

leysGreatFear.solve = function () {
	ley.lines = ["Are they gone yet?!"]
}

var davidsDreamPond = new Mission("David's Dream Pond", "Reward", "David Swimmer loves to swim! He wishes one day to find\na great big pond that he could swim in forever!", "Unfortunately, he's explored all the bodies of water in Chard Town and\nnone are big enough. Maybe somewhere you'll find the pond of David's dreams!")

var blancheAndBianca = new Mission("Blanche and Bianca", "Reward", "[insert description]", "[insert instructions]", function() {

})

var theBlockedEntrance = new Mission("The Blocked Entrance", "Reward", "[insert description]", "[insert instructions]")

theBlockedEntrance.solve = function () {
    if (droptonCity.checkBlocks([
        [35, 26], [34, 27], [35, 27], [36, 27], [33, 28], [34, 28], [36, 28], [37, 28],
        [34, 29], [35, 29], [36, 29], [35, 30]
    ], "^")) {

        droptonCity.changeBlocks([[35, 25], [34, 26], [36, 26], [33, 27], [37, 27],
        [32, 28], [38, 28], [33, 29], [37, 29], [34, 30], [36, 30], [35, 31]], '~')
        for (var i = 0; i < 9; i ++) {
            droptonCity.changeBlock(31 + i, 28, '+')
            droptonCity.changeBlock(35, 24 + i, '+')
        }
        for (var i = 0; i < 3; i ++) {
            droptonCity.changeBlocks([[36 + i, 25 + i], [34 - i, 25 + i], [32 + i, 29 + i], [38 - i, 29 + i]], '+')
            
        }
        droptonCity.changeBlocks([[34, 27], [35, 27], [36, 27], [34, 29], [35, 29], [36, 29]], '+')
        mainMap.changeBlock(252, 81, '+')

        if (!theBlockedEntrance.complete) {
            
            loch.lines = [
                "...", "What?! All the ice and purple stuff is gone!",
                "And look at that, the entrance opened again?\nDid you do this?",
                "...", "Wow. Thank you so much!",
                "I must reward you. Here, take these trills!",
                "If you ever need me, I'll be in my house to the west.\nSee ya!"
            ]

            
        }
        loch.action = function (p) {
            if (!theBlockedEntrance.complete) {
                p.trills += 50
                
                loch.speed = 5
                loch.curPath = [
                    [40, 21],
                    function () {
                    loch.x = 75
                    loch.y = 75
                    loch.map = lochNessHouse
                    loch.dir = "R"
                    loch.lines = ["Wow, I've sure missed that entrance.\nThanks again for fixing it!",
                        "If you want to go up and down, just enter from the middle!"]
                    }
                ]
                theBlockedEntrance.finish()
            }
                
        }
        loch.actionLine = "after"
    }
    
   
}

var deltasLostTreasure = new Mission("Delta's Lost Treasure", "Reward", "[insert description]", "[insert instructions]", function() {
	if (entityDistance(p, delta) <= 100 && p.weapon.name == 'Light Container' && mouseIsDown) {
		delta.lines = [
			"Did you find the treasure?",
			"...",
			"Wow! Thank you so much!",
			"...can I have it?",
			"...",
			"I appreciate you doing this for me.\nTake these 75 trills as a gift!"
		]

		delta.action = function() {
			p.trills += 75
			p.removeItem(items.lightContainer)
			deltasLostTreasure.finish()
		}

		delta.actionLine = "after"

		delta.lineNum = 0
	}
})

var berylsSpecialBracelet = new Mission("Beryl's Special Bracelet", "Reward", "Beryl seems to know where King Jasper is. Or at least, he\ndid until he lost his special bracelet. Without it, he's too worried to think about\nanything else. If you bring it back to him, he might remember\nKing Jasper's whereabouts.", "He says that he put it temporarily in a safe chest near the northern Litholian border\nbut then lava began to seep out of the ground and now he can't get to it!\nMaybe there's a way to get around the lava...");

berylsSpecialBracelet.solve = function() {
	if (entityDistance(p, beryl) <= 100 && p.weapon.name == "Beryl's Bracelet" && mouseIsDown) {
		beryl.lines = [
			"Wh-what? Am I dreaming?",
			"You found my bracelet!",
			"...",
			"Oh yes, of course. You wanted to know where King Jasper was.\nLucky for you, I can remember it now!",
			"He went to do some business in the northern region of Fortune Field.",
			"Again, thank you so much. Here's some money as a little gift.",
		]

		beryl.action = function() {
			p.giveItem(TrillSum(50));
			p.removeItem(items.berylsBracelet)

			beryl.lines = [
				"Thanks for finding my bracelet.\nKing Jasper should be in the northern region of Fortune Field."
			]

			beryl.clearAction()

			berylsSpecialBracelet.finish()
		}

		beryl.actionLine = "after"

		beryl.lineNum = 0
	}
}

const journeyToLuminosIsle = new Mission("Journey to Luminos Isle", "Main", "Now that you've defeated Lithos, it's time to make your way to the final\ncity, Luminos Isle! Once you're there, you need to look for the leader, Empress Aurora.", "According to Wayne, the only way to get to Luminos Isle is to head to Dawn's Landing.\nFrom there, you can make your way up to the sky where Luminos Isle is.");

const mineraGrovePranksters = new Mission("Pranksters of Minera Grove", "Main", "To reach Dawn's Landing, you need to cross through Minera Grove. Unfortunately,\nSplints are hiding underneath the grove and have blocked Dawn's Landing with trees.\nYou need to help Ranger Gunther deal with the Splints and find a way past the trees.", "");


var missions = Mission.all
var curMissions = [];

function sortMissionsByType(missionArr) {
    let sortedMissions = [];

    missionArr.forEach((m) => {
        if (m.type == "Main") sortedMissions.push(m);
    });

    missionArr.forEach((m) => {
        if (m.type == "Ability") sortedMissions.push(m);
    });

    missionArr.forEach((m) => {
        if (m.type == "Reward") sortedMissions.push(m);
    });

    return sortedMissions;
}

function addMission(mission) {
	if (curMissions.indexOf(mission) == -1) {
		curMissions.push(mission)
	}
}