var curMap;
if (!!save) {
    // if (!!save.areas) {
    //     areas = save.areas
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

// Encompassed Forest vars
var forestLoopStarted = false // Once player gets close enough to lost traveler, the loop begins and the forest never ends
var forestTeleport = true

// Abandoned Channel vars
var cascadeEntered = false // Has Cascade entered the place and started the adventure

var scene = "GAME"

var bossfight = false
var curBoss = 0

var mapScale = 0.265

var initImage = function(src) {
    var img = new Image()
    img.src = src
    return img
}

// Camera movement variables
var curCX = 0 // current pos
var curCY = 0
var cameraMoving = false
var camera = 0;

var images = {
    // Blocks
    grass: initImage('sprites/blocks/grass.png'),
    water: initImage('sprites/blocks/water.png'),
    bush: initImage('sprites/blocks/bush.png'),
    stone: initImage('sprites/blocks/stone.png'),
    stoneWall: initImage('sprites/blocks/stone_wall.png'),
    tree: initImage('sprites/blocks/tree.png'),
    tree2: initImage('sprites/blocks/tree2.png'),
    snow: initImage('sprites/blocks/snow.png'),
    leaf: initImage('sprites/blocks/leaf.png'),
    woodenWall: initImage('sprites/blocks/woodenWall.png'),
    speedySnow: initImage('sprites/blocks/speedySnow.png'),
	lava: initImage('sprites/blocks/lava.png'),
	trail: initImage('sprites/blocks/trail.png'),
	sand: initImage('sprites/blocks/sand.png'),
    suspensia: initImage('sprites/blocks/suspensia.png'),
    iceWall: initImage('sprites/blocks/iceWall.png'),
    crackedIceWall: initImage('sprites/blocks/crackedIceWall.png'),
    teleport: initImage('sprites/blocks/teleport.png'),
     
    // Enemies
    splint: initImage('sprites/enemies/splint/splint.png'),
    splintHurt: initImage('sprites/enemies/splint/splint-hurt.png'),
    stormedPhase1: initImage('sprites/enemies/stormed/stormed-phase-1.png'),
    stormedPhase2: initImage('sprites/enemies/stormed/stormed-phase-2.png'),
    drownedPhase1: initImage('sprites/enemies/drowned/drowned-phase-1.png'),
    drownedPhase2: initImage('sprites/enemies/drowned/drowned-phase-2.png'),
    drownedHurt: initImage('sprites/enemies/drowned/drowned-hurt.png'),
    drownedStunned: initImage('sprites/enemies/drowned/drowned-stunned.png'),
    drownedMinion: initImage('sprites/enemies/drowned/drowned-minion.png'),
    patroller: initImage('sprites/enemies/patroller/patroller.png'),

    // Food
    apple: initImage('sprites/food/apple.png'),

    // Items
    steelFieldKey: initImage('sprites/items/steelFieldKey.png'),
    steelSword: initImage('sprites/items/steelSword.png'),
    confoundedCaveKey: initImage('sprites/items/confoundedCaveKey.png'),
    spearOfTheDarkened: initImage('sprites/items/spearOfTheDarkened.png'),
    stormedSword: initImage('sprites/items/stormed-sword.png'),
    oldMansGlasses: initImage('sprites/items/oldMansGlasses.png'),
	speedySnowPath: initImage('sprites/items/speedySnowPath.png'),
    auraOfWarmth: initImage('sprites/items/auraOfWarmth.png'),
    drownedScythe: initImage('sprites/items/drownedScythe.png'),

    // Icons
    sacredStar: initImage('sprites/icons/sacredStar.png'),
    foodIcon: initImage('sprites/icons/food.png'),
    swordIcon: initImage('sprites/icons/inventory.png'),
    keyIcon: initImage('sprites/icons/key.png'),
    starIcon: initImage('sprites/icons/star.png'),
    questionMarkIcon: initImage('sprites/icons/questionMark.png'),

    // Interactives
    chestOpen: initImage('sprites/interactives/chest/chestOpen.png'),
    chestClosed: initImage('sprites/interactives/chest/chestClosed.png'),
    breezewayBase: initImage('sprites/interactives/breezeway/breezewayBase.png'),
    breezewayCenter: initImage('sprites/interactives/breezeway/breezewayCenter.png'),
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
		img: images.water
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
        dps: 50, // Default 50
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
        speed: 6, // Default 6
        sound: "Trail Walking"
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
        speed: 2,
        useDesc: "Press space to enter"
    },
    {
        id: "T",
        name: "tree",
        through: false,
        dps: 0,
        speed: 3
    },
    {
        id: "t",
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
        through: true,
        dps: 0,
        speed: 10, // Default 10
		sound: "Speedy Snow Walking" 
    },
    {
        id: "^",
        name: "suspensia",
        through: true,
        dps: 75, // Default (change) 75
        speed: 0.5 // Default (change) 0.5
    },
	{
		id: "+",
		name: "teleport",
		through: true,
		dps: 0,
		speed: 4,
		
	},
    {
        id: ";",
        name: "stun",
        through: true,
        dps: 0,
        speed: 0.25
    },
    {
        id: 'I',
        name: "ice wall",
        through: false,
        dps: 0,
        speed: 0,
    },
    {
        id: 'i',
        name: "cracked ice wall",
        through: false,
        dps: 0,
        speed: 0,
    },
    {
        id: 'X',
        name: "break",
        through: false,
        dps: 0,
        speed: 0
    },
    {
        id: 's',
        name: "shovel",
        through: true,
        dps: 0,
        speed: 4
    }
]

var flowers = [] // WIP
var flowersFinished = false


/**
 * Returns block information from the block id (e.g. '~')
 * @param {*} id The id for the block type you want info for 
 * @returns the object containing the data for that block type
 */
var getBlockById = function(id) {
    for (var i in blocks) {
        if (blocks[i].id == id) {
            return blocks[i]
        }
    }
}


/**
 * Gets block type info from block name
 * @param {*} name Block name
 * @returns the object containing the data for that block type
 */
var getBlockByName = function(name) {
    for (var i in blocks) {
        if (blocks[i].id == name) {
            return blocks[i] 
        }
    }
}

/**
 * Gets block type info from block coordinates
 * @param {*} x The x (in PIXELS) of the block to get info for
 * @param {*} y The y (in PIXELS) of the block to get info for
 * @returns the object containing the data for that block type
 */
var getBlockInfoByCords = function(x /* Pixels */, y /* Pixels */) {
    return getBlockById(curMap.getBlock(Math.floor(x / 75), Math.floor(y / 75)))
}

var getGameAlertInfoByCords = function (x, y, map) {
	for (var i in alerts) {
		if (alerts[i].x == x && alerts[i].y == y && alerts[i].map == map) {
			return alerts[i]
		}
	}
	return null
} 


/**
 * Landscape constructor
 * @param {*} arr Array of strings with block characters
 * @param {*} enterX The x-coordinate that the player will be standing at upon entry
 * @param {*} enterY The x-coordinate that the player will be standing at upon entry
 * @param {*} doorX The block x-coordinate that the door to enter is at
 * @param {*} doorY The block y-coordinate that the door to enter is at
 * @param {*} name The name of the map (should use spaces and capitalization)
 * @param {*} solve A function that constantly runs while the player is on the map (used for special map actions unique to this map)
 */
function Landscape(arr, enterX, enterY, doorX, doorY, name, solve) {
    this.arr = arr;
    this.grid = new PF.Grid(this.getDimensions().x, this.getDimensions().y)
    this.loadGrid()
    
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

    Landscape.all.push(this)
}

Landscape.all = []

/**
 * Loads the grid for pathfinding
 */
Landscape.prototype.loadGrid = function() {
    for (var i = 0; i < this.arr.length; i ++) {
        for (var j = 0; j < this.arr[i].length; j ++) {
            var c = this.arr[i].charAt(j)
            if (!getBlockById(c).through || getBlockById(c) == '!') {
                this.grid.setWalkableAt(j, i, false)
            }
        }
    }
}


/**
 * Display the map
 * @param {*} p Player object (just put p)
 * @param {*} mode Map display type (options: "Player View", "Map View", "Cutscene View", "Snippet View", "Camera View")
 * @param {*} cx X-coordinate to translate map display (only use for "Cutscene View")
 * @param {*} cy Y-coordinate to translate map display (only use for "Cutscene View")
 * @param {*} cscale Amount to scale map display (only use for "Cutscene View")
 */
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
            } else if (mode == "Camera View") {
				this.loadCase = (j * this.blockSize - curCX + width / 2 > -1 * this.blockSize &&
                    j * this.blockSize - curCX + width / 2 < width &&
                    i * this.blockSize - curCY + height / 2 > -1 * this.blockSize &&
                    i * this.blockSize - curCY + height / 2 < height + this.blockSize)
			}
            if (this.loadCase) {
                if (!!getBlockById(c).img) {
                    ctx.drawImage(getBlockById(c).img, j * this.blockSize, i * this.blockSize, 75, 75)
                }
                switch (c) {
                    case ',': // Grass
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
                        // if (i == 0 && j == 0 && flowers.length > 1) {
                        //     flowersFinished = true
                        // } 
                        // var hasFlower = (Math.random() <= 0.1)
                        // if (hasFlower && !flowersFinished) {
                        //     flowers.push({
                        //         cordX: j,
                        //         cordY: i,
                        //         x: Math.random() * 75,
                        //         y: Math.random() * 75
                        //     })
                        // }
                        break
                    case '~': // Water
                        // ctx.fillStyle = 'rgb(0, 0, 255)'
                        // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        ctx.drawImage(images.water, j * this.blockSize, i * this.blockSize, 75, 75)
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
                    var pulsation = Math.sin(elapsed / 12) * 2
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
                        ctx.drawImage(images.bush, j * this.blockSize - pulsation / 2, i * this.blockSize + pulsation, 75 + pulsation, 75) + pulsation
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
                        //     ellipse(j * this.blockSize + 20, i * this.blockSize + 25, 20, 20, "rgb(0, 0, 0)")
                        //     ellipse(j * this.blockSize + 20, i * this.blockSize + 50, 15, 15, "rgb(0, 0, 0)")
                        //     ellipse(j * this.blockSize + 50, i * this.blockSize + 30, 25, 25, "rgb(0, 0, 0)")
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
                    case 't': // Other tree (pine tree I think)
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
                        ctx.drawImage(images.tree2, j * this.blockSize + 7.5, i * this.blockSize - 70, 60, 120)
                        break
                    case ':': // Lock
						var c = this.blockSize / 2 // c = center
                        ctx.fillStyle = 'rgb(180, 180, 180)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ellipse(j* this.blockSize + (this.blockSize / 2), i * this.blockSize + (this.blockSize / 2), this.blockSize, this.blockSize, 'rgb(200, 200, 200)')
						ellipse(j* this.blockSize + (this.blockSize / 2), i * this.blockSize + (this.blockSize / 3), this.blockSize / 3.5, this.blockSize / 3.5, 'rgb(0, 0, 0)')
                     	triangle(j * this.blockSize    + c, i * this.blockSize    + c - 10,    j * this.blockSize - 15    + c, i * this.blockSize + 20    + c, j * this.blockSize + 15 + c, i * this.blockSize + 20 + c, 'rgb(0, 0, 0)')
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
                    case "^": // Suspensia
                        ctx.drawImage(images.suspensia, j * this.blockSize, i * this.blockSize, 75, 75)
                        break
					case "+": // Teleport
						ctx.drawImage(images.teleport, j * this.blockSize, i * this.blockSize, 75, 75)
						break
                    case ";": // Stun
                        ctx.fillStyle = 'rgb(79, 13, 13)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    case 'I': // Ice Wall
                        // ctx.fillStyle = 'rgb(0, 255, 255)'
                        // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        ctx.drawImage(images.iceWall, j * this.blockSize, i * this.blockSize, 75, 75)
                        break
                    case 'i': // Cracked Ice Wall
                        // ctx.fillStyle = 'rgb(0, 200, 200)'
                        // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        ctx.drawImage(images.crackedIceWall, j * this.blockSize, i * this.blockSize, 75, 75)
                        break
                    case 'X':
                        ctx.fillStyle = 'rgb(10, 10, 10)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    case 's':
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, 75, 75)
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
            var treePulsation = Math.sin(elapsed / 15) * 4
            if (c == "T") { // Tree
                ctx.drawImage(images.tree, j * this.blockSize - 10, i * this.blockSize - 50 - treePulsation, 95, 100 + treePulsation)
            } else if (c == "t") {
                ctx.drawImage(images.tree2, j * this.blockSize + 7.5, i * this.blockSize - 70 - treePulsation, 60, 120 + treePulsation)
            }
        }
    }
}


/**
 * Gets block char from coordinates
 * @param {*} x the x (in BLOCKS)
 * @param {*} y the y(in BLOCKS)
 * @returns Block character (e.g. '~')
 */
Landscape.prototype.getBlock = function(x, y) {
    return this.arr[y].charAt(x)
}

/**
 * 
 * @param {*} blocks array of block coords you're checking (2D array)
 * @param {*} c the block you're comparing to (string)
 * @returns boolean - true if ALL blocks in array are = to c
 */
Landscape.prototype.checkBlocks = function(blocks, c) {
    for (var i in blocks) {
        if (this.getBlock(blocks[i][0], blocks[i][1]) != c) {
            return false
        }
    }
    return true
}

/**
 * Changes a block on the map
 * @param {*} x The x (in BLOCKS)
 * @param {*} y The y (in BLOCKS)
 * @param {*} block The block char of the new block
 */
Landscape.prototype.changeBlock = function(x, y, block) {
    this.arr[y] = this.arr[y].replaceAt(x, block)
    this.changes.push({
        x: x,
        y: y,
        block: block
    })
}

/**
 * Changes multiple blocks to a specific block
 * @param {*} a Two dim array of coords (in BLOCKS)
 * @param {*} b The block char of the new block
 */
Landscape.prototype.changeBlocks = function (a, b) {
    for (var i in a) {
        this.changeBlock(a[i][0], a[i][1], b)
    }
}

/**
 * Switches two types of blocks for each other
 * @param {*} x Block coordinate x
 * @param {*} y Block coordinate y
 * @param {*} b1 Block type 1 (e.g. '~')
 * @param {*} b2 Block type 2 (e.g. '!')
 */
Landscape.prototype.switch = function(x, y, b1, b2) {
    if (this.getBlock(x, y) == b1) {
        this.changeBlock(x, y, b2)
    } else if (this.getBlock(x, y) == b2) {
        this.changeBlock(x, y, b1)
    }
}

/**
 * Gets the dimensions of the map
 * @returns Object containing .x and .y which give the lengths of the sides (in BLOCKS)
 */
Landscape.prototype.getDimensions = function() {
    return {
        x: this.arr[0].length,
        y: this.arr.length
    }
}

/**
 * 
 * @param {*} cx Center x coordinate the camera should focus on
 * @param {*} cy Center y coordinate the camera should focus on
 * @param {*} cspeed Speed that the camera moves to the specified coordinates
 * @param {*} type Type of camera use: ("NPC", "AUTO")
 * @param {*} config Variables specific to the camera type (e.g for "NPC" you would set lineStop or for "AUTO" you would set time)
 */
function Camera(cx, cy, cspeed, type, config) {
	this.cx = cx
	this.cy = cy
	this.cspeed = cspeed
	this.type = type

    if (!!config) {
        this.lineStop = config.lineStop
        this.time = config.time
    }


	this.showCamera = true
	this.cameraMoving = true
}

Camera.prototype.draw = function() {
	if (this.showCamera) {
		curCX = p.x
		curCY = p.y
		p.canMove = false
		finalCX = this.cx
		finalCY = this.cy
		cameraSpeed = this.cspeed
		cameraMoving = true
		camera = this
		scene = "CAMERA"
		p.canMove = true
		this.showCamera = false
        cutsceneFrame = 0
	}
}

Camera.prototype.move = function () {
	
}




/* Map Legend
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
Suspensia ^
Teleport +
Ice Wall/Cracked Ice Wall I/i
Stun ;
Break X
Shovel s
*/

var mainMap = new Landscape([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SO,,,,T,,,,,,,,,,,,,,,,,,,,TTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,T,,,,,TT@__!!!!________!!S!_____________________S__S__!!!__S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S****************************************************************************************,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,T,,,,TTTTTTTTT,,,,,,,T~~~~~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT@!______!___!!!!_S!____!!SSSSSSSS__SSS_SS__S__!_!__S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S****************************************************************************************,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,T~~~~T@,,,,@@T,,,,,,,T~~~~~~TTTTTTT,,,,,,,,,,B,,,,,,,,T,,,TT@SSSSSSSS!!SSSSSSS_______S___S_____S_______S_SSSSS_S!___________________SSSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SSSSSSSSS****************************************************************************************,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,T~~~~T@,,B,,,TT,,,,,,T~~~...------T,,,,,,,,BBBBB,T,,,,,,,,TT@________!!______S_________S_S_SS__SSS_SSSSS___!!__S____________________S------------------------------------------_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,T~~~~T,,BBB,,,TTTTT,,T~~~~~~TTTT--T,,,,,,,BBBBBBB,,,,,,,,,TT@!!!!_______SSS____!!______S___SS__________________S_______!____________SSSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SSSSSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,T~~~~T,BBBBB@,,,@@T,,T~~~~~~T,,T--T,,,,T,BBBBBBBBB,,,,,T,,TT@SSSSSSSSSSSSSS__S_!!SSSSSSSSSSSS__SSSSSSSSSSS!____S____________________SSSS!!!!!!!!!!!!!!!!!!$~~~~~~~~~~~~~~~~~~~~S*****************zz*********************************************************************,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,T~~~~T,BBBBB@,TTT@,,,T~~~~~~T,,T--T,,,,,,BBBBBBBBB,,,,,,,,TT@______S_________S___S__S______!S____________S_____S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*****************zz****************************************************SS***************,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,TTTTTT,BB|BBTTT,,TTTTTTTTTTTT,,T--TT@@@@@BBBB|BBBB@@@@@,,,TT@___!!_S_________SS_______S_____SSSSSSSSSSS__SS____S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*****************zz******************************************SS********SS********SS*****,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,,@--------ssssss-ss----ss---------------------------------TTS___!!_S___________SSSSSSSSSS_S_S_________S!__S__!_S_______!____________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*******WWW*******zz*****************************************SSSS**SS**SSSS**SS**SSSS****,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,@@--------------s--s----------------------------------------:S_____________!!S__________S!SSSSSSSSSSS_____SS___S________________!!!!SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS******WWWWW******zz****************WWWWWWWWWWWWWWWWW******SSSSSSSSSSSSSSSSSSSSSSSSSSSS**,,,,,,,,,,,,,,,,,,,,',
    'S,,,,,@--@,,@,,,,,,,,,--,,,,,,,,,,,,S,,_______________,,,,--,,,,TTS______SSSSSSSS!!SSSSS__________!_______S__!__!S___S_______________!!!!!S___******************zz**WWW*************zz****WWW...WWW****zz*****W**********W*****WzzzzzzzzzW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'S,,,,@@s-@,,@,,,,,,,,,--,,@@,,,,,,,SSS,,,,,,,,,@@@,,,,,,,,--,,,,TT@@@@@@@@@@@@@@@@@@@@@@@@@@SSSSSSS___S___S__S!__S!__S_______________!!!!!S___******************zz*WW.WW***.........zz**WWW.......WWW**zz****W.W*********W*****Wz!!SSS!!zW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T,,,,@s--@,,@,,,,,,,,,--,,@@,,,,,,SSSSS,,,,,,,,@@@,,,,,,,,--,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTT______S___S___S__S___SSSSS____!!_________!!!!!S___****..........****zzWW...WW**.~~.,tt,.zzWWWWWWWWWWWWWWWWWzz***W...W********WWWWWWWz!SSSSS!zW*********SSSSSSSSSSSSSSSSSSSSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T,,,,@s-@@,,@,,,,,,,,,--,,,,,,,,@@SS|SS@@,,,,,,,,,,,,,,,,,--,,,@TTTTTTTTTTTTTTTTTTTTTTTTTTTTSSS___S___S___S__S_______S____!!_________!!!!!S*******.tt.~~~~~.****zzW..W..W**.~~.,tt,.zzW...............Wzz**W.....W*******WW!!!!!z!SSSSS!zW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T@TTT@s-@TT,,@,,,,,TTT--------------------------------------,,,@@@,,,,,,,,,,,,________,,,,TT!!_S__S___S___S__SSSSSSSSSS_______________!!!!S*******.,,.~~~~~.****zzW.WWW.W**.........zzW......WWW......Wzz**W.WWW.W*******WW!~~~zz!SSSSS!zW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T@,,,@-s@@T~~~~~~~~~~W--------------------------------------,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,TT!!_S______!!__S___________S___________________S*******..........****zzWWW|WWW***********zzWWWWWWWW|WWWWWWWWzz**WWW|WWW*******WW!z!!!z!SS|SS!zW*********SSSSSSSSSSSSSSSSSSSSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T@,,,@--s@T~~~~~~~~~~W--W~~~~~~~TTTTTTTTTTTTTTTTTTTT~TTTTTT,@~~~~~@,,,,,,,,,,_~~~~~~~~_,,,TTSS___SS___!!__S___________S___________________SzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzW!!z!W!z!!!z!!!zW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T,,,,@@-s@@T~~~~~~~~~W--W~~~~~~~T~~~~~~~~~~~~~~~~~~T~T,,,,T,,@~~~@,,,,WWW,,,,_~~~~~~~~_,,,TT!!SSSSS___S___S__SSSSSSS__S_____$__!!____SSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz~!W!z!!!~!zzzW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,@--s@T~~~~~~~~~W--W~~~~~~~T~~~~~~~~~~~~~~~~~~T~T,,,,TT,,@~@,,,,WWWWW,,,_~~~~~~~~_,,,TT__________S___S__S_____S__S____$$$_!!____SSSSSS*******************zz*tttttttt*******zzTzzTTTTTTTTTTTTTTTTTTTTTTTTTT**********W!!!!W!~~zzz!WWWW*********SSSS__S__SSSS__S__SSSS*****,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,@@--@TTTTTTTTTTW--W@~~~~~~T~~~~~~~~~~~~~TTTT~T~TT,,,,T,,,,,,,WWWWWWWWW,_~~~~~~~~_,,,TT__________S___S__S___!!SSSS___$$$$$______SSSSSS*******************zzt~~~~~~~~t******zzTz,,,,,,t,,,,,,,,,,,,,,,,,,,T**********WWWWWW!!!!WW!W**W****ttSSSSSSSSSSSSSddSSSSSSSSSSSSSTT,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,T--,,,,,,,,,@W--W@~~~~~~TTTTTTTTTTTTTTT~~~~~~~TTTTT,,,@~@,,WWWWWWWWW,_~~~~~~~~_,,,TTSSSSSSSSSSSSSSS__S___!!S______$$$$$_____SSSSSSS*******zzzzz*******zzt~~~~~~~~t******zzT,,,t~,,~,,,~t,,,,~,t~,,,,,,T**********WWWWWWWWWWWWWWWWW************************************,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,T--,,,,,,,,,,,--TTTTTTTTT-------------TTTTTTT~~~~~~,,@~~~@,WWWW|WWWW,_~~~~~~~~_,,,TT____!!___S_______S_____S______$$|$$_____SSSSSSS******zzzzzzz******zzt~~~~~~~~t******zzT,,,,,,,,,,,,,,,,,t,,,,,,,,,T***************************************************************,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,T-------------------------------------------TTTTTTT,@~~~~~@,,,---,,,,_~~~~~~~~_,,,TT____!!___S_____________S________________S!SS|SS*****zzzzzzzzz*****zzt~~~~~~~~t******zzTTTTTTTTTTTT,,,,,,,,,,,,t,,,T***************************************************************,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,T--,,B,,T,,W,,--T~~~~~~~TT@@BBBBB@@-----------------------------------________,,,,TT_________SSSS_SSSS_____S________!!______SSS___S*****zzzzzzzzz*****zzt~~~~~~~~t******zz***********TTTTTTT,,,,,,s,,,T***********************************************zzzz************,,,,,,,,,,,,,,,,,,,,',
    'TTTT,TTTT--,BBB,T,WWW,--T~~~~~~~--@BBBBBBB@---@TTTT---------------------------,,,,,,,,,,,,TT____________S____SS____SSSSSSSS_!!______S!S___S*****zzzzzzzzz*****zzt~~~~~~~~t**SSSSzzSSSS*************TTTTTTTTTTTT*******************TTTTTTTTTTTTTTTTTTTTTTTTTTTT~~Tz************,,,,,,,,,,,,,,,,,,,,',
    'T///,///T--BBBBBTWWWWW--T~~~~~~~--BBBBBBBBB---@T,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,,,TTSSSSSSSSSSSS_______SSS_S______S_________SSS___S*****zzzzzzzzz*****zz*tttttttt***S~~SzzS~~S*******************************************TT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Tz************,,,,,,,,,,,,,,,,,,,,',
    'T/,,,,,/T--BB|BBTWWWWW--T~~~~~~~TTBBBB|BBBB---@T,,,,,,,,,,,,,,,,,,,,,,,,,,,,--,,,,,,,,,,,,TT_S_____S_S_S_SS!!!__SS_S_SSSS)S______________SS*****zzzzzzzzz*****zz************S~~SzzS~~S*******************************************T~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Tz************,,,,,,,,,,,,,,,,,,,,',
    'T/,,,,,/T-------TWW|WW--TTTTTTTTTT------------@T,,,,,,,,,,,,,,,@@@,,,,,,,,,,--,,,,,,,,,,,,TT_!_____S_S_!_S___!_______S!!S)S______________SS******zzzzzzz******zz************SSSSzzS~~S*******************************************TIIITTTTTTTTTTTTTTTTTTTTTTTTTTTTz************,,,,,,,,,,,,,,,,,,,,',
    'T/,,,,//T-TTTTT-T----------------TTTTTTTTT@---@T,,,,,,,,,,,,,,,@@@,,,,,,,,,,--,,,,,,,,,,,,TT_SSSSSSS_SS!_S___SSSSS_S_S!!S)S_______$______SS*******zzzzz*******zzzzzzzzzzzzzzzzzzzzS~~S*******************************************T~~~~~~~~~~~~~~~~~~~~~~~~~~~~TTTS************,,,,,,,,,,,,,,,,,,,,',
    'TT/////TT-T,,,--TTTTTT--TTTTTTTT---------------T,,,,,,,,,,,,,,,@@@,,,,,,,,,,,--,,,,,,,,,,,TT_____________S_________S_S!!S)S______$!$_____SS*******************zzzzzzzzzzzzzzzzzzzzSSSS*******************************************T~~~~~~~~~~~~~~~~~~~~~~~~T---TTTzS***********,,,,,,,,,,,,,,,,,,,,',
    'TTTT~TTT--T,,,----------,,,,,,,TTTTTTTTTTTT----TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT--,,,,,,,,,,,TTSSSSSSSSSSSS_SSSSSSSSS_S_S!!S_S_____$!!!$____SSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTS:STTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT---TTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,',
    'T~~~~T---TT,,,-,,,,,,,,,,/////,,,,,,,,,,,,T------------------------------------,,,,,,,,,,,TT___________S______!__S_SSSSSSSSSSSS$!!!!!$___SS*************************************SSS***********S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~TTTT-TTT,,,,-,,,,,//////~~~//////,,,,,,,T------------------------------------,,,,,,,,,,,TT___________S_________S____________$$$$$$$$$__SS**********************W!**z*|***WW*|*W*W***********S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~~~~T-T,,,,,,-//////~~~~~~~~~~~~~//////,,T,,,,TTTTTTTT@,,,--,,,@TTTTTTTTTTTTT-,,,,,,,,,,,TT___________S!________S____________$$$$$$$$$__SS*********************WWW*z**W***W*z**W*WWW**!******S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTT~T-T,,,,,-//~~~~~~~~~~~~~~~~~~~~~~~//,T,,,,T,,,,,,,,,,,--,,,,,,,,,,,,,,-------,,,,,,,,TT____________S!!!__SSSSSSSSSSSSSS__$$$$$$$$$__SS**********************|*****WWW**W***z|**|**W******S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~~~~T-T,,,,-//~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,,==============,,,,,,,--BBBBB--,,,,,,,TTSSSSSSSSSS__S_____S__$___!_____S__$$$$$$$$$__SS******************!W*z*WWW***W!z*z**WW*WWWW********S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~TTTT-T,,,-///~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,@--B=====B--@,,,,,TT_XXX________S__!!!S_$$$________S__$$$$|$$$$__SS********WW**z**W***WW!*z*W**z*****W**z******WWWW***S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~~~~T-,,,-///~~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,@-B=======B-@,,,,,TTSSSSSSSSSS__S_____S$$$$$_______S_____!_______SS*********|**z******Wz*****z***|*zW!**W*W*zWWz***W**S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTT~T-,,,-///~~~~~~~~~~~~~~~~~~~~~~~~///,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,,-B=======B-,,,,,,TT____!!!!!S__S!!!__S$$$$$_______S_____!_______SS********WW**!*|****W***W!***WW**W****W****W***WWW**S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~~~~T-T,,,-///~~~~~~~~~~~~~~~~~~~~~~////,T,,,TT,,,,=..............=,,,,,-B=======B-,,,,,,TT___!!!!!_S__S_____S$$$$$_______SSSSSSS_SSSS__SS******!**W********WWWz*WW**|*W****|*z**W*W**WW*****S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~TTTT-T,,,-///~~~~~~~~~~~~~~~~~~~~~/////,T,,,T,,,,,=..............=,,,,,-B==BBB==B-,,,,,,TT__!!!!!__S__S__!!!S$$|$$__________________S__SS******W*|W**W**W!**W*W***|****W*WW!*WW**z|**WW*****S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~~~~T-T,,,-////~~~~~~~~~~~~~~~~~~~//////,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,-BBBB|BBBB-,,,,,,TT_!!!!!___S__S_____________________________S__SS******W**WWWWW*W*****W!WWW!z**z**WW**W***z*z*****W*S**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTT~T-T,,,,-/////~~~~~~~~~~~~~~~///////,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,-----------,,,,,,TT!!!!!____S__S_SSSSSSSSSSSSSSSSSSSSSSSSSSSSS__SS*********!*****W*W*W*****W*|z**z*|*z*|*W!W**WWW****S**********************************T,,,,,,,,,,,,,,,,,,,,,,,TT--TTT,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T~~~~T-T,,,,--/////////~~~~~////////////,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,,,,,,,,,,,,,,,,,,TTSSSSSSSSSS__S_S______________________________SS******|W***W!******!WW*W!WW*!WzW*W**WW***WW*W*z*W**S**********************************T,,,,,,,,,,,,,,,,,,,,,,TT,,,,,TT,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTTTT,TTTTTT-//////////////////////,,,,,,T,,,T,,,,,,==============,,,,,,,,,,,////////////TT____________S_S______________________________SS*****zWW*********z*****|**!*WW***W******z*z*!*W****S**********************************T,,,,,,,,,,,,,,,,,,,,,TT,,,T,,,TT,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TT~~~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TTSSSSSSSSSS__S_S______________________________SS********W***W*W!zzz!W****W***z*WW*z*WW*****WWW**W**S**********************************TTTTTTTTTTTTTTTTTTTTTTT,,T,T.T,,TTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,',
    'TT~~SSSSS~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,TTT,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TT_________S_SS_S______________________________SS************z**W!z!W**z**WW****z*!***!W**W*********S**********************************T------@@@@TT~~T@@-----,,.,,,,,,-------@@@@TT~~T@@----T,,,,,,,,,,',
    'TT~SOOOOOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TTSSSSSSSS______S______________________________SS*********WW**W**W!W**W*****z********W**z*WWW***W***S**********************************T------------TT----TTT-,TT,,,TT,-------------TT----TTTT,,,,,,,,,,',
    'TT~SOOOOOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT!S!S!!!SSSSSSSSS!SSS!SSS!!SSS!S!!SSS!S!SS!!SSSS**********z|*W***W**WW*z**W***WW*****W***!****W****S**********************************T------@@@@T----TTT~~~T,,,,,,.,,-------@@@@T----TTT~~~T,,,,,,,,,,',
    'TT~SOOOOOS~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S!S!!S!S!!S!SS!!S!S!!SS!S!S!!S!S!SS!SS!SS!_SS!SS***********zz****|*z*!*W**W**********|**W*zz***z***S**********************************TTTTTTTTTTTTTTTTTTTTTTT,,T.T,T,,TTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,',
    'TT~SOSSSOS~TT,,,,,,,,,,,~~~~~,,,,,,,,,,,,,,,,,//////,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSST,,,,,,,,,,,,,,,,,,,,,TT,,,T,,,TT,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TT~SOSSSOS~TT,,,,,,,,,,~~~~~~~,,,,,,,,,,,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS!SS!!S!!!!!S!!S!SS!S!S!S!S!!S!S!S!S!S!S!SS!SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,TT,,,,,TT,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TT~_SS:SS_~TT,,,,,,,,,~~~~~~~~~,,,,,,,,,,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS________SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,TT---TT,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TT~~~~~~~~~TT,,,,,,,,,~~~~~~~~~,,,,,,,,,,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS_SSS!SS________S________SSSS_______________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTTTTTTTTTTT,,,,,,,,,~~~~~~~~~,,,,,,,,T,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS_S__S_SSS!SSSS_S_SSSSSS_S____SSSSS!SSSSSS_SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,~~~~~~~~~,,,,,,,,T,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS____S________S_!__!!!!S_SSS!SSSSSSS___SSS_SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,~~~~~~~~~,,,,,,,,T,,,,,/~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSSSS!SSSSSS_S_!_!!$_!!!SSS_!!!_______S_S!S_SS!,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,~~~~~~~,,,,,,,,,T,,,,,,//////,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S__________!_S_S_!$$$!__S!S!!!$!__SSS_S_!!S_SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,~~~~~,,,,,,,,,,T,,,,*,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S_!SS!SS_S_S_S___$$$$$__SSS!!$$$__S!S_!!!!__SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____S_!_S_S_S__$$$$$$$_____$$$$$_SSS_SSS!SSSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S!SS_S_S_S_S_S__$$$$$$$_!!__$$$$$_____SSSSSSS!S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,T~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S__S_!___S___S__$$$|$$$!!!__$$|$$___SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,T~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S__S!!SSSSSS!SS_________!____________)))~~~,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,,TTTTTTTTT,,,,,,,,,,T~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S___!!!S______SSS_SS!S_______SSSSSSSSSSS,,~~~,,,,,,,,,,,,t@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,',
    'T,,,,TT,,BBB,,TT,,,,,,,,,TTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S_S!SSSS_SS!S___S__S_______!!S,,,,,,,,,,,,,,~~,,,,,,@t,,,,,,,,,,,,@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTT---TTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,',
    'T,,TTT,,BBBBB,,TT,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S_S______S!!!__!!__S____SS!!!S,,,,,,t,,,,,,,,~,,,,,,,,,,,@,t,,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,S~~~~-~~~~S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,TT,,,@BB|BB@,,TT,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S_SS!SSS_SSS!SSSS__S!___S!!__S,,,,,,@,,,,,,,,~~~,,,t,,,,,,,,,,,@,,,,@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S~~~S-S~~~S,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,',
    'TTT,,,,,,,,,,,,,TT,,,-------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S______S______$___!!!!___SS__S,,,,,,,,,t@,,,,@@~@@,,,@,,,t@,,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S~~~S-S~~~S,,,,T,,,,,,,,,,,T~~~~~~T,,,,,,,,',
    'T@///////@------TT,,--------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S!SSS!_SSS!SS$$$__S!S____S___S,,@,,,,,,,,,,,,,,~~@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT~~~~~~~TT~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,SSS~S-S~SSS,,,,,,,,,,,,,,,T~~~~~TT,,,,,,,,,',
    'T@~~~~~~~@@@@TT--,,---,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S!$____S___S$$$$$_SSS____S___S,,t,,,,,@,,,,,,,,,~,,t,,,,,@,,,,,@t,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT~~~~~~~TT~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,B,,,,,,,,,,,,,///~S-S~///,,,,,,T,,,,,,TT~~~~TT,,,,,,,,,,,',
    'T@~~~~~~~@TTTT,------,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S$$$_SSSSS_S$$|$$_S______S___S,,,,,,,,,,,t,,,,,@~@,,,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTT,,,TT~~~~~~~TT~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,BBB,,,,,,,,,,,/~~~~S-S~~~~/,,,,,,,,,TTT~~~TTT,,,,,,,,,,,,,',
    'TTTTTTTTTTT,,T,-----,,,,,,TTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S$$$_S!!!S________S______S___S,,,,@,,t,,,,,,,,,@~@@,,,,,SSSS,,,,,,,,,,,,,,,,,,,,,,,,-----TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BBBBB,,,,,,,,//~~~~~S-S~~~~~//,,,,,TT~~~~WBWBW,,,,,,,,,,,,,',
    'T~~~~~~~~~~~~T,--,,,,,,,,,T////////////////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S$|$_S!!!S_SSSSSSSS__________S,,t,,,,@,,,,,,t,,,~~~,,,,,S~~S,,,,,,,,,,,,,,,,,,TTTTTTTTTT--TTT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,WTTTTT-,,,,,,,TBBBBBT,,,,,,/~~~~~~~S-S~~~~~~~/TTTT~~~~~~BWBWB,,,,,,,,,,,,,',
    'T~~~~~~~~~~~~T,---,,,,,,,,T/~~~~///////~~//T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____SSSSS_S_________________S,,,,,,,,,,,@,,,,,,,,~~,,,,S~~S,,,,t,,,,,,,,,,,,,----TTT~~~---TT-TTTTTTTTTTT------,,,,,,,,,,,,W.W,,,T-,,,,,,T@BB|BB@T,,,,,/~~~~~~~S-S~~~~~~~~~~~~~~~~TTWBWBW,,,,,,,,,,,,,',
    'T~~~~~~~~~~~~T,,---,,,,,,,T/~~~~///////~~//T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_________S___SSSSSS__________S,,@,,t,,,,,,,,,,,,,,@~@,,,SSSS,,,,,,,,,,,,,,,TTTTTT---T~~~-T--T-----------TTTTTT--,,,,,,,,,,W...W,,T-,,,,,,T@@---@@T,,,,/~~~~~~~~S-S~~~~~~~~~~~~~TTT@@BW|WB,,,,,,,,,,,,,',
    'T~~~~~~~~~~~~T,,,----------////////////~~//T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_____SSS_SS_SS____S__________S,,t,,,,@,,,,,,,@t,,,@~~@,,,,,,t,,,,,,,,,,,,,,T----TTT-TTTT-TT-----TTTTTTT------TT--,,,,,,,,W.....W,T-@@,,,,T~@---@~T,,,/~~~~~~~~~S-S~~~~~~~~~/TT~~~~--T---T,,,,,,,,,,,,,',
    'T~~~~~~~~~~~~T@,,,---------///////~~///////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_______S_______SSSS__________S,,,,,,,,,,t,,,,,,,,,,,-,,,,,,,@,,,,,,,,,,,,,,T------T----T-TTTTT--T~~~~~T@@W@@--TT-,,,,,,,W.......WT-@@,,,,T@@---@@T,,,/~~~~~~~~~S-S~~~~~~~~~/,,TTT~~-------,,,,,,,,,,,,',
    'T~~~~~~~~~~~~T@,,,,,,,,,,,T/~~////~~///////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_______SSSSSSSSS_____________S,,,,,,,,,,@,,,@,,,,,,-~-,,,,,,,,,t,,,,,,@,,,,T-TTTT-TTTT---TT,,T--T~~~~~T@WWW@T--T--,,,,,W.........W----,,,TTT---TTT,,//~~~~~~~~~S-S~~~~~~~~~//,,,,T~~~~~~~~,,,,,,,,,,,,',
    'TTTTTTTTTTTTTT@,,,,,,,,,,,T/~~////~~///////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_____________________________S,,,,,,,,,,,,,,t,,,,,,,-~@,t,,,,,,,,@,,,t,,,,TW-T~~T-T~~~T-TT,,,T--T~~~~~TWWWWWTT-TT---WWWWWWWWWWWWWWWWW-,,,T~~---~~T,,/~~~~~~~~~S---S~~~~~~~~~/,,,,,TTTTTTTT,,,,,,,,,,,,',
    'T,,,,,,,,,,@@@@,,,,,,,,,,,T////////////////T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_____________________________S,,,,,,,,,,,,,,,,SSSS,,@~@,,@,,t,,,,,,,,,,,,,):-T~~T--TTT--T,,,,T--T~~~~~TWWWWW,T--TT@@W......WWW......W-,,,,T~~---~~T,/SSSSSSSSS-----SSSSSSSSS/,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_____________________________S,,,,,,,,,,,,,,,,S~~S,,@~,,,,,,,,,,,,t,,,,,,,TW-T~~T------TT,,,,T--T~~~~~TWW|WW,TT--T@@W.....WBBBW.....W-TT,,,T~~------------------------------/,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_____________________________S,,,,,,,,,,,,,,,,S~~S,,@~t,@@,,,@,,,,,@,,t,,,,T-TTTT--TTTTT,,,,,T--TTTTTTT-------TT-T@@WWWWWWWB|BWWWWWWW-TT@,,@TTTTT-,,/SSSSSSSSS-----SSSSSSSSS/,,,,,,T,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,_____________________________S,,,,,,,,,,,,,,,,SSSS,,,~~~~@,,,,,,t,,,,,,,,,,T------TT,,T,,,,,,T-TT,,,,,,,,,,,,----TT-------------------------------,,/~~~~~~~~~S---S~~~~~~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,t,,@~~~~,,,,,,,,t,,@,,,TT-TTTTT,,TT,,,,,,T-T,,,,,,,,,,,,,,,,----------------------------------,,//~~~~~~~~~S-S~~~~~~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,@@t~~~,,,@,,,,,,,,,TT-T------T,,TTT,,T-T,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T,,,,,,,,,,,,,-,,,/~~~~~~~~~S-S~~~~~~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~t,,,,,,,,,,,TT--T-TTTT-TTTT.TTTT-T,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T,WWW,,,,,,,,,-,,,/~~~~~~~~~S-S~~~~~~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,.,,,,,@~~~~,,,,,,,,TT--TT-T,,T-----------T,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~TW...WTTTTTTTT-,,,,/~~~~~~~~S-S~~~~~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,WWWW,,,,,,,,,,,.~.,,,,@@,,~~~,,,,,,T--TT--T,,TTTT-TTTTTTTT,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~TTTTTT~~~~~@---@,,,,/~~~~~~~S-S~~~~~~~/,,,T,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,W~~W,,,,,,,,,,,,.,,,,,,,,,,@~~,TTTTT-TT--TT,,,,,T-WWWWWWWW,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~~~@@@@@---@,,,,,/~~~~~~~S-S~~~~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,W~~W,,,,,,,,,,,,,,,,,,,,,,,@@~,T---T----TT,,,,,,T-W~~~~~~W,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~..-------@,,,,,,,//~~~~~S-S~~~~~//,,,,,,,,,,,,,T,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,WWWW,,,,,,,,,,,,,,,,,,,,,,,,,~~T---TTT-TT,,,,,,,T-W~~~~~~W,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~..------@,,,,,,,,,,/~~~~S-S~~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~T-----T--T,,,,,,,T-WWWWWWWW,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~~~@@@@@@,,,,,,,,,,,,///~S-S~///,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~TTTTT-TT-T,,,,,,,T---------,,,,,,,,,,,,,,,,,,,,,,TTTT,,,,,TTTT,TTTTT,,,,,,,,,,,T,,,,,,,,,/////,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~@,,,T-TT-T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@~~,,,,T----TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~~~@,,,,TTTT--TTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@~~~~~@@,,,,,,,,TT------TTT------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~~@@,,,,,,,,,,,,,TTTTTT-TT--TTTT--,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,~~~@,,,,,,,,,,,,,,,,,,TT-----TT,,TT---,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,@~@,,,,,,,,,,,,TTT,,TTTT--TTTTT@,,,TTT-----,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,@~~@,,,,,,,,,,,,T-T,TT----TT,,,@@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,@~@@,,,,,,,,,,,,,T-TTT--TT-TTT,,,@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,@,,,,,,,,,,,,,,,T-T---TTT---TTTT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T-T-TTTTTTT---TT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,----,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'
], 0, 0, null, null, "Main Map")

var c = new Camera(200 * 75, 15 * 75, 15)
mainMap.solve = function() {
    // Encompassed Forest
    function correctDir() {
        var lostTravelerLine = lostTraveler.lines[0]
        switch (lostTraveler.dir){
            case "U":
                return lostTravelerLine
                break             
        }
    }

    // Blocked Entrance Complete
    if (keys.space) {
        if (theBlockedEntrance.complete && p.on(252, 81)) {
            curMap = droptonCity
            p.goTo(35 * 75 + 37.5, 27 * 75 + 37.5)
        }
    }
	
    // Lonzo mannn
    if (lonzo.playerDist <= 500 && lonzo.firstInteraction) {
        lonzo.remote = true
        
     }

    // Wanderer GV
    if (!!getGameAlertInfoByCords(205, 24, mainMap)) {
        if (getGameAlertInfoByCords(205, 24, mainMap).playerRead) {
            curMissions.push(theWanderersRiddlesGV)
        }
    }
	
}


var imperilledPrison = new Landscape([
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$O_____________$$$$$$$$$$$$_______________________$',
    '$_________________________$_______________________$',
    '$______________$$$$$______$_______________________$',
    '$__________________$______$$$$$$__________________$',
    '$__________________$___________$__________________$',
    '$__________________$__$$$$$$$__$__________________$',
    '$__________________$_$!!!!!!!$_$__________________$',
    '$__________________$_$!$$$$$!$_$__________________$',
    '$__________________$_$!$$$$$!$_$__________________$',
    '$__________________$_$!$$;$$!$_$__________________$',
    '$__________________$_$!$$_$$!$_$__________________$',
    '$__________________$_$!$___$!$_$__________________$',
    '$__________________$_$!$$_$$!$_$__________________$',
    '$__________________$_$!!$_$!!$_$__________________$',
    '$__________________$__$$$_$$$__$__________________$',
    '$__________________$___________$__________________$',
    '$__________________$$$$$$_$$$$$$__________________$',
    '$_________________________________________________$',
    '$_________________________________________________$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
], 75 + 37.5, 75 + 37.5, 1, 1, "Imperilled Prison")

var prisonCameraActivated = false

imperilledPrison.solve = function () {
    if (curMap == imperilledPrison) {
        lighting = 1500
        if (!(p.cords.x == 25 && p.cords.y == 10)) {
            
            //playSound("Alarm", true)
            if (!prisonCameraActivated) {
                cutsceneFrame ++
                console.log(cutsceneFrame)
                p.canMove = false
                if (cutsceneFrame > 50) {
                    alerts.push(new GameAlert(165, 17, ["WHAT? The alarm turned on?", "That must be an error..."], imperilledPrison, "NPC Prison Guard"))
                    cameraStart(19 * 75, 2 * 75, 10, "", {})
                    prisonGuard.lines = [
                        "WHAT?! You escaped?!",
                        "I don't have time to explain.\nNot that I could explain anyways...",
                        "`I never thought this job would be eventful...\nI just do it for the trills.",
                        "You have to follow me..."
                    ]
                    prisonCameraActivated = true
                }
            }

        }
    }
    
}

var johnHouse = new Landscape([
    '=======',
    '=======',
    '=======',
    '=======',
    '=======',
    '===|==='
], 3 * 75 + 37.5, 5 * 75 + 37.5, 15, 8, "John's House")

var ronHouse = new Landscape([
    '___|___',
    '_______',
    '_______',
    '_______',
    '_______',
    '_______'
], 262.5, 25, 36, 14, "Ron's House")

var mikeHouse = new Landscape([
    '---------',
    '---------',
    '---------',
    '---------',
    '---------',
    '---------',
    '----|----',
], 4 * 75 + 37.5, 6 * 75 + 37.5, 51, 8, "Mike's House")


mikeHouse.solve = function () {

	if (p.cords.x == 8 && p.cords.y == 5 && keys.x && !secrets[0][3]) {
		p.giveItem(items.chardTownBeam, true)
		secrets[0][3] = true
		
	}
}
var lyraHouse = new Landscape([
    '.............',
	'........_....',
	'......._.....',
	'......_......',
	'..._._.......',
	'...._........',
    '..._._.......',
    '.._..........',
    '.............',
    '......|......'
], 7 * 75 + 37.5, 4 * 75 + 37.5, 13, 27, "Lyra's House")

var carolHouse = new Landscape([
    '=========',
    '=-----@@=',
    '===----@=',
    '=~=-----=',
    '====|====',
], 4 * 75 + 37.5, 4 * 75 + 37.5, 38, 27, "Carol's House")

var leyHouse = new Landscape([
    '.......',
    '.......',
    '.......',
    '.......',
    '...|...'
], 3 * 75 + 37.5, 4 * 75 + 37.5, 19, 28, "Ley's House")

var sarahsShop = new Landscape([
    'WWWWWWWWW',
    'W@W...W@W',
    'W,W...W,W',
    'W~W...W~W',
    'WWWW|WWWW',
], 4 * 75 + 37.5, 4 * 75 + 37.5, 71, 22, "Sarah's Shop")

var rowansDojo = new Landscape([
    'BBBBBBBBBBB',
    'B=========B',
    'B=B==B==B=B',
    'B=========B',
    'B=========B',
    'B=B==B==B=B',
    'B=========B',
    'B=========B',
    'B=B==B==B=B',
    'B=========B',
    'BBBBB|BBBBB',
], 5 * 75 + 37.5, 10 * 75 + 37.5, 78, 42, "Rowan's Dojo")

var smithHouse = new Landscape([
    '!S_______',
    '!S_______',
    'SS_______',
    '_________',
    '_______SS',
    '_______S!',
    '____|__S!',
], 337.5, 412.5, 130, 37, "Smith's House")

var rickHouse = new Landscape([
    '!S___SSSSS',
    'SS___SS___',
    '__________',
    'SS___SS___',
    '~S|__SSSSS'
], 2 * 75 + 37.5, 4 * 75 + 37.5, 136, 23, "Rick's House")

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
    '____$___$_$_$_.~~~~~~~~~~._$_$_O$_$_$_S_S_S_S_S_____',
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
], 75, 75, 0, 0, "Darkened Room", function() {
    if (bosses[0].health > 0) {
        bossfight = true
    } else {
        bossfight = false
    }
}) // You don't enter through a door

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

var trailShop = new Landscape([
	'WWWWWWWWWWWWW',
	'W...........W',
	'W...........W',
	'W.WWWWWWWWW.W',
	'W...........W',
    'W...........W',
	'W...........W',
	'W...........W',
	'WWWWWW|WWWWWW'
], 6 * 75 + 37.5, 7 * 75 + 37.5, 165, 16, "Trail Shop")

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
    p.cordSave =    {
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
    '__________________SSS____~S~~zz~OS__________________SSzzSzzS',
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
], 32 * 75 + 37.5, 24 * 75 + 37.5, 156, 50, "Gale Cave")
// look at chat jumpscare
galeCave.solve = function() {
    p.cordSave = {
        x: 157,
        y: 50
    }
    
    if (
        this.getBlock(12, 10) == "," && // Fo solve
        this.getBlock(1, 18) == "_" && // Fi solve
        this.getBlock(41, 3) == "!" && // Fum solve
        this.getBlock(50, 19) == "~") { // Fee solve
        // Animates lighting up the cave
        if (lighting <= 1500) {
            lighting += 15
        }
        
        if (getInteractive(27, 24, galeCave).toggleState == 2 && getInteractive(27, 26, galeCave).toggleState == 2 && getInteractive(27, 23, galeCave).toggleState == 1 && getInteractive(27, 25, galeCave).toggleState == 1) {
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
            // code to take you into Howler Hollow
            curMap = howlerHollow
            p.x = 75 + 37.5
            p.y = 75 + 37.5
        }
    
        if (p.cords.x == 0 && p.cords.y == 35) {
            // code to take you out of Gale Cave
        }
    }
}

var howlerHollow = new Landscape([
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$.....*$$*...$$*..*$$$.$$$!__$',
    '$.....*SS...*$$$$..$$$.$.*__!$',
    '$**.**.$$....SS.$...$$.$..!$$$',
    '$$$$))$$$*...$$$$*..$$.$*.__$$',
    '$$$$*.$$$.*..$$$$...$$.$SS!_!$',
    '$.....$$$$$$$$$$....$$.$.!__$$',
    '$__$$....*..$$$...*$$$.$S__$$$',
    '$..$$*......$$*...$$$$.$S$$$$$',
    '$..$$$$$$$..$$...$$$$$S$S$$$$$',
    '$..$$*..$$....S)S..*.._..$$$$$',
    '$.!$$...SS....(_(....._.*$$$$$',
    '$..$$...$$...$$$$$*..._..$$$$$',
    '$!.$$$*.$$$$$$$$$$$$$$SSSSSS$$',
    '$..$$$..$$$$$$$$$$$$$$$$$$$S$$',
    '$.!$$$..*.......:S!~!~!~!.$S$$',
    '$..$$$.........*$$$$$$$$$$$S$$',
    '$!.$$$$$$$$$$$$$$$$$SSSSSSSS$$',
    '$..!!.$$$$$$$$$$$$$$S$$$$$$$$$',
    '$!..!.$SSSSSSSSS$$_$S$$$$$$$$$',
    '$!!...$S*_____S:_)_SS$$$$$$$$$',
    '$!!!!!$S_SSSSSSS$$$$$$$$$$$$$$',
    '$$$$$$$S_S*___*S$$$$$$$$$$$$$$',
    '$$$$$$$S_S_SSS_S$$$$$$$$$$$$$$',
    '$$$$$$$S_S_O_S_S$$$$$$$$$$$$$$',
    '$$$$$$$S_S__*S_S$$$$$$$$$$$$$$',
    '$$$$$$$S_SSSSS_S$$$$$$$$$$$$$$',
    '$$$$$$$S*_____*S$$$$$$$$$$$$$$',
    '$$$$$$$SSSSSSSSS$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
], 1 * 75 + 37.5, 1 * 75 + 37.5, null, null, "Howler Hollow")

howlerHollow.solve = function() {
    lighting = 2000
    this.temperature = -1
    if (!!!howlerHollow.intervalSet) {
        setInterval(function() {
            if (howlerHollow.getBlock(18, 15) == '!') {
                howlerHollow.changeBlock(18, 15, '_')
                howlerHollow.changeBlock(20, 15, '_')
                howlerHollow.changeBlock(22, 15, '_')
                howlerHollow.changeBlock(24, 15, '_')
            } else {
                howlerHollow.changeBlock(18, 15, '!')
                howlerHollow.changeBlock(20, 15, '!')
                howlerHollow.changeBlock(22, 15, '!')
                howlerHollow.changeBlock(24, 15, '!')
            }

            howlerHollow.switch(25, 6, '_', '!')
            howlerHollow.switch(26, 6, '_', '!')
            howlerHollow.switch(26, 5, '_', '!')
            howlerHollow.switch(26, 4, '_', '!')
            howlerHollow.switch(26, 3, '_', '!')
            howlerHollow.switch(26, 2, '_', '!')
            howlerHollow.switch(27, 5, '_', '!')
            howlerHollow.switch(28, 5, '_', '!')
            howlerHollow.switch(26, 1, '_', '!')
            howlerHollow.switch(27, 1, '_', '!')
            howlerHollow.switch(28, 2, '_', '!')
        }, 1000)
        howlerHollow.intervalSet = true
    }

    if (p.in(1, 8, 2, 20) || p.in(3, 18, 5, 20)) {
        p.y -= 1.3
    }
}

var stormedRoom = new Landscape([
    'WWWWWWWWWWWWWWWWWWWWWWWWW',
    'Wzz!zzWzzzzzzzz!zzzzzzzzW',
    'WzzzzWzWzzz!zzzzzzzWzWzzW',
    'WzzzWzzzzzzzzzzzzzzzWzzzW',
    'WzzzWzz!zzWWWWWzzz!zzzzzW',
    'WzzzzzzzzzWWWzWzzzzzzzzzW',
    'Wzz!zzWzzzWWWWWzzzzWzzzzW',
    'WzzzzWzWzzzzzzzzzzWzzzzzW',
    'Wz!zzzzzzzWzzzWzzzzWzzzzW',
    'WzzzzzzzzWzzzzzWzzzzz!zzW',
    'WzzzzWzzzzz!zzzzzzzzzzzzW',
    'Wzz!WzzzzzzzzzzzzWzz!zzzW',
    'WzzzzzzzzzWzzzz!zzWzzzzzW',
    'WzWzz!zzWzzzzzWzzzzWzz!zW',
    'WzzWzzzWzzzzzWzzzzzzzzzzW',
    'W!zzzWzzzzWzzz!zzzzWzzzzW',
    'WzzzW!zzzzzWzzzzzzWzzzzzW',
    'WzzzzzzzzzzzzzzzWzzzzzzzW',
    'WzzzzzWzz!zzzzzWzzzz!zzzW',
    'WzzzzzzWzzzzzzzzzzWzzzzzW',
    'WzzzWzzzzzzzzWzzzzzWzzWzW',
    'WzzWzzzzzzzzWzzzzzWzzWzzW',
    'WzzzzzzzzzzzzzzWzzzzzzzzW',
    'WzzzzzzzzzWzzzzzWzzzzzzzW',
    'WWWWWWWWWWWWWWWWWWWWWWWWW'
], 13 * 75 + 37.5, 23 * 75 + 37.5, 0, 0, "Stormed Room", function() {
    lighting = 2500
    if (bosses[1].health > 0) {
        bossfight = true
    } else {
        bossfight = false
    }
}) // Don't enter from mainMap

var encompassedLabyrinth = new Landscape([
    'SSSSSSSSSSSSSSSSSSSS',
    'S__S_SSSSSSSSSSS__,S',
    'S__S,S_________S_S_S',
    'S__S_S_SSSSSSS_S_S_S',
    'S__S_S_S,____S_S_S_S',
    'SS___S_S_SSS_S_SSS_S',
    'SS_S_S_S_S_S_S_____S',
    'SS_S_S_S_S_S_SSS_SSS',
    'SS_S_SSS_S_S__,S_S_S',
    'SS,______OOSSSSS_S_S',
    'SS_S_SSSSOO______S_S',
    'SS_S_S__S_SSSSSS_S_S',
    'SS_S_SS_S_S,__,S_S_S',
    'SS_S___,S_SSS_SS_S_S',
    'SS_S,___S_S,_____S_S',
    'SS_SSSSSS_S___SSSS_S',
    'SS,_______S__,S____S',
    'SSSSS_SSSSSSSSS____S',
    'S,_________________S',
    'SSSSSSSSSSSSSSSSSSSS',
], 10 * 75, 10 * 75, 252, 48, "Encompassed Labyrinth", function() {
    if (encompassedLabyrinth.bright) {
        setLighting(2500)
    } else {
        lighting = 500
    }
})

var droptonWaterWear = new Landscape([
    'WWWWWWWWWWWWWWWWW',
    'W.....W...W.....W',
    'W.....WWWWW.....W',
    'W...............W',
    'W...............W',
    'WWWWWWWW|WWWWWWWW'
], 8 * 75 + 37.5, 5 * 75 + 37.5, 216, 82, "Dropton Water Wear")

var coralsWatercolors = new Landscape([
    "BBBBBBBBBBB",
    "B.........B",
    "B.BBBBBBB.B",
    "B.........B",
    "B,,.....,,B",
    "B~@.....@~B",
    "BBBBB|BBBBB",
], 5 * 75 + 37.5, 6  * 75 + 37.5, 274, 75, "Coral's Watercolors")

var droptonTunnels = new Landscape([
    'SS~SSSSSSS~SSSSSSSSSSSS~SSSSSS',
    'SS~SSSSSSS~SSSSSSSSSSSS~SSSSSS',
    'SS~SSSSSSS~SSSSSSSSSSSS~SSSSSS',
    'SS~~~~~~~~~SSSSSSSSSSSS~~~~~~~',
    'SS~SSSSS~SSSSSSSSSSSSSS~SSSSSS',
    'SS~SSSSS~~~~~~~~~~~~~~~~SSSSSS',
    'SS~SSSSSSSSSSSSSSSSS~SSSSSSSSS',
    'SS~SSSSSSSSSSSSSSSSS~SSSSSSSSS',
    'S~~~~~~~~~~~~~SSSSSS~SSSSSSSSS',
    'SSSS~SSSSSSSS~S~~~~~~SSSSSSSSS',
    'SSSS~SSSSSSSS~~~SSSS~SSSSSSSSS',
    'SSSS~SSSSSSSSSS~SSSS~SSSSSSSSS',
    'SSSS~SSSSSSSSSS~SSSS~~~~~~~~~O',
    'SSSS~SSSSSSSS~~~~SSSSS~SSSSSSS',
    'SSSS~SSSSSSSS~~~~SSSSS~SSSSSSS',
    'O~~~~SSSSSSSS~~~~SSSSS~SSSSSSS',
    'SSSSSSSSSSSSS~~~OSSSSS~SSSSSSS',
    '~~~~~~~~~~SSSSSSSSSSSS~SSSSSSS',
    'SSSSSSSSS~SSSSSSSSSSSS~~~~~~~~',
    'SSSSSSSSS~SSSSSSSSSSSS~SSSSSSS',
    '~~~~~~~~~~~~~~~~~~~~~~~SSSSSSS',
    'SSSSSSSSSSSSSSS~SSSSSS~SSSSSSS',
    'SSSSSSSSSSSSSSS~SSSSSS~SSSSSSS',
    'SSSSSSSSSSSSSSS~SSSSSS~~~~~~~~',
    'SSSSSSSSSSSSSSS~SSSSSSSSSSSSSS',
    '~~~~~~~~~~~~~~~~SSSSSSSSSSSSSS',
    'SSS~SSSSSSSSSSS~SSSSSSSSSSSSSS',
    'SSS~SSSSSSSSSSS~~~~~~~~~~~~~~~',
    'SSS~SSSSSSSSSSS~SSSSSSSSSSSSSS',
    'SSS~SSSSSSSSSSS~SSSSSSSSSSSSSS',
], null, null, null, null, "Dropton Tunnels")

droptonTunnels.solve = function() {
    if (!p.can.goUnderWater) {
        p.getHit(0.1)
    }

    if (keys.space) {
        // Exit
        if (p.on(16, 16)) {
            curMap = mainMap
            p.goTo(271 * 75 + 5, 78 * 75 + 37.5)
        }

        if (p.on(0, 15)) {
            // Code that takes you to Dropton City
            curMap = droptonCity
            p.goTo(5 * 75, 5 * 75)
        }

        if (p.on(29, 12)) {
            // Code that takes you to Dropton Town
            curMap = droptonTown
            p.goTo(2 * 75 + 5, 1 * 75 + 75 / 2)
        }
    }
}

var droptonCity = new Landscape([
    'O__SSSSSSSSSSSSSSSSSS~~~~~~~~~~~~_~~~SS_SS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '___~~~~~~~~~~~~~~~~~S~~~~~~~~~~~~_~~SiSS_SS~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '___~~~~~~~~~~~~~~S~~S~~~~~~~~~~~~_~~~S__iS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S~~~SSSSSSSSSS~~SIS~S~~~~~~~~~~~~_~~~~SSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S~~~~~~~~~~~~S~SIIISS~~~~~~~~~~~~_~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S~~~~~~~S~~~~S~SISISS~~~~~~~~~~~~____________________________~~~~~~~~~~',
    'SSSSSSS~S~~~~S~SS|SSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~I~~~S~S~~~~S~_____S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~III~~S~S~~~~SSSSSSSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'IIIII~S~S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'IIIII~S~S~~I~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'II|II~S~S~III~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '_____SS~SIIIII~~~~~~~~~~~~~~~~~~SSSSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~SIIIII~~~~~~~~~~~~~~~~~SSIIiSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'SSSSSSSSSII|II~~~~~~~~~~~~~~~~~SI~|iISS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~SiIiiIiS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~________~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S--S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'SSSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~SIS~~~~~~~~~~~~!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~SIIIS~~~~~~~~~~!^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~SIIIIIS~~~~~~~~!^i^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~SIIIIIIIS~~~~~~!^IIi^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~SIIIIIIIIIS~~~~!^II~Ii^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~SIIIIIIIIIS~~~~~!^IIi^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~SIIIIIIIIIS~~~~~~!^i^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~SIIII|IIIIS~~~~~~~!^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~______S)S______~~~~~~!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~ScS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_____~~~~~~~~~~~~~~~',
    'SSSSSSSSSSSSSSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_______I___~~~~~~~~~~~~~~~',
    'S_____~~SS~~~~S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_iii__III__~~~~~~~~~~~~~~~',
    'SSSSSS~S___~~~S~~SSSSS~~~~~~~~~~~~~~~~~~~~~~~_i_i_IIIII_~~~~~~~~~~~~~~~',
    'S~~~~~~S__S~~~S~~S~~~S~~~~~~~~~~~~~~~~~~~~~~~_i___IIIII_~~~~~~~~~~~~~~~',
    'S~~SSS~~SS~~~~_~~S~~~S~~~~~~~~~~~~~~~~~~~~~~~_i_i_II|II_~~~~~~~~~~~~~~~',
    'S~SS_SS~~~~~~~_~~S~~~S~~~~~~~~~~~~~~~~~~~~~~~_iii_______~~~~~~~~~~~~~~~',
    'S~S___S~~~~~~~_~~S~~~S~~~~~~~~~~~~~~~~~~~~~~~_____~~~~~~~~~~~~~~~~~~~~~',
    'S~SSSSS~~~~~~~SSSS~~~S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'S~~S:S~~S_S~~~S~~~~~~S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'SS~~~~~S___S~~S~~~~~~S~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'SSSSSSSSSSSSSSSSSSSSSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
], null, null, null, null, "Dropton City")

droptonCity.solve = function() {
    setLighting(4500)

    // Make Officer Marina give you the full pass once you reach the required amount
    if (p.droptonDonations >= 250) {
        marina.lines = [
            "The Pass Office is back in business!",
            "...and it looks like you've reached 250 trills in contributions!",
            "On behalf of Dropton, take this as a thank you gift!"
        ]

        marina.action = function() {
            p.giveItem(items.fullPass, true)
            
        }
    }

    // Places to go
    if (keys.space) {
        //Exit
        if (p.on(0, 0)) {
            curMap = droptonTunnels
            p.goTo(1 * 75 + 5, 15 * 75 + 75 / 2)
        }

        // Abandoned Channel
        if (p.on(39, 1)) {
            curMap = abandonedChannel
            p.goTo(10 * 75, 10 * 75)
        }

        // Houses/Rooms
        if (p.on(21, 31)) {
            curMap = droptonHall
            p.goTo(7 * 75 + 37.5, 6 * 75 - 5)
        }

        if (p.on(2, 11)) {
            curMap = lochNessHouse
            p.goTo(5 * 75 + 37.5, 4 * 75 + 37.5)
        }
        
        if (p.on(35, 28) && theBlockedEntrance.complete) {
            curMap = mainMap
            p.goTo(252 * 75 + 37.5, 80 * 75 + 37.5)
        }
    }
}

// In Dropton City {
var droptonHall = new Landscape([
    'IIIIIIIIIIIIIII',
    'I*__________**I',
    'I*____________I',
    'I_____________I',
    'I____________*I',
    'I**__________*I',
    'IIIIIII|IIIIIII',
], null, null, null, null, "Dropton Hall", function() {
    if (keys.space && p.on(7, 6)) {
        curMap = droptonCity
        p.goTo(21 * 75 + 75 / 2, 32 * 75 + 5)
    }
})
// }

var droptonTown = new Landscape([
    'SSSSSS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'SO~~~~~~~~~~~~~~~~~~~~~~~~~~~S~~~~~~~~~~~~~~~',
    'S~_~~~~~~~~~~~~~~~~~~~~~~~~~SIS~~~~~~~~~~~~~~',
    'S~_~~~SSS~~~~~~~~~~~~~~~~~~SIIIS~~~~~~~~~~~~~',
    'S~_~~S---S~~~~~~~~~~~~~~~~SIIIIIS~~~~~~~~~~~~',
    'S~_~~~SSS~~~~~~~~~~~~~~~~~SIiiiIS~~~~~~~~~~~~',
    '~~_~~~~~~~~~~~~~~~~~~~~~_~SIi|iIS~~~~~~~~~~~~',
    '~~_~~~~~~~~~~SSS~~~~~~~~______SSS~~~~~~~~~~~~',
    '~~_~~~~~~~~~SiiiS~~~~~~~_SSSS_~~~~~~~~~~~~~~~',
    '~~_________SiIIIiS~~~~~~_S~~S_~~~~~~~~~~~~~~~',
    '~~_~~~~~~~_SiI|IiS~~~~~~_S~~S_~~~~~~~~~~~~~~~',
    '~~_~~~~~~~_SSS_SSS~~~~~~_SSSSSSSS~~~~~~~~~~~~',
    '~~_~~~~~~~_________________S~~~~S~~~~~~~~~~~~',
    '___~~~~~~~_~~~~~~~~~_~~~~~~SSSSSSS~~~~~~~~~~~',
    '~~~~~~~~~~_SSSSS--SS_~~~~iiiiiiiiS~~~SSS~~~~~',
    '~~~~~~~~~~_S-S~S--SS_~~~~iSS____iS~~SiiiS~~~~',
    '~~~~~~~~~~_S-S~S--SS_~~~~i!S___SiS~SIIIIIS~~~',
    '~~~~~~~~~~_S-S~S--SS_~~~~iSS__S!iSSIiiiiiIS~~',
    '~~~~~~~~~~~SSS~S--SS___________SiiiIiIIIiIS~~',
    '~~~~~~~~~~~SSSSS--SS_~~~Si_SSS_____III|IIIS~~',
    '~~~~~~~~~~~S------SS_~~~Si_S!S__ii__SS)SSSS~~',
    '~~~~~~~~~~~S-iiii-SS_~~~Si_SSS__iiS___cSSSS~~',
    '~~~~~~~~~~~S-i~~i-SS~~~~SiiiiiiiiiSSSSSS~~~~~',
    '~~~~~~~~~~~S-i~~i-SS~~~~SSSSSSSSSSS~~~~~~~~~~',
    '~~~~~~~~~~~S-iiii-SS~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~S------SS~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~SSSSSSSSS~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
], null, null, null, null, "Dropton Town", function() {
    // Places to go
    if (keys.space) {
        //Exit
        if (p.on(1, 1)) {
            curMap = droptonTunnels
            p.goTo(28 * 75 + 70, 12 * 75 + 75 / 2)
        }

        // Houses/Rooms
        if (p.on(38, 19)) {
            curMap = droptonResearchFacility
            p.goTo(4 * 75 + 37.5, 3 * 75 + 70)
        }
    }
})

var droptonResearchFacility = new Landscape([
    '_____ScSS',
    '_____SSS!',
    '_______S~',
    '_______SS',
    '____|____',
], null, null, null, null, "Dropton Research Facility", function() {
    if (keys.space) {
        // Exit
        if (p.on(4, 4)) {
            curMap = droptonTown
            p.goTo(38 * 75 + 37.5, 20 * 75 + 5)
        }
    }
})

var lochNessHouse = new Landscape([
    '___________',
    '___________',
    '___________',
    '___________',
    '___________',
    '_____|_____',
], null, null, null, null, "Loch Ness House", function() {
    if (keys.space) {
        if (p.on(5, 5)) {
            curMap = droptonCity
            p.goTo(2 * 75 + 37.5, 12 * 75 + 37.5)
        }
    }
})

var abandonedChannel = new Landscape([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSS~~~~~~~~~~~~~SSSSSSSSSSSSSSSSS^^^^SSSSSSSSSSSSSS',
    'SSSSSSSS~~~~~~~~SSSSSSSSSSSSSSSSSSSS^SSSSSSSSSSSSSS',
    'SSSSSSSS~~SSSSS~~SSSSSSSSSS^^^^^SSSS^SSSSSSSSSSSSSS',
    'SSSSSSSS~~SSSSS~~SSSSSSSSSS^SSS^SSSS^^^^^SSSSSSSSSS',
    'SSSSSSSS~~SSSSS~~SSSSSSSSSS^SSS^^^^^^SSS^SSSSSSSSSS',
    'SSS~~~~~~~~~S~~~~SSSSSSSSSS^SSS^SSSSSSSS^SSSSSSSSSS',
    'SSS~~~~~~~~SS~~SSSSSSSSSSSS^SSS^SSSSSSSSSSSSSSSSSSS',
    '~~~~~SSSSSSS~~~S^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^S',
    '~~~~~SSSSO~~~SSS^^SSSSSSSSS^SSS^SSSSSSSSSSSSSSSSSSS',
    'S~~SSSSSS~~SSS^^^SSSSSSSSSS^SSS^SSSSS!~!~!~!SSSSSSS',
    'S~~SSSS~~~~S^^^^SSSSSSSSSSS^SSS^SS^SS~~~~~~~_SSSSSS',
    'S~~SSS~~~SSS^^^SSSSSSS~SSSS^^^^^^^^SS~SSSSSSSSSSSSS',
    'S~~SSS~~SS^^^^SSS~SSSS~SSSS^SSSSSSSSS~SSSSS~SSSSSSS',
    'S~~SSS~~S^^^^^SSS~SSSS~SSSS^SSSSSSSSS~~~~~~~SSSSSSS',
    'S~~SSS~~S^^^^^SSS~SS~~~~~SSSSSSSS~~~SSSSSSS~SSSSSSS',
    'S~~S^$__$^SSSSSSS~SSSSSS~SSSSSSSSSS~SSSSSSS~~~SSSSS',
    'SSSS^^^^^^SSSSSSS~~~~~SS~S~SSSSSSSS~~~~~~~S~SSSSSSS',
    'S~SS^$^^$^SSSSSSS~SSS~SS~S~~~~~~~SS~SSSS~SS~SS~~~SS',
    'S~SSSSSSSSSSS~~~~~SSS~~~~~~SSSSS~SS~SSSS~SS~~~~~OSS',
    'S~SSSSSSSSSSSS_SSSSSS~SSSSSSS~~~~~~~~~~S~SS~SS~~~SS',
    'S~SSSSS~~~~~~_!~S~~~~~i~~~~SS~SS~SSSS~SS~SS~SSSSSSS',
    'S~SSSSS~SSSSSSSSS~SSS~SSSSSSS~~~~SSSS~SS~SS~SSSSSSS',
    'S~~~~~~~~~~~SSS~~~SSS~~~~~~~~~SS~SSSS~SS~SS~SSSSSSS',
    'SSS~SSSSS~SSSSSSS~SSSSSSSSSSSSSSSSS~~~SS~~~~SSSSSSS',
    'SSS~SSSSSiSS~~~~~~SSS~SSSS~~~~~SSSSSS~SS~SS~SSSSSSS',
    'SSS~SSSSSiSS~SSSSSSSS~~~~~~SSSSSSS~~SSSS~SS~SSSSSSS',
    'SSS~~~~SS~~~~~~~~~~~~~SSSSSSSSSSSSS~~~~~~SS~SSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
], null, null, null, null, "Abandoned Channel")

// var growInterval = 0
// var allSuspensia = false
abandonedChannel.solve = function() {
    lighting = 2000
    // Places to go
    if (keys.space) {
        // Exits to Dropton City
        if (p.on(9, 9) || p.on(47, 16)) {
            curMap = droptonCity
            p.goTo(ctr(39), 2 * 75 + 5)
        }
    }
    if (!cascadeEntered && cascade.map != abandonedChannel) {
        setTimeout(() => {
            cascade.x = 9 * 75 + 37.5
            cascade.y = 9 * 75 + 37.5
            cascade.map = abandonedChannel

            cascade.lines = [
                "Hello there!",
                "I heard about the disturbance, and I came all\nthe way from Dropton Town to investigate!",
                "I even had to get permission from the President...",
                "Somehow, though, it looks like you beat me to it.",
                "Say, I could use a research partner. Want to\nhelp me learn about this place?",
                "...",
                "Perfect! Let's get started right away!",
                "It looks like this channel is splitting into two parts.\nSuspensia and water.",
                "This seems like a perfect time to try out my new Suspenia boots!\nLet's hope they work though...",
                "Unfortunately, I only have one pair, so I'll go on my own while you\nexplore other parts of this place.",
                "You can track the water portion. Let's see if we find anything.",
                "I'll call out if I need anything. Good luck!"
            ]

            cascade.curPath = [
                [11, 9],
            ]

            cascade.action = function() {
                cascade.lines = [
                    "Please explore the stone passage while I investigate this one.",
                    "I already told you once, we haven't got time for dillydallying!"
                ]
                curMap.changeBlocks([[15, 3], [16,3]], '~')
                
                cascade.curPath = [
                    [10, 9],
                    [10, 11],
                    [7, 11],
                    [7, 17],
                    [9, 17],
                    [9, 15],
                    [10, 15],
                    [17, 8],
                    [27, 8],
                    function() {
                        cascade.dir = 'R'
                        cascade.lines = [
                            "Hmmm...",
                        ]
                    }
                ]
            }
        }, 5000)

        cascadeEntered = true
    }


    if (!!!abandonedChannel.intervalSet) {
        setInterval(function() {
            if (abandonedChannel.getBlock(37, 11) == '~') {
                abandonedChannel.changeBlocks([[37, 11], [39, 11], [41, 11], [43, 11]], '!')
                abandonedChannel.changeBlocks([[37, 10], [39, 10], [41, 10], [43, 10]], '~')
                
            } else {
                abandonedChannel.changeBlocks([[37, 11], [39, 11], [41, 11], [43, 11]], '~')
                abandonedChannel.changeBlocks([[37, 10], [39, 10], [41, 10], [43, 10]], '!')
            }
        }, 1000)
        abandonedChannel.intervalSet = true
    }

    if (keys.space) {
        if (p.on(48, 19)) {
            curMap = cryoUnderground
            p.goTo(ctr(7), ctr(1))
        }
    }
}

var cryoUnderground = new Landscape([
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WIIii~~~OW~~~~~~~~~~W^^^^^^^^^^^^^^^^W~~~~~~~~iiWW',
    'WWWWWWW~iWWWWWWW~~W~W^^WWWWWWWW^^^^^^W~~~~~~~~~iWW',
    'WIIIIiW~iW~~~~~WWWW~WWWW.IIIIIWWWWWWWW~~~~~~~~~~WW',
    'WIIIIiW~iW~~~~~)~~~~WIIW.zzzzz!~~~~~~~~~~~~~~~!!WW',
    'WWWWWWW~iWW((WW)WWWWWiiW.^^^^^WWWWWWWWWW.WWWWW^^WW',
    'W^^^^W~~~~~~~I(~~)~~~~iW.^^^^^W^^^^^^^^W~~~~~!^^WW',
    'W^^^^WWWWWWW~~W~WW~~~~~W.^^^^^W^^^^^^^^W~~~~~!WWWW',
    'W^^^^^^^^^^W~~W~W~~~~~~W.zzzzzzWWWWWW^^W!!!!!!!!!W',
    'W^^^^^^^^^^W~~W~W~WWWWWW~~~~~~~!!!!!WWWW^^^^^!^^^W',
    'W^^^^^^^^^^W~~WWW~W~~~~~~~~~~~~!!!!!W^^^^^^^^!^^^W',
    'W^^^WWWWWWWW~~~~~~W~~~~~~~~~~~W!!!!!W^^!!!!!!!^^^W',
    'WWWWii~~~~~~~~~~~WWWWWWWWWWWWWW!!!!!W^^!^^^^^^^^^W',
    'WI~~~~~~~~~~~~WWWWzz~~~W~z~z~z~z~z~zW^^!!!!!!!!!^W',
    'W:WWWWWWWWWWWWW~~~zz~~~Wz!z!z!z!z!z!W^^^^^^^^^^!^W',
    'WWWIIIIIIiii!!!~~~zz~~~WWWWz~z~z~zIzW^!!!!!!!^^!^W',
    'W~~~~~~~~~~I!!!~~~zz~~~~Wzz!z!z!z!z!W^!^^^^^!!!!^W',
    'W~~~~~~~~~~I!!!~~~zz~~~~.W!WWWWWWWWWWW!^^^^^^^^^^W',
    'W~~~~~~~~~~I!!!~~~zz~~~W.W!W~~~~~~~~~~~WWWWWWWWWWW',
    'W~~~~~~~~~~I!!!~~~zz~~~W.W!W~WWWWWWWWWWWWWWWW~~WWW',
    'W~~~~~~~~~~I!!!~~~zz~~~W.W!W~zzz^^^^^^^^z^^^!!!WWW',
    'W~~~~~~~~~~I!!!~~~zz~~~W.W!W~WWWWW.WWWWW.WWWWW.WWW',
    'W~IIIIiiiiii!!!~~~zz~~~W.W!W~S~~~~~~~~~~~.~~!~...W',
    'WWWWWWWWWWWWWWWWWW!!WWWW.W!WWWWWWWWWWWWWWWWWWWWWWW',
    'OOOOOOOOOOOOOOWWWW!!WW~~~~~WOOOOOOOOOWI~~~~~~~W~~W',
    'OOOOOOOOOOOOOOWWWW!!WW~~~~~WOOOOOOOOOWIWWWWWW~W~~W',
    'OOOOOOOOOOOOOOWWWW!!WW~~~~~WOOOOOOOOOWIW~~~~W~W~~W',
    'OOOOOOOOOOOOOOW~WWWWWW~~~~~WOOOOOOOOOW~W~WW~W~W~~W',
    'OOOOOOOOOOOOOOW~~~~~~~~~~~~WOOOOOOOOOW~W~WO~W~W~~W',
    'OOOOOOOOOOOOOOW~~~~~~~~~~~~WOOOOOOOOOW~W~WWWW~W~~W',
    'OOOOOOOOOOOOOOWWWWWWWWWWWWWWOOOOOOOOOW~W~~~~.IW~~W',
    'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOW~WWWWWWWW~~W', // hello
    'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOWII~~~~~~i~~W',
    'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOWWWWWWWWWWWWW'
], 1 * 75 + 37.5, 1 * 75 + 37.5, 0, 0, "The Cryo Underground") // Don't enter from mainMap

cryoUnderground.solve = function() {
    this.temperature = -1
    lighting = 1500

    if (keys.space) {
        if (p.on(8, 1)) { // Exit to Abandoned Channel
            p.goTo(47 * 75 + 37.5, 19 * 75 + 37.5)
            curMap = abandonedChannel
            
        }

        // if (p.on(42, 28)) {
        //    // curMap = stormedRoom
        //     //p.x = 13 * 75 + 37.5
        //     //p.y = 23 * 75 + 37.5
        //     //p.dir = "U"
        // }
    }

	if (cryoUnderground.getBlock(44, 22) == '~') {
		if (!!!cryoUnderground.intervalSet) {
	        setInterval(function() {
	            if (cryoUnderground.getBlock(34, 20) == '^') {
	                cryoUnderground.changeBlock(34, 20, '!')
	                cryoUnderground.changeBlock(35, 20, '!')
	                cryoUnderground.changeBlock(36, 20, '!')
	                cryoUnderground.changeBlock(37, 20, '!')
					cryoUnderground.changeBlock(38, 20, '!')
					cryoUnderground.changeBlock(39, 20, '!')
	            } else {
	                cryoUnderground.changeBlock(34, 20, '^')
	                cryoUnderground.changeBlock(35, 20, '^')
	                cryoUnderground.changeBlock(36, 20, '^')
	                cryoUnderground.changeBlock(37, 20, '^')
					cryoUnderground.changeBlock(38, 20, '^')
					cryoUnderground.changeBlock(39, 20, '^')
	            }
	        }, 5000)
	        cryoUnderground.intervalSet = true
    	}	
	}
}

var drownedRoom = new Landscape([
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'W~~~~~~~~~~~~~W^W~~~~~~~~~~~~~W',
    'W~.......~~~.......~~~.......~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.~~~~~!!!!!~~~~~!!!!!~~~~~.~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~...!...~~~.......~~~...!...~W',
    'W~~~~!~~~~~~~~~~~~~~~~~~~!~~~~W',
    'W~~~~!~~~~~~~~~~~~~~~~~~~!~~~~W',
    'W~~~~!~~~~~~~~~~~~~~~~~~~!~~~~W',
    'W~...!...~~~~~~~~~~~~~...!...~W',
    'W~.~~~~~.~~~~~~~~~~~~~.~~~~~.~W',
    'W~.~~~~~.~~~~~~W~~~~~~.~~~~~.~W',
    'W~.~~~~~.~~~~~W^W~~~~~.~~~~~.~W',
    'W~.~~~~~.~~~~~~W~~~~~~.~~~~~.~W',
    'W~.~~~~~.~~~~~~~~~~~~~.~~~~~.~W',
    'W~...!...~~~~~~~~~~~~~...!...~W',
    'W~~~~!~~~~~~~~~~~~~~~~~~~!~~~~W',
    'W~~~~!~~~~~~~~~~~~~~~~~~~!~~~~W',
    'W~~~~!~~~~~~~~~~~~~~~~~~~!~~~~W',
    'W~...!...~~~.......~~~...!...~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.~~~~~!!!!!~~~~~!!!!!~~~~~.~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.~~~~~.~~~.~~~~~.~~~.~~~~~.~W',
    'W~.......~~~.......~~~.......~W',
    'W~~~~~~~~~~~~~~~~~~~~~~~~~~~~~W',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
], 1 * 75 + 37.5, 1 * 75 + 37.5, 0, 0, "Drowned Room", function() {

}) // Don't enter from mainMap

var fortuneFieldWaterTunnel146_88 = new Landscape([
    'OOSSSOOOOOOOOOOOOOOO',
    'OSO~~SOOSSSSOOOOOOOO',
    'OOSS~~SOS~~SOOSSSSSO',
    'OOOSS~SSS~~SSSS~~~SO',
    'OOSS~~~~~~~~~!~~~~SO',
    'OOS~~SS~~~~SSSS~~~SO',
    'OSS~SSS~~~SSOOSSSSSO',
    'OS~~SOSSSOSOOOOOOOOO',
    'OSS~SOOOSSSOOOOOOOOO',
    'OOSSSOOOOOOOOOOOOOOO',
], null, null, null, null, "Fortune Field Secret Tunnel (146, 88)", function() {
    if (keys.space) {
        // Exit back through entrance
        if (p.on(9, 7)) {
            curMap = mainMap
            p.goTo(ctr(146), ctr(87))
        }

        // Second exit (to toggle)
        if (p.on(2, 1)) {
            curMap = mainMap
            p.goTo(ctr(140), ctr(82))
        }
    }
})

var fortuneFieldWaterTunnel144_78 = new Landscape([
    'OOOOOOOOOOSSSOOOOOOO',
    'OOOOOOOOOS~OSOOOOOOO',
    'OOOOOOOOS~~SSSOOOOOO',
    'OOOOOOOS~~S~~SOOOOOO',
    'OOOOOOS~WSSS~SOOOOOO',
    'OOOOOS~~~_S~~SOOOOOO',
    'OOOOOSSSSO~~SOOOOOOO',
    'OOOOOOSOOSSSOOOOOOOO',
], null, null, null, null, "Fortune Field Secret Tunnel (144, 78)", function() {
    if (keys.space) {
        // Exit back through the entrance
        if (p.on(9, 6)) {
            curMap = mainMap
            p.goTo(ctr(144), ctr(77))
        }

        // Second exit (to toggle)
        if (p.on(11, 1)) {
            curMap = mainMap
            p.goTo(ctr(149), ctr(74))
        }
    }
})

var fortuneFieldWaterTunnel148_102 = new Landscape([
    'OOOOOOOOOOOOSOOOOOOOOOOOOSSSOO',
    'OOOOOOOOOOOSOSOOOOOOOOOSS~~~SO',
    'OOOOOOOOOOOS~SOOOOOOOOS~~~SSOO',
    'OOOOOOOOOOOS~~SSOOOOOS~~SSOOOO',
    'OOOOOOOOOOOOS~~~SSOOS~~SOOOOOO',
    'OOOOOOOSSOOOOSS~~~SSS~SOOOOOOO',
    'OOOOOOS~~SSSOOOSS~~~~~~SOOOOOO',
    'OOOOOOOS~~~~SOOS~~SSS~~SSSOOOO',
    'OOOOOOOOSSS~SOOS~SOOOS~~~~SOOO',
    'OOOOOOOOOOS~~SS~~SOOOS~~~~SOOO',
    'OOOOOOOOOOOS~~~~SOOOOOSS~~~SOO',
    'OOOOOOOOOOOOS~SSOOOOOOOOSSOSOO',
    'OOOOOOOOOOOS~~SOOOOOOOOOOOSOOO',
    'OOOOOOOOOOS~~SOOOOOOOOOOOOOOOO',
    'OOOOOOOOOOS~SOOOOOOOOOOOOOOOOO',
    'OOOOOOOOOOOSOOOOOOOOOOOOOOOOOO',
], null, null, null, null, "Fortune Field Secret Tunnel (148, 102)", function() {
    if (keys.space) {
        // Exit back through the entrance
        if (p.on(26, 11)) {
            curMap = mainMap
            p.goTo(ctr(148), ctr(101))
        }

        // Second exit (to toggle)
        if (p.on(12, 1)) {
            curMap = mainMap
            p.goTo(ctr(132), ctr(90))
        }
    }
})

var litholianHistoryCenter = new Landscape([
    'SSSSSSSSS',
    'S..WWW..S',
    'S.......S',
    'SW.....WS',
    'SW.....WS',
    'SW.....WS',
    'S.......S',
    'S.......S',
    'SSSS|SSSS',
], ctr(4), ctr(7), 111, 62, "Litholian History Center")

var areas = Landscape.all

function areaSearchByCords(x, y) {
    for (var i in areas) {
        var r = areas[i]
        if (r.doorX == x && r.doorY == y) {
            return r
        }
    }
    return false
}

function areaSearchByName(name) {
    for (var i in areas) {
        var r = areas[i]
        if (r.name == name) {
            return r
        }
    }
    return false
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
        if (p.cords.x >= b.x1 && p.cords.y >= b.y1 && p.cords.x <= b.x2 && p.cords.y <= b.y2 && curMap == mainMap) {
            p.region = this
            this.inRegion = true
            this.passiveRun = false
        }
    }

    if (this.inRegion) {
        this.active()
        if (!this.passiveRun) {
            this.passive()
            this.passiveRun = true
        }
    }
}

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
    setLighting(5000)
}, function() {
    playMusic("Chard")
})

var steelField = new Region([
    {
        x1: 67,
        y1: 1,
        x2: 138,
        y2: 12
    },
    {
        x1: 92,
        y1: 1,
        x2: 138,
        y2: 51
    }
], function() {
    setLighting(5000)
}, function() {
    playMusic("Steel Field")
})

var glaciaVillage = new Region([
    {
        x1: 138,
        y1: 11,
        x2: 270,
        y2: 30
    },
    {
        x1: 182,
        y1: 1,
        x2: 270,
        y2: 11
    }
], function() {
    setLighting(5000)
}, function() {
    playMusic("Glacia Village")
})

var windyWastelands = new Region([{
    x1: 139,
    y1: 32,
    x2: 224,
    y2: 50
}], function() {
    setLighting(5000)
}, function() {
    playMusic("Windy Wastelands")
})

var encompassedForest = new Region([{
    x1: 225,
    y1: 31,
    x2: 279,
    y2: 65
}], function() {
    lighting = 1000
    var randNPCDir = ["U", "R", "D", "L"]
    var randDir = ["Forward", "Right", "Backward", "Left"] // Changed UP and DOWN to FORWARD and BACKWARD because it makes more sense if it's relative to where he is pointing
    var pDir = ""
    function changeDir () {
        lostTraveler.dir = randNPCDir[Math.floor(Math.random() * 4)]
        lostTraveler.lines = [randDir[Math.floor(Math.random() * 4)]]
        forestTeleport = false
    }

    if (entityDistance(lostTraveler, p) <= 300) {
        forestLoopStarted = true
        forestTeleport = true
    }

    function moveLostToggle() {
        // Move lost traveler's toggle to next location in cycle
        lostToggleCurPos ++
        lostToggleCurPos = lostToggleCurPos % 4 // If it hits 4, it resets back to 0
        lostTravelerToggle.x = lostTogglePositions[lostToggleCurPos][0]
        lostTravelerToggle.y = lostTogglePositions[lostToggleCurPos][1]
    }

    // Teleports the player in a seamless loop so it looks like the forest never ends
    if (forestLoopStarted && forestTeleport) {
        if (p.x > 250 * 75 && p.x < 254 * 75) {
            if (p.y < 37 * 75){
                p.y = 59 * 75
                changeDir()
                pDir = "U"
                
                if (getBlockInfoByCords(lostTraveler.x, lostTraveler.y - 75).through) {
                    lostTraveler.y -= 75
                }
                moveLostToggle()
            }

            if (p.y > 59 * 75) {
                p.y = 37 * 75
                changeDir()
                pDir = "D"

                if (getBlockInfoByCords(lostTraveler.x, lostTraveler.y + 75).through) {
                    lostTraveler.y += 75
                }
                moveLostToggle()
            }
        }

        if (p.y > 46 * 75 && p.y < 50 * 75) {
            if (p.x < 236 * 75) {
                p.x = 268 * 75
                changeDir()
                pDir = "L"
                
                if (getBlockInfoByCords(lostTraveler.x - 75, lostTraveler.y).through) {
                    lostTraveler.x -= 75
                }
                moveLostToggle()
            }

            if (p.x > 268 * 75) {
                p.x = 236 * 75
                changeDir()
                pDir = "R"

                if (getBlockInfoByCords(lostTraveler.x + 75, lostTraveler.y).through) {
                    lostTraveler.x += 75
                }
                moveLostToggle()
            }
        }
    }

    if (lostTraveler.cords.x == lostTravelerToggle.x && lostTraveler.cords.y == lostTravelerToggle.y) {
        lostTravelerToggle.toggleState = 2
        curMap.changeBlock(252, 48, "O")

        // // Entrance to Encompassed Labyrinth
        // if (keys.space && p.on(252, 48)) {
        //     curMap = encompassedLabyrinth
        // }
    } else {
        lostTravelerToggle.toggleState = 1
    }
}, function() {
    if (lighting == 1000) {
        playMusic("Encompassed Forest Dark")
    } else {
        playMusic("Encompassed Forest")
    }
})

var droptonDrylands = new Region([
    {
        x1: 197,
        y1: 66,
        x2: 289,
        y2: 107
    }
], function() {
    // Insert active function here
    setLighting(5000)
}, function() {
    // Insert passive function here
    playMusic("Dropton Drylands")
})

var fortuneField = new Region([
    {
        x1: 123,
        y1: 62,
        x2: 160,
        y2: 109
    },
    {
        x1: 161,
        y1: 62,
        x2: 165,
        y2: 87
    }
], function() {
    setLighting(5000)
}, function() {
    // changeme Add music for Fortune Field
})

var regions = [chardTown, steelField, glaciaVillage, windyWastelands, encompassedForest, droptonDrylands, fortuneField]