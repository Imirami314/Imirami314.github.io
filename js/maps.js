var curMap;
if (!!save) {
  // if (!!save.areas) {
  //   areas = save.areas
  // }
  if (!!save.mainMap) {
    mainMap = save.mainMap.arr
  }
}

var badGuy = "hunk" // DEFAULT TBD

var fadeOut = 0
var fadeStarted

var cutsceneFrame = 0 // DEFAULT 0

// Darkened Boss Cutscene vars
var darkenedScale = 1
var defeatSquareX = width * 3 / 4
var defeatSquareSpeed = 10
var defeatSquareWidth = 50

var scene = "GAME"

var bossfight = false
var curBoss = 0

var mapScale = 0.265

var initImage = function(src) {
  var img = new Image()
  img.src = src
  return img
}

var images = {
  grass: initImage('sprites/grass.png'),
  water: initImage('sprites/water.png'),
  bush: initImage('sprites/bush.png'),
  stone: initImage('sprites/stone.png'),
  stoneWall: initImage('sprites/stone_wall.png'),
  tree: initImage('sprites/tree.png'),
  confoundedCaveKey: initImage('sprites/confoundedCaveKey.png'),
  spearOfTheDarkened: initImage('sprites/spearOfTheDarkened.png'),
  sacredStar: initImage('sprites/sacredStar.png'),
  splint: initImage('sprites/splint.png'),
  splintHurt: initImage('sprites/splint-hurt.png'),
  snow: initImage('sprites/snow.png'),
  leaf: initImage('sprites/leaf.png'),
  woodenWall: initImage('sprites/woodenWall.png'),
  speedySnow: initImage('sprites/speedySnow.png'),
	lava: initImage('sprites/lava.gif'),
	trail: initImage('sprites/trail.png'),
	sand: initImage('sprites/sand.png'),
  oldMansGlasses: initImage('sprites/oldMansGlasses.png')
}

var blocks = [
  {
    id: ",",
    name: "grass",
    through: true,
    dps: 0,
    speed: 4, // Default 4
    sound: "Grass Walking",
    img: images.grass
  },
  {
    id: "~",
    name: "water",
    through: true,
    dps: 0,
    speed: 2, // Default 2
    sound: "Splash",
  },
  {
    id: "_",
    name: "stone",
    through: true,
    dps: 0,
    speed: 4, // Default 4
    img: images.stone
  },
  {
    id: "#",
    name: "dirt",
    through: true,
    dps: 0,
    speed: 4
  },
  {
    id: "!",
    name: "lava",
    through: true,
    dps: 30, // Default 30
    speed: 1
  },
  {
    id: "@",
    name: "bush",
    through: true,
    dps: 0,
    speed: 2
  },
  {
    id: "/",
    name: "sand",
    through: true,
    dps: 0,
    speed: 3,
		sound: "Sand Walking"
  },
  {
    id: ".",
    name: "wood",
    through: true,
    dps: 0,
    speed: 4
  },
  {
    id: "-",
    name: "trail",
    through: true,
    dps: 0,
    speed: 6 // Default 5 (6?)
  },
  {
    id: "=",
    name: "brick",
    through: true,
    dps: 0,
    speed: 5
  },
  {
    id: "|",
    name: "door",
    through: true,
    dps: 0,
    speed: 4,
    useDesc: "Press space to open"
  },
  {
    id: "B",
    name: "brick wall",
    through: false,
    dps: 0,
    speed: 3
  },
	{
    id: "S",
    name: "stone wall",
    through: false,
    dps: 0,
    speed: 3
  },
  {
    id: "O",
    name: "hole",
    through: true,
    dps: 0,
    speed: 2
  },
  {
    id: "T",
    name: "tree",
    through: false,
    dps: 0,
    speed: 3
  },
  {
    id: ":",
    name: "lock",
    through: true,
    dps: 0,
    speed: 3
  },
  {
    id: "(",
    name: "toggle open",
    through: true,
    dps: 0,
    speed: 4
  },
  {
    id: ")",
    name: "toggle close",
    through: false,
    dps: 0,
    speed: 4
  },
  {
    id: "W",
    name: "wooden wall",
    through: false,
    dps: 0,
    speed: 5
  },
	{
    id: "d",
    name: "dungeon door",
    through: false,
    dps: 0,
    speed: 4
  },
	{
    id: "$",
    name: "stone brick",
    through: false,
    dps: 0,
    speed: 4
  },
	{
		id: "c",
		name: "concrete",
		through: true,
		dps: 0,
		speed: 4
	},
  {
    id: "*",
    name: "snow",
    through: true,
    dps: 0,
    speed: 4 // Default 4
  },
  {
    id: "z",
    name: "speedy snow",
    through: "true",
    dps: 0,
    speed: 10, // Default 10
		sound: "Speedy Snow Walking" 
  }
]

var flowers = []
var flowersFinished = false

var getBlockById = function(id) {
  for (var i in blocks) {
    if (blocks[i].id == id) {
      return blocks[i]
    }
  }
}

var getBlockByName = function(name) {
  for (var i in blocks) {
    if (blocks[i].id == name) {
      return blocks[i] 
    }
  }
}

function Landscape(arr, enterX, enterY, doorX, doorY, name, solve) {
  this.arr = arr;
  this.blockSize = 75 // Default 75
  this.enterX = enterX
  this.enterY = enterY
  this.doorX = doorX
  this.doorY = doorY
  this.name = name
  if (!!solve) {
    this.solve = solve
  }

  this.loadCase = true

  this.nextLayer = []
  this.nextLayerSave = []

  this.changes = []

  this.temperature = 0

  if (!!save) {
    for (var i in save.maps) {
      var m = save.maps[i]
      if (m.name == this.name) {
        for (var j in m.changes) {
          var cm = m.changes[j]
          this.changeBlock(cm.x, cm.y, cm.block)
        }
      }
    }
  }
}

Landscape.prototype.draw = function(p, mode, cx, cy, cscale) {
  for (var i = 0; i < this.arr.length; i ++) {
    for (var j = 0; j < this.arr[i].length; j ++) {
      var c = this.arr[i].charAt(j)
      if (mode == "Player View") {
        this.loadCase = (j * this.blockSize - p.x + width / 2 > -1 * this.blockSize &&
          j * this.blockSize - p.x + width / 2 < width &&
          i * this.blockSize - p.y + height / 2 > -1 * this.blockSize &&
          i * this.blockSize - p.y + height / 2 < height + this.blockSize)
      } else if (mode == "Map View") {
        this.loadCase = (j * this.blockSize + p.mapPan.x < width / mapScale && 
                         j * this.blockSize + p.mapPan.x > - width / mapScale && 
                        i * this.blockSize + p.mapPan.y < height / mapScale && 
                        i * this.blockSize + p.mapPan.y > - height / mapScale)
      } else if (mode == "Cutscene View") {
        this.loadCase = (j * this.blockSize - cx > -1 * this.blockSize &&
          j * this.blockSize - cx < width / cscale &&
          i * this.blockSize - cy > -1 * this.blockSize &&
          i * this.blockSize - cy < height / cscale + this.blockSize)
      } else if (mode == "Snippet View") {
        this.loadCase = (Math.abs(j * 75 - p.x) <= 10 * 75 && Math.abs(i * 75 - p.y) <= 10 * 75)
				// ctx.fillStyle = 'rgb(255, 255, 0)'
				// ctx.fillRect(1255, 620, 1000, 1000)
      }
      if (this.loadCase) {
        if (!!getBlockById(c).img) {
          ctx.drawImage(getBlockById(c).img, j * this.blockSize, i * this.blockSize, 75, 75)
        }
        switch (c) {
          case ',': // Grass
            ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
            // if (i == 0 && j == 0 && flowers.length > 1) {
            //   flowersFinished = true
            // } 
            // var hasFlower = (Math.random() <= 0.1)
            // if (hasFlower && !flowersFinished) {
            //   flowers.push({
            //     cordX: j,
            //     cordY: i,
            //     x: Math.random() * 75,
            //     y: Math.random() * 75
            //   })
            // }
            break
          case '~': // Water
            ctx.fillStyle = 'rgb(0, 0, 255)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
            // ctx.drawImage(images.water, j * this.blockSize, i * this.blockSize, 75, 75)
            break
          case '_': // Stone
            ctx.drawImage(images.stone, j * this.blockSize, i * this.blockSize, 75, 75)
            break
          case '#': // Dirt
            ctx.fillStyle = 'rgb(100, 75, 15)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
            break
          case '!': // Lava
						ctx.drawImage(images.lava, j * this.blockSize, i * this.blockSize, 75, 75)
            // ctx.fillStyle = 'rgb(250, 40, 0)'
            // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)

            if (mode != "Map View") {
              // var ptcles = new ParticleSystem(j * this.blockSize + this.blockSize / 2, i * this.blockSize + this.blockSize / 2, 5, 100, 255, 0, 0)
              // ptcles.create()
              // ptcles.draw()
            }
						
            break
          case '@': // Bush
            ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
            ctx.drawImage(images.bush, j * this.blockSize, i * this.blockSize, 75, 75)
            break
  				case '/': // Sand
  					// ctx.fillStyle = 'rgb(242, 209, 107)'
            // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ctx.drawImage(images.sand, j * this.blockSize, i * this.blockSize, 75, 75)
  					break
  				case '.': // Wood
            ctx.beginPath()
            ctx.lineWidth = 1.5
            ctx.strokeStyle = "rgb(66, 24, 33)"
  					ctx.fillStyle = 'rgb(164, 116, 73)'
						for (var block = 0; block < 3; block ++) {
            	ctx.rect(j * this.blockSize, i * this.blockSize + (this.blockSize / 3 * block), this.blockSize, this.blockSize/3)
						}
            ctx.fill()
            ctx.stroke()
  					break
  				case '-': // Trail
  					// ctx.fillStyle = 'rgb(183, 133, 81)'
       			// ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ctx.drawImage(images.trail, j * this.blockSize, i * this.blockSize, 75, 75)
  					break
					case '=': // Brick
            ctx.beginPath()
						ctx.lineWidth = 1
            ctx.strokeStyle = "rgb(255, 255, 255)"
  					ctx.fillStyle = 'rgb(220, 85, 57)'
						for (var block = 0; block < 3; block ++) {
            	ctx.rect(j * this.blockSize, i * this.blockSize + (this.blockSize / 3 * block), this.blockSize, this.blockSize/3)
						}
            ctx.fill()
            ctx.stroke()
						break
          case '|': // Door
            ctx.fillStyle = 'rgb(56, 41, 20)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ellipse(j * this.blockSize + 60, i * this.blockSize + 40, this.blockSize - 55, this.blockSize - 55, 'rgb(255, 255, 0)')
						
            break
          case 'B': // Brick wall
            ctx.beginPath()
						ctx.lineWidth = 3
            ctx.strokeStyle = "rgb(255, 255, 255)"
  					ctx.fillStyle = 'rgb(220, 85, 57)'
						for (var block = 0; block < 3; block ++) {
            	ctx.rect(j * this.blockSize, i * this.blockSize + (this.blockSize / 3 * block), this.blockSize, this.blockSize/3)
						}
            ctx.fill()
            ctx.stroke()
						break
					case 'S': // Stone wall
						// ctx.fillStyle = 'rgb(40, 40, 40)'
            // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)

            ctx.drawImage(images.stoneWall, j * this.blockSize, i * this.blockSize, 75, 75)

            // if (mode != "Map View") {
            //   ellipse(j * this.blockSize + 20, i * this.blockSize + 25, 20, 20, "rgb(0, 0, 0)")
            //   ellipse(j * this.blockSize + 20, i * this.blockSize + 50, 15, 15, "rgb(0, 0, 0)")
            //   ellipse(j * this.blockSize + 50, i * this.blockSize + 30, 25, 25, "rgb(0, 0, 0)")
            // }
						break
          case 'O': // Hole
            ctx.fillStyle = 'rgb(0, 0, 0)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
            break
          case 'T': // Tree
            ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
            ctx.drawImage(images.tree, j * this.blockSize - 10, i * this.blockSize - 50, 95, 100)
						
            break
          case ':': // Lock
						var c = this.blockSize / 2 // c = center
            ctx.fillStyle = 'rgb(180, 180, 180)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ellipse(j* this.blockSize + (this.blockSize / 2), i * this.blockSize + (this.blockSize / 2), this.blockSize, this.blockSize, 'rgb(200, 200, 200)')
						ellipse(j* this.blockSize + (this.blockSize / 2), i * this.blockSize + (this.blockSize / 3), this.blockSize / 3.5, this.blockSize / 3.5, 'rgb(0, 0, 0)')
           	triangle(j * this.blockSize  + c, i * this.blockSize  + c - 10,  j * this.blockSize - 15  + c, i * this.blockSize + 20  + c, j * this.blockSize + 15 + c, i * this.blockSize + 20 + c, 'rgb(0, 0, 0)')
						break
          case "(": // Toggle Open
            ctx.fillStyle = 'rgb(100, 255, 100)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
            break
          case ")": // Toggle Close
            ctx.fillStyle = 'rgb(255, 100, 100)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
            break
          case "W": // Wooden Wall
            ctx.drawImage(images.woodenWall, j * this.blockSize, i * this.blockSize, 75, 75)
  					break
					case "d": // Dungeon door
            ctx.fillStyle = 'rgb(60, 60, 60)'
            ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ctx.fillStyle = 'rgb(0, 0, 0)'
						ctx.fillRect(j * this.blockSize + this.blockSize / 4 , i * this.blockSize, this.blockSize / 2, this.blockSize / 1.5)
  					break
					case "$": // Stone wall (w/ brick pattern)
						ctx.beginPath()
            ctx.lineWidth = 1.5
            ctx.strokeStyle = "rgb(0, 0, 0)"
  					ctx.fillStyle = 'rgb(70, 70, 70)'
						for (var block = 0; block < 3; block ++) {
            	ctx.rect(j * this.blockSize, i * this.blockSize + (this.blockSize / 3 * block), this.blockSize, this.blockSize/3)
						}
            ctx.fill()
            ctx.stroke()
						break
					case "c": // concrete (light gray)
						ctx.beginPath()
						ctx.fillStyle = 'rgb(200, 200, 200)'
						ctx.lineWidth = 1.5
						ctx.strokeStyle = 'rgb(100, 100, 100)'
            ctx.rect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ctx.fill()
						ctx.stroke()
						break
          case "*": // Snow
            ctx.drawImage(images.snow, j * this.blockSize, i * this.blockSize, 75, 75)
            break
          case "z": // Speedy snow
            ctx.drawImage(images.speedySnow, j * this.blockSize, i * this.blockSize, 75, 75)
            break
        }
      }
    }
  }
}

Landscape.prototype.drawNextLayer = function(p) {
  for (var i = 0; i < this.arr.length; i ++) {
    for (var j = 0; j < this.arr[i].length; j ++) {
      var c = this.arr[i].charAt(j)
      if (c == "T") { // Tree
        // if (p.y < i * this.blockSize) {
          ctx.drawImage(images.tree, j * this.blockSize - 10, i * this.blockSize - 50, 95, 100 + Math.sin(elapsed / 10))
        // }
      }
    }
  }
}

Landscape.prototype.getBlock = function(x, y) {
  return this.arr[y].charAt(x)
}

Landscape.prototype.changeBlock = function(x, y, block) {
  this.arr[y] = this.arr[y].replaceAt(x, block)
  this.changes.push({
    x: x,
    y: y,
    block: block
  })
}

Landscape.prototype.getDimensions = function() {
  return {
    x: this.arr[0].length,
    y: this.arr.length
  }
}

/*
Grass ,
Water ~
Stone _
Dirt #
Lava !
Bush @
Wood .
Trail -
Brick =
Door |
Brick Wall B
Stone Wall S
Hole O
Tree T
Lock :
Toggle Open (
Toggle Close )
Wooden Wall W
Dungeon Door d
Stone Wall $
Concrete (light gray) c
Snow *
Speedy Snow z
*/

var mainMap = new Landscape([
  'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  'S,,,,,T,,,,,,,,,,,,,,,,,,,,TTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,T,,,,,TT@__!!!!________!!S!_____________________S__S__!!!__S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S****************************************************************************************',
  'S,,,,,T,,,,TTTTTTTTT,,,,,,,T~~~~~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT@!______!___!!!!_S!____!!SSSSSSSS__SSS_SS__S__!_!__S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S****************************************************************************************',
  'S,,,,,T~~~~T@,,,,@@T,,,,,,,T~~~~~~TTTTTTT,,,,,,,,,,B,,,,,,,,T,,,TT@SSSSSSSS!!SSSSSSS_______S___S_____S_______S_SSSSS_S!___________________SSSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SSSSSSSSS****************************************************************************************',
  'S,,,,,T~~~~T@,,B,,,TT,,,,,,T~~~...------T,,,,,,,,BBBBB,T,,,,,,,,TT@________!!______S_________S_S_SS__SSS_SSSSS___!!__S____________________S------------------------------------------_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'S,,,,,T~~~~T,,BBB,,,TTTTT,,T~~~~~~TTTT--T,,,,,,,BBBBBBB,,,,,,,,,TT@!!!!_______SSS____!!______S___SS__________________S_______!____________SSSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SSSSSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'S,,,,,T~~~~T,BBBBB@,,,@@T,,T~~~~~~T,,T--T,,,,T,BBBBBBBBB,,,,,T,,TT@SSSSSSSSSSSSSS__S_!!SSSSSSSSSSSS__SSSSSSSSSSS!____S____________________SSSS!!!!!!!!!!!!!!!!!!$~~~~~~~~~~~~~~~~~~~~S*****************zz*********************************************************************',
  'S,,,,,T~~~~T,BBBBB@,,,,@T,,T~~~~~~T,,T--T,,,,,,BBBBBBBBB,,,,,,,,TT@______S_________S___S__S______!S____________S_____S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*****************zz****************************************************SS***************',
  'S,,,,,TTTTTT,BB|BB@,,,,,T,,TTTTTTTT,,T--TT@@@@@BBBB|BBBB@@@@@,,,TT@___!!_S_________SS_______S_____SSSSSSSSSSS__SS____S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*****************zz******************************************SS********SS********SS*****',
  'S,,,,,,@--------------------------------------------------------TTS___!!_S___________SSSSSSSSSS_S_S_________S!__S__!_S_______!____________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*******WWW*******zz*****************************************SSSS**SS**SSSS**SS**SSSS****',
  'S,,,,,@@----------------------------------------------------------:S_____________!!S__________S!SSSSSSSSSSS_____SS___S________________!!!!SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS******WWWWW******zz****************WWWWWWWWWWWWWWWWW**zzzzSSSSSSSSSSSSSSSSSSSSSSSSSSSSzz',
  'S,,,,,@--@,,@,,,,,,,,,--,,,,,,,,,,,T--T_______________,,,,,,,,,,TTS______SSSSSSSS!!SSSSS__________!_______S__!__!S___S_______________!!!!!S___******************zz**WWW*************zz****WWW...WWW****zz****************W*****WzzzzzzzzzW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  'S,,,,@@--@,,@,,,,,,,,,--,,,,,,,,,,,T--T,,,,,,,,@@@,,,,,,,,,,,,,,TT@@@@@@@@@@@@@@@@@@@@@@@@@@SSSSSSS___S___S__S!__S!__S_______________!!!!!S___******************zz*WW.WW***.........zz**WWW.......WWW**zz****************W*****Wz!!SSS!!zW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  '@,,,,@---@,,@,,,,,,,,,--,,,,,,,,,,,T--T,,,,,,,,@@@,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTT______S___S___S__S___SSSSS____!!_________!!!!!S___****..........****zzWW...WW**.~~.,TT,.zzWWWWWWWWWWWWWWWWWzz****************WWWWWWWz!SSSSS!zW**zzzzzzzSSSSSSSSSSSSSSSSSSSSSSzzzzz',
  '@,,,,@--@@,,@,,,,,,,,,--,,,,,,,,,@@@|_@@@,,,,,,,,,,,,,,,,,,,,,,@TTTTTTTTTTTTTTTTTTTTTTTTTTTTSSS___S___S___S__S_______S____!!_________!!!!!S*******.TT.~~~~~.****zzW..W..W**.~~.,TT,.zzW...............Wzz****************WW!!!!!z!SSSSS!zW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  'T@TTT@--@TT,,@,,,,,TTT--TTTTTTTTT@______@,,,,,,,,,,,,,,,,,,,,,,@@@,,,,,,,,,,,________,,,,,TT!!_S__S___S___S__SSSSSSSSSS_______________!!!!S*******.,,.~~~~~.****zzW.WWW.W**.........zzW......WWW......Wzz****************WW!~~~zz!SSSSS!zW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  '@@,,,@--@@T~~~~~~~~~~W--W~~~~~~~T@______@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TT!!_S______!!__S___________S___________________S*******..........****zzWWW|WWW***********zzWWWWWWWW|WWWWWWWWzz****************WW!z!!!z!SS|SS!zW**zzzzzzzSSSSSSSSSSSSSSSSSSSSSSzzzzz',
  '@T,,,@---@T~~~~~~~~~~W--W~~~~~~~T@______@,,,,TTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TTSS___SS___!!__S___________S___________________SzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzW!!z!W!z!!!z!!!zW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  ',,,,,@@--@@T~~~~~~~~~W--W~~~~~~~T@______@,,,,T~~~T,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TT!!SSSSS___S___S__SSSSSSS__S_____S__!!____SSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz~!W!z!!!~!zzzW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  'T,,,,,@---@T~~~~~~~~~W--W~~~~~~~T@@@@@@@@,,,,T~~~T,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TT__________S___S__S_____S__S____SSS_!!____SSSSSS*******************zz*TTTTTTTT*******zzTzzTTTTTTTTTTTTTTTTTTTTTTTTTT**********W!!!!W!~~zzz!WWWW**zzzzzzzSSSS__S__SSSS__S__SSSSzzzzz',
  'T,,,,,@@--@TTTTTTTTTTW--W@~~~~~~T,,,,,,,,,,,,TT,TT,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TT__________S___S__S___!!SSSS___SSSSS______SSSSSS*******************zzT~~~~~~~~T******zzTz,,,,,,T,,,,,,,,,,,,,,,,,,,T**********WWWWWW!!!!WW!W**W**zzTTSSSSSSSSSSSSSddSSSSSSSSSSSSSTT',
  'T,,,,,,,T--,,,,,,,,,@W--W@~~~~~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TTSSSSSSSSSSSSSSS__S___!!S______SSSSS_____SSSSSSS*******************zzT~~~~~~~~T******zzT,,,T~,,~,,,~T,,,,~,T~,,,,,,T**********WWWWWWWWWWWWWWWWW************************************',
  'T,,,,,,,T--,,,,,,,,,,,--TTTTTTTTT----------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TT____!!___S_______S_____S______SS|SS_____SSSSSSS*******************zzT~~~~~~~~T******zzT,,,,,,,,,,,,,,,,,T,,,,,,,,,T***************************************************************',
  'T,,,,,,,T-------------------------------------------,,,,,,,,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,,TT____!!___S_____________S________________S!SS|SS*******************zzT~~~~~~~~T******zzTTTTTTTTTTTT,,,,,,,,,,,,T,,,T***************************************************************',
  'T,,,,,,,T--,,B,,T,,W,,--,,,,,,,,,,,,,,,,,,-----------------------------------________,,,,,TT_________SSSS_SSSS_____S________!!______SSS___S*******************zzT~~~~~~~~T******zz***********TTTTTTT,,,,,,,,,,T***************************************************************',
  'TTTT,TTTT--,BBB,T,WWW,--,,,,,,,,,,,,,,,,,,,,,,,,,,,---------------------------,,,,,,,,,,,,TT____________S____SS____SSSSSSSS_!!______S!S___S*******************zzT~~~~~~~~TTTTT**zz*****************TTTTTTTTTTTT***************************************************************',
  'T///,///T--BBBBBTWWWWW--,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,,,TTSSSSSSSSSSSS_______SSS_S______S_________SSS___S*******************zz*TTTTTTTT*******zz********************************************************************************************',
  'T/,,,,,/T--BB|BBTWWWWW--,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,,,TT_S_____S_S_S_SS!!!__SS_S_SSSS)S______________SS*******************zz****************zz********************************************************************************************',
  'T/,,,,,/T-------TWW|WW--,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@,,,,,,,,,,--,,,,,,,,,,,,TT_!_____S_S_!_S___!_______S!!S)S______________SS*******************zz****************zz********************************************************************************************',
  'T/,,,,//T-TTTTT-T-------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@,,,,,,,,,,--,,,,,,,,,,,,TT_SSSSSSS_SS!_S___SSSSS_S_S!!S)S_______S______SS*******************zzzzzzzzzzzzzzzzzzzz********************************************************************************************',
  'TT/////TT-T,,,--TTTTTT--TTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@,,,,,,,,,,,--,,,,,,,,,,,TT_____________S_________S_S!!S)S______S!S_____SS*******************zzzzzzzzzzzzzzzzzzzz********************************************************************************************',
  'TTTT~TTT--T,,,----------,,,,,,,TTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,,TTSSSSSSSSSSSS_SSSSSSSSS_S_S!!S_S_____S!!!S____SSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTS:STTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'T~~~~T---TT,,,-,,,,,,,,,,/////,,,,,,TTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,TT___________S______!__S_SSSSSSSSSSSSS!!!!!S___SS*************************************SSS*******************************************************************************************',
  'T~TTTT-TTT,,,,-,,,,,//////~~~//////,,,,,,TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,TT___________S_________S____________SSSSSSSSS__SS**********************W!**z*|**!WW*|!W*W*******************************************************************************************',
  'T~~~~T-T,,,,,,-//////~~~~~~~~~~~~~//////,,T,,,,TTTTTTTTTT@,,,,,,@TTTTTTTTTTTTT--,,,,,,,,,,TT___________S!________S____________S_______S__SS*********************WWW*z**W***W*z**W*!WW!*!**************************************************************************************',
  'TTTT~T-T,,,,,-//~~~~~~~~~~~~~~~~~~~~~~~//,T,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,TT____________S!!!__SSSSSSSSSSSSSS__S_______S__SS*******************!**|*****WWW**W***z|**|**W!*************************************************************************************',
  'T~~~~T-T,,,,-//~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,,==============,,,,,,,====|====,,,,,,,TTSSSSSSSSSS__S_____S___S__!_____S__S__SSS__S__SS******************!W*z!WWW***W!z*z**WW*W!WW****************************************************************************************',
  'T~TTTT-T,,,-///~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,@@=-------=@@,,,,,TT____________S__!!!S___S________S__SSSS|SSSS__SS********WW**z!!W***WW!*z*W**z*****W**z******!WW!***********************************************************************************',
  'T~~~~T-,,,-///~~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,@@=-------=@@,,,,,TTSSSSSSSSSS__S_____S___S________S_____!_______SS*********|**z******Wz*****z!**|*zW!**W*W!zWWz***W**********************************************************************************',
  'TTTT~T-,,,-///~~~~~~~~~~~~~~~~~~~~~~~~///,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,,,=-------=,,,,,,,TT____!!!!!S__S!!!__S___S________S_____!_______SS********WW!!!*|***!W***W!**!WW!*W****W****W***!WW**********************************************************************************',
  'T~~~~T-T,,,-///~~~~~~~~~~~~~~~~~~~~~~////,T,,,TT,,,,=..............=,,,,,,=-------=,,,,,,,TT___!!!!!_S__S_____S___S________SSSSSSS_SSSS__SS******!**W********WWWz*WW!*|!W!***|*z*!W!W!*WW*************************************************************************************',
  'T~TTTT-T,,,-///~~~~~~~~~~~~~~~~~~~~~/////,T,,,T,,,,,=..............=,,,,,,=-------=,,,,,,,TT__!!!!!__S__S__!!!SS|SS___________________S__SS******W*|W**W!*W!*!W*W!**|***!W*WW!*WW!*z|!*WW*************************************************************************************',
  'T~~~~T-T,,,-////~~~~~~~~~~~~~~~~~~~//////,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,,=========,,,,,,,TT_!!!!!___S__S_____________________________S__SS******W**WWWWW*W*****W!WWW!z**z**WW*!W!**z*z*!***W*********************************************************************************',
  'TTTT~T-T,,,,-/////~~~~~~~~~~~~~~~///////,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,,,,,,,,,,,,,,,,,,TT!!!!!____S__S_SSSSSSSSSSSSSSSSSSSSSSSSSSSSS__SS*********!*****W*W*W*****W*|z**z*|*z*|*W!W**WWW************************************************************************************',
  'T~~~~T-T,,,,--/////////~~~~~////////////,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,,,,,,,,,,,,,,,,,,TTSSSSSSSSSS__S_S______________________________SS******|W***W!!***!*!WW*W!WW*!WzW*W**WW***WW*W*z*W**********************************************************************************',
  'TTTTTT,TTTTTT-//////////////////////,,,,,,T,,,T,,,,,,==============,,,,,,,,,,,////////////TT____________S_S______________________________SS*****zWW*!*******z*****|**!*WW***W!**!**z*z*!*W************************************************************************************',
  'TT~~~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TTSSSSSSSSSS__S_S______________________________SS*******!W***W*W!zzz!W****W***z*WW*z*WW!*!**WWW**W**********************************************************************************',
  'TT~~SSSSS~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,TTT,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TT_________S_SS_S______________________________SS********!***z**W!z!W**z**WW*!**z*!***!W**W****!************************************************************************************',
  'TT~SOOOOOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TTSSSSSSSS______S______________________________SS********!WW*!W**W!W**W*!!**z*****!**W**z*WWW!**W***********************************************************************************',
  'TT~SOOOOOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT_______SSSSSSSS______________________________SS**********z|*W***W**WW*z**W***WW****!W!**!****W************************************************************************************',
  'TT~SOOOOOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S_____________________________________________SS***********zz****|*z*!*W**W!**!***!**|**W*zz!**z*!*********************************************************************************',
  'TT~SOSSSOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,//////,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  'TT~SOSSSOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TT~_SS:SS_~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TT~~~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'ccccccccccccccccccccT,,,,,,,,,,,,,,,,,,T,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'ccccccc~~~~~~cccccccT,,,,,,,,,,,,,,,,,,T,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'ccccccc~~~~~~cccccccT,,,,,,,,,,,,,,,,,,T,,,,,,//////,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'ccccccccccccccccccccT,,,,,,,,,,,,,,,,,,T,,,,*,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,___________________________________________,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,T~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,T~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,TTTTTTTTT,,,,,,,,,,T~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,TT,,BBB,,TT,,,,,,,,,TTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,TTT,,BBBBB,,TT,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,TT,,,@BB|BB@,,TT,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TTT,,,,,,,,,,,,,TT,,,-------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'T@///////@------TT,,--------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'T@~~~~~~~@@@@TT--,,---,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'T@~~~~~~~@TTTT,------,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TTTTTTTTTTT,,T,-----,,,,,,TTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  '~~~~~~~~~~~~~T,--,,,,,,,,,T////////////////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  '~~~~~~~~~~~~~T,---,,,,,,,,T/~~~~///////~~//T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  '~~~~~~~~~~~~~T,,---,,,,,,,T/~~~~///////~~//T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  '~~~~~~~~~~~~~T,,,----------////////////~~//T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  '~~~~~~~~~~~~~T@,,,---------///////~~///////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  '~~~~~~~~~~~~~T@,,,,,,,,,,,T/~~////~~///////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  'TTTTTTTTTTTTTT@,,,,,,,,,,,T/~~////~~///////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,@@@@,,,,,,,,,,,T////////////////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
], 0, 0, null, null, "Main Map")



var johnHouse = new Landscape([
  '=======',
  '=======',
  '=======',
  '=======',
  '=======',
  '===|==='
], 75, 337.5, 15, 8, "John's House")

var ronHouse = new Landscape([
  '___|___',
  '_______',
  '_______',
  '_______',
  '_______',
  '_______'
], 262.5, 25, 36, 14, "Ron's House")

var mikeHouse = new Landscape([
  '----|----',
  '---------',
  '---------',
  '---------',
  '---------',
  '---------',
  '---------',
], 262.5, 25, 51, 8, "Mike's House")

var smithHouse = new Landscape([
  '!S_______',
  '!S_______',
  'SS_______',
  '_________',
  '_______SS',
  '_______S!',
  '____|__S!',
], 337.5, 412.5, 130, 37, "Smith's House")

var confoundedCave = new Landscape([
  '_____SSSSS___S______)_S____________________________S',
  '_____S_|_S___S__SSSSS_S_SSSSSSSSSSSSSSSSSSSSSSSSSS_S',
  '$$$______S___S__S_____S______________________S~~~S_S',
  '~~$$$$_______S__S_SSSSSSSSS____SSS_SSSSSSSSS_SSSSS_S',
  '~~$~~$______SSSSS_________S____S__S________________S',
  '$$$$$$$$$$$__SSSSSSSSSSSS_SSS_SS__S_S_SSSSSSSSSSSSSS',
  '_____$____$__SSSSSSSSSSSS_SS__S___S_S_SSSS~S_______S',
  '_____$_SS_$__SSSS__SS___S____SS_S_S_S____S~S_SSSSSSS',
  '_____$_SS_$__SS_______S____S________S_SS_S~S_S_____S',
  '$$$$$$_SS_$__SSSSSSSSSS_SS_____SSSS____S_SSS_S_____S',
  '_____$_SS_$___SSSSSSSSSSSSSSSSSSSSSSSSSS_____S_____S', 
  '_____$_SS_$$$_______________:S______$__SSSSS_S_____S',
  '____$__SS___$_............_$$$$$$$$_$______S_S_____S',
  '$$$$$_$$$$$_$_.~~~~~~~~~~._$______$_$__SSS_S_SSSSSSS',
  '____$_$___$_$_.~~~~~~~~~~._$_$$$$_$_$_S___S___S_____',
  '____$___$_$_$_.~~~~~~~~~~._$_$__$_$_$_S_S_S_S_S_____',
  '____$$$$$_$)$_.~~~~~~~~~~._$_$_$$_$_$_S_S_S_S_S_____',
  '____$$$$__$_$_.~~~~~~~~~~._$_$____$_$_S_S_S_S_S_____',
  '____$_$$_S__$_.~~~~~~~~~~._$_$$$$$$_$_S_S_S_S_S_____',
  '____$__$_S__$_.~~~~~~~~~~._$________$_S_S_S_S_S_____',
  '____$$_$__SS$_.~~~~~~~~~~._$$$$$$$$$$_S_S_S_S_S_____',
  '____$$_$$_____............____________S_S___S_S_____',
  '_____$_$$_$)$_______________$$$$$$$$$$$)$$$$$$$_____',
  '_____$____$_$$$$$$$$$$$$$$$$$_____________$_________',
  '_____$$$$$$_______________________________$_________',
  '__________$$$$$$$$$$$$$$$$$$$_____________$_________',
  '____________________________$$$$$$$$$$$$$$$_________',
  '____________________________________________________',
], 75, 75, 6, 52, "Confounded Cave")

var darkenedRoom = new Landscape([
  '____________S_______',
  '____S_______________',
  '_______________S____',
  '__S_________________',
  '__________S_________',
  '____________________',
  '_S__________________',
  '_______S_______S____',
  '_S__________________',
  '___________S________',
  '____S_______________',
  '______________S_____',
  '________S___________',
  '_________________S__',
  '_S__________________',
  '______________S_____',
  '_____S______________',
  '__S_________________',
  '____________S_______',
  '_______S__________S_',
], 75, 75, 0, 0, "Darkened Room") // You don't enter through a door

var glaciaCenter = new Landscape([
  'WWWWWWWWWWW',
  'W.........W',
  'W.WWWWWWW.W',
  'W.WWWWWWW.W',
  'W.........W',
  'W.........W',
  'WWWW......W',
  'W..W......W',
  'WWWWW|WWWWW',
], 5 * 75 + 37.5, 7 * 75 + 37.5, 190, 16, "Glacia Center")

var lonzoHouse = new Landscape([
  '**W_$!!',
  'WWW_$$$',
  '_______',
  '_______',
  '___|___',
], 3 * 75 + 37.5, 3 * 75 + 37.5, 228, 16, "Lonzo's House")

var queensCastle = new Landscape([
  '___W___W_____________________________$$$$$$$',       
  '___!___W__________________________~~~$**~~~$',    
  '___W___W__________________________!$$$**~zz$',     
  'W!WWW!WW__________________________c$****~cz$',
  '___W___W__________________________!$$$**~zz$',
  '___!___W__________________________~~~$**~~~$',
  '___W___W_______S*******S_____________$$$$$$$',
  'WWWWWWWWSSSSSSSS~~***~~SSSSSSSSSSSSSSSSSSSSS',
  'WW__W__WW______S*******S____________________',
  'W~WWWW_WW___________________________________',
  'W~W!!!_!WSSS__________SSS_SSSSS_SSS_________',
  'W~W!~_~!WS~S__________S*****S*****S_________',
  'W~W!_!!!WSSS__________S*****S*****S_________',
  'W~W!~_~!WSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS_SS',
  'W~W!!!~!W_________SSS_________SSSSS_____S_SS',
  'WWWWWW~WW_SSSSSSS_SSS_SSSS_SS_SS____SSS_S_SS',
  'SSSSS___SSSSSSSSS_SSS_SSSS_SS_SS_SS_S___S_SS',
  'SSSSS___SSSSSSSSS_____SSSS_SS_SS_SS_S_S_S_SS',
  'SSSSSzzzzzzzzzzzzzSSSSSSSSzSzzzzzSzzS_S_S_SS',
  'SSSSSzzzzzzzzzzzzzzzzzOSSSzSzzzzzSzzS_____zS',
  'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
], 0 * 75 + 37.5, 0 * 75 + 37.5, 159, 4, "The Queen's Castle")

queensCastle.solve = function() {
  p.cordSave =  {
    x: 254,
    y: 21
  }
  
  if (queensCastle.getBlock(3, 1) == "~" && 
			queensCastle.getBlock(1, 3) == "~" && 
			queensCastle.getBlock(3, 5) == "~" && 
			queensCastle.getBlock(5, 3) == "~") {
		queensCastle.changeBlock(5, 7, "_")
	}

  if (p.cords.x == 34 && p.cords.y == 3) {
    queensCastle.changeBlock(35, 3, '*')
  }

  if (!!!queensCastle.intervalSet) {
    setInterval(function() {
      if (queensCastle.getBlock(6, 11) == '~') {
        queensCastle.changeBlock(6, 11, '!')
        queensCastle.changeBlock(4, 11, '!')
        queensCastle.changeBlock(6, 13, '!')
        queensCastle.changeBlock(4, 13, '!')
      } else {
        queensCastle.changeBlock(6, 11, '~')
        queensCastle.changeBlock(4, 11, '~')
        queensCastle.changeBlock(6, 13, '~')
        queensCastle.changeBlock(4, 13, '~')
      }
    }, 1000)
    queensCastle.intervalSet = true
  }

  // 6, 11 / 4, 11 / 6, 13 / 4, 13
}

var galeCave = new Landscape([
  'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  '___________________________________S___S____________________',
  '___________________________________S___S_________________SSS',
  '__________________________zzzzzzzzzSS_SSzzzzzzzzzzzzzzzzzzzS',
  'SSSSSSSSSSSSSSSSSSSSSSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzS',
  'Szz!zzzzzzzzzzzzzzzzzzzzzzSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSzzS',
  'Szzzzzzzzzzzzzzzzzz!zzzzzzzzzzzSzzzzzzzzzzzzzzzzzzzzzSSSSzzS',
  'SSSSSzSSSSSzzSSSSSSSSSSSSSzzzzzSzzzzzzzzzzzzzzzzzzzzzSSSSzzS',
  'S_________SzzSS___________zSSzzSzzSSSSSSzzSSSSSSSSSSSSSSSzzS',
  'S_________SzzSS_____________Sz!SzzS~~~~!zzzzzzzzzzzzzzzzSzzS',
  'S_________SzzSS_____________SzzSzzS,~!~~zzzzzzzzzzzzzzzzSzzS',
  'SSSSSSSSSSSSSSSSSSSSS_______S!zSzzSSSSSSSSSSSSSSSSSSSSzzSzzS',
  'S___!!zzzzzzzzzzzzz!S_______SzzSzzzzzzzzz!!zzzzzzzzzzSzzSzzS',
  'S___!!zzzzzzzzzzzzzzSSSSSSSSSz!Szzzzzzzzzzzzz!!zzzzzzSzzSzzS',
  'SSSSSSSSSzzSSSSSSSzzzzzzzzzzzzzSSSSSSSSSSSSSSSSSSSSzzSzzSzzS',
  'S_______SzzS_____Szzzzzz!zzzzzzS__________S_______SzzSzzSzzS',
  'S________zzS_____SSSSSSSSSSSSzzS__________S_______SzzSzzSzzS',
  'SSSS_SSSSzzS_____SSSSSSSSSSSSzzS__________S_______SzzSzzSzzS',
  'SzzzzzzzSzzSSSSSSSSSSSSSSSSSSzzSSSSSSSSSSSS_SS_SS_SzzSzzSzzS',
  'SzzzzzzzzzzSSzzzzzzzzSzzz!zzSzzzzzzzzzzzzz!zzzzzzzzzzSzzSzzS',
  'SzzzzzzzzzzSSzzz!zzzzSzzzzzzSzzzzz!zzzzzzzzzzzzzzzzzzSzzSzzS',
  'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSzzSSSSSSSSSSSSSSSSSSSSSSSzzSzzS',
  '___________________________SSzzSS___________________SSzzSzzS',
  '__________________SSS____~S~~zz~~S__________________SSzzSzzS',
  '__________________S~S____#S~~zz~~S__________________SSzzzzzS',
  '__________________S,S____!S~~zz~~S__________________SSzzzzzS',
  '__________________S!S____,S~~zz~~SSSSSSSSSSSSSSSSSSSSSzzSSSS',
  '__________________SSS______S!SS!SzzzzzzzzzzzzzzzzzzzzzzzSSSS',
  '___________________________S!zz!SzzzzzzzzzzzzzzzzzzzzzzzSSSS',
  '________SSSSSS_____________S!zz!SzzzzzzzzzzzzzzzzzzzzzzzSSSS',
  '________S~~~~S_____________S!zz!SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
  '________S~SS~S__________________________________________SS..',
  'zS______S~SS~S___________________________________________S__',
  'zS______S~~~~S______________SSSS________SSSS*SSSS________S__',
  'zS______SSSSSS______________S__S_______SSSSS*SS*SS_______S__',
  'zSSSS_______________________S__S______SS*SSSOSSSSSS_____SS..',
  '|zzzz_______________________SSSS______SSSSSSSSSSSSS_____SSSS',
], 0 * 75 + 37.5, 0 * 75 + 37.5, 156, 50, "Gale Cave")
// look at chat jumpscare
galeCave.solve = function() {
  
  if (
    this.getBlock(12, 10) == "," && // Fo solve
    this.getBlock(1, 18) == "_" && // Fi solve
    this.getBlock(41, 3) == "!" && // Fum solve
    this.getBlock(50, 19) == "~") { // Fee solve
    // Animates lighting up the cave
    if (lighting <= 1500) {
      lighting += 15
    }
    
    if (t27_24.toggleState == 2 && t27_26.toggleState == 2 && t27_23.toggleState == 1 && t27_25.toggleState == 1) {
      galeCave.changeBlock(28, 27, 'S')
      galeCave.changeBlock(29, 27, 'z')
      galeCave.changeBlock(30, 27, 'z')
      galeCave.changeBlock(31, 27, 'S')
    }
  } else {
    lighting = 450 // Default 450
  }

  if (keys.space) {
    if (p.cords.x == 44 && p.cords.y == 35) {
      // code to take you into Cryo Underground
      curMap = cryoUnderground
      p.x = 75 + 37.5
      p.y = 75 + 37.5
    }
  
    if (p.cords.x == 0 && p.cords.y == 35) {
      // code to take you out of Gale Cave
    }
  }
}

var cryoUnderground = new Landscape([
  'zzzzzzz..WWWWWWWWWWWWzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzW..W..........Wzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WWWWWWW..WWWWWWW..W.Wzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W~~~~~W..W~~~~~WWWW.WWWWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W~~~~~W..W~~~~~)~~..WzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WWWWWWW..WW((WW)WWWWWzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W~~~~Wzzzzzzzz(~~)zzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W~~~~WWWWWWWzzW~WWWzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W~~~~W~~~~~WzzW~WzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WWWWWW~~~~~WzzW~WzWWWWWWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W...W~~~~~~WzzWWWzWzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W...WWWWWWWWzzWzzzWzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W..........zzzzzzWWWWWWWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W..........zzzWWWWzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'W:WWWWWWWWWWWWWzzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WWWzzzzzzzzzzzzzzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'Wzzzzzzzzzzzzz!zzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'Wzzzzzzzzzzzzz!zzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'Wzzzzzzzzzzz!!!!!zzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'Wzzzzzzzzzzzzz!zzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'Wzzzzzzzzzzzzz!zzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WzzzzzzzzzzzzzzzzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WzzzzzzzzzzzzzzzzzzzzzzWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'WWWWWWWWWWWWWWWWWWWWWWWWzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
], 1 * 75 + 37.5, 1 * 75 + 37.5, 0, 0, "The Cryo Underground") // Don't enter through a door

cryoUnderground.solve = function() {
  this.temperature = -1
  lighting = 800
  
}

var areas = [johnHouse, ronHouse, mikeHouse, smithHouse, confoundedCave, darkenedRoom, glaciaCenter, lonzoHouse, queensCastle, galeCave, cryoUnderground]

// for (var l in areas) {
//   var a = areas[l]
//   for (var i = 0; i < a.arr.length; i ++) {
//     for (var j = 0; j < a.arr[i].length; j ++) {
//       var c = this.arr[i].charAt(j)
//       console.log(c)
//       if (c == ",") {
        
//       }
//     }
//   }
// }

function areaSearchByCords(x, y) {
  for (var i in areas) {
    var r = areas[i]
    if (r.doorX == x && r.doorY == y) {
      return r
    }
  }
  return 0
}

var Region = function(bounds, active, passive) {
  this.bounds = bounds

  //this.music = music
  this.musicStarted = false
  this.musicStartDelay = 3.9
  this.locationMusicPlayed = true
  
  this.inRegion = false

  this.active = active
  this.passive = passive
  this.passiveRun = false
}

Region.prototype.update = function() {
  this.inRegion = false
  for (var i in this.bounds) {
    var b = this.bounds[i]
    if (p.cords.x >= b.x1 && p.cords.y >= b.y1 && p.cords.x <= b.x2 && p.cords.y <= b.y2) {
      this.inRegion = true
    }
  }

  if (this.inRegion) {
    this.active()
    if (!this.passiveRun) {
      this.passive()
      this.passiveRun = true
    }
    // this.musicStartDelay -= 1 / 66.67

    // if (this.musicStartDelay <= 2.9) {
    //   playMusic("New Location")
    //   if (this.musicStartDelay <= 0) {
    //     this.startMusic()
    //   }
    // }
    
  // } else {
  //   this.musicStartDelay = 3.9
  }

  // if (this.musicStarted) {
  //   playMusic(this.music)
  // }
}

// Region.prototype.startMusic = function() {
//   curMusic = {}
//   this.musicStarted = true
// }
// this.cords.x >= 158 && this.cords.y >= 32 && this.cords.x <= 269 && this.cords.y <= 50

var chardTown = new Region([
  {
    x1: 0,
    y1: 0,
    x2: 66,
    y2: 15
  },
  {
    x1: 0,
    y1: 15,
    x2: 91,
    y2: 60
  }
], function() {
}, function() {
  playMusic("Chard")
})

var steelField = new Region([
  {
    x1: 66,
    y1: 1,
    x2: 138,
    y2: 12
  },
  {
    x1: 92,
    y1: 1,
    x2: 138,
    y2: 60
  }
], function() {
}, function() {
  playMusic("Steel Field")
})

var glaciaVillage = new Region([
  {
    x1: 138,
    y1: 11,
    x2: 270,
    y2: 31
  },
  {
    x1: 182,
    y1: 1,
    x2: 270,
    y2: 11
  }
], function() {
}, function() {
  playMusic("Glacia Village")
})

var windyWastelands = new Region([{
  x1: 158,
  y1: 32,
  x2: 269,
  y2: 50
}], function() {
}, function() {
  playMusic("Windy Wastelands")
})

var regions = [chardTown, steelField, glaciaVillage, windyWastelands]