function Interactive(map, x, y, key, name, draw, action) {
  this.map = map
  this.x = x
  this.y = y
  this.key = key
  this.name = name
  this.draw = draw
  this.action = action
  this.cutsceneOn = false
}

function Toggle(map, x, y, action1, action2) {
  this.map = map
  this.x = x
  this.y = y
  this.toggleCooldown = 0.5
  this.action1 = action1
  this.action2 = action2
  this.cutscene = null
  this.toggleState = 1
}

Toggle.prototype.draw = function() {
  this.toggleCooldown -= 1 / (66 + (2 / 3))
  if (this.toggleState == 2) {
    ellipse(this.x * 75 + 37.5, this.y * 75 + 37.5, 50, 50, "rgb(100, 10, 175)")
  } else {
    ellipse(this.x * 75 + 37.5, this.y * 75 + 37.5, 50, 50, "rgb(255, 255, 0)")
  }
}

Toggle.prototype.activate = function() {
  if (keys.space && this.toggleCooldown <= 0) {
    if (this.toggleState == 2) {
      this.action1()
      this.toggleState = 1
    } else {
      this.action2()
      this.toggleState = 2
    }
    this.toggleCooldown = 0.5
    // alert(this.toggleState)
  }
}

Toggle.prototype.toggleCutscene = function(x, y) {
  ctx.save()
  // ctx.scale(0.5, 0.5)
  ctx.translate(-1 * x, -1 * y)
  curMap.draw(p, "Cutscene View", -1 * x, -1 * x, 1)
  ctx.restore()
  ctx.fillStyle = "rgb(0, 0, 0)"
  ctx.fillRect(20, 20, 100, 100)
}

Toggle.prototype.playCutscene = function(x, y) {
  this.cutscene = {
    x: x,
    y: y
  }
}

Toggle.prototype.stopCutscene = function() {
  this.cutscene = null
}

function MultiToggle(map, x, y, changeX, changeY, blocks) {
	this.map = map;
	this.x = x;
	this.y = y;
	this.toggleCooldown = 0.5
	this.changeX = changeX;
	this.changeY = changeY;
	this.blocks = blocks;
	this.toggleNum = 0 // Hasn't been pressed yet
}

MultiToggle.prototype.draw = function () {
	this.toggleCooldown -= 1 / (66 + (2 / 3))
	ellipse(this.x * 75 + 37.5, this.y * 75 + 37.5, 50, 50, "rgb(100, 10, 175)")
	
	if (this.toggleNum != 0) {
		ctx.fillStyle = 'rgb(0, 0, 0)'
		ctx.fillText(this.toggleNum, this.x * 75 + 37.5, this.y * 75 + 37.5)
	}
	
}

MultiToggle.prototype.activate = function () {
	if (keys.space && this.toggleCooldown <= 0) {
		if (this.toggleNum > this.blocks.length - 1) {
			this.toggleNum = 0
		}
		this.toggleNum ++
		this.toggleCooldown = 0.5
		this.map.changeBlock(this.changeX, this.changeY, this.blocks[this.toggleNum - 1])
	}
}
