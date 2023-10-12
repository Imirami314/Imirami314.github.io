// FOR TESTING PURPOSES

function DARKENED() {
    this.x = width / 2
    this.y = height / 2
    this.phase = 2
}

DARKENED.prototype.draw = function() {
    ctx.save()
    
    // Body
    ellipse(this.x, this.y, 150, 150, "rgb(0, 0, 0)")

    // Eyes
    if (this.phase == 1) {
        ellipse(this.x - 30, this.y - 35, 30, 30, "rgb(255, 50, 100)")
        ellipse(this.x + 30, this.y - 35, 30, 30, "rgb(255, 50, 100)")
    } else if (this.phase == 2) {
        ellipse(this.x - 30, this.y - 35, 30, 30, "rgb(0, 50, 100)")
        ellipse(this.x + 30, this.y - 35, 30, 30, "rgb(0, 50, 100)")
    }

    // Arms
    if (this.phase == 1) {
        ellipse(this.x + 75, this.y, 40, 40, "rgb(125, 25, 50)")
        ellipse(this.x - 75, this.y, 40, 40, "rgb(125, 25, 50)")
    } else if (this.phase == 2) {
        ellipse(this.x + 75, this.y, 40, 40, "rgb(0, 25, 50)")
        ellipse(this.x - 75, this.y, 40, 40, "rgb(0, 25, 50)")
    }

    ctx.save()
    ctx.translate(this.x + 55, this.y)
    if (this.phase == 1) {
        ctx.rotate(- Math.PI / 10)
    } else if (this.phase == 2) {
        ctx.rotate(- Math.PI / 15)
    }
    ctx.translate(-1 * (this.x + 55), -1 * this.y)
    ctx.translate(0, -1 * this.spearShift)

    // Spear thing
    if (this.phase == 1) {
        ctx.fillStyle = "rgb(110, 60, 30)"
    } else if (this.phase == 2) {
        ctx.fillStyle = "rgb(50, 50, 50)"
    }
    
    ctx.fillRect(this.x + 60, this.y - 80, 16, 180) // Center x = 63
    ctx.beginPath()
    
    if (this.phase == 1) {
        triangle(this.x + 50, this.y - 80, this.x + 68, this.y - 115, this.x + 86, this.y - 80, "rgb(255, 50, 100)")
    } else if (this.phase == 2) {
        for (var i = 0; i < 6; i ++) {
            triangle(this.x + 50, this.y - 80 + i * 15, this.x + 68, this.y - 115 + i * 15, this.x + 86, this.y - 80 + i * 15, "rgb(0, 50, 100)")
        }
    }
        
    ctx.restore()
}

function NPC(x, y, name, dir) {
    this.x = x
    this.y = y
    this.cords = {}
    this.speed = 4 // Default 4 or 5
	this.dir = dir
	this.name = name
}

NPC.prototype.draw = function() {
	
    this.cords.x = Math.floor(this.x / 75) // This regulates it, because you don't start at x-cord 0, you start at x-cord 10
    this.cords.y = Math.floor(this.y / 75) // Same thing as x-cord, but height / 2 is about half of width / 2, so it's 5 instead of 10
    
    ctx.save()

	switch (this.name) {
		case "Old":
			triangle(this.x - 22, this.y + 10, this.x + 22, this.y + 10, this.x, this.y + 40, "rgb(100, 100, 100)")
			ellipse(this.x, this.y, 50, 50, "rgb(240, 181, 122)")

			
			break
	}
	
	switch (this.dir) {
			
			case "D":
			
				ellipse(this.x - 10, this.y - 10, 10, 10, eyeColor)
				ellipse(this.x + 10, this.y - 10, 10, 10, eyeColor)
			
				break
			case "R":
				ellipse(this.x + 10, this.y - 10, 10, 10, eyeColor)
				break
			case "L":
				ellipse(this.x - 10, this.y - 10, 10, 10, eyeColor)
				break
			
	}	

	
    // ctx.translate(width / 2, height / 2)
	
    
	
    
    // ctx.translate(-1 * (width / 2), -1 * (height / 2))
    
    
    // ellipse((width / 2) - 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
	// ellipse((width / 2) + 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
    
    ctx.restore()
    
    // ctx.fillStyle = "rgb(0, 255, 0)"
    // ctx.fillText(this.cords.x + ", " + this.cords.y, 100, 100)
}



var old = new NPC(width/2, height/2, "Old", "D")
var dark = new DARKENED()

var cutSceneFrame = 0
var spearSpeed = 1
var darkenedColor = 0
var spearSize = 0 // change triangle into circle
var shootTriangle = 0
var darkenedScale = 1
var fade = 0
spearSize = 50
setInterval(function() {
	
	ctx.save()
	ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, 0, width, height) 

    if (cutSceneFrame > 100 && cutSceneFrame < 575) {
		darkenedScale += 0.001
		if (spearSize > 0) {
			spearSize -= 1
		} else {
			spearSize = 0
		}
		darkenedColor += 0.3
	}

	if (cutSceneFrame > 100 && cutSceneFrame < 750) {
		ctx.translate(Math.random() * 5, Math.random() * 5)
	}

	if (cutSceneFrame > 575 && cutSceneFrame < 800) {
		if (fade < 1) {
			fade += 0.01
		}	
	}

	if (cutSceneFrame > 800) {
		if (fade > 0) {
			fade -= 0.01
		}

	}

	if (cutSceneFrame > 750) {
		spearSpeed += 0.1
	}

	if (cutSceneFrame )
	// old.draw()
    ctx.translate(width / 2, height / 2)
	ctx.scale(darkenedScale, darkenedScale)
	ctx.translate(width / -2, height / -2)


	
	if (cutSceneFrame < 750) {
	    // Body
	    ellipse(width/2, height/2, 150, 150, "rgb("+ darkenedColor +", "+ darkenedColor +", "+ darkenedColor +")")
	
	    // Eyes
		ellipse(width/2 - 30, height/2 - 35, 30, 30, "rgb("+ darkenedColor +", 50, 100)")
	    ellipse(width/2 + 30, height/2 - 35, 30, 30, "rgb("+ darkenedColor +", 50, 100)")
	    
	
	    // Arms
		ellipse(width/2 + 75, height/2, 40, 40, "rgb("+ darkenedColor +", 25, 50)")
		ellipse(width/2 - 75, height/2, 40, 40, "rgb("+ darkenedColor +", 25, 50)")
    
	}
    //ctx.save()
    ctx.translate(width/2 + 75, height/2)
	

	if (cutSceneFrame > 100    && cutSceneFrame < 750 && spearSpeed > 0) {
		spearSpeed += 0.01 + (cutSceneFrame / 1000)
	
	} /*else {
		spearSpeed ++
	}*/
	
	
 
 	ctx.rotate(- Math.PI / 15 + (spearSpeed / 5))
	
    
    ctx.translate(-1 * (width/2 + 75), -1 * height/2)
    //ctx.translate(0, -1 * this.spearShift)

    // Spear thing
    
    
    triangle(width/2 + 50, height/2 - 80, width/2 + 68, height/2 - 115, width/2 + 86, height/2 - 80, "rgb(" + (darkenedColor) + ", 50, 100)")
	ctx.fillStyle = "rgb(0, 50, 50)"
    ctx.fillRect(width/2 + 60, height/2 - 80, 16, 180) // Center x = 63
	ellipse(width/2 + 68, height/2 - 90, spearSize, spearSize, "rgb(0, 50, 100)")
    ctx.beginPath()
    
    
	
	
    
    ctx.restore()
	
	ctx.fillStyle = "rgb(255, 255, 255, "+ fade +")"
	ctx.fillRect(0, 0, width, height)
	
	
	cutSceneFrame ++
    
    // ellipse(width / 2, height / 2, 50, 50, "rgb(100, 0, 0)")
    
}, 15)
