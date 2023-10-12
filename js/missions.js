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
		if (this.newMissionFrame > 300) {
			this.newMission = false
		}
	}
}

var aStrangeWorld = new Mission("A Strange World", "Main", null, 0)

aStrangeWorld.solve = function () {
	
}

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
			"You are now on the final step of teleporation.", "Sit in the center of the magical ring,\nPlace the beam and the water will spring."
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
			"I've given you 3 decipherers,\nwhich from my research should be enough to complete Chard Town's riddle",
			"Now quick, go back to the first location.\nThe second riddle will be waiting for you."
	
		]
		theWanderer.action = function(p) {
			
			p.inventory.push(items.decipherer)
			secrets[0][1] = true
		}
		theWanderer.actionLine = "after"
		
	}
}

var leysGreatFear = new Mission("Ley's Great Fear", "Reward", null, 0)

leysGreatFear.solve = function () {
	console.log("ley mann")
	ley.lines = ["Are they gone yet?!"]
}