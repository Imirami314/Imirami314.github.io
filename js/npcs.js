/**
 * Creates new NPC
 * @param {*} x X coordinate (in pixels)
 * @param {*} y Y coordinate (in pixels)
 * @param {*} name NPC name
 * @param {*} map NPC map (use variable not map name)
 * @param {*} dir Direction npc faces ("U", "D", "L", "R")
 * @param {*} lines NPC's default lines when talked to
 * @param {*} desc NPC's description (use '\n's!)
 * @param {*} action NPC's action that executes during interaction
 * @param {*} actionLine Dialogue line to execute action on (set to "after" to run the function when dialogue finishes)
 * @param {*} shopMenu Insert shopMenu instance (brings up shop menu when dialogue finishes)
 */
function NPC(x, y, name, map, dir, lines, desc, action, actionLine, shopMenu) {
    this.x = x
    this.y = y
	
    this.cords = {}
    this.speed = 4 // Default 4 or 5
	this.dir = dir
	this.name = name
    this.map = map
	
    this.lines = lines
	this.desc = desc
	
    this.lineNum = -1
    this.textCooldown = 1
	this.nextIndicator = false // To indicate you can move on to next line in speech
	this.nextIndicatorY = 0 // Animation effect
	this.nextIndicatorDir = "D"
	this.showName = false
	this.properties = { // Default colors
		eyeColor: "rgb(0, 0, 0)",
		skinColor: "rgb(240, 181, 122)"
	} // Default properties

    this.action = action
    this.actionLine = actionLine
    this.actionFinished = false
	this.talkedTo = true // Default false

    this.pathPoint = 0
    this.pathPointReached = false
    this.curPath = 0
    this.speed = 2 // Default 2

    this.remote = false
    this.remoteSpeak = false

	this.firstInteraction = true

	this.cameraOn = false
    if (!!save) {
        if (!!this.name) {
            var n = JSON.parse(lget(this.name))
            this.lines = n.lines
            this.lineNum = n.lineNum
            this.textCooldown = n.textCooldown
            this.speed = n.speed
            if (n.map != "Main Map") {
                this.map = areaSearchByName(n.map)
            } else {
                this.map = mainMap
            }
            this.x = n.x
            this.y = n.y
            this.actionLine = n.actionLine
            this.dir = n.dir
            this.talkedTo = n.talkedTo

            this.properties = n.properties
            this.showName = n.showName

            this.pathPoint = n.pathPoint
            this.pathPointReached = n.pathPointReached
            this.curPath = n.curPath
        }
    }

    this.shopMenu = shopMenu
}

NPC.prototype.draw = function() {
	if (scene == "CAMERA") {
		this.cameraOn = true
	}

	if (!dev) {
		if (!cameraMoving) {
			this.textCooldown -= 1 / (66 + (2 / 3))
		}
    	
	} else {
		this.textCooldown -= 1 / 20	
	}
    this.cords.x = Math.floor(this.x / 75) // This regulates it, because you don't start at x-cord 0, you start at x-cord 10
    this.cords.y = Math.floor(this.y / 75) // Same thing as x-cord, but height / 2 is about half of width / 2, so it's 5 instead of 10
    
    ctx.save()

	switch (this.name) {
		case "Old Man":
			triangle(this.x - 22, this.y + 10, this.x + 22, this.y + 10, this.x, this.y + 40, "rgb(100, 100, 100)")
            triangle(this.x - 15, this.y - 20, this.x + 15, this.y - 20, this.x, this.y - 60, "rgb(22, 16, 54)")
		    ctx.fillStyle = "rgb(54, 38, 16)"
    		ctx.fillRect(this.x + 23, this.y + 20, 7, 30)
    		ellipse(this.x + 26, this.y + 20, 15, 15, "rgb(227, 174, 95")
    		ellipse(this.x - 26, this.y + 20, 15, 15, "rgb(227, 174, 95")
    		if (this.glasses) {
    			ctx.strokeStyle = "rgba(100, 100, 100, 0.7)"
    			ctx.beginPath();
    			ctx.arc(this.x - 11, this.y - 12, 10, 0, Math.PI);
    			ctx.arc(this.x + 11, this.y - 12, 10, 0, Math.PI);
    			ctx.stroke()
    			ctx.beginPath();             
    			ctx.moveTo(this.x - 22, this.y - 12);        
    			ctx.lineTo(this.x + 22, this.y - 12);
    			ctx.stroke();
    		}
			this.properties.skinColor = "rgb(227, 174, 95)"
			this.properties.eyeColor = "rgb(150, 150, 150)"
			break
        case "John":
            this.properties.skinColor = "rgb(255, 0, 0)"
			break
        case "Ron":
            this.properties.skinColor = "rgb(70, 75, 75)"
			break
        case "Larry":
            this.properties.skinColor = "rgb(255, 255, 255)"
			break
        case "Mike":
            this.properties.skinColor = "rgb(255, 255, 0)"
            break
        case "Mike's Mom":
            this.properties.skinColor = "rgb(255, 180, 180)"
            break
		case "Wayne":
			this.properties.skinColor = "rgb(125, 88, 40)"
			break
        case "Smith the Blacksmith":
			this.properties.skinColor = "rgb(115, 75, 75)"
			break
        case "Rocky":
            this.properties.skinColor = "rgb(100, 100, 100)"
            this.properties.eyeColor = "rgb(150, 150, 150)"
            break
        case "Kori":
            this.properties.skinColor = "rgb(225, 225, 225)"
            this.properties.eyeColor = "rgb(0, 0, 0)"
            triangle(this.x - 15, this.y - 20, this.x + 15, this.y - 20, this.x, this.y - 60, "rgb(160, 255, 255)")
        case "Isa":
            this.properties.skinColor = "rgb(225, 225, 225)"
            this.properties.eyeColor = "rgb(200, 200, 255)"
            break
        case "Blanche":
            this.properties.skinColor = "rgb(200, 200, 200)"
            this.properties.eyeColor = "rgb(0, 0, 0)"
            triangle(this.x - 15, this.y - 20, this.x + 15, this.y - 20, this.x, this.y - 60, "rgb(160, 255, 255)")
            break
        case "Lonzo":
            this.properties.skinColor = "rgb(245, 0, 245)"
            this.properties.eyeColor = "rgb(255, 255, 0)"
            break
        case "Castle Guard Alfred":
            this.properties.skinColor = "rgb(205, 205, 205)"
            this.properties.eyeColor = "rgb(0, 0, 0)"
            break
        case "Queen Alaska":
            this.properties.skinColor = "rgb(200, 200, 255)"
            this.properties.eyeColor = "rgb(0, 0, 0)"
            break
        case "Lost Traveler":
            this.properties.skinColor = "rgb(220, 220, 255, 0.3)"
            this.properties.eyeColor = "rgb(0, 0, 0, 0.5)"
            break
        case "President Wells":
            // Top hat
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.fillRect(this.x - 35, this.y - 25, 70, 5)
            ctx.fillRect(this.x - 20, this.y - 35, 40, 10)
            break
	}

    let npcPulsation = Math.sin(elapsed / 15) * 2
	ellipse(this.x, this.y, 50 + npcPulsation, 50 + npcPulsation, this.properties.skinColor)

	switch (this.dir) {
        case "D":
            ellipse(this.x - 10, this.y - 10, 10, 10, this.properties.eyeColor)
            ellipse(this.x + 10, this.y - 10, 10, 10, this.properties.eyeColor)
            break
        case "R":
            ellipse(this.x + 10, this.y - 10, 10, 10, this.properties.eyeColor)
            break
        case "L":
            ellipse(this.x - 10, this.y - 10, 10, 10, this.properties.eyeColor)
            break
	}

	if (this.name == "Old Man") { // accesories (walking stick, hat, glasses)
		
	} else if (this.name == "Wayne") {
		// ctx.fillStyle = ""
		// ellipse(this.x, this.y - 40, 20, 400, "rgb(0, 0, 0)");		
		
	} 
	
    ctx.restore()
    if (Math.hypot((this.x - p.x), (this.y - p.y)) <= 100 && keys.space && this.lineNum < 0 && this.textCooldown <= 0) {
        this.lineNum = 0
        this.textCooldown = 1
    } else if (this.remote) {
        this.remoteSpeak = true
        this.lineNum = 0
        this.textCooldown = 1
        this.remote = false
    }

	if (this.showName) {
		ctx.fillStyle = "rgb(0, 0, 0)"
		ctx.textBaseline = 'middle'
		ctx.font = "20px serif"
		ctx.textAlign = 'center'
    	ctx.fillText(this.name, this.x, this.y - 40)
	}

	

	
}

NPC.prototype.talk = function(p, npcs) {
    var playerDist = Math.hypot((this.x - p.x), (this.y - p.y))
	if (playerDist <= 100) {
		this.showName = true
	} else {
		this.showName = false
	}

	if (this.lineNum >= 0 && playerDist <= 100) {

		// Change player dir depending on which way you're facing
		if (p.cords.y == this.cords.y) {
			if (p.cords.x == this.cords.x) {
				p.dir = "U"
			} else if (p.x > this.x) {
				p.dir = "L"
			} else if (p.x < this.x) {
				p.dir = "R"
			}
		} else if (p.cords.y > this.cords.y) {
			p.dir = "U"
		} else {
			p.dir = "D"
		}
		
	}
	

    if (this.lineNum >= 0) {
		
        if (playerDist <= 100 || this.remoteSpeak) {
			
            if (this.actionLine == this.lineNum && !this.actionFinished) {
                this.action(p)
                this.actionFinished = true
            }

            if (this.textCooldown <= 0) {
				this.nextIndicator = true
				if (this.nextIndicatorDir == "D") {
					this.nextIndicatorY += 1
				} else {
					this.nextIndicatorY -= 1
				}
				
				if (this.nextIndicatorY >= 10) {
					this.nextIndicatorDir = "U"
				}

				if (this.nextIndicatorY <= 0) {
					this.nextIndicatorDir = "D"
				}
				
				if (keys.space) {
	                if (this.lineNum + 1 == this.lines.length) {
                        if (this.actionLine == "after") {
                            this.action(p)
                        }
						this.firstInteraction = false
	                    this.lineNum = -1
                        this.actionFinished = false
						this.talkedTo = true
                        this.remoteSpeak = false
	                } else {
	                    this.lineNum ++
						this.nextIndicatorY = 0
                        if (curMap == mainMap) {
                            // saveGame()
                            // alert('game saved')
                        }
	                }
	                this.textCooldown = 1
					this.nextIndicator = false
				}
            }

            if (!!this.lines[this.lineNum]) { // Check if line even exists (fixes annoying console error)
                if (typeof this.lines[this.lineNum] != "function") {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.60)"
                    ctx.roundRect(width / 4, height * 3 / 4 - 10, width / 2, height / 4, 10)
                    ctx.fill()
                    ctx.fillStyle = "rgb(0, 0, 0)"
                    ctx.font = "15px serif"
                    ctx.textAlign = 'left'
                    ctx.fillText(this.name, width / 4 + 10, height * 3 / 4 + 5)
                    ctx.textBaseline = 'middle'

                    // Small or big text
                    ctx.textAlign = 'center'
                    if (this.lines[this.lineNum].charAt(0) == "`") {
                        ctx.font = "15px serif"
                        fillTextMultiLine(this.lines[this.lineNum].substring(1,(this.lines[this.lineNum]).length), width / 2, (height * 3 / 4) + 60)
                    } else {
                        ctx.font = "20px serif"
                        fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 60)
                    }
                    
                    
                    if (this.nextIndicator) {
                        if (this.nextIndicator) {
                            triangle(width / 2 - 10, height - 60 + this.nextIndicatorY, width/2 + 10, height - 60 + this.nextIndicatorY, width/2, height - 40 + this.nextIndicatorY, "rgb(0, 0, 0)")
                        }
                    }
                } else {
                    this.lines[this.lineNum].update()
                }
            }
        } else if (!!this.curPath && this.curPath != 0) {
            this.lineNum = -1
            this.actionFinished = false
        }
    }

    if (this.curPath != 0 && this.lineNum == -1) {
        this.runPath(this.curPath)
    }

	if (playerDist <= 100) {
		if (this.lineNum == -1) {
			p.canMove = true
			
		} else {
			p.canMove = false
		}
	} else if (this.remoteSpeak) {
        p.canMove = false
    } else {
        p.canMove = true
    }

    

	
}
// Ex: [[30, 60], [30, 90]]
NPC.prototype.move = function(pos) {
	
	
	var finished = false
    
    console.log(pos)
    var moveX = pos[0]
    var moveY = pos[1]
    
    
    if (this.cords.x < moveX) {
        this.dir = "R"
        this.x += this.speed
    }
    if (this.cords.x > moveX) {
        this.dir = "L"
        this.x -= this.speed
    }
    if (this.cords.y < moveY) {
        this.dir = "D"
        this.y += this.speed
    }
    if (this.cords.y > moveY) {
        this.dir = "U"
        this.y -= this.speed
    }
}

NPC.prototype.runPath = function(path) {
    if (typeof path[this.pathPoint] == "object") {
        if (this.cords.x == path[this.pathPoint][0] && this.cords.y == path[this.pathPoint][1]) { // Checks to make sure npc is on the right block
            if (!!!path[this.pathPoint + 1]) {
                this.curPath = 0
                return
            } else {
                this.pathPoint ++
            
                // Centers the NPC on their block before moving on to the next point
                this.x = this.cords.x * 75 + 37.5
                this.y = this.cords.y * 75 + 37.5
                this.runPath(path)
            }
        
        }

        this.move(path[this.pathPoint])
        console.log("Path point: " + path[this.pathPoint])
    } else if (typeof path[this.pathPoint] == "function") {
        try {
            path[this.pathPoint]()
            if (!!!path[this.pathPoint + 1]) {
                this.curPath = 0
                return
            } else {
                this.pathPoint ++
                this.runPath(path)
            }

            

        } catch (e) {
            console.log(e)
        }
        return
    }
}

NPC.prototype.drawFace = function(faceX, faceY) {
	//alert("uh yeah")
	ellipse(faceX, faceY, 50, 50, this.properties.skinColor)
	ellipse(faceX - 10, faceY - 10, 10, 10, this.properties.eyeColor)
    ellipse(faceX + 10, faceY - 10, 10, 10, this.properties.eyeColor)
}