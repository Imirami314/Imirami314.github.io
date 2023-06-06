function Enemy(map, spawnX, spawnY) {
  this.map = map
  this.spawnX = spawnX
  this.spawnY = spawnY
  this.x = spawnX
  this.y = spawnY
}

Enemy.prototype.move = function(dx, dy) {
  if (getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through) {
    this.y += dy
  }
  
  if (getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
    this.x += dx
  }
}

Enemy.prototype.isStuck = function(dx, dy) {
  if (!getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + dy) / 75))).through ||
  !getBlockById(curMap.getBlock(Math.floor((this.x + dx) / 75), Math.floor((this.y) / 75))).through) {
    return true
  }
}

// Bosses

function Darkened(map, spawnX, spawnY) {
  Enemy.call(this, map, spawnX, spawnY)
  this.name = "Darkened"
  this.damage = 10
  this.maxHealth = 250
  this.health = 250 // Default 250
	this.animatedHealth = 250
	
  this.cords = {
    x: 0,
    y: 0
  }
  this.speed = 2
  this.playerDist = 100000 // idk man
  this.playerAngle = 0
  this.tpTimer = 3
  this.scaleFactor = 1
  this.scaleShift = 1

  this.spearShift = 0

  this.phase = 1 // Default 1
  this.tpHitCount = 0
  this.tping = false

  this.hittable = true
  this.beingHit = false

  this.spikes = []

	this.phase2Played = false // Check if phase 2 cutscene has played

  this.spikeShotCooldown = 5
  this.spikeShotRoundCount = 0 // Long name lol
  this.stuck = false
}

Darkened.prototype = Object.create(Enemy.prototype)

Darkened.prototype.draw = function() {
	if (scene === "GAME") {
    if (this.phase == 1) {
		  playMusic("Darkened Battle")
    } else if (this.phase == 2) {
      playMusic("Darkened Battle Phase 2")
    }
    if (this.health > 0) {
      bossfight = true
    } else {
      bossfight = false
    }
	}
	
  // Makes it so the calculations don't divide by 0
  if ((p.x - this.x) == 0) {
    this.x -= 0.5
  }
  
  if ((p.y - this.y) == 0) {
    this.y -= 0.5
  }
  
  this.tpTimer -= 1 / (66 + (2 / 3))
  this.cords.x = Math.floor(this.x / 75)
  this.cords.y = Math.floor(this.y / 75)
  this.pdx = p.x - this.x
  this.pdy = p.y - this.y
  this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
  this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x)) + (Math.PI) / 2 // Gives angle direction of player
  
  this.spikeX = this.x + Math.cos(this.playerAngle - Math.PI / 3.3) * 112
  this.spikeY = this.y + Math.sin(this.playerAngle - Math.PI / 3.3) * 112
  this.playerWandAngle = Math.atan2((p.y - this.spikeY), (p.x - this.spikeX))

  // this.move(this.speed * (p.x - this.x) / Math.abs(p.x - this.x), 0)
  // this.move(0, this.speed * (p.y - this.y) / Math.abs(p.y - this.y))
  
  
  if (this.map == curMap) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.playerAngle)
    ctx.scale(this.scaleFactor * this.scaleShift, this.scaleFactor * this.scaleShift)
    ctx.translate(-1 * this.x, -1 * this.y)
    
    // Speedy fade thing
    if (this.spearShift == 100 && !this.stuck) {
      ellipse(this.x, this.y + 10, 150, 150, "rgba(0, 0, 0, 0.3)")
      ellipse(this.x, this.y + 20, 150, 150, "rgba(0, 0, 0, 0.2)")
      ellipse(this.x, this.y + 45, 150, 150, "rgba(0, 0, 0, 0.1)")
    }

    // Body
		if (this.beingHit) {
      
			ellipse(this.x, this.y, 150, 150, "rgb(50, 0, 0)")
		} else {
    	ellipse(this.x, this.y, 150, 150, "rgb(0, 0, 0)")
		}
  
    // Eyes
    if (this.phase == 1 || this.beingHit) {
      ellipse(this.x - 30, this.y - 35, 30, 30, "rgb(255, 50, 100)")
      ellipse(this.x + 30, this.y - 35, 30, 30, "rgb(255, 50, 100)")
    } else if (this.phase == 2) {
      ellipse(this.x - 30, this.y - 35, 30, 30, "rgb(0, 50, 100)")
      ellipse(this.x + 30, this.y - 35, 30, 30, "rgb(0, 50, 100)")
    }
  
    // Arms
    if (this.phase == 1 || this.beingHit) {
      ellipse(this.x + 75, this.y, 40, 40, "rgb(125, 25, 50)")
      ellipse(this.x - 75, this.y, 40, 40, "rgb(125, 25, 50)")
    } else if (this.phase == 2) {
      ellipse(this.x + 75, this.y, 40, 40, "rgb(0, 25, 50)")
      ellipse(this.x - 75, this.y, 40, 40, "rgb(0, 25, 50)")
    }
    ctx.translate(this.x + 55, this.y)
    if (this.phase == 1) {
      ctx.rotate(- Math.PI / 10)
    } else if (this.phase == 2) {
      // ctx.rotate(- Math.PI / 15)
      ctx.rotate(0)
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
      ellipse(this.x + 68, this.y - 90, 30, 30, "rgb(0, 50, 100)")
      // for (var i = 0; i < 6; i ++) {
      //   triangle(this.x + 50, this.y - 80 + i * 15, this.x + 68, this.y - 115 + i * 15, this.x + 86, this.y - 80 + i * 15, "rgb(0, 50, 100)")
      // }
    }

    if (this.spikes.length == 0) {
      
    }
    
    ctx.restore()
    ctx.fillStyle = "rgb(0, 0, 0)"
    // ctx.fillText((this.playerWandAngle / Math.PI) + "pi", this.x + 200, this.y + 200)

    for (var i in this.spikes) {
      var s = this.spikes[i]
      if (s.moving) {
        ellipse(s.x, s.y, 30, 30, "rgb(255, 50, 100)")
      }
    }
  }
}

Darkened.prototype.update = function() {
  if (this.health <= this.maxHealth / 2) {
    this.phase = 2
		if (!this.phase2Played) {
			scene = "DARKENED BOSS CUTSCENE PHASE 2"
			this.phase2Played = true
		}
  }

  if (this.phase == 1) {
    if (!this.tping) {
      if (this.tpTimer <= 0) {
        // this.move((p.x - this.x) / (33 + (1 / 3)), (p.y - this.y) / 100)
        this.spearShift = 100
        this.stuck = this.isStuck(this.speed * (p.x - this.x) * 5 / Math.abs(p.x - this.x), this.speed * (p.y - this.y) * 5 / Math.abs(p.y - this.y))
        this.move(this.speed * (p.x - this.x) * 5 / Math.abs(p.x - this.x), this.speed * (p.y - this.y) * 5 / Math.abs(p.y - this.y))
        if (this.playerDist <= 225) {
          p.health -= 3
          this.tpTimer = 3
        }
        if (this.tpTimer <= -0.2) {
          this.tpTimer = 3
        }
      } else {
        if (this.spearShift > 0) {
          this.spearShift --
        }
      }
    
      if (this.tpHitCount % 10 == 0 && this.tpHitCount != 0) {
        this.tping = true
        this.tpHitCount ++
      }
    } else if (this.tping || this.playerDist >= 900) {
      this.scaleFactor -= 1 / (66 + (2 / 3))
      if (this.scaleFactor > 0) {
        this.scaleShift = 1
        this.tpTimer = 3
      } else {
        if (this.scaleShift != -1) {
          this.x = Math.random() * curMap.getDimensions().x * 75
          this.y = Math.random() * curMap.getDimensions().y * 75
        }
        this.scaleShift = -1
      }
  
      if (Math.abs(this.scaleFactor) >= 1) {
        this.scaleFactor = 1
        this.scaleShift = 1
        this.tping = false
      }
    }
  } else if (this.phase == 2) {
    this.spikeShotCooldown -= 1 / (66 + (2 / 3))

    if (this.tping) {
      if (this.playerDist >= 300) {
        this.move(this.speed * (p.x - this.x) * 10 / Math.abs(p.x - this.x), this.speed * (p.y - this.y) * 10 / Math.abs(p.y - this.y))
      } else {
        this.tping = false
      }
    }

    if (this.spikeShotCooldown <= 0) {
      this.spikes.push({
        x: this.spikeX,
        y: this.spikeY,
        dx: Math.cos(this.playerWandAngle) * 10,
        dy: Math.sin(this.playerWandAngle) * 10,
        moving: true
      })
      this.spikeShotRoundCount ++
      if (this.spikeShotRoundCount == 5) {
        this.spikeShotCooldown = 3.5
        this.tping = true
        this.spikeShotRoundCount = 0
      } else {
        this.spikeShotCooldown = 0.4
      }
    }
    
    for (var i in this.spikes) {
      var s = this.spikes[i]
      if (s.moving) {
        s.x += s.dx
        s.y += s.dy
        if (Math.hypot(s.x - p.x, s.y - p.y) <= 30) {
          p.health -= 2
          this.spikes.splice(i, 1)
        }
      }
    }
    
    // alert(this.spikes.length)
  }
}

Darkened.prototype.healthBar = function() {
	ctx.fillStyle = "rgb(150, 0, 0)"
	ctx.font = "70px serif"
  ctx.textAlign = "center"
  ctx.fillText("Darkened", width / 2, height / 9)
	
  ctx.fillStyle = "rgb(100, 100, 100)"
  ctx.roundRect(width / 8, height / 8, width * 3 / 4, 25, 10)
	ctx.fill()
  if (this.health > 0) {
    ctx.fillStyle = "rgb(150, 0, 0)"
    ctx.roundRect(width / 8, height / 8, (width * 3 / 4) * (this.animatedHealth / this.maxHealth), 25, 5)
  	ctx.fill()
  }

	if (this.health < this.animatedHealth && this.health > 0) {
		this.animatedHealth --
    this.beingHit = true
	} else {
    this.beingHit = false
  }
		
}

// Monsters

function Splint(map, spawnX, spawnY) { // Idk what to call it man
  Enemy.call(this, map, spawnX, spawnY)
  this.damage = 2
  this.maxHealth = 20
  this.health = 20
  this.cords = {
    x: 0,
    y: 0
  }
  this.speed = 1
  this.playerDist = 10000 // Gets updated by the draw method
  
  this.weaponPos = 0
  this.hitting = false
  this.hitCooldown = 1

  this.dead = false
}

Splint.prototype = Object.create(Enemy.prototype)

Splint.prototype.draw = function(p) {
  this.cords.x = Math.floor(this.x / 75)
  this.cords.y = Math.floor(this.y / 75)
  this.playerDist = Math.hypot((p.x - this.x), (p.y - this.y))
  this.playerAngle = Math.atan2((p.y - this.y), (p.x - this.x))

  if (this.health <= 0 && !this.dead) {
    this.dead = true
    var trillsChanceGenerator = Math.random()
    if (trillsChanceGenerator <= 0.15) {
      p.trills += Math.round(Math.random() + 1)
    }
  }

  if (this.playerDist <= 350 && this.playerDist >= 75) {
    this.move(Math.cos(this.playerAngle) * 2, Math.sin(this.playerAngle) * 2)
  }

  if (this.playerDist < 100 && this.hitCooldown <= 0) {
    this.hit()
  } else {
    this.hitCooldown -= 1 / (66 + 2 / 3)
  }
  
  if (this.map == curMap) {
    ctx.save()
    ctx.translate(this.x, this.y)
    if (this.playerDist <= 350) {
      ctx.rotate(this.playerAngle - Math.PI / 2)
    }
    ctx.translate(- (this.x), - (this.y))
    if (!this.isHit) {
      ctx.drawImage(images.splint, this.x - 37.5, this.y - 37.5, 75, 75)
    } else {
      ctx.drawImage(images.splintHurt, this.x - 37.5, this.y - 37.5, 75, 75)
    }
    ctx.translate(this.x, this.y)
    if (this.playerDist <= 350) {
      ctx.rotate(this.weaponPos)
    }
    ctx.translate(- (this.x), - (this.y))
    ellipse(this.x - 32, this.y - 10, 25, 25, "rgb(40, 40, 40)")
    ellipse(this.x - 32, this.y + 10, 25, 25, "rgb(40, 40, 40)")
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(this.x - 35.5, this.y - 60, 10, 70)
    ctx.restore()
  }

  if (this.hitCooldown > 0) { // Re-adjust weapon position after a hit
    if (this.weaponPos < 0) {
      this.weaponPos += Math.PI / 66
    } else {
      this.weaponPos = 0
    }
  }
}

Splint.prototype.hit = function() {
  if (this.hitCooldown <= 0) {
    this.hitting = true
    if (this.hitting) {
      this.weaponPos -= Math.PI / 33
      if (this.weaponPos <= -1 * Math.PI) {
        this.hitting = false
        this.hitCooldown = 1
        if (this.playerDist <= 100) {
          p.health -= 2
        }
      }
    }
  }
}


var monsters = [
  new Splint(mainMap, 4 * 75, 4 * 75),
  new Splint(mainMap, 46 * 75, 18 * 75),
  new Splint(mainMap, 47 * 75, 18 * 75),
  new Splint(mainMap, 48 * 75, 18 * 75)
]

var bosses = [
  new Darkened(darkenedRoom, 712.5, 100)
]