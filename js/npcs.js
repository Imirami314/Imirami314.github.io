class NPC extends Entity {
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
    static all = []
    
    // Helper function to make a color slightly darker
    // I don't know what any of this does but it's too specific for me to figure out
    getDarkerSkinColor() {
        // Extract RGB values from the skin color string
        const match = this.properties.skinColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
            const r = Math.max(0, parseInt(match[1]) - 30);
            const g = Math.max(0, parseInt(match[2]) - 30);
            const b = Math.max(0, parseInt(match[3]) - 30);
            return `rgb(${r}, ${g}, ${b})`;
        }
        // Fallback to a default darker color if parsing fails
        return "rgb(100, 70, 40)";
    }
    
    constructor(x, y, name, map, dir, lines, desc, action, actionLine, shopMenu) {
        super(map, x, y)

        this.cords = {}
        this.speed = 4 // Default 4 or 5
        this.dir = dir
        this.dirSave = dir
        this.lookAtPlayer = true
        this.name = name
        
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

        this.speechBubbleIndex = 0
        this.speechBubbleAnimation = ["", ".", "..", "..."]

        this.action = action
        this.actionLine = actionLine
        this.actionFinished = false

        this.talkedTo = false // Default false (NPC List)

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

                this.firstInteraction = n.firstInteraction
            }
        }

        this.shopMenu = shopMenu
        
        NPC.all.push(this)

        this.blinkTimer = Math.random() * 180 + 60; // frames until next blink
        this.isBlinking = false;
        this.blinkFrame = 0;
    }

    draw() {
        if (scene == "CAMERA") {
            this.cameraOn = true
        }
    
        if (!dev) {
            if (!cameraMoving) {
                if (this.lines[this.lineNum] != "...") {
                    this.textCooldown -= perSec(1)
                } else {
                    this.textCooldown -= 1 / 100
                }
            } 
        } else {
            this.textCooldown -= 1 / 20	
        }
        this.cords.x = Math.floor(this.x / 75) // This regulates it, because you don't start at x-cord 0, you start at x-cord 10
        this.cords.y = Math.floor(this.y / 75) // Same thing as x-cord, but height / 2 is about half of width / 2, so it's 5 instead of 10
        
        ctx.save()

        this.drawFeaturesBehind();
    
        let npcPulsation = Math.sin(elapsed / 15) * 2
        // Draw head border first
        ellipse(this.x, this.y, 52 + npcPulsation, 52 + npcPulsation, this.getDarkerSkinColor())
        // Draw head on top
        ellipse(this.x, this.y, 50 + npcPulsation, 50 + npcPulsation, this.properties.skinColor)
    
        // Blinking logic
        if (this.isBlinking) {
            this.blinkFrame++;
            if (this.blinkFrame > 6) { // Blink lasts 6 frames
                this.isBlinking = false;
                this.blinkTimer = Math.random() * 180 + 120; // 2-4 seconds at 60fps
                this.blinkFrame = 0;
            }
        } else {
            this.blinkTimer--;
            if (this.blinkTimer <= 0) {
                this.isBlinking = true;
                this.blinkFrame = 0;
            }
        }

        switch (this.dir) {
            case "D":
                // Draw arm borders first
                ellipse(this.x - 26, this.y + 20, 17, 17, this.getDarkerSkinColor())
                ellipse(this.x + 26, this.y + 20, 17, 17, this.getDarkerSkinColor())
                // Draw arms on top
                ellipse(this.x - 26, this.y + 20, 15, 15, this.properties.skinColor)
                ellipse(this.x + 26, this.y + 20, 15, 15, this.properties.skinColor)
                break
            case "R":
                // Draw arm border first
                ellipse(this.x + 5, this.y + 26, 17, 17, this.getDarkerSkinColor())
                // Draw arm on top
                ellipse(this.x + 5, this.y + 26, 15, 15, this.properties.skinColor)
                break
            case "L":
                // Draw arm border first
                ellipse(this.x - 5, this.y + 26, 17, 17, this.getDarkerSkinColor())
                // Draw arm on top
                ellipse(this.x - 5, this.y + 26, 15, 15, this.properties.skinColor)
                break
            case "U": 
                // Draw arm borders first
                ellipse(this.x - 26, this.y + 20, 17, 17, this.getDarkerSkinColor())
                ellipse(this.x + 26, this.y + 20, 17, 17, this.getDarkerSkinColor())
                // Draw arms on top
                ellipse(this.x - 26, this.y + 20, 15, 15, this.properties.skinColor)
                ellipse(this.x + 26, this.y + 20, 15, 15, this.properties.skinColor)
                break
        }

        this.drawFeaturesFront();
    
        if (this.name == "Old Man") { // accesories (walking stick, hat, glasses)
            
        } else if (this.name == "Wayne") {
            // ctx.fillStyle = ""
            // ellipse(this.x, this.y - 40, 20, 400, "rgb(0, 0, 0)");		
            
        } 
        
        ctx.restore()

        if (keys.space && !p.spaceActioned && !p.isTalking() && Math.hypot((this.x - p.x), (this.y - p.y)) <= 100 && this.lineNum < 0 && this.textCooldown <= 0 && CUR_SHOP_MENU == 0) {
            p.spaceActioned = true

            this.lineNum = 0
            this.textCooldown = 1
            this.dirSave = this.dir
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

        // Eyes (with blinking)
        var playerDist = Math.hypot((this.x - p.x), (this.y - p.y))
        if (this.isBlinking || (p.hitting && playerDist <= 100)) {
            switch (this.dir) {
                case "D":
                    // Draw closed eyes (lines)
                    ctx.save();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.properties.eyeColor;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 15, this.y - 10);
                    ctx.lineTo(this.x - 5, this.y - 10);
                    ctx.moveTo(this.x + 5, this.y - 10);
                    ctx.lineTo(this.x + 15, this.y - 10);
                    ctx.stroke();
                    ctx.restore();
                    break;
                case "R":
                    ctx.save();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.properties.eyeColor;
                    ctx.beginPath();
                    ctx.moveTo(this.x + 2, this.y - 10);
                    ctx.lineTo(this.x + 12, this.y - 10);
                    ctx.stroke();
                    ctx.restore();
                    break;
                case "L":
                    ctx.save();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.properties.eyeColor;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 12, this.y - 10);
                    ctx.lineTo(this.x - 2, this.y - 10);
                    ctx.stroke();
                    ctx.restore();
                    break;
            }
        } else {
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
        }
    }

    drawFeaturesFront() {
        switch (this.name) {
            case "Old Man":
                
                triangle(this.x - 15, this.y - 20, this.x + 15, this.y - 20, this.x, this.y - 60, "rgb(22, 16, 54)")
                ctx.fillStyle = "rgb(54, 38, 16)"
                ctx.fillRect(this.x + 23, this.y + 20, 7, 30)

                if (this.glasses) {
                    ctx.lineWidth = 1;
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
                if (this.hasAquaLung) {
                    ellipse(this.x, this.y, 75, 75, "rgb(0, 255, 255, 0.4)")
                }
                this.properties.skinColor = "rgb(125, 88, 40)"
                break
            case "Smith":
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
                break
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
            case "Alfred":
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
            case "Empress Aurora":
                ctx.drawImage(images.empressAurorasCrown, this.x - 25, this.y - 42, 50, 25); // changeme to look better lol
                break
        }
    }

    drawFeaturesBehind() {
        switch (this.name) {
            case "Old Man":
                // beard
                triangle(this.x - 22, this.y + 10, this.x + 22, this.y + 10, this.x, this.y + 40, "rgb(100, 100, 100)")
                break
        }
    }

    talk(p, npcs) {
        var playerDist = Math.hypot((this.x - p.x), (this.y - p.y))
        if (playerDist <= 100) {
            this.showName = true
        } else {
            this.showName = false
        }
        this.playerDist = playerDist // temporary
    
        if (this.lineNum >= 0) {
            
            if (playerDist <= 100 || this.remoteSpeak) {
                this.faceTalkingDirection();

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

                            if (this.remoteSpeak) {
                                p.canMove = true
                            }

                            this.firstInteraction = false
                            this.lineNum = -1
                            this.textCooldown = 1;
                            this.actionFinished = false
                            this.talkedTo = true
                            this.remoteSpeak = false
                            this.dir = this.dirSave
                        } else {
                            this.lineNum ++
                            this.nextIndicatorY = 0
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
                        
                        if (this.lines[this.lineNum] != "...") {
                            this.speechBubbleIndex = 0
                        }
                        ctx.textBaseline = 'middle'
                        

                        
                        // Special text cases
                        ctx.textAlign = 'center'
                        if (this.lines[this.lineNum].charAt(0) == "`") {
                            ctx.font = "15px serif"
                            fillTextMultiLine(this.lines[this.lineNum].substring(1,(this.lines[this.lineNum]).length), width / 2, (height * 3 / 4) + 55)
                        } else if (this.lines[this.lineNum].charAt(0) == "*") {
                            ctx.font = "20px serif"
                            ctx.fillStyle = "rgb(150, 0, 0)"
                            fillTextMultiLine(this.lines[this.lineNum].substring(1,(this.lines[this.lineNum]).length), width / 2, (height * 3 / 4) + 55)
                        } else if (this.lines[this.lineNum] == "...") {
                            ctx.textAlign = 'left'
                            ctx.font = "40px serif"
                            this.speechBubbleIndex += 0.08
                            if (this.speechBubbleIndex >= 4) {
                                this.speechBubbleIndex = 0
                            }
                            //console.log(Math.floor(this.speechBubbleIndex))
                            fillTextMultiLine(this.speechBubbleAnimation[Math.floor(this.speechBubbleIndex)], width / 2 - 15, (height * 3 / 4) + 55)
                            ctx.textAlign = 'center'
                        } else {
                            ctx.fillStyle = "rgb(0, 0, 0)"
                            ctx.font = "20px serif"
                            fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 55)
                        }
                        
                        
                        if (this.nextIndicator) {
                            if (this.nextIndicator) {
                                triangle(width / 2 - 10, height - 60 + this.nextIndicatorY, width/2 + 10, height - 60 + this.nextIndicatorY, width/2, height - 40 + this.nextIndicatorY, "rgb(0, 0, 0)")
                            }
                        }

                        ctx.textBaseline = "alphabetic"; // reset to default
                    } else {
                        this.lines[this.lineNum].update()
                    }
                }
            } else if (!!this.curPath && this.curPath != 0) {
                this.lineNum = -1
                this.actionFinished = false
                p.canMove = true;
            }
        }
    
        if (this.curPath != 0 && this.lineNum == -1) {
            this.runPath(this.curPath)

            p.canMove = true;
        } else if (playerDist <= 100 || this.remoteSpeak) {
            if (this.lineNum == -1) {
                p.canMove = true
            } else {
                p.canMove = false
            }
        }
    }

    faceTalkingDirection() {
        // Change player/npc dir depending on which way you're facing
        // This sometimes causes weird issues if the npc's y coordinate is on the edge of a block
        if (p.cords.y == this.cords.y) {
            if (p.x > this.x) {
                p.dir = "L"
                if (this.lookAtPlayer) {
                    this.dir = "R"
                }
            } else if (p.x < this.x) {
                p.dir = "R"
                if (this.lookAtPlayer) {
                    this.dir = "L"
                }
            }
        } else if (p.cords.y > this.cords.y) {
            p.dir = "U"
            if (this.lookAtPlayer) {
                this.dir = "D"
            }
        } else if (p.cords.y < this.cords.y) {
            p.dir = "D"
            if (this.lookAtPlayer) {
                this.dir = "U"
            }
        }
    }

    move(pos) {
	
	
        var finished = false
        
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

    runPath(path) {
        if (typeof path[this.pathPoint] == "object") {
            if (this.cords.x == path[this.pathPoint][0] && this.cords.y == path[this.pathPoint][1]) { // Checks to make sure npc is on the right block
                if (!!!path[this.pathPoint + 1]) {
                    this.curPath = 0
                    return
                } else {
                    this.pathPoint ++
                
                    // Centers the NPC on their block before moving on to the next point
                    // this.x = ctr(this.cords.x)
                    // this.y = ctr(this.cords.y)
                    this.runPath(path)
                }
            
            }
    
            this.move(path[this.pathPoint])
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

    drawFace(faceX, faceY) {
        // ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ellipse(faceX, faceY, 50, 50, this.properties.skinColor)
        ellipse(faceX - 10, faceY - 10, 10, 10, this.properties.eyeColor)
        ellipse(faceX + 10, faceY - 10, 10, 10, this.properties.eyeColor)
    }

    /**
     * Clears action function and sets actionLine to "after"
    */
    clearAction() {
        this.action = function() {}
        this.actionLine = "after"
    }
}