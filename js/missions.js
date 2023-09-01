function Mission(name, type, nodes, num, solve) {
	this.name = name
	this.type = type
	this.nodes = nodes
	this.num = num
	this.solve = solve

	this.curNode = 0 // How far the player has progressed the mission
	
	this.newMission = true
	this.newMissionFrame = 0
}

Mission.prototype.drawDesc = function () {
	ctx.fillStyle = "rgb(0, 0, 0)"
	ctx.textBaseline = 'middle'
	ctx.font = "20px serif"
	ctx.textAlign = 'center'
	ctx.fillText(this.type + "mission - " + this.name, 50, this.num * 20, width / 2, height / 2)
}

Mission.prototype.solve = function () {
	this.solve()
}

Mission.prototype.alert = function(t) {
	this.newMissionFrame ++
	if (this.newMission && t == "NEW") {
		
		
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