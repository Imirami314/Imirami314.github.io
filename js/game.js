// Function wrapping prevents console from altering game variables
// (function() {
curMap = galeCave

var saveLoaded = false
// hello
var alerts = [
  new BlockAlert(9, 53, ["Confounded Cave\nKEEP OUT!"], mainMap, "SIGN"),
  new BlockAlert(1, 44, ["pranked"], mainMap, "SIGN"),
  new BlockAlert(182, 3, ["Glacia Village  ---------->\n<---------- Steel Field\nIf text on the signs confuse and confound, it all becomes clearer if you flip it around."], mainMap, "SIGN"),
  new BlockAlert(66, 10, ["Huh? It's locked.\nYou need the 'Steel Field Key'."], mainMap, "KEY", "Map Key"),
  new BlockAlert(6, 53, ["Huh? It's locked.\nYou need the 'Confounded Cave Key'."], mainMap, "KEY", "Confounded Cave Key"),
  new BlockAlert(6, 21, ["The buttons above will alter the walls,\nPress them correctly to open both halls..."], confoundedCave, "SIGN"),
  new BlockAlert(28, 11, ["Huh? It's locked.\nYou need the 'Puzzle Key'."], confoundedCave, "KEY", "Puzzle Key"),
  new BlockAlert(253, 21, ["The queen does not wish to speak with commoners at this time.", "If you must enter the castle, this riddle you must use,\nthe entrance is at the entrance, between red and blue."], mainMap, "SIGN"),
  new BlockAlert(230, 18, ["If you've found the secret, but do not know how to go through,\ndo not be afraid to simply press 'q'."], mainMap, "SIGN"),
  new BlockAlert(23, 5, ["The castle exit can be found at the bottom of the lowest floor."], queensCastle, "SIGN"),
  new BlockAlert(176, 30, ["DO NOT ENTER\nWIND IS INCREDIBLY STRONG"], mainMap, "SIGN"),
  new BlockAlert(183, 39, ["Shot from a bow, on the map you'll see,\nthe land forms a symbol to point where you should be."], mainMap, "SIGN"),
  new BlockAlert(28, 23, ["Find the four brothers, have no fears,\nAs the light shines through, the answer appears.", "When a button is found, a brother is near.\nOnce you're finished, come back here."], galeCave, "SIGN"),
  new BlockAlert(35, 11, ["Press space at the center, prepare for a fight,\nFor you're about to meet the Master of Night."], confoundedCave, "SIGN"),
  new BlockAlert(44, 33, ["Warning: very cold past this point!", "Auras are recommended."], galeCave, "SIGN")
]

// Cool riddle to figure out the backwards text on some signs: If text on the signs confuse and confound, it all becomes clearer if you flip it around.

var lighting = 2500 // Between 0 and 2500
var lightingSize = 45

var SAVE_MENU = false

var weather = {
  wind: {
    activated: true,
    x: 1,
    y: 0,
    time: 0,
    equation: function(t) {
      //return (0.25) * Math.pow(t, 2) + (0.25) * t + 0.25
      return Math.sin(t) * 1.35
    }
  }
}

var cutsceneText = ""

var bossDoors = [
  {
    x: 31,
    y: 15,
    map: confoundedCave,
    enterFunction: function(p) {
      saveGame()
      p.x = darkenedRoom.enterX
      p.y = darkenedRoom.enterY
      curMap = darkenedRoom
      scene = "DARKENED BOSS CUTSCENE"
    }
  }
]

function loadSave() {
  // if (!!save.player.map) {
  //   alert(save.player.map.arr.length)
  //   curMap = save.player.map
  // }
  p.x = parseFloat(save.player.x)
  p.y = parseFloat(save.player.y)
  p.health = parseFloat(save.player.health)
  p.inventory = JSON.parse(save.player.inventory)
  // for (var i in save.player.inventory) {
  //   var s = save.player.inventory[i]
  //   for (var j in items) {
  //     if (j.name == j.name) {
  //       p.inventory.push(j)
  //     }
  //   }
  //   // p.inventory.push(save.player.inventory[i])
  // }
  p.loadSaveComplete = true
}

function Player(x, y, npcs) {
  this.x = x
  this.y = y
  this.buildMode = true
  this.bb = ','
  this.health = 10
  this.animatedHealth = 10
  this.cords = {}
  this.speed = 4 // Default 4 or 5
  this.speedMultiplier = 1
  this.dir = "D"
  this.canMove = true
  this.stoppedDir = ""
  this.blockOn = {}
  this.cordSave = {}
  this.doorCooldown = 0.1
  
  this.mapOn = false
  this.mapSwitchTimer = 0.3
  this.mapPan = {
    x: 0,
    y: 0
  }
  
  this.npcs = npcs
  
  this.loadSaveComplete = false

  this.moving = false

  this.hitCooldown = 0.25

  this.inventoryDisplay = false

  this.inventory = [items.spearOfTheDarkened, items.auraOfWarmth] // Default []
  

  this.waterParticles = new ParticleSystem(width / 2, height / 2, 5, 50, 0, 0, 100)
  this.lavaParticles = new ParticleSystem(width / 2, height / 2, 1, 75, 50, 50, 50)
  this.windParticles = new ParticleSystem(width / 2, height / 2, 1, 50, 100, 200, 200, 200)
//x, y, vx, vy, size, r, g, b
  this.area = ""
  
  this.weaponIndex = 0
  this.weapon = this.inventory[this.weaponIndex]

  this.tracking = []
  this.questPoint = {
    x: 15, // Default 15
    y: 8, // Default 8
    map: mainMap // Default mainMap
  }

  this.trills = 0

  this.resistances = {
    cold: 1, // Default 0
    heat: 0
  }
}

Player.prototype.draw = function() {
  this.mapSwitchTimer -= 1 / (66 + (2 / 3))
  this.particle = new Particle(this.blockOn.name, this.dir)
  this.doorCooldown -= 1 / (66 + (2 / 3))
  this.hitCooldown -= 1 / (66 + (2 / 3))
  this.cords.x = Math.floor(this.x / 75) // This regulates it, because you don't start at x-cord 0, you start at x-cord 10
  this.cords.y = Math.floor(this.y / 75) // Same thing as x-cord, but height / 2 is about half of width / 2, so it's 5 instead of 10

  // Load save for player
  if (!this.loadSaveComplete && save != null) {
    this.x = parseFloat(save.player.x)
    this.y = parseFloat(save.player.y)
    lighting = save.lighting
    if (save.player.map != "Main Map") {
      for (var i in areas) {
        if (areas[i].name == save.player.map) {
          curMap = areas[i]
        }
      }
    } else {
      curMap = mainMap
    }
    this.health = parseFloat(save.player.health)
    
    p.inventory = [] // Clearing inventory before save reload
    for (var i in save.player.inventory) {
      var s = save.player.inventory[i]
      console.log(s.name)
      for (var j in items) {
        if (items[j].name == save.player.inventory[i].name) {
          p.inventory.push(items[j])
        }
      }
    }
    this.loadSaveComplete = true
  }

  if (this.blockOn.name == "water") {
    this.waterParticles.create()
    this.waterParticles.draw()
  } else if (this.blockOn.name == "lava") {
    this.lavaParticles.create()
    this.lavaParticles.draw()
  } else if (this.blockOn.name == "speedy snow") {
    this.windParticles.create()
    this.windParticles.draw()
  }
  
  

  switch (this.dir) {
    case "D":
      ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

      // Eyes
      ellipse((width / 2) - 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
      ellipse((width / 2) + 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")

      ctx.save()
      ctx.translate(width / 2 - 30, height / 2 - 15)
      ctx.rotate(Math.PI / 2)
      ctx.translate(- width / 2, - height / 2)
      if (this.inventory.length >= 1) {
        try {
          !!this.weapon ? this.weapon.draw(width / 2 + 15, height / 2) : 0
        } catch(error) {
          
        }
      }
      ctx.restore()
      break
    case "R":
      ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")
      if (this.inventory.length >= 1) {
        try {
          !!this.weapon ? this.weapon.draw(width / 2 + 15, height / 2 + 15) : 0
        } catch(error) {
          
        }
      }

      // Eyes
      ellipse((width / 2) + 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
      break
    case "L":
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(-1, 1)
      ctx.translate(- width / 2, - height / 2)
      if (this.inventory.length >= 1) {
        try {
          !!this.weapon ? this.weapon.draw(width / 2 + 15, height / 2 + 15) : 0
          } catch(error) {
            
          }
      }
      ctx.restore()
      ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

      // Eyes
      ellipse((width / 2) - 10, (height / 2) - 10, 10, 10, "rgb(0, 0, 0)")
      break
    case "U":
      ctx.save()
      ctx.translate(width / 2 + 30, height / 2 + 15)
      ctx.rotate(- Math.PI / 2)
      ctx.translate(- width / 2, - height / 2)
      if (this.inventory.length >= 1) {
        try {
          !!this.weapon ? this.weapon.draw(width / 2 + 15, height / 2) : 0
        } catch(error) {
          
        }
      }
      ctx.restore()
      ellipse(width / 2, height / 2, 50, 50, "rgb(240, 181, 122)")

      // No eyes are shown in the up position
  }
  if (!!this.blockOn.useDesc) {
    ctx.roundRect(width / 2 - 100, height / 2 + 50, 200, 50, 10)
    ctx.fill()
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.font = "15px serif"
    ctx.textAlign = "center"
    ctx.fillText(this.blockOn.useDesc, width / 2, height / 2 + 75)
  }
  
  
  ctx.fillStyle = "rgb(0, 255, 0)"
  
  if (mouseIsDown && !keys.e) {
    try {
      this.weapon.use(this)
    } catch(error) {
      
    }
  }
}

Player.prototype.HUD = function() {
  ctx.fillStyle = "rgb(255, 255, 255)"
  ctx.fillRect(40, 45, 120, 60)
  ctx.fillStyle = "rgb(0, 200, 0)"
  ctx.fillRect(50, 50, this.animatedHealth * 10, 50)

  // ctx.fillStyle = "rgb(0, 0, 0)"
  // ctx.fillRect(1285, 530, 100, 100)
  
  ctx.save()
  if (this.health < this.animatedHealth) {
    this.animatedHealth -= 0.5
  } else {
    this.animatedHealth = this.health
  }
  
  ctx.translate(1365 - 100, 640 - 100)
  ctx.scale(0.1, 0.1)
  ctx.translate(-1 * p.x, -1 * p.y)
  curMap.draw(p, "Snippet View")
  ellipse(this.x, this.y, 50, 50, "rgb(255, 0, 0)")
  ctx.restore()
}

Player.prototype.move = function() {
  this.weapon = this.inventory[this.weaponIndex]
  if ((this.cords.x > 66 && this.cords.x < 138 && this.cords.y >= 1 && this.cords.y <= 12) || 
      (this.cords.x >= 92 && this.cords.x < 138 && this.cords.y >= 1 && this.cords.y <= 60)) {
    "Steel Field"
  } else if ((this.cords.x <= 66 && this.cords.x >= 0 && this.cords.y >= 0 && this.cords.y < 15) || 
            (this.cords.x >= 0 && this.cords.x < 91 && this.cords.y >= 15 && this.cords.y <= 60)) {
    this.area = "Chard Town"
  } else if ((this.cords.x >= 138 && this.cords.x < 270 && this.cords.y >= 11 && this.cords.y < 31) ||
            (this.cords.x >= 182 && this.cords.x < 270 && this.cords.y >= 1 && this.cords.y < 11)) {
    this.area = "Glacia Village"
  } else if (this.cords.x >= 158 && this.cords.y >= 32 && this.cords.x <= 269 && this.cords.y <= 50) {
    this.area = "Windy Wastelands"
		
    weather.wind.time += (1 / (66 + (2 / 3)))
    weather.wind.x = weather.wind.equation(weather.wind.time % 10)
    weather.wind.y = weather.wind.equation(weather.wind.time % 7)
    if (getBlockById(curMap.getBlock(Math.floor((this.x + weather.wind.x) / 75), Math.floor((this.y) / 75))).through) {
      this.x += weather.wind.x
    }
    if (getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + weather.wind.y) / 75))).through) {
      this.y += weather.wind.y
    }
  } else {
    this.area = "NONE"
  }
  
  if (!this.mapOn && this.canMove) {
    if (keys.w && this.stoppedDir != "U" && getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y - this.speed) / 75))).through) {
      this.y -= this.speed
      this.dir = "U"
      this.stoppedDir = ""
      this.moving = true
    } 
    
    if (keys.a && this.stoppedDir != "L" && getBlockById(curMap.getBlock(Math.floor((this.x - this.speed) / 75), Math.floor(this.y / 75))).through) {
      this.x -= this.speed
      this.dir = "L"
      this.stoppedDir = ""
      this.moving = true
    } 
    
    if (keys.s && this.stoppedDir != "D" && getBlockById(curMap.getBlock(Math.floor((this.x) / 75), Math.floor((this.y + this.speed) / 75))).through) {
      this.y += this.speed
      this.dir = "D"
      this.stoppedDir = ""
      this.moving = true
    }
    
    if (keys.d && this.stoppedDir != "R" && getBlockById(curMap.getBlock(Math.floor((this.x + this.speed) / 75), Math.floor(this.y / 75))).through) {
      this.x += this.speed
      this.dir = "R"
      this.stoppedDir = ""
      this.moving = true
      
    }
  }

  if (!keys.w && !keys.a && !keys.s && !keys.d) {
    this.moving = false
  }

  for (var i in bosses) {
    var b = bosses[i]
    var bDist = Math.hypot((this.x - b.x), (this.y - b.y))
    if (bDist <= 100 && mouseIsDown && !holding && this.hitCooldown <= 0 && b.hittable) {
      b.health -= this.weapon.damage
      this.hitCooldown = 0.25
      
      switch (b.name) {
        case "Darkened":
          b.tpHitCount ++
          break
      }
    }
  }

  if (this.buildMode) {
    if (keys.b) {
      // curMap.changeBlock(this.cords.x, this.cords.y, this.bb) // DEFAULT GONE
    }
  }

  if (Math.abs(curMap.temperature) > this.resistances.cold) {
    this.health -= (1 / 66.6667) * (Math.abs(curMap.temperature) - this.resistances.cold)
  }

  if (curMap.temperature > this.resistances.heat) {
    this.health -= (1 / 66.6667) * (curMap.temperature - this.resistances.heat)  
  }
}

Player.prototype.collide = function() {
  var b = curMap.getBlock(this.cords.x, this.cords.y)
  this.blockOn = getBlockById(b)
  
  for (var i in chests) {
    if (this.cords.x == chests[i].cords.x && this.cords.y == chests[i].cords.y && chests[i].map == curMap) {
      chests[i].open(this)
    }
  }

  for (var i in interactives) {
    if (this.cords.x == interactives[i].x && this.cords.y == interactives[i].y && interactives[i].map == curMap) {
      interactives[i].activate()
    }
  }

  if (this.doorCooldown <= 0) {
    if ((this.blockOn.name == "door" || this.blockOn.name == "hole") && keys.space) {
      fadeStarted = true
    }
    this.doorCooldown = 0.1
  }

  if (fadeStarted) {
    this.canMove = false
    ctx.fillStyle = "rgb(0, 0, 0, " + fadeOut +  ")"
    ctx.fillRect(0, 0, width, height)
    if ((areaSearchByCords(this.cords.x, this.cords.y) != 0) || (curMap != mainMap)) { // i have to go tho it is new time for chunky men!ok gluconate
      fadeOut += 0.05
    } else {
      fadeStarted = false
    }
    if (fadeOut >= 1) {
      if (curMap == mainMap) {
        this.cordSave.x = this.cords.x
        this.cordSave.y = this.cords.y
  
        var areaJoining = areaSearchByCords(this.cords.x, this.cords.y)
        
        this.x = areaJoining.enterX
        this.y = areaJoining.enterY
        curMap = areaJoining
      } else if (curMap != mainMap) {
        curMap = mainMap
        this.x = this.cordSave.x * 75
        this.y = this.cordSave.y * 75
        this.cordSave = {}
        saveGame()
      }
      fadeStarted = false
      fadeOut = 0
      this.canMove = true
    }
  }

  Player.prototype.hitEnemies = function() {
    // For monsters
    for (var i in monsters) {
      var m = monsters[i]
      var mDist = entityDistance(this, m)
      if (mDist <= 150 && mouseIsDown && this.hitCooldown <= 0) {
        this.hitCooldown = 0.25
        m.health -= this.weapon.damage
        eventsDelay(
          function() {
            m.isHit = true
          },
          function() {
            m.isHit = false
          },
          0.5
        )
      } 
    }
  }

  // Secret Entrances
  
  if (this.cords.x == 160 && this.cords.y == 4 && keys.q) {
    curMap = queensCastle
    this.x = 37.5
    this.y = 37.5
  }

  // Colliding with block properties
  this.speed = this.blockOn.speed * this.speedMultiplier
  this.health -= this.blockOn.dps / (66 + (2 / 3))

  if (this.moving) {
    playSound(this.blockOn.sound)
    for (var i in blocks) {
      if (blocks[i] != this.blockOn) {
        stopSound(blocks[i].sound)
      }
    }
  } else {
    stopSound(this.blockOn.sound)
  }
}

Player.prototype.displayMap = function() {
  if (this.mapOn) {
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, width, height)
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(mapScale, mapScale) 
    ctx.translate(width / -2, height / -2)
    ctx.translate(this.mapPan.x, this.mapPan.y)
    
    curMap.draw(p, "Map View")
    ellipse(this.x, this.y, 50, 50, "rgb(255, 0, 0)")
    for (var i in this.tracking) {
      var t = this.tracking[i]
      models.npcs.oldMan.x = t.x
      models.npcs.oldMan.y = t.y
      models.npcs.oldMan.draw()
      // ellipse(t.x, t.y, 75, 75, "rgb(0, 0, 0)"
    }
    
    if (!!this.questPoint) {
      var questPointParticles = new ParticleSystem(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 10, 35 / mapScale, 0, 255, 0)

      questPointParticles.create()
      questPointParticles.draw()
      ellipse(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 35 / mapScale, 35 / mapScale, "rgb(0, 250, 45)")
      ellipse(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 25 / mapScale, 25 / mapScale, "rgb(0, 200, 40)")
      ellipse(this.questPoint.x * 75 + 37.5, this.questPoint.y * 75 + 37.5, 10 / mapScale, 10 / mapScale, "rgb(0, 250, 45)")
      
    }
    
    ctx.restore()
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.roundRect(width / 2 - 60, height - 100, 50, 50, 5)
    ctx.fill()
    ctx.roundRect(width / 2 + 10, height - 100, 50, 50, 5)
    ctx.fill()
    ctx.roundRect(width / 2 - 50, height - 175, 100, 50, 5)
    ctx.fill()
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.font = "50px serif"
    ctx.textAlign = "center"
    ctx.fillText("+", width / 2 - 35, height - 62.5)
    ctx.fillText("-", width / 2 + 35, height - 62.5)

    if (keys.w) {
      this.mapPan.y += 25 / mapScale
    }

    if (keys.a) {
      this.mapPan.x += 25 / mapScale
    }

    if (keys.s) {
      this.mapPan.y -= 25 / mapScale
    }

    if (keys.d) {
      this.mapPan.x -= 25 / mapScale
    }

    if (mouseIsDown) {
      if (mouseY > height - 100 && mouseY < height - 50) {
        if (mouseX > width / 2 - 60 && mouseX < width / 2 - 10 && mapScale < 0.45) { // Zoom in button
          mapScale *= 1.03
        }
        
        if (mouseX > width / 2 + 10 && mouseX < width / 2 + 60 && mapScale > 0.13) { // Zoom out button
          mapScale /= 1.03
        }
      }
    }
  }
}

Player.prototype.displayInventory = function() {
  ctx.fillStyle = "rgba(50, 50, 255, 0.5)"
  ctx.fillRect(width / 8, height / 8, width * 3 / 4, height * 3 / 4)
  for (var i in this.inventory) {
    try {
      var item = this.inventory[i]
      var mouseItemDist = Math.hypot(mouseX - ((i % 8) * 100 + width / 8 + 100), mouseY - (height / 8 + 100 * (Math.floor(i / 8) + 1)))
      item.draw((i % 8) * 100 + width / 8 + 100, height / 8 + 100 * (Math.floor(i / 8) + 1))
      if (mouseItemDist < 50) {
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.textAlign = "center"
        ctx.font = "50px serif"
        ctx.fillText(item.name, width / 2, height / 2 + 120)
        ctx.font = "15px serif"
        ctx.fillText(item.desc + "\nDamage: " + item.damage, width / 2, height / 2 + 150)
        if (mouseIsDown) {
          this.weaponIndex = i
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
}

// function 

function Block(id, x, y, through) {
  this.id = id
  this.x = x
  this.y = y
  this.through = through
  this.playerOn = false
}

function BlockAlert(x, y, lines, map, type, item) {
  this.x = x
  this.y = y
  this.lines = lines
  this.map = map
  this.type = type
  this.item = item // items you need to see a specific message (key)

  this.showLines = false;

  this.finishCooldown = 1;
  this.lineNum = 0;
  this.textCooldown = 1
  this.nextIndicator = false // To indicate you can move on to next line in speech
  this.nextIndicatorY = 0 // Animation effect
  this.nextIndicatorDir = "D"
  this.hasItem = false;
  this.showKeyAlert = true;
  
}

BlockAlert.prototype.draw = function () {
  if (curMap == this.map) {
    if (this.type == "SIGN") {
      ctx.fillStyle = "rgb(51, 37, 25)"
      ctx.fillRect(this.x * 75 + 27.5, this.y * 75 + 10, 20, 65)
      ctx.fillStyle = "rgb(102, 74, 50)"
      ctx.fillRect(this.x * 75 + 5, this.y * 75 + 5, 65, 35)
    }
    
    if (this.lineNum == 0 && !this.showLines) {
      this.finishCooldown -= 1 / (66 + 2/3)
    }
    if (this.showLines && this.lineNum < this.lines.length) {
      this.textCooldown -= 1 / (66 + 2/3)
      if (this.textCooldown <= 0) {
        this.nextIndicator = true
        if (this.nextIndicatorDir == "D") {
          this.nextIndicatorY += 0.5
        } else  {
          this.nextIndicatorY -= 0.5
        }
        
        if (this.nextIndicatorY >= 10) {
          this.nextIndicatorDir = "U"
        }
    
        if (this.nextIndicatorY <= 0) {
          this.nextIndicatorDir = "D"
        }
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.60)"
      ctx.roundRect(width / 4, height * 3 / 4 - 10, width / 2, height / 4, 10)
      ctx.fill()
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.font = "15px serif"
      ctx.textBaseline = 'middle'
      ctx.font = "20px serif"
      ctx.textAlign = 'center'
      fillTextMultiLine(this.lines[this.lineNum], width / 2, (height * 3 / 4) + 60)
      if (this.nextIndicator == true) {
        triangle(width / 2 - 10, height - 60 + this.nextIndicatorY, width/2 + 10, height - 60 + this.nextIndicatorY, width/2, height - 40 + this.nextIndicatorY, "rgb(0, 0, 0)")	
      }
  
      if (this.textCooldown <= 0 && keys.space) {
        this.lineNum ++
        this.nextIndicator = false;
        this.textCooldown = 1
      }
  
      if (this.lineNum == this.lines.length && keys.space) {
        this.showLines = false
        this.lineNum = 0
      }
    }
  }
  
  if (p.cords.x == this.x && p.cords.y == this.y) {
    if (!this.showLines && curMap == this.map) {
      if (this.type == "SIGN") {
        ctx.fillStyle = "rgb(255, 255, 255)"
        ctx.roundRect(width / 2 - 75, height / 2 + 50, 150, 50, 10)
        ctx.fill()
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.font = "15px serif"
        ctx.textAlign = "center"
        ctx.fillText("Press space to read", width / 2, height / 2 + 75)		
      } else if (this.type == "KEY") {
        for (var i in p.inventory) {
          var item = p.inventory[i]
          if (item.name == this.item) {
            this.hasItem = true
          }
        }
        if (this.showKeyAlert) {
          if (!this.hasItem) {
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.roundRect(width / 2 - 80, height / 2 + 50, 160, 50, 10)
            ctx.fill()
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.font = "15px serif"
            ctx.textAlign = "center"
            ctx.fillText("Press space to examine", width / 2, height / 2 + 75)	
          } else {
            ctx.fillStyle = "rgb(255, 255, 255)"
            ctx.roundRect(width / 2 - 80, height / 2 + 50, 160, 50, 10)
            ctx.fill()
            ctx.fillStyle = "rgb(0, 0, 0)"
            ctx.font = "15px serif"
            ctx.textAlign = "center"
            ctx.fillText("Click to unlock", width / 2, height / 2 + 75)	
            
          }
        }

        if (mouseIsDown && this.hasItem) {
          this.showKeyAlert = false
        }
      }
    }

    if (this.type != "KEY" || (this.type == "KEY" && !this.hasItem)) {
      if (this.lineNum == 0 && !this.showLines && keys.space && this.lineNum != this.lines.length && this.finishCooldown <= 0) {
          this.showLines = true
          this.lineNum = 0
          this.finishCooldown = 1
      }
      if (keys.space && this.textCooldown <= 0) {
        this.lineNum ++;		
      }
    }
  }

}

var oldMan = new NPC(5*75, 1*75, "Old Man", johnHouse, "D", [
  "Huh? Who is there?",
  "Sorry, I can't see you very well.\nOld age has ruined my vision.",
  "Actually, could you do me a favor?\nFetch me my glasses, will you?",
  "One of the children near the big lake has taken them.",
  "Please go now."
], function(p) {
  // Original location of mike
  p.questPoint = {
    x: 27,
    y: 44
  }
}, "after")

// oldMan.glasses = true // Default false

var john = new NPC(70, 70, "John", johnHouse, "D", [
  "Hi!",
  "Do you want to hear my song?",
  "Well too bad, im gonna sing it anyway lol",
  "Here goes...",
  "I'm a barbie girl! In a barbie woooorrld!",
  "Oh wait sorry no no not that, say im a zuchinni",
  "shoud i turn on the stove for the biryani, or its already hot...?",
  "bought saari heh? huh? yeah microwave it. back",
  "(lyrics courtesy of diya)"
], function(p) {
  p.dir = "D"
}, 6)

var ron = new NPC(150, 300, "Ron", ronHouse, "D", [
  "*sigh*",
  "Hey, what are you looking at?",
  "...",
  "Yeah I know, my house is gross.\nNot sure why I chose my house to be stone.",
  "If I were to choose again. I would've made it wood.",
  "It's really expensive though.\n100 wood planks! In the end it isn't really worth it."
], function(p) {
  
}, 0)

var mike = new NPC(28 * 75, 44 * 75, "Mike", mainMap, "L", [
  "Hi.",
  "Who are you?",
  "...",
  "Oh, you're the new person in this village.\nNo wonder I didn't know who you were.",
  "...",
  "You're looking for a pair of glasses?",
  "I found one on the ground. But first, I need to you\nto do me a favor.",
  "My mom heard about you being new here\nand desperately wanted to meet you.",
  "Could you go talk to her? She's at home right now.",
  "Thanks."
], function(p) {
  // Location of Mike's Mom's house
  p.questPoint = {
    x: 51,
    y: 8
  }
}, "after")

var mikesMom = new NPC(300, 300, "Mike's Mom", mikeHouse, "R", [
  "Wait.",
  "Are you the new person on the island I've been\nlooking for?",
  "...",
  "Woah! I was searching everywhere to find\nout what you look like, and then you just\nshow up at my house!",
  "Every time somebody new arrives on this\nisland, I have to meet them.",
  "Anyway, It was super nice meeting you.",
  "See you later!"
], function(p) {
  mike.lines = [
    "Hi.",
    "Did you talk to my mom?",
    "...",
    "Thanks.",
    "...",
    "Oh yeah, here's the glasses. I don't know why\nyou need them, but whatever.",
    "Here's a pair I found on the ground. Hope it's what\nyou are looking for.",
    "...",
    "Fine, I guess I'll go back home in a little bit..."
  ]
  mike.action = function(p) {
    p.inventory.push(items.oldMansGlasses)
    // Location of the Old Man's house to give him the glasses
    p.questPoint = {
      x: 15,
      y: 8
    }
    mike.lines = [
      "Hi!",
      "Uh...",
      "Bye..."
    ]

    mike.actionLine = -2
  }
  mike.actionLine = "after"
  // Second location of mike to get the glasses
  p.questPoint = {
    x: 27,
    y: 44
  }
}, 0)

var wayne = new NPC(48 * 75, 55 * 75, "Wayne", mainMap, "D", [
  "Aye matey! What brings you to this foreign land?",
  "I'm Wayne, fearless sailor of the seven seas!",
  "Well that's what I've told everyone anyways.\nI actually just swim a lot.",
  "I'm sure you've heard of the mysterious cavern\nnear the big lake.",
  "...",
  "You haven't? Huh, I would have thought somebody\nhas told you about this.",
  "However, It hasn't been open for years,\nno one knows how to get in nor what's inside...",
  "By the way, what's your name, pirate?",
  "...",
  "Oh! In that case, have you talked to that old guy?",
  "He wanted to meet you and tell you something\napparently..."
], function(p, npc) {
  var old_man = npcs.searchByName("Old Man")
  if (old_man.glasses) {
    this.lines = [
      "Aye matey!",
      "The old man probably asked you to talk\nto me.",
      "You need to get off this island ASAP and go back to where\n" + badGuy + " is.",
      "I've given you a key to get out of this little village\nplace, but this island is much bigger\nthan you might think.",
      "This key should get you further east.\nFollow the trail, and you'll reach the next village.",
      "From there, you're going to want to talk to Smith The Blacksmith.\nHe'll get you geared up!",
      "Good luck, you're gonna need it.\nAnd don't worry! I'll be around."
    ]

    // Location of Smith the Blacksmith's house
    p.inventory.push(items.steelFieldKey)
    p.questPoint = {
      x: 130,
      y: 37
    }
  }
}, 0)

var smith = new NPC(4 * 75, 1 * 75, "Smith the Blacksmith", smithHouse, "D", [
  "Hey!",
  "Who are you??",
  "...",
  "Kay. I'm guessin' you here to get some cool stuff.",
  "I normally give a little somethin' to people who\ncome here, but I'm gonna need you to get me somethin' too.",
  "Could you fetch me a Heat Handle? I need it if you want me to help you.",
  "See ya!"
])

var rocky = new NPC(119 * 75, 17 * 75, "Rocky", mainMap, "R", [
  "Hi.",
  "Are you a traveler?",
  "...",
  "Nice.",
  "...",
  "So uh...",
  "Yyyyyyup.",
  "...",
  ".....",
  "ok...",
  "uh, bye."
], function(p, npc) {
  this.curPath = [
    [119, 3],
    [134, 3],
    [134, 9],
    function() {
      rocky.lines = [
        "I love lava."
      ]
    }
  ]
}, "after")

var kori = new NPC(178 * 75, 13 * 75, "Kori", mainMap, "L", [
  "Hi.",
  "Just watering my, uh, trees.",
  "By the way, I've never seen you before.",
  "There aren't a whole lot of people in Glacia Village\nso we all really know everybody.",
  "Where are you coming from, then?",
  "...",
  "Huh. That's weird.",
  "Anyways, I'll see you later!"
])

var isa = new NPC(2 * 75 + 75, 7 * 75, "Isa", glaciaCenter, "R", [
  "Hello, welcome to the Glacia center.",
  "There's not much to do here though...",
  "Hey, you don't look like you're from around here.",
  "What do you need?",
  "...",
  "Masters? Locked away? Haha!",
  "I don't get it.",
  "...",
  "Wait, you're not joking?",
  "Oh, uh, I can't help you then. Maybe ask Lonzo.\nHe knows a lot of weird, uh, stuff.",
  "Everybody thinks he's crazy, but uh, I would ask him.\nSee you later."
])

var lonzo = new NPC(3 * 75 + 37.5, 1 * 75 + 37.5, "Lonzo", lonzoHouse, "D", [
  "*cough",
  "Hello. Who might you be?",
  "...",
  "nice.",
  "What do you need?",
  "...",
  "Elemental masters? Ah yes, yes, I\nkeep telling everybody about them, but nobody believes\nme!",
  "It makes me sag.",
  "Sad, I mean.",
  "Anyway, the master of wind is locked around this\narea somewhere.",
  "I know that from the time I snuck into the\nqueen's lair to use the toilet. But\nthat's a whole different story.",
  "You should ask the queen, but she...",
  "C&BP$wbo9#&W*CN#O(B(BVO!!!",
  "...she doesn't make much contact with the outside world, so\nher lair might be tough to get into.",
  "I think I fell down on my way out of it so I\ndon't remember where it is. But it's somewhere\nto the east, and...",
  "zzz",
  "zzzzzzzzzzz..."
])

var guardAlfred = new NPC(19 * 75 + 37.5, 7 * 75 + 37.5, "Castle Guard Alfred", queensCastle, "D", [
  "Hello. Welcome to the High Floor.",
  "Are you looking to meet with the Queen?",
  "...",
  "Ah yes. She's been waiting someone.\nShe made a wall around her throne that APPARENTLY\nopens only to this person.",
  "She's been hiding in there for a while now.\nHopefully, you're the person she's waiting for!",
  "The queen instructed us to tell visitors to stand on the white\nblock in front of her throne.",
  "So far, no visitor's prescence opened the door,\nso we are starting to lose hope.",
  "Anyway, you may now proceed."
])

var queenAlaska = new NPC(42 * 75 + 37.5, 3 * 75 + 37.5, "Queen Alaska", queensCastle, "L", [
  "Welcome! I am Queen Alaska, but you can just\ncall me Alaska.",
  "I see your prescence triggered my special\nwall, which means you are the person I'm supposed to meet.",
  "So, is it true? Did you really venture into the Confounded Cave\nof Chard Town and defeat Darkened?",
  "...",
  "That's incredible. You know, another Elemental Master was\ncaptured here, in Glacia.",
  "Unfortunately, almost nobody knows that the Elemental Masters exist anymore!",
  "Anyway, legend says that it can be found\nsomewhere in Glacia. However, many past Queens have\nfailed to locate it.",
  "This leads me to believe that it's underground\nsomewhere. Specifically underneath this castle.",
  "However, even if you do find where the prison is, it could be\nextremely dangerous to enter!",
  "Long ago, when the Elemental Masters were corrupted and\nrunning free, this specific one was known for its high speed.",
  "While Darkened had its magical spear to bring it power\n(which " + badGuy + " gave it), this Master, known as Stormed\nwould use a powerful sword.",
  "Its strong control over wind and weather meant that\nthe strong people of Glacia were be best suited to\ncapture this beast.",
  "The leaders of this island's regions, like me,\nhave attempted to locate and take down these corrupted masters.",
  "However, the borders between the regions made this\nvery difficult. So, we need you to take the Masters out one at a time.",
  badGuy + " provided the Masters with weapons in the\norder of the Sacred Star.",
  "So, by looking at the connection points,\nwe believe you should defeat the Masters in the\nfollowing order: Night, Wind, Sea, Land and Day.",
	"Although I wish that I could tell you where this prison is,\nI'm going to have to leave it up to you.",
  "However, we suspect it could be somewhere in the perilous Windy Wastelands.\nIf you do go there, please be extremely careful.",
	"Good luck my friend! You're definitely going to need it."
], function(p) {
  lonzo.x = 252 * 75 + 37.5
  lonzo.y = 21 * 75 + 37.5
  lonzo.map = mainMap
  lonzo.lines = [
    "Hey there again!",
    "I've been looking for you. Nice job making\nit inside the queen's castle!",
    "Did you...",
    "B$(8N(#c7b9BC@7@%B??",
    "...sorry. Did you talk to her?",
    "...",
    "Nice! Anyway, she announced to the village that\nyou would be venturing into the Windy Wastelands.",
    "I found the key there a while ago buried in the snow.\nHowever, the Wastelands are incredibly dangerous, so I never\nhad any reason to go there.",
    "The queen's been telling me to keep it safe, and now I\nknow why!",
    "Anyway, here you goat.",
    "Go*."
  ]
  lonzo.action = function(p) {
    p.inventory.push(items.windyWastelandKey)
  }
  lonzo.actionLine = "after"
}, "after")

var fee = new NPC(46 * 75 + 37.5, 16 * 75 + 37.5, "Fee", galeCave, "D", [
  "Lemme guess, you came to talk to me for a word of advice.",
  "I always just go with the flow...",
  "Also, have you seen Fi and Fo? They're in this\ncave somewhere..."
])

var fi = new NPC(4 * 75 + 37.5, 16 * 75 + 37.5, "Fi", galeCave, "D", [
  "Hey pal, want a word of advice?",
  "If you ever hit rock bottom, the only way is up.",
  "By the way, where'd fee and fo go?"
])

var fo = new NPC(5 * 75 + 37.5, 9 * 75 + 37.5, "Fo", galeCave, "D", [
  "This cave has been dark for years...",
  "In the meantime, I've made up a song.",
  "♪ Red Orange Yellow Blue, Indigo and Violet Too! ♪",
  "Am I forgetting something?",
  "...",
  "Anyway, I've been looking for Fee and Fi, but I can't see\nanything!"
])

var fum = new NPC(37 * 75 + 37.5, 2 * 75 + 37.5, "Fum", galeCave, "D", [
  "HEY YOU! WHAT ARE YOU DOING?",
  "Hah, I'm just messin' with you.", "When things get heated, always stay calm."
])

var mum = new NPC(42 * 75 + 37.5, 2 * 75 + 37.5, "mum", galeCave, "D", [
  "HEY YOU! WHAT ARE YOU DOING?",
  "Hah, I'm just messin' with you.", "When things get heated, always stay calm.", "chunky man"
]) //TEST NPC

var shopkeeperMuhammad = new NPC(58 * 75, 33 * 75 + 37.5, "Shopkeeper Muhammad", galeCave, "L", [
  "Hello!",
  "Would you like to purchase some auras?\nWe use all-natural ingredients."
], function() {
  ShopMenu.open([
    {item: items.auraOfWarmth, cost: 0, amount: 2},
  ])
}, "after")

var npcs = [oldMan, john, ron, mike, mikesMom, wayne, smith, rocky, kori, isa, lonzo, guardAlfred, queenAlaska, fee, fi, fo, mum, fum, shopkeeperMuhammad]

npcs.searchByName = function(name) {
  for (var i in this) {
    var npc = this[i]
    if (npc.name == name) {
      return npc
    }
  }
}

if (!!save) {
  for (var i in save.npcActions) {
    var actn = save.npcActions[i].action
    var nm = save.npcActions[i].name
    npcs.searchByName(nm).action = eval("(" + actn + ")")
  }
}

// for (var i in save.npcs) {
//   var n = save.npcs[i].name
//   console.log(n)
//   npcs.searchByName(n) = new NPC(n.x, n.y, n.name, n.map, n.dir, n.lines, n.action, n.actionLine)
//   // for (var j in npcs) {
//   //   if (npcs[j].name == n) {
//   //     npcs[j] = 
//   //   }
//   // }
  
// }

// Main Map

var t116_31 = new Toggle(mainMap, 116, 31, function() {
  curMap.changeBlock(121, 27, ")")
}, function() {
  curMap.changeBlock(121, 27, "(")
})

var t102_3 = new Toggle(mainMap, 102, 3, function() {
  curMap.changeBlock(121, 28, ")")
  this.playCutscene(110 * 75, 23 * 75)
  //var timeout = setTimeout(this.stopCutscene, 1000)
}, function() {
  curMap.changeBlock(121, 28, "(")
})

var t77_5 = new Toggle(mainMap, 77, 5, function() {
  curMap.changeBlock(121, 29, ")")
}, function() {
  curMap.changeBlock(121, 29, "(")
})

var t97_11 = new Toggle(mainMap, 97, 11, function() {
  curMap.changeBlock(121, 30, ")")
}, function() {
  curMap.changeBlock(121, 30, "(")
})

// Confounded Cave

var t5_18 = new Toggle(confoundedCave, 5, 18, function() {
  curMap.changeBlock(9, 18, "S")
  curMap.changeBlock(10, 18, "_")
  curMap.changeBlock(9, 19, "_")
  curMap.changeBlock(10, 19, "S")
}, function() {
  curMap.changeBlock(9, 18, "_")
  curMap.changeBlock(10, 18, "S")
  curMap.changeBlock(9, 19, "S")
  curMap.changeBlock(10, 19, "_")
})

var t5_19 = new Toggle(confoundedCave, 5, 19, function() {
  curMap.changeBlock(9, 19, "S")
  curMap.changeBlock(10, 19, "_")
  curMap.changeBlock(9, 20, "_")
  curMap.changeBlock(10, 20, "S")
}, function() {
  curMap.changeBlock(9, 19, "_")
  curMap.changeBlock(10, 19, "S")
  curMap.changeBlock(9, 20, "S")
  curMap.changeBlock(10, 20, "_")
})

var t6_19 = new Toggle(confoundedCave, 6, 19, function() {
  curMap.changeBlock(10, 19, "S")
  curMap.changeBlock(11, 19, "_")
  curMap.changeBlock(10, 20, "_")
  curMap.changeBlock(11, 20, "S")
}, function() {
  curMap.changeBlock(10, 19, "_")
  curMap.changeBlock(11, 19, "S")
  curMap.changeBlock(10, 20, "S")
  curMap.changeBlock(11, 20, "_")
})

var t6_12 = new Toggle(confoundedCave, 6, 12, function() {
  curMap.changeBlock(11, 22, ")")
  curMap.changeBlock(5, 14, "_")
  curMap.changeBlock(11, 16, ")")
  
}, function() {
  curMap.changeBlock(11, 22, "(")
  curMap.changeBlock(11, 16, "(")
  curMap.changeBlock(5, 14, "S")
})

var t14_12 = new Toggle(confoundedCave, 14, 12, function() {
  curMap.changeBlock(39, 22, ")")
}, function() {
  curMap.changeBlock(39, 22, "(")
})

var t15_8 = new Toggle(confoundedCave, 15, 8, function() {
  curMap.changeBlock(20, 0, ")")
}, function() {
  curMap.changeBlock(20, 0, "(")
})

// Queen's Castle

var t2_2 = new Toggle(queensCastle, 2, 2, function() {
  curMap.changeBlock(1, 3, "!")
  curMap.changeBlock(3, 1, "~")
}, function() {
  curMap.changeBlock(1, 3, "~")
  curMap.changeBlock(3, 1, "!")
})

var t2_4 = new Toggle(queensCastle, 2, 4, function() {
  curMap.changeBlock(1, 3, "~")
  curMap.changeBlock(3, 5, "!")
}, function() {
  curMap.changeBlock(1, 3, "!")
  curMap.changeBlock(3, 5, "~")
})

var t4_4 = new Toggle(queensCastle, 4, 4, function() {
  curMap.changeBlock(1, 3, "~")
  curMap.changeBlock(3, 5, "~")
  curMap.changeBlock(5, 3, "!")
}, function() {
  curMap.changeBlock(1, 3, "!")
  curMap.changeBlock(3, 5, "!")
  curMap.changeBlock(5, 3, "~")
})

var t4_2 = new Toggle(queensCastle, 4, 2, function() {
  curMap.changeBlock(1, 3, "!")
  curMap.changeBlock(5, 3, "!")
}, function() {
  curMap.changeBlock(1, 3, "~")
  curMap.changeBlock(5, 3, "~")
})


// Gale Cave
var mt49_19 = new MultiToggle(galeCave, 49, 19, 50, 19, ["!", "~", "_", ",", "z"]) // Fee toggle

var mt2_18 = new MultiToggle(galeCave, 2, 18, 1, 18, ["!", "~", "_", ",", "z"]) // Fi toggle

var mt11_10 = new MultiToggle(galeCave, 11, 10, 12, 10, ["!", "~", "_", ",", "z"]) // Fo toggle

var mt40_3 = new MultiToggle(galeCave, 40, 3, 41, 3, ["!", "~", "_", ",", "z"]) // Fum toggle

var t27_26 = new Toggle(galeCave, 27, 26, function() {
  curMap.changeBlock(18, 26, "_")
}, function() {
  curMap.changeBlock(18, 26, "S")
})

var t27_25 = new Toggle(galeCave, 27, 25, function() {
  curMap.changeBlock(18, 25, "_")
}, function() {
  curMap.changeBlock(18, 25, "S")
})

var t27_24 = new Toggle(galeCave, 27, 24, function() {
  curMap.changeBlock(18, 24, "_")
}, function() {
  curMap.changeBlock(18, 24, "S")
})

var t27_23 = new Toggle(galeCave, 27, 23, function() {
  curMap.changeBlock(18, 23, "_")
}, function() {
  curMap.changeBlock(18, 23, "S")
})

var t19_26 = new Toggle(galeCave, 19, 26, function() {}, function() {})

var t19_24 = new Toggle(galeCave, 19, 24, function() {}, function() {})

// The Cryo Underground

var t13_6 = new Toggle(cryoUnderground, 13, 6, function() {
  curMap.changeBlock(15, 4, ')')
  curMap.changeBlock(15, 5, ')')
  curMap.changeBlock(11, 5, '(')
  curMap.changeBlock(12, 5, '(')
  curMap.changeBlock(14, 6, '(')
}, function() {
  curMap.changeBlock(15, 4, '(')
  curMap.changeBlock(15, 5, '(')
  curMap.changeBlock(11, 5, ')')
  curMap.changeBlock(12, 5, ')')
  curMap.changeBlock(14, 6, ')')
})

var t21_4 = new Toggle(cryoUnderground, 21, 4, function() {
  curMap.changeBlock(17, 6, ')')
}, function() {
  curMap.changeBlock(17, 6, '(')
})

var interactives = [
  t116_31,
  t102_3,
  t77_5,
  t97_11,
  t5_18,
  t5_19,
  t6_19,
  t6_12,
  t14_12,
  t15_8,
  t2_2,
  t2_4,
  t4_4,
  t4_2,
	mt49_19,
	mt2_18,
	mt11_10,
	mt40_3,
  t27_26,
  t27_25,
  t27_24,
  t27_23,
  t19_26,
  t19_24,
  t13_6,
  t21_4
]

var models = {
  bosses: {
    darkened: new Darkened(darkenedRoom, width / 2, height / 2)
  },
  npcs: {
    oldMan: new NPC(0, 0, "Old Man", null, null, null, null)
  }
}

var p = new Player(56 * 75, 33 * 75, npcs) // default x = width / 2, y = height / 2 helloooh

var c121_31 = new Chest(mainMap, 121, 31, [
  items.heatHandle
])

var c92_37 = new Chest(mainMap, 92, 37, [
  items.confoundedCaveKey
])

var c14_3 = new Chest(confoundedCave, 14, 3, [
  new Item("Puzzle Key", 0, function(x, y) {
    ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
  }, function(p) {
      
    if (p.cords.x == 28 && p.cords.y == 11 && curMap == confoundedCave) {
      curMap.changeBlock(29, 11, '_')
      
      for (var i in p.inventory) {
        var item = p.inventory[i]
        if (item.name == this.name) {
          p.inventory.splice(i, 1)
        }
      }
    }
  })
])

var c10_1 = new Chest(cryoUnderground, 10, 1, [
  new Item("Puzzle Key", 0, function(x, y) {
    ellipse(x, y, 10, 10, "rgb(0, 0, 0)")
  }, function(p) {
    if (p.cords.x == 1 && p.cords.y == 14 && curMap == cryoUnderground) {
      curMap.changeBlock(1, 15, 'z')
      
      for (var i in p.inventory) {
        var item = p.inventory[i]
        if (item.name == this.name) {
          p.inventory.splice(i, 1)
        }
      }
    }
  })
])

var chests = [
  // Main Map
  c121_31, // Heat Handle
  c92_37, // Confounded Cave Key
  
  // Confounded Cave
  c14_3, // Puzzle Key

  // Cryo Underground
  c10_1,
]

var opacity = 1

// Darkened phase 2 cutscene variables
var spearSpeed = 1
var darkenedColor = 0
var spearSize = 0 // changes triangle into circle
var shootTriangle = 0
var fade = 0

function saveGame() {
  var SAVING = {
    player: {
      x: p.x,
      y: p.y,
      health: p.health,
      map: curMap.name,
      inventory: []
    },
    npcs: [],
    npcActions: [],
    maps: [],
    lighting: lighting
  }

  SAVING.maps.push({
    name: "Main Map",
    changes: mainMap.changes
  })

  for (var i in areas) {
    var a = areas[i]
    SAVING.maps.push({
      name: a.name,
      changes: a.changes
    })
  }

  for (var j in p.inventory) {
    var i = p.inventory[j]
    SAVING.player.inventory.push(i)
  }

  for (var i in npcs) {
    var n = npcs[i]
    SAVING.npcs.push(npcs[i])
    if (!!npcs[i].action) {
      SAVING.npcActions.push({name: npcs[i].name, action: npcs[i].action.toString()})
    }//
  }
  
  localStorage.setItem('save', JSON.stringify(SAVING))
  console.log("Saved game!")
}

function clearSave() {
  localStorage.setItem('save', null)
}

// Turns off saves
// clearSave() // DEFAULT GONE

var gameInterval = setInterval(function() {
  elapsed ++
  ctx.fillStyle = "rgb(0, 0, 0)"
  ctx.fillRect(0, 0, width, height)

  for (var i in eventDelays) {
    eventDelays[i].timer -= 1 / (66 + 2 / 3)
    var e = eventDelays[i]
    e.f1()
    if (e.timer > 0) {
      e.f1()
    } else {
      e.f2()
    }
  }
  
  if (scene == "GAME") {
    // if (mouseIsDown && curMap != darkenedRoom) {
    //   scene = "DARKENED BOSS CUTSCENE"
    //   curMap = darkenedRoom
    // }

    
    
    ctx.save()
    ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
    curMap.draw(p, "Player View")
    if (!!curMap.solve) {
      curMap.solve()
    }
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.font = "20px serif"
    ctx.fillText(p.cords.x + " , " + p.cords.y + " , " + p.canMove, p.x, p.y - 50)
    
  
    if (mouseIsDown) {
      playing = true
    }
		
    // Music
    if (playing) {
      if (curMap == mainMap) {
        if (p.area == "Chard Town") {
          // playMusic("Chard")
        } else if (p.area == "Steel Field") {
          // playMusic("Steel Field")
        } else if (p.area == "Glacia Village") {
          // playMusic("Glacia Village")
        } else if (p.area == "Windy Wastelands") {
					// playSound("Speedy Snow Walking")
          // playMusic("Windy Wastelands")
				} else if (p.area == "NONE") {
          playMusic("Adventure")
        }
      } else if (curMap == confoundedCave) {
        playMusic("Puzzle")
      } else if (curMap == queensCastle) {
				playMusic("Queen's Castle")
			} else if (curMap == galeCave) {
        if (lighting < 1000) {
          playMusic("Gale Cave Dark")
        } else {
          playMusic("Gale Cave Light")
        }
      }
    }
    
    for (var i in npcs) {
      if (!!npcs[i].map) {
        if (curMap.name == npcs[i].map.name) {
          
          npcs[i].draw()
        }
      }
    }
  
    for (var i in chests) {
      if (curMap == chests[i].map) {
        chests[i].draw()
      }
    }

    for (var i in alerts) {
      if (curMap == alerts[i].map) {
        alerts[i].draw()
      }
    }
  
    for (var i in interactives) {
      if (curMap == interactives[i].map) {
        interactives[i].draw()
      }
    }

    for (var i in bossDoors) {
      var b = bossDoors[i]
      if (keys.space && p.cords.x == b.x && p.cords.y == b.y) {
        b.enterFunction(p)
      }
    }
  
    for (var i in monsters) {
      if (curMap == monsters[i].map && !monsters[i].dead) {
        monsters[i].draw(p)
      }
    }
  
    for (var i in bosses) {
      if (curMap == bosses[i].map) {
        curBoss = bosses[i]
        curBoss.draw()
      }
    }
    
    ctx.restore()

    if (curBoss.health <= 0 && curMap == darkenedRoom) {
      ctx.fillStyle = "rgb(0, 0, 0, " + fade + ")"
      ctx.fillRect(0, 0, width, height)
      cutsceneFrame = 0
      fade += 0.005
      if (fade >= 1) {
        scene = "DARKENED BOSS CUTSCENE DEFEATED"
        fade = 0
      }
    }
  
    
  
    for (var i in bosses) {
      if (curMap == bosses[i].map) {
        bosses[i].update()
        bosses[i].healthBar()
      }
    }

    // if (curBoss != 0) {
    //   curBoss.update()
    //   curBoss.healthBar()
    // }
    
    p.draw()

		
		
    ctx.save()
    ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
    curMap.drawNextLayer(p)
    ctx.restore()

    // Play toggle cutscenes
    for (var i in interactives) {
      if (interactives[i].constructor.name == "Toggle") {
        var inter = interactives[i]
        if (inter.cutscene != null) {
          inter.toggleCutscene(inter.cutscene.x, inter.cutscene.y)
        }
      }
    }

    // Display lighting pixels
    if (lighting < 2500) {
      for (var i = 0; i < (width / lightingSize) + 1; i ++) {
        for (var j = 0; j < (height / lightingSize) + 1; j ++) {
          var lightingCalc = Math.hypot((i * lightingSize - lightingSize / 2) - width / 2, (j * lightingSize - lightingSize / 2) - height / 2) / lighting
          ctx.fillStyle = "rgba(0, 0, 0, " + lightingCalc + ")"
          ctx.fillRect((i - 1) * lightingSize, (j - 1) * lightingSize, lightingSize * 2, lightingSize * 2)
        }
      }
    }

		
    if (keys.e) {
      p.displayInventory()
    }
    
    p.move()
    p.collide()
    p.HUD()
    p.displayMap()
    p.hitEnemies()

    // DEFAULT ON
    for (var i in regions) {
      regions[i].update()
    }

    if (keys.slash) {
      if (!bossfight) {
        saveGame()
        SAVE_MENU = true
      }
    }

    if (SAVE_MENU) {
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillRect(width - 200, 0, 200, 100)
      ctx.fillStyle = "rgb(255, 255, 255)"
      ctx.fillText("Game saved.", width - 100, 50)
      var SAVE_MENU_TIMER = setTimeout(function() {
        SAVE_MENU = false
      }, 1500)
    }

		for (var i = 0; i < alerts.length; i ++) {
      alerts[i].draw()
    }
		// NPCS speech bubbles (problem?)
		for (var i in npcs) {
      if (!!npcs[i].map) {
        if (curMap.name == npcs[i].map.name) {
          npcs[i].talk(p, npcs)
        }
      }
    }
		
    if (p.health <= 0) {
      ctx.fillStyle = "rgba(0, 0, 0, " + fade + ")"
      ctx.fillRect(0, 0, width, height)
      fade += 0.01
      if (fade >= 1) {
        fade = 0
        scene = "DEATH"
      }
    }

    
    
    
    if (keys.shift) {
      // Screen.fadeOut(255, 255, 255, 0.01)
      p.mapPan.x = (- p.x + width / 2)
      p.mapPan.y = (- p.y + height / 2)
      if (p.mapSwitchTimer <= 0) {
        if (!p.mapOn) {
          p.mapOn = true
        } else {
          p.mapOn = false
        }
        p.mapSwitchTimer = 0.3
      }
    }

    if (CUR_SHOP_MENU != 0) {
      ShopMenu(CUR_SHOP_MENU)
    }
    
  } else if (scene == "DARKENED BOSS CUTSCENE") {
    playMusic("Boss Cutscene")
    cutsceneFrame ++
    
    // ctx.fillStyle = "rgb(255, 50, 100)"
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.scale(darkenedScale, darkenedScale)
    ctx.translate(width / -2, height / -2)
    if (cutsceneFrame >= 360) {
      if (darkenedScale > 2) {
        ctx.translate(Math.random() * 10, Math.random() * 10)
      }
      darkenedRoom.draw(p, "Player View")
    //   if (darkenedScale <= 2) {
    //     darkenedScale += 0.03
    //   }
      if (darkenedScale <= 2) {
        darkenedScale += 0.05
      }
    }
    models.bosses.darkened.draw()
    ctx.restore()
    if (darkenedScale > 2) {
      ctx.fillStyle = "rgb(150, 0, 0)"
      ctx.font = "100px serif"
      ctx.textAlign = "center"
      ctx.fillText(models.bosses.darkened.name, width / 2, height / 4)
    }
    
    if (cutsceneFrame < 360) {
      opacity -= 0.005
      ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")"
      ctx.fillRect(width / 4, height / 4, width / 2, height / 2)
    }

    if (cutsceneFrame >= 535) {
      scene = "GAME"
      cutsceneFrame = 0
      darkenedScale = 1
    }
  } else if (scene == "DARKENED BOSS CUTSCENE PHASE 2") {
    if (cutsceneFrame == 0) {
      darkenedScale = 1.5
    }
    ctx.save()
    
    if (cutsceneFrame > 100 && cutsceneFrame < 575) {
      ctx.translate(Math.random() * 20, Math.random() * 10)
      darkenedScale -= 0.001
    }
    
    ctx.translate(width / 2, height / 2)
    ctx.scale(darkenedScale, darkenedScale)
    ctx.translate(width / -2, height / -2)
    
    ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
    darkenedRoom.draw(p, "Player View")
    
    ctx.translate(-1 * ((-1 * p.x) + (width / 2)), -1 * ((-1 * p.y) + (height / 2)))
    
    
    // Body
    ellipse(width/2, height/2, 150, 150, "rgb(0, 0, 0)")
  
    // Eyes
    ellipse(width/2 - 30, height/2 - 35, 30, 30, "rgb(" + (255 - (darkenedColor / 2)) + ", 50, 100)")
    ellipse(width/2 + 30, height/2 - 35, 30, 30, "rgb(" + (255 - (darkenedColor / 2)) + ", 50, 100)")
    
  
    // Arms
    ellipse(width/2 + 75, height/2, 40, 40, "rgb(" + (125 - darkenedColor) + ", 25, 50)")
    ellipse(width/2 - 75, height/2, 40, 40, "rgb(" + (125 - darkenedColor) + ", 25, 50)")
    
    
    if (cutsceneFrame > 100 && cutsceneFrame < 575 && spearSpeed > 0) {
      spearSpeed += 1 - (cutsceneFrame / 1000)
      darkenedColor ++
      if (spearSize < 50) 
      spearSize += 0.15
    }
    
    ctx.translate(width/2 + 75, height/2)
    ctx.rotate(- Math.PI / 15 + (spearSpeed / 5))
    ctx.translate(-1 * (width/2 + 75), -1 * height/2)


    // Spear thing
    ctx.fillStyle = "rgb(" + (50 - darkenedColor) + ", 50, 50)"
    
    
    ctx.fillRect(width/2 + 60, height/2 - 80, 16, 180) // Center x = 63
    if (cutsceneFrame > 700) {
      ellipse(width/2 + 68, height/2 - 90 - shootTriangle, 30, 30, "rgb(255 , 50, 100)")
    }
    ellipse(width/2 + 68, height/2 - 90, spearSize, spearSize, "rgb(" + (255 - darkenedColor) + ", 50, 100)")
    ctx.beginPath()
    
    
    
    
    if (cutsceneFrame < 700) {
      triangle(width/2 + 50, height/2 - 80, width/2 + 68, height/2 - 115, width/2 + 86, height/2 - 80, "rgb(" + (255 - darkenedColor) + ", 50, 100)")
    }
    
    if (cutsceneFrame > 700) {
      shootTriangle += 20
    }
  
    if (shootTriangle > 500) {
      shootTriangle = 0
      
    }

    if (cutsceneFrame > 900) {
      fade += 0.5
    }

    if (cutsceneFrame >= 1100) {
      scene = "GAME"
      fade = 0
      cutsceneFrame = 0
      darkenedScale = 0
    }
    
    ctx.restore()
    ctx.fillStyle = "rgb(0, 0, 0, " + fade / 10 + ")"
    ctx.fillRect(0, 0, width, height)
    cutsceneFrame ++
  } else if (scene == "DARKENED BOSS CUTSCENE DEFEATED") {
    //cutsceneFrame = 1100
    //console.log(cutsceneFrame)
    cutsceneFrame ++
    
    ctx.save()
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, 0, width, height) 
  
    if (cutsceneFrame > 100 && cutsceneFrame < 575) {
      darkenedScale += 0.001
      if (spearSize > 0) {
        spearSize -= 1
      } else {
        spearSize = 0
      }
      darkenedColor += 0.3
    }

    if (spearSize <= 0) {
      spearSize = 0
    }

    
  
    if (cutsceneFrame > 100 && cutsceneFrame < 750) {
      ctx.translate(Math.random() * 5, Math.random() * 5)
    }
  
    if (cutsceneFrame > 575 && cutsceneFrame < 800) {
      if (fade < 1) {
        fade += 0.01
      }	
    }
  
    if (cutsceneFrame > 800) {
      scene = "GAME"
      fade = 0
      curMap = mainMap
      p.x = 6 * 75
      p.y = 54 * 75
      p.inventory.push(items.spearOfTheDarkened)
      wayne.x = 6 * 75 + mainMap.blockSize / 2 // Makes Wayne centered
      wayne.y = 46 * 75 + mainMap.blockSize / 2
      lighting = 2500
      wayne.actionLine = 2
      wayne.action = function(p) {
        this.curPath = [
          [6, 32],
          [8, 32],
          [9, 31],
          [9, 19],
          [7, 17],
          [7, 11],
          [10, 8],
          [12, 8],
          function () {
            wayne.lines = [
              "ayo"
            ]
            wayne.action = function() {
              
            }
          }
        ]
      }
      wayne.lines = [
        "Aye matey!", 
        "It looks like you defeated whatever treacherous thing was inside\nthat cave, huh?", 
        "The old man wanted to talk to you about something.\nHe should be outside his house."
      ]
      
      oldMan.x = 19 * 75 + mainMap.blockSize / 2
      oldMan.y = 8 * 75 + mainMap.blockSize / 2
      oldMan.map = mainMap
      oldMan.lines = [
        "You're back! Wait...",
        "What's this you're holding?",
        "...",
        "The Spear of the Darkened??? How did you get that?",
        "Did you really defeat the Darkened?",
        "...",
        "Wow!! I was planning on telling you more first, but\nyou've already gone and done it!",
        "I still have a lot to tell you though.\nFollow me and I'll tell you more...",
        "Here's a special tracker in case you get lost.\nYou should be able to see me on your map with it!"
      ]
      oldMan.action = function(p) {
        p.tracking.push(this)
        oldMan.lines = [
          "Follow me..."
        ]
        this.curPath = [
          [20, 9],
          [44, 9],
          [44, 59],
          [40, 59],
          function() {
            oldMan.lines = [
              "Now I will tell you about " + badGuy + "'s history.'"
            ]
            oldMan.action = function(p) {
              cutsceneFrame = 0
              scene = "SACRED STAR CUTSCENE"
            }
            oldMan.actionLine = "after"
            // alert(this.lines[0])
          }
        ]
      }
      oldMan.actionLine = "after"
      
      wayne.talkedTo = false
      cutsceneFrame = 0
      // if (fade > 0) {
      // 	fade -= 0.01
      // }
  
    }
  
    if (cutsceneFrame > 750) {
      spearSpeed += 0.1
    }
  
    
    // old.draw()
    ctx.translate(width / 2, height / 2)
    ctx.scale(darkenedScale, darkenedScale)
    ctx.translate(width / -2, height / -2)

    ctx.translate((-1 * p.x) + (width / 2), (-1 * p.y) + (height / 2))
    darkenedRoom.draw(p, "Player View")
    ctx.translate(-1 * ((-1 * p.x) + (width / 2)), -1 * ((-1 * p.y) + (height / 2)))
  
  
    
    if (cutsceneFrame < 750) {
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
    
  
    if (cutsceneFrame > 100  && cutsceneFrame < 750 && spearSpeed > 0) {
      spearSpeed += 0.01 + (cutsceneFrame / 1000)
    
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
    
    // if (cutsceneFrame >= 1200) {
      
      
    // }
    // darkenedRoom.draw(p, "Player View")
  } else if (scene == "SACRED STAR CUTSCENE") {
    cutsceneFrame ++
    playMusic("Sacred Star Cutscene")
    if (cutsceneFrame >= 0 && cutsceneFrame < 700) {
      ctx.fillStyle = "rgb(255, 255, 255)"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(images.sacredStar, width / 2 - width/6 - cutsceneFrame / 30, height / 2 - height * 3/8 - cutsceneFrame / 10, width/3 + cutsceneFrame / 15, width/3 + cutsceneFrame / 15)

      if (cutsceneFrame < 350) {
        cutsceneText = "This island is made up of five core elements. The elements make up what we call the Sacred Star."
      } else {
        cutsceneText = "These elements are Wind, Land, Sea, Day, and Night. Each one of these has its own master."
      }
    } else if (cutsceneFrame >= 700 && cutsceneFrame < 2050) {
      ctx.save()
      ctx.scale(0.5, 0.5)
      ctx.translate(0 * 75 - (cutsceneFrame - 700) * 2, -10 * 75)
      confoundedCave.draw(p, "Cutscene View", 0 * 75 + (cutsceneFrame - 700) * 2, 10 * 75, 0.5)
      ctx.restore()
      if (cutsceneFrame < 1150) {
        cutsceneText = "Darkened is the Master of Night. However, the Darkened you battled is not the real one!"
      } else if (cutsceneFrame >= 1150 && cutsceneFrame < 1600) {
        cutsceneText = badGuy + " provided the original masters with weapons to make them more powerful."
      } else if (cutsceneFrame >= 1600 && cutsceneFrame < 2050) {
        cutsceneText = "Over time, however, these weapons corrupted the Masters and turned them against the island."
      }
    } else if (cutsceneFrame >= 2050 && cutsceneFrame < 3850) {
      // music[curMusicNum].audio.volume -= 0.002
      // console.log(music[curMusicNum].audio.volume)
      ctx.save()
      ctx.scale(0.3, 0.3)
      ctx.translate(0 * 75 - (cutsceneFrame - 2050) * 2, -10 * 75)
      mainMap.draw(p, "Cutscene View", 0 * 75 + (cutsceneFrame - 2050) * 2, 10 * 75, 0.3)
      ctx.restore()
      if (cutsceneFrame >= 2050 && cutsceneFrame < 2500) {
        cutsceneText = "When the time is right, " + badGuy + " will use the power of the Masters for anything he wants!"
      } else if (cutsceneFrame >= 2500 && cutsceneFrame < 2950) {
        cutsceneText = "If this happens, the elements will no longer remain here, and the island will be destroyed!"
      } else if (cutsceneFrame >= 2950 && cutsceneFrame < 3400) {
        cutsceneText = "When you battled " + badGuy + " you proved that you could handle the power of the weapons without being corrupted."
      } else if (cutsceneFrame >= 3400 && cutsceneFrame < 3850) {
        // musicFading = true
        // if (musicFading) {
        //   music[curMusicNum].audio.volume -= 0.002
        //   console.log(music[curMusicNum].audio.volume)
        // }
        
        cutsceneText = "So, we need you to battle the Masters, take their weapons, defeat " + badGuy + " and save the island!"
      }
      
    } else {
      scene = "GAME"
      p.x = 41 * 75 + 37.5
      p.y = 59 * 75 + 37.5
      p.questPoint = {
        x: 37,
        y: 50
      }

      curMap.changeBlock(67, 10, "_") // Opens the path to Steel Field (this only does anything when starting at a game point)
      curMap.changeBlock(138, 4, "_")

      // This code piece is a backup to move the old man into the correct spot, even though he should be there anyway
      oldMan.x = 40 * 75 + 37.5
      oldMan.y = 59 * 75 + 37.5
      oldMan.map = mainMap
      
      oldMan.lines = [
        "Now go talk to Wayne. He'll tell you what\nto do next.",
        "He should be around here somewhere."
      ]
      
      wayne.x = 37 * 75 + 37.5
      wayne.y = 50 * 75 + 37.5
      wayne.lines = [
        "Hello!",
        "I think the old man told you about this island's history,\nso I'll help you save it!",
        "Darkened, as well as the other masters, were corrupted and they created borders between\ndifferent regions of this island. This was to ensure that\nus islanders could not work together.",
        "However, now that you have defeated Darkened and taken his spear, the borders\nshould open up to you, as they were designed to open for Darkened.",
        "The weapon you possess contains the corrupted spirit of Darkened, and right now the\nonly person who has the spirit of the real Darkened is " + badGuy + ".",
        "The openings in the borders allowed Darkened to work with the other masters to do " + badGuy + "'s bidding.\nHowever, the islanders were able to safely contain the masters.'",
        "This all happened quite a long time ago, and so now only a select few people still\nhave this information.",
        "However, the masters have slowly grown stronger through their weapons\nand they get closer and closer to escaping each passing hour.",
        "Nobody knows when they will break free, but we need to prevent it from happening\nbefore it does.",
        "I've marked a spot on your map for where we believe the border was placed long ago.\nHead to it, and see if it is open for you."
      ]

      // 137, 4
      alerts.push(new BlockAlert(137, 4, ["SEGREME THGIN FO RETSAM WEN A SA SNEPO REDROB EHT"], mainMap, "SIGN"))
      
      wayne.action = function(p) {
        // Location of Glacia Village entry
        p.questPoint = {
          x: 135 * 75,
          y: 4 * 75
        }
      }
      wayne.actionLine = "after"
    }
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, height * 5 / 6, width, height / 6)
    ctx.textAlign = "center"
    ctx.font = "25px serif"
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillText(cutsceneText, width / 2, height * 11 / 12)
    
  } else if (scene == "DEATH") {
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.textAlign = "center"
    ctx.fillText("it seems you have acquired death good sire", width / 2, height / 2 - 100)
    ctx.fillText("click to continue", width / 2, height / 2 + 50)
    if (mouseIsDown) {
      location.reload()
      scene = "GAME"
    }
  }
}, 15)
// })();
