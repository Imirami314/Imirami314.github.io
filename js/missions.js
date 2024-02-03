function Mission(name, type, nodes, num, solve) {
	this.name = name
	this.type = type
	this.nodes = nodes
	this.num = num
	this.solve = solve

	this.curNode = 0 // How far the player has progressed the mission
	
	this.newMission = true
	this.newMissionFrame = 0

	this.complete = false
	this.completionPopup = false
}

Mission.prototype.drawDesc = function () {
	ctx.fillStyle = "rgb(0, 0, 0)"
	ctx.textBaseline = 'middle'
	ctx.font = "20px serif"
	ctx.textAlign = 'center'
	ctx.fillText(this.type + "mission - " + this.name, 50, this.num * 20, width / 2, height / 2)
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
var aStrangeWorld = new Mission("A Strange World", "Main", null, 0)

aStrangeWorld.solve = function () {
	
}

var meetingTheQueen = new Mission("Meeting The Queen", "Main", null, 0)

meetingTheQueen.solve = function () {
    
}

// ABILITY MISSIONS
var theWanderersRiddles = new Mission("The Wanderer's Riddles", "Ability", null, 0)

theWanderersRiddles.solve = function () {
	if (getGameAlertInfoByCords(10, 7, mainMap).playerRead) {	// makes sure message is correct			
		secrets[0][0] = true
	}
	
	if (secrets[0][3] == true) {
		theWanderer.x = 28 * 75 + 37.5
		theWanderer.y = 55 * 75 + 37.5
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
var theWanderersRiddlesGV = new Mission("The Wanderer's Riddles - Glacia Village", "Ability", null, 0)

theWanderersRiddlesGV.solve = function () {
    // console.log(getBlockInfoByCords(202 * 75, 24 * 75).id)
    if (getBlockInfoByCords(202 * 75, 24 * 75).id == "-") { // Default WATER
        
    }
}


// REWARD MISSIONS 
var leysGreatFear = new Mission("Ley's Great Fear", "Reward", null, 0)

leysGreatFear.solve = function () {
	console.log("ley mann")
	ley.lines = ["Are they gone yet?!"]
}

var davidsDreamPond = new Mission("David's Dream Pond", "Reward", null, 0)

var blancheAndBianca = new Mission("Blanche and Bianca", "Reward", null, 0, function() {

})

var theBlockedEntrance = new Mission("The Blocked Entrance", "Reward", null, 0)

theBlockedEntrance.solve = function () {
    if (droptonCity.checkBlocks([
        [35, 26], [34, 27], [35, 27], [36, 27], [33, 28], [34, 28], [36, 28], [37, 28],
        [34, 29], [35, 29], [36, 29], [35, 30]
    ], "~")) {

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

var deltasLostTreasure = new Mission("Delta's Lost Treasure", "Reward", null, 0, function() {
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


var missions = [theWanderersRiddles, leysGreatFear, davidsDreamPond, blancheAndBianca, theBlockedEntrance, deltasLostTreasure]
var curMissions = []