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

    this.unread = false;

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
    this.unread = true;
}

Mission.prototype.setInstructions = function(newInstructions) {
    this.instructions = newInstructions;
    this.unread = true;
}

Mission.prototype.addInstructions = function(newInstructions) {
    this.instructions += newInstructions;
    this.unread = true;
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
		ctx.fillText(this.name, width / 2, height / 8)
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
		ctx.fillText(this.name, width / 2, height / 8)
		ctx.font = "30px serif"
		ctx.fillText("Completed!", width / 2, height / 8 + 50)
		setTimeout(() => { 
			this.completionPopup = false
            for (let m of curMissions) {
                if (m.name == this.name) {
                    curMissions.splice(curMissions.indexOf(m));
                }
            }
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

const secretsOfSteelField = new Mission("Secrets of Steel Field", "Main", "This is where the adventure really begins.", "You've made it to Steel Field. Keep an eye out for lava!\nWayne says you need to go find Smith the Blacksmith to get geared up.\nHe lives in one of the houses on the east side of Steel Field.")

const underneathChardTown = new Mission("Underneath Chard Town", "Main", "After finding the key, you entered Confounded Cave...now what?", "If you don't know where to go, you might as well just explore the place.");

const elementsOfElria = new Mission("Elements of Elria", "Main", "At last, you now know your true mission: Venture to all 5 major regions, defeat the corrupted Elemental masters,\nand lastly, defeat Omnos to save Elria!", "Go find Wayne, and he'll give you the next steps.");

var meetingTheQueen = new Mission("Meeting The Queen", "Main", "In order to defeat the elemental master of Glacia Village, you'll\nneed to speak to Glacia Village's leader, Queen Alaska.", "Lonzo told you that he had the key to Queen Alaska's castle, but he lost it!\nWhen using this key, Lonzo said to 'go between red and blue'.\nFirst things first, however, you need to find that key.\nPerhaps the other citizens of Glacia have picked it up...")

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
                            meetingTheQueen.setInstructions("It looks like Lonzo's key to the Queen's Castle might be floating in the small\npond. However, the breezeway that can take you there is broken.\nSo, Nevada needs you to collect 10 gale wings for her to repair the breezeway with.\nAlso, she normally charges 100 trills, but she'll only charge you 50 because\nit's your first time!");
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

        meetingTheQueen.setInstructions("You successfully retrieved the Castle Key from the pond! Now, where do you use it?\nLonzo remembers the Queen saying to stand 'between red and blue.'");
        p.giveItem(items.castleKey, true)    
        nevada.lines = ["Look at that!\nIt was the key!", "This is great! We must let Lonzo know!", "Go ahead and do the honors.\nI couldn't have done this without you!"];
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
        Screen.shake(3,3)
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

                ronan.lines = [
                    "I can't believe it! The entrance is fixed!",
                    "How did this happen??",
                    "...",
                    "Wow, so it was you! Thank you so much!",
                    "Now I don't need to sit here all day...",
                    "If you ever need me, I'll be in my house."
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

mineraGrovePranksters.solve = function() {
    if (keys.space && !p.spaceActioned) {
        if (p.on(89, 54) || p.on(57, 56) || p.on(85, 90)) {
            Screen.fadeOut(0.05, function() {
                if (p.on(89, 54)) {
                    curMap = mineraBurrow;
                    p.goTo(ctr(23), ctr(1));
                } else if(p.on(57, 56)) {
                    curMap = mineraBurrow;
                    p.goTo(ctr(1), ctr(1));
                } else if (p.on(85, 90)) {
                    curMap = mineraBurrow;
                    p.goTo(ctr(23), ctr(23));
                }

                Screen.fadeIn(0.05);
            })
        }
    }

    if (!mineraGrovePranksters.hasPlayerReachedOtherSide) {
        if (p.on(46, 69)) {
            rangerGunther.goTo(ctr(51), ctr(70));
            rangerGunther.dir = 'L';
            rangerGunther.lines = [
                "Woah! How did you make it over there?",
                "...",
                "Really? You found where all those nasty creatures were hiding?",
                "...",
                "Wow, I really should have checked the restricted areas\nmore.",
                "Guess I'll head down there to get rid of them, once and for all!",
                "Thank you very much. Here's a little gift for you.",
            ];

            rangerGunther.actionLine = "after";

            rangerGunther.action = function() {
                p.giveItem(new TrillSum(50), true);

                rangerGunther.lines = [
                    "Thanks for helping me out! You're welcome to visit me anytime.",
                ]

                rangerGunther.clearAction();
            }
        }

        if (p.on(46, 70)) {
            rangerGunther.lineNum = 0;
            rangerGunther.remote = true;
            mineraGrovePranksters.hasPlayerReachedOtherSide = true;
        }
    }
}

const meetingEmpressAurora = new Mission("Meeting Empress Aurora", "Main", "At last, you have reached Luminos Isle. Now, you must let the leader, Empress Aurora,\nknow exactly why you're here.", "Empress Aurora can be hard to find, so it might be helpful to ask the people\nof Luminos Isle for help.");

meetingEmpressAurora.solve = function() {
    if (curMap == luminosIsle) {
        if (p.in(24, 7, 25, 8) && !meetingEmpressAurora.beaconGivingLecture && !meetingEmpressAurora.canEnterPalace) { // Empress's Palace entrance
            meetingEmpressAurora.beaconGivingLecture = true;
            p.canMove = false;

            beacon.lines = [
                "Sorry, but you need the Empress's permission to go in there.",
            ];

            beacon.remoteSpeak = true;
            beacon.lineNum = 0;
            beacon.actionLine = "after";
            beacon.action = function() {
                Screen.fadeOut(0.05, function() {
                    p.goTo(b(24), ctr(11));

                    Screen.fadeIn(0.05, function() {
                        p.canMove = true;
                        meetingEmpressAurora.beaconGivingLecture = false;

                        if (!empressAurora.talkedTo) { // Before Empress Aurora shows up
                            // Reset Beacon's lines and action
                            beacon.lines = [
                                "Before you say anything...\nyes, my name is actually Beacon.",
                                "When people refer to me as Guard Beacon, they always think I'm a literal beacon.\nBut I'm a person!",
                                "*sigh",
                                "...",
                                "You need to talk to the Empress? Unfortunately, she's not here right now.\nAnd it'll stay that way until any important business happens.",
                                "I guess you COULD press the Important Business Button over there,\nbut if the Empress finds out you don't have any important business...",
                                "...let's just say, it won't be pretty.",
                                "Don't worry, I believe that you have important stuff to say.\nIf the guard over there doesn't let you press it, I'll back you up.",
                                "I'd at least give it a shot.",
                                "Good luck!"
                            ];
                            beacon.action = function() {
                                cameraStart(ctr(44), ctr(7), 50, "NPC", {
                                    npcName: beacon,
                                    lineStop: 6
                                })

                                meetingEmpressAurora.beaconGaveBackup = true;
                            };
                            beacon.actionLine = 5;
                        } else {
                            beacon.lines = [
                                "Well, you've pressed the button now.",
                                "You'd better go tell the Empress about your important business."
                            ];
                            beacon.clearAction();
                        }
                    });
                });
            }
        }

        if (p.in(42, 5, 46, 8)) { // Important Business Button
            if (!meetingEmpressAurora.lucyGivingLecture && !meetingEmpressAurora.lucyGavePermission) {
                if (!meetingEmpressAurora.beaconGaveBackup) { // Player must talk to Guard Beacon first
                    lucy.lines = [
                        "Woah!",
                        "You can't just barge in there and press that button!",
                        "That's for important business only!"
                    ];

                    p.canMove = false;

                    lucy.lineNum = 0; // Start dialogue
                    lucy.remoteSpeak = true;
                    lucy.actionLine = "after";
                    lucy.action = function() {
                        Screen.fadeOut(0.05, function() {
                            p.goTo(ctr(44), ctr(10));

                            meetingEmpressAurora.lucyGivingLecture = false;

                            Screen.fadeIn(0.05, function() {
                                p.canMove = true;

                                lucy.lines = [
                                    "Good morningternoon...",
                                    "...sorry, I'm so tired. The Empress wants me to guard this button all day...",
                                    "...but this place is so bright and I can't get any rest!",
                                ]; // Her original lines
                                lucy.clearAction();
                            });
                        })
                    }
                } else {
                    lucy.lines = [
                        "Woah!",
                        "You can't just barge in there and press that button!",
                        "That's for important business only!",
                        "If the Empress knew you were doing this...",
                        "...you'd be in some serious trouble!",
                        "...",
                        "`huh?",
                        "Guard Beacon, is that you?",
                        "...",
                        "You're telling me that this guy ACTUALLY has\nimportant business with the Empress?",
                        "Hmmph. Well I guess you can go on ahead\nand press that button.",
                        "Just don't say I didn't warn you."
                    ];

                    lucy.lineNum = 0; // Start dialogue
                    lucy.remoteSpeak = true;
                    lucy.actionLine = "after";
                    lucy.action = function() {
                        meetingEmpressAurora.lucyGivingLecture = false;
                        meetingEmpressAurora.lucyGavePermission = true;

                        lucy.lines = [
                            "Apparently you DO have important business.",
                            "Just, if you get in trouble, leave me out of it!"
                        ];
                        lucy.clearAction();
                    }

                    beacon.curPath = [
                        [43, 10],
                    ];

                    beacon.lines = [
                        "Go ahead and press that button.",
                        "I hope you have something to say that\nthe Empress wants to hear."
                    ];

                    p.canMove = false;
                }

                meetingEmpressAurora.lucyGivingLecture = true;
            }
        }
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
        Screen.shake(3,3)
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