var curMap;
var curCutscene; // Default null
if (!!save) {
    // if (!!save.areas) {
    //     areas = save.areas
    // }
    if (!!save.mainMap) {
        mainMap = save.mainMap.arr
    }
}

const badGuy = "Omnos" // DEFAULT TBD

var fadeOut = 0
var fadeStarted

var cutsceneFrame = 0 // DEFAULT 0

// Noctos Boss Cutscene vars
var noctosScale = 1
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

const images = {
    // Blocks
    grass: initImage('sprites/blocks/grass.png'),
    water: initImage('sprites/blocks/water.png'),
    bush: initImage('sprites/blocks/bush.png'),
    stone: initImage('sprites/blocks/stone.png'),
    stoneWall: initImage('sprites/blocks/stone_wall.png'),
    stoneTiles: initImage('sprites/blocks/stoneTiles.png'),
    tree: initImage('sprites/blocks/tree.png'),
    tree2: initImage('sprites/blocks/tree2.png'),
    snow: initImage('sprites/blocks/snow.png'),
    // leaf: initImage('sprites/blocks/leaf.png'),
    woodenWall: initImage('sprites/blocks/woodenWall.png'),
    speedySnow: initImage('sprites/blocks/speedySnow.png'),
	lava: initImage('sprites/blocks/lava.png'),
	trail: initImage('sprites/blocks/trail.png'),
	sand: initImage('sprites/blocks/sand.png'),
    suspensia: initImage('sprites/blocks/suspensia.png'),
    iceWall: initImage('sprites/blocks/iceWall.png'),
    crackedIceWall: initImage('sprites/blocks/crackedIceWall.png'),
    teleport: initImage('sprites/blocks/teleport.png'),
    sunStoneWall: initImage('sprites/blocks/sunStoneWall.png'),
    sunStone: initImage('sprites/blocks/sunStone.png'),
    sunStoneBricks: initImage('sprites/blocks/sunStoneBricks.png'),
    luminosLamp: initImage('sprites/blocks/luminosLamp.png'),
     
    // Enemies
    splint: initImage('sprites/enemies/splint/splint.png'),
    splintHurt: initImage('sprites/enemies/splint/splint-hurt.png'),
    patroller: initImage('sprites/enemies/patroller/patroller.png'),

    stormedPhase1: initImage('sprites/enemies/stormed/stormed-phase-1.png'),
    stormedPhase2: initImage('sprites/enemies/stormed/stormed-phase-2.png'),
    hydrosPhase1: initImage('sprites/enemies/hydros/hydros-phase-1.png'),
    hydrosPhase2: initImage('sprites/enemies/hydros/hydros-phase-2.png'),
    hydrosHurt: initImage('sprites/enemies/hydros/hydros-hurt.png'),
    hydrosStunned: initImage('sprites/enemies/hydros/hydros-stunned.png'),
    hydrosMinion: initImage('sprites/enemies/hydros/hydros-minion.png'),
    lithosPhase1: initImage('sprites/enemies/lithos/lithos-phase-1.png'),
    lithosPhase2: initImage('sprites/enemies/lithos/lithos-phase-2.png'),
    

    // Food
    apple: initImage('sprites/food/apple.png'),

    // Items
    puzzleKey: initImage('sprites/items/puzzleKey.png'),
    steelFieldKey: initImage('sprites/items/steelFieldKey.png'),
    steelSword: initImage('sprites/items/steelSword.png'),
    confoundedCaveKey: initImage('sprites/items/confoundedCaveKey.png'),
    spearOfNoctos: initImage('sprites/items/spearOfNoctos.png'),
    stormedSword: initImage('sprites/items/stormed-sword.png'),
    oldMansGlasses: initImage('sprites/items/oldMansGlasses.png'),
	speedySnowPath: initImage('sprites/items/speedySnowPath.png'),
    auraOfWarmth: initImage('sprites/items/auraOfWarmth.png'),
    hydrosScythe: initImage('sprites/items/hydrosScythe.png'),

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
    rock: initImage('sprites/interactives/rock/rock.png'),
    rockSwitchOff: initImage('sprites/interactives/rock/rockSwitchOff.png'),
    rockSwitchOn: initImage('sprites/interactives/rock/rockSwitchOn.png'),
    skyway: initImage('sprites/interactives/skyway/skyway.png'),
    skywayCharged: initImage('sprites/interactives/skyway/skywayCharged.png'),
    blockMirror: initImage('sprites/interactives/blockMirror/blockMirror.png'),
    blockMirrorActive: initImage('sprites/interactives/blockMirror/blockMirrorActive.png'),

    // Npc Features
    empressAurorasCrown: initImage('sprites/npcFeatures/empressAurorasCrown.png'),
}

var blocks = [
    {
        id: ",",
        name: "grass",
        through: true,
        dps: 0,
        speed: 5, // Default 4
        sound: "Grass Walking",
        img: images.grass
    },
    {
        id: "~",
        name: "water",
        through: true,
        dps: 0,
        speed: 3, // Default 2
        sound: "Splash",
		img: images.water
    },
    {
        id: "_",
        name: "stone",
        through: true,
        dps: 0,
        speed: 5, // Default 4
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
        dps: 100, // Default 100
        speed: 1,
        img: images.lava
    },
    {
        id: "@",
        name: "bush",
        through: true,
        dps: 0,
        speed: 3,
    },
    {
        id: "/",
        name: "sand",
        through: true,
        dps: 0,
        speed: 3,
		sound: "Sand Walking",
        img: images.sand
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
        speed: 7, // Default 7
        sound: "Trail Walking",
        img: images.trail
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
        speed: 3,
    },
	{
        id: "S",
        name: "stone wall",
        through: false,
        dps: 0,
        speed: 3,
        img: images.stoneWall
    },
    {
        id: "%",
        name: "stone tiles",
        through: true,
        dps: 0,
        speed: 4,
        img: images.stoneTiles
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
        speed: 3,
    },
    {
        id: "t",
        name: "tree",
        through: false,
        dps: 0,
        speed: 3,
    },
    {
        id: ":",
        name: "lock",
        through: true,
        dps: 0,
        speed: 3,
        useDesc: "Press space to examine"
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
        speed: 5,
        img: images.woodenWall
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
        speed: 4,
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
        speed: 4, // Default 4
        img: images.snow
    },
    {
        id: "z",
        name: "speedy snow",
        through: true,
        dps: 0,
        speed: 10, // Default 10
		sound: "Speedy Snow Walking",
        img: images.speedySnow
    },
    {
        id: "^",
        name: "suspensia",
        through: true,
        dps: 200, // Default (change) 200
        speed: 0.5, // Default (change) 0.5
        img: images.suspensia
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
        speed: 0.25,
    },
    {
        id: 'I',
        name: "ice wall",
        through: false,
        dps: 0,
        speed: 0,
        img: images.iceWall
    },
    {
        id: 'i',
        name: "cracked ice wall",
        through: false,
        dps: 0,
        speed: 0,
        img: images.crackedIceWall
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
    },
    {
        id: '5',
        name: "sun stone wall",
        through: false,
        dps: 0,
        speed: 4,
        img: images.sunStoneWall
    },
    {
        id: '`',
        name: "sun stone",
        through: true,
        dps: 0,
        speed: 6,
        img: images.sunStone
    },
    {
        id: '2',
        name: "sun stone bricks",
        through: false,
        dps: 0,
        speed: 4,
        img: images.sunStoneBricks
    },
    {
        id: 'l',
        name: "luminos lamp",
        through: false,
        dps: 0,
        speed: 7,
    },
    { // Impassable void block to avoid out of bounds error on map
        id: "",
        name: "void",
        through: false,
        dps: 0,
        speed: 5, // Default 4
    },
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

    this.visited = false;
	
    if (!!save) {
        for (var i in save.maps) {
            var m = save.maps[i]
            if (m.name == this.name) {
                for (var j in m.changes) {
                    var cm = m.changes[j]
                    this.changeBlock(cm.x, cm.y, cm.block)
                }
            }

            // this.changes = m.changes
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
                this.blockSize = 75;
                this.loadCase = (j * this.blockSize - p.x + width / 2 > -1 * this.blockSize &&
                    j * this.blockSize - p.x + width / 2 < width &&
                    i * this.blockSize - p.y + height / 2 > -1 * this.blockSize &&
                    i * this.blockSize - p.y + height / 2 < height + this.blockSize)
            } else if (mode == "Map View") {
                this.blockSize = 75;
                if (!p.canViewAllRegions && curMap == mainMap) {
                    this.loadCase = (j * this.blockSize + p.mapPan.x < width / mapScale && 
                        j * this.blockSize + p.mapPan.x > - width / mapScale && 
                        i * this.blockSize + p.mapPan.y < height / mapScale && 
                        i * this.blockSize + p.mapPan.y > - height / mapScale) &&
                        p.regionsDiscovered.indexOf(Region.getRegionFromCords(j, i)) != -1
                } else {
                    this.loadCase = (j * this.blockSize + p.mapPan.x < width / mapScale && 
                        j * this.blockSize + p.mapPan.x > - width / mapScale && 
                        i * this.blockSize + p.mapPan.y < height / mapScale && 
                        i * this.blockSize + p.mapPan.y > - height / mapScale)
                }
            } else if (mode == "Cutscene View") {
                // this.loadCase = (j * this.blockSize - cx > -1 * this.blockSize &&
                //     j * this.blockSize - cx < (width + this.blockSize) / cscale &&
                //     i * this.blockSize - cy > -1 * this.blockSize &&
                //     i * this.blockSize - cy < (height + this.blockSize) / cscale)
                this.loadCase = true; // temp
            } else if (mode == "Snippet View") {
                if (!p.canViewAllRegions && curMap == mainMap) {
                    this.loadCase = (Math.abs(j * 75 - p.x) <= 10 * 75 && Math.abs(i * 75 - p.y) <= 10 * 75) &&
                    p.regionsDiscovered.indexOf(Region.getRegionFromCords(j, i)) != -1
                } else {
                    this.loadCase = (Math.abs(j * 75 - p.x) <= 10 * 75 && Math.abs(i * 75 - p.y) <= 10 * 75)
                }
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
                    if (mode != "Map View") {
                        ctx.drawImage(getBlockById(c).img, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
                    } else {
                        ctx.drawImage(getBlockById(c).img, Math.floor(j * this.blockSize * mapScale), Math.floor(i * this.blockSize * mapScale), Math.ceil(this.blockSize * mapScale), Math.ceil(this.blockSize * mapScale));
                    }
                }

                ctx.save();
                if (mode == "Map View") {
                    ctx.scale(mapScale, mapScale);
                }

                switch (c) {
                    // case ',': // Grass
                    //     ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     // if (i == 0 && j == 0 && flowers.length > 1) {
                    //     //     flowersFinished = true
                    //     // } 
                    //     // var hasFlower = (Math.random() <= 0.1)
                    //     // if (hasFlower && !flowersFinished) {
                    //     //     flowers.push({
                    //     //         cordX: j,
                    //     //         cordY: i,
                    //     //         x: Math.random() * 75,
                    //     //         y: Math.random() * 75
                    //     //     })
                    //     // }
                    //     break
                    // case '~': // Water
                    //     // ctx.fillStyle = 'rgb(0, 0, 255)'
                    //     // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     ctx.drawImage(images.water, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    // case '_': // Stone
                    //     ctx.drawImage(images.stone, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    case '#': // Dirt
                        ctx.fillStyle = 'rgb(100, 75, 15)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    // case '!': // Lava
					// 	ctx.drawImage(images.lava, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     // ctx.fillStyle = 'rgb(250, 40, 0)'
                    //     // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)

                    //     if (mode != "Map View") {
                    //         // var ptcles = new ParticleSystem(j * this.blockSize + this.blockSize / 2, i * this.blockSize + this.blockSize / 2, 5, 100, 255, 0, 0)
                    //         // ptcles.create()
                    //         // ptcles.draw()
                    //     }
						
                    //     break
                    case '@': // Bush
                    var pulsation = Math.sin(elapsed / (randomSeed(i * j) * 2 + 15)) * 1.5
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        ctx.drawImage(images.bush, j * this.blockSize - pulsation / 2, i * this.blockSize + pulsation, 75 + pulsation, 75) + pulsation
                        break
    				// case '/': // Sand
    				// 	// ctx.fillStyle = 'rgb(242, 209, 107)'
                    //     // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
					// 	ctx.drawImage(images.sand, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
    				// 	break
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
    				// case '-': // Trail
    				// 	// ctx.fillStyle = 'rgb(183, 133, 81)'
             		// 	// ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
					// 	ctx.drawImage(images.trail, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
    				// 	break
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
					// case 'S': // Stone wall
                    //     ctx.drawImage(images.stoneWall, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
					// 	break
                    // case '%': // Stone tiles
                    //     ctx.drawImage(images.stoneTiles, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    case 'O': // Hole
                        ctx.fillStyle = 'rgb(0, 0, 0)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    case 'T': // Tree
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        ctx.drawImage(images.tree, j * this.blockSize - 10, i * this.blockSize - 50, 95, 100)
                        break
                    case 't': // Other tree (pine tree I think)
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
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
                    // case "W": // Wooden Wall
                    //     ctx.drawImage(images.woodenWall, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
    				// 	break
					case "d": // Dungeon door
                        ctx.fillStyle = 'rgb(60, 60, 60)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						ctx.fillStyle = 'rgb(0, 0, 0)'
						ctx.fillRect(j * this.blockSize + this.blockSize / 4 , i * this.blockSize, this.blockSize / 2, this.blockSize / 1.5)
    					break
					case "$": // Stone wall (w/ brick pattern)
						ctx.beginPath()
                        ctx.lineWidth = 2
                        ctx.strokeStyle = "rgb(0, 0, 0)"
    					ctx.fillStyle = 'rgb(50, 50, 50)'
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
                    // case "*": // Snow
                    //     ctx.drawImage(images.snow, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    // case "z": // Speedy snow
                    //     ctx.drawImage(images.speedySnow, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    // case "^": // Suspensia
                    //     ctx.drawImage(images.suspensia, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
					case "+": // Teleport
						ctx.drawImage(images.teleport, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
						break
                    case ";": // Stun
                        ctx.fillStyle = 'rgb(79, 13, 13)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    // case 'I': // Ice Wall
                    //     // ctx.fillStyle = 'rgb(0, 255, 255)'
                    //     // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     ctx.drawImage(images.iceWall, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    // case 'i': // Cracked Ice Wall
                    //     // ctx.fillStyle = 'rgb(0, 200, 200)'
                    //     // ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     ctx.drawImage(images.crackedIceWall, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                    //     break
                    case 'X':
                        ctx.fillStyle = 'rgb(10, 10, 10)'
                        ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    case 's':
                        ctx.drawImage(images.grass, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        break
                    // case '5':
                    //     ctx.drawImage(images.sunStoneWall, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
                    //     break
                    // case '2':
                    //     ctx.drawImage(images.sunStoneBricks, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
                    //     break
                    case 'l': // Luminos Lamp
                        ctx.drawImage(images.sunStone, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize)
                        ctx.drawImage(images.luminosLamp, j * this.blockSize + 20, i * this.blockSize - 35, 35, 85)
                        break
                }
                ctx.restore();
            }
        }
    }
}

Landscape.prototype.drawNextLayer = function(p) {
    for (var i = 0; i < this.arr.length; i ++) {
        for (var j = 0; j < this.arr[i].length; j ++) {
            var c = this.arr[i].charAt(j)
            var treePulsation = Math.sin(elapsed / (randomSeed(i * j) * 2 + 15)) * 4
            if (c == "T") { // Tree
                ctx.drawImage(images.tree, j * this.blockSize - 10, i * this.blockSize - 50 - treePulsation, 95, 100 + treePulsation);
            } else if (c == "t") {
                ctx.drawImage(images.tree2, j * this.blockSize + 7.5, i * this.blockSize - 70 - treePulsation, 60, 120 + treePulsation);
            } else if (c == "l") {
                ctx.drawImage(images.luminosLamp, j * this.blockSize + 20, i * this.blockSize - 35, 35, 85)
            }
        }
    }
}

Landscape.prototype.displayLighting = function() { // New lighting system (not currently in use) (changeme to add new lighting system back (once we have figured out how to make it work in camera view)
    for (var i = 0; i < this.arr.length; i ++) {
        for (var j = 0; j < this.arr[i].length; j ++) {
            if ((j * this.blockSize - p.x + width / 2 > -1 * this.blockSize &&
                j * this.blockSize - p.x + width / 2 < width &&
                i * this.blockSize - p.y + height / 2 > -1 * this.blockSize &&
                i * this.blockSize - p.y + height / 2 < height + this.blockSize)) {
                let ctrX = ctr(j);
                let ctrY = ctr(i);
                let lightAlpha = Math.hypot(p.x - ctrX, p.y - ctrY) / lighting + 0.1;
                fill(0, 0, 0, lightAlpha);
                ctx.fillRect(Math.round(b(j)), b(i), 75, 75);
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
    try {
        return this.arr[y].charAt(x);
    } catch (e) {
        console.log('Cannot get block at coordinates: ' + x + ', ' + y);

        return "";
    }
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
    if (this.arr[y].charAt(x) != block && !!this.grid) {
        this.arr[y] = this.arr[y].replaceAt(x, block)
        this.grid.setWalkableAt(x, y, getBlockById(block).through);
        this.changes.push({
            x: x,
            y: y,
            block: block
        })
    }
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
        this.npcName = config.npcName
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
		this.cspeed = this.getSpeed()
		cameraMoving = true
		camera = this
		scene = "CAMERA"
		p.canMove = true
		this.showCamera = false
        cutsceneFrame = 0
        cameraMoving = false
	}
}

Camera.prototype.move = function () {
	
}

Camera.prototype.getSpeed = function () {
    var div = 1
    var s = 0
    while ((Math.hypot((p.x - this.cx), (p.y - this.cy)) / div) >= this.cspeed) {
        s = Math.hypot((p.x - this.cx), (p.y - this.cy)) / div
        div += 1
    }
    return s
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
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SO,,,,T,,,,,,,,,,,,,,,,,,,,TTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,T,,,,,TT@__!!!!________!!S!_____________________S__S__!!!__S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*************************************************************************************************S',
    'S,,,,,T,,,,TTTTTTTTT,,,,,,,T~~~~~~T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT@!______!___!!!!_S!____!!SSSSSSSS__SSS_SS__S__!_!__S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*************************************************************************************************S',
    'S,,,,,T~~~~T@,,,,@@T,,,,,,,T~~~~~~TTTTTTT,,,,,,,,,,B,,,,,,,,T,,,TT@SSSSSSSS!!SSSSSSS_______S___S_____S_______S_SSSSS_S!___________________SSSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SSSSSSSSS*************************************************************************************************S',
    'S,,,,,T~~~~T@,,B,,,TT,,,,,,T~~~...------T,,,,,,,,BBBBB,T,,,,,,,,TT@________!!______S_________S_S_SS__SSS_SSSSS___!!__S____________________S------------------------------------------_zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz*********S',
    'S,,,,,T~~~~T,,BBB,,,TTTTT,,T~~~~~~TTTT--T,,,,,,,BBBBBBB,,,,,,,,,TT@!!!!_______SSS____!!______S___SS__________________S_______!____________SSSS$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$SSSSSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz*********S',
    'S,,,,,T~~~~T,BBBBB@,,,@@T,,T~~~~~~T,,T--T,,,,T,BBBBBBBBB,,,,,T,,TT@SSSSSSSSSSSSSS__S_!!SSSSSSSSSSSS__SSSSSSSSSSS!____S____________________SSSS!!!!!!!!!!!!!!!!!!$~~~~~~~~~~~~~~~~~~~~S*****************zz******************************************************************************S',
    'S,,,,,T~~~~T,BBBBB@,TTT@,,,T~~~~~~T,,T--T,,,,,,BBBBBBBBB,,,,,,,,TT@______S_________S___S__S______!S____________S_____S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*****************zz****************************************************SS************************S',
    'S,,,,,TTTTTT,BB|BBTTT,,TTTTTTTTTTTT,,T--TT@@@@@BBBB|BBBB@@@@@,,,TT@___!!_S_________SS_______S_____SSSSSSSSSSS__SS____S____________________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*****************zz******************************************SS********SS********SS**************S',
    'S,,,,,,@--------ssssss-ss----ss---------------------------------TTS___!!_S___________SSSSSSSSSS_S_S_________S!__S__!_S_______!____________SSSS!!!!!!!!!!!!!!!!!!S~~~~~~~~~~~~~~~~~~~~S*******WWW*******zz*****************************************SSSS**SS**SSSS**SS**SSSS*************S',
    'S,,,,,@@--------------s--s----------------------------------------:S_____________!!S__________S!SSSSSSSSSSS_____SS___S________________!!!!SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS******WWWWW******zz****************WWWWWWWWWWWWWWWWW******SSSSSSSSSSSSSSSSSSSSSSSSSSSS***********S',
    'S,,,,,@--@,,@,,,,,,,,,--,,,,,,,,,,,,S,,_______________,,,,--,,,,TTS______SSSSSSSS!!SSSSS__________!_______S__!__!S___S_______________!!!!!S___******************zz**WWW*************zz****WWW...WWW****zz*****W**********W*****WzzzzzzzzzW*********SSSS__S__SSSS__S__SSSS**************S',
    'S,,,,@@s-@,,@,,,,,,,,,--,,@@,,,,,,,SSS,,,,,,,,,@@@,,,,,,,,--,,,,TT@@@@@@@@@@@@@@@@@@@@@@@@@@SSSSSSS___S___S__S!__S!__S_______________!!!!!S___******************zz*WW.WW***.........zz**WWW.......WWW**zz****W.W*********W*****Wz!!SSS!!zW*********SSSS__S__SSSS__S__SSSS**************S',
    'T,,,,@s--@,,@,,,,,,,,,--,,@@,,,,,,SSSSS,,,,,,,,@@@,,,,,,,,--,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTT______S___S___S__S___SSSSS____!!_________!!!!!S___****..........****zzWW...WW**.~~.,tt,.zzWWWWWWWWWWWWWWWWWzz***W...W********WWWWWWWz!SSSSS!zW*********SSSSSSSSSSSSSSSSSSSSSS**************S',
    'T,,,,@s-@@,,@,,,,,,,,,--,,,,,,,,@@SS|SS@@,,,,,,,,,,,,,,,,,--,,,@TTTTTTTTTTTTTTTTTTTTTTTTTTTTSSS___S___S___S__S_______S____!!_________!!!!!S*******.tt.~~~~~.****zzW..W..W**.~~.,tt,.zzW...............Wzz**W.....W*******WW!!!!!z!SSSSS!zW*********SSSS__S__SSSS__S__SSSS**************S',
    'T@TTT@s-@TT,,@,,,,,TTT--------------------------------------,,,@@@,,,,,,,,,,,,________,,,,TT!!_S__S___S___S__SSSSSSSSSS_______________!!!!S*******.,,.~~~~~.****zzW.WWW.W**.........zzW......WWW......Wzz**W.WWW.W*******WW!~~~zz!SSSSS!zW*********SSSS__S__SSSS__S__SSSS**************S',
    'T@,,,@-s@@T~~~~~~~~~~W--------------------------------------,,,,,,,,,,,,,,,,,_~~~~~~~~_,,,TT!!_S______!!__S___________S___________________S*******..........****zzWWW|WWW***********zzWWWWWWWW|WWWWWWWWzz**WWW|WWW*******WW!z!!!z!SS|SS!zW*********SSSSSSSSSSSSSSSSSSSSSS**************S',
    'T@,,,@--s@T~~~~~~~~~~W--W~~~~~~~TTTTTTTTTTTTTTTTTTTT,,,,,,,,@~~~~~@,,,,,,,,,,_~~~~~~~~_,,,TTSS___SS___!!__S___________S___________________SzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzW!!z!W!z!!!z!!!zW*********SSSS__S__SSSS__S__SSSS**************S',
    'T,,,,@@-s@@T~~~~~~~~~W--W~~~~~~~T~~~~~~~~~~~~~~~~~~T,,SSSSS,,@~~~@,,,,WWW,,,,_~~~~~~~~_,,,TT!!SSSSS___S___S__SSSSSSS__S_____$__!!____SSSSSSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz~!W!z!!!~!zzzW*********SSSS__S__SSSS__S__SSSS**************S',
    'T,,,,,@--s@T~~~~~~~~~W--W~~~~~~~T~~~~~~~~~~~~~~~~~~T,,S~~~S,,,@~@,,,,WWWWW,,,_~~~~~~~~_,,,TT__________S___S__S_____S__S____$$$_!!____SSSSSS*******************zz*ttttttt********zzTzzTTTTTTTTTTTTTTTTTTTTTTTTTTzzTTTTTTTTW!!!!W!~~zzz!WWWW*********SSSS__S__SSSS__S__SSSS**************S',
    'T,,,,,@@--@TTTTTTTTTTW--W@~~~~~~T~~~~~~~~~~~~~TTTT~T,,S~O~S,,,,,,,,WWWWWWWWW,_~~~~~~~~_,,,TT__________S___S__S___!!SSSS___$$$$$______SSSSSS*******************zzt~~~~~~~t*******zzTz,,,,,,t,,,,,,,,,,,,,,,,,,,Tzz**W*****WWWWWW!!!!WW!W**W****ttSSSSSSSSSSSSSddSSSSSSSSSSSSSTT*********S',
    'T,,,,,,,T--,,,,,,,,,@W--W@~~~~~~TTTTTTTTTTTTTTT~~~~~,,S~~~S,,,@~@,,WWWWWWWWW,_~~~~~~~~_,,,TTSSSSSSSSSSSSSSS__S___!!S______$$$$$_____SSSSSSS*******zzzzz*******zzt~~~~~~~t*******zzT,,,t~,,~,,,~t,,,,~,t~,,,,,,Tzz*WWW****WWWWWWWWWWWWWWWWW*********************************************S',
    'T,,,,,,,T--,,,,,,,,,,,--TTTTTTTTT-------------------,,SSSSS,,@~~~@,WWWW|WWWW,_~~~~~~~~_,,,TT____!!___S_______S_____S______$$|$$_____SSSSSSS******zzzzzzz******zzt~~~~~~~t*******zzT,,,,,,,,,,,,,,,,,t,,,,,,,,,TzzWWWWW*****************************************************************S',
    'T,,,,,,,T-------------------------------------------,,,,,,,,@~~~~~@,,,---,,,,_~~~~~~~~_,,,TT____!!___S_____________S________________S!SS|SS*****zzzzzzzzz*****zzt~~~~~~~t*******zzTTTTTTTTTTTT,,,,,,,,,,,,t,,,TzzWWWWW*****************************************************************S',
    'T,,,,,,,T--,,B,,T,,W,,--T~~~~~~~TT@@BBBBB@@-----------------------------------________,,,,TT_________SSSS_SSSS_____S________!!______SSS___S*****zzzzzzzzz*****zzt~~~~~~~t*******zzzzzzzzzzzzzTTTTTTT,,,,,,s,,,TzzWW|WW*****************************************************************S',
    'TTTT,TTTT--,BBB,T,WWW,--T~~~~~~~--@BBBBBBB@----@@TT---------------------------,,,,,,,,,,,,TT____________S____SS____SSSSSSSS_!!______S!S___S*****zzzzzzzzz*****zzt~~~~~~~t***SSSSzzSSSSWWWWWWzzzzzzzTTTTTTTTTTTTzz**********************************************************************S',
    'T///,///T--BBBBBTWWWWW--T~~~~~~~--BBBBBBBBB----@TTB@@-@@@TTTTTTT,,BBBTTTTTTT--,,,,,,,,,,,,TTSSSSSSSSSSSS_______SSS_S______S_________SSS___S*****zzzzzzzzz*****zzt~~~~~~~t***S~~SzzS~~SW....WT*****zzzz*****W***zz**********************************************************************S',
    'T/,,,,,/T--BB|BBTWWWWW--T~~~~~~~TTBBBB|BBBB----@TBBB@-BBB-------,BBBBBTTO,,T--,,,,,,,,,,,,TT_S_____S_S_S_SS!!!__SS_S_SSSS)S______________SS*****zzzzzzzzz*****zz*ttttttt****S~~SzzS~~SW....WTT*SS****z****WWW**zz**********************************************************************S',
    'T/,,,,,/T-------TWW|WW--TTTTTTTTTT------------@TBBBBB-B~B-TTTT--BBBBBBBT,,,T--,,,,,,,,,,,,TT_!_____S_S_!_S___!_______S!!S)S______________SS******zzzzzzz******zz************SSSSzzS~~SW.....zTS**S***z***WWWWW*zztttt******************************************************************S',
    'T/,,,,//T-TTTTT-T----------------TTTTTTTTT@---@TBB|BB-BBB-T~~T--BBBBBBB@,,,T--,,,,,,,,,,,,TT_SSSSSSS_SS!_S___SSSSS_S_S!!S)S_______$______SS*******zzzzz*******zzzzzzzzzzzzzzzzzzzzS~~SW....WzTTTTTTTTz***WWWWW*zz,~~t******************************************************************S',
    'TT/////TT-T,,,--TTTTTT--TTTTTTTT---------------T@---------T~~T--BBB|BBB@,,,TT--,,,,,,,,,,,TT_____________S_________S_S!!S)S______$!$_____SS*******************zzzzzzzzzzzzzzzzzzzzSSSSWWWWWWzzzzzzzzzzzz*WW|WW*zz,~~t*************************************T---T***S********************S',
    'TTTT~TTT--T,,,----------,,,,,,,TTTTTTTTTTTT----TTTTTTTTTTTTTTT---------TTTTTT--,,,,,,,,,,,TTSSSSSSSSSSSS_SSSSSSSSS_S_S!!S_S_____$!!!$____SSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTS:STTTTTTTTTTTTTTTTTTTTzzzzzzzzzztttt************TTTTTTTTTTTTTTTTTTTTTTTTTT---TTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T~~~~T---TT,,,-,,,,,,,,,,/////,,,,,,,,,,,,T------------------------------------,,,,,,,,,,,TT___________S______!__S_SSSSSSSSSS__$!!!!!$___SS*************************************SSS***********T@@,,W@@T**************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~TTTT-TTT,,,,-,,,,,//////~~~//////,,,,,,,T----------------------TTTTTTT-------,,,,,,,,,,,TT___________S_________S____________$$$$$$$$$__SS**********************W!**z*|***WW*|*W*W***********T@,,WWW@T**************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~~~~T-T,,,,,,-//////~~~~~~~~~~~~~//////,,T,,,,TTTTTTTT@,,,--,,,@,,,,,,TTTTTTT-,,,,,,,,,,,TT___________S!________S____________$$$$$$$$$__SS*********************WWW*z**W***W*z**W*WWW**!******T,,WWWWWT**************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTT~T-T,,,,,-//~~~~~~~~~~~~~~~~~~~~~~~//,T,,,,T,,,,,,,,,,,--,,,,,,,,,,,,,,-------,,,,,,,,TT____________S!!!__SSSSSSSSSSSSSS__$$$$$$$$$__SS**********************|*****WWW**W***z|**|**W******T,,WWWWWT**************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~~~~T-T,,,,-//~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,,==============,,,,,,,--BBBBB--,,,,,,,TTSSSSSSSSSS__S_____S__$___!_____S__$$$$$$$$$__SS******************!W*z*WWW***W!z*z**WW*WWWW********T@,WW|WWT**************************T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~TTTT-T,,,,-/~~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,@--B=====B--@,,,,,TT_XXX________S__!!!S_$$$________S__$$$$|$$$$__SS********WW**z**W***WW!*z*W**z*****W**z******WWWW***T,,,,,,,T**************************T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~~~~T-,,,,,-/~~~~~~~~~~~~~~~~~~~~~~~~~~/,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,@-B=======B-@,,,,,TTSSSSSSSSSS__S_____S$$$$$_______S_____!_______SS*********|**z******Wz*****z***|*zW!**W*W*zWWz***W**T**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTT~T-,,,,,-/~~~~~~~~~~~~~~~~~~~~~~~~///,T,,,,T,,,,=~~~~~~..~~~~~~=,,,,,-B=======B-,,,,,,TT____!!!!!S__S!!!__S$$$$$_______S_____!_______SS********WW**!*|****W***W!***WW**W****W****W***WWW**T**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~~~~T-T,,,,-//~~~~~~~~~~~~~~~~~~~~~~//,,,T,,,TT,,,,=..............=,,,,,-B=======B-,,,,,,TT___!!!!!_S__S_____S$$$$$_______SSSSSSS_SSSS__SS******!**W********WWWz*WW**|*W****|*z**W*W**WW*****T**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~TTTT-T,,,,--/~~~~~~~~~~~~~~~~~~~~~//,,,,T,,,T,,,,,=..............=,,,,,-B==BBB==B-,,,,,,TT__!!!!!__S__S__!!!S$$|$$__________________S__SS******W*|W**W**W!**W*W***|****W*WW!*WW**z|**WW*****T**********************************T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~~~~T-T,S,,,-//~~~~~~~~~~~~~~~~~~~//,,,,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,-BBBB|BBBB-,,,,,,TT_!!!!!___S__S_____________________________S__SS******W**WWWWW*W*****W!WWW!z**z**WW**W***z*z*****W*T**********************************T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTT~T-TS,,SS-,///~~~~~~~~~~~~~~~///,,,,,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,-----------,,,,,,TT!!!!!____S__S_SSSSSSSSSSSSSSSSSSSSSSSSSSSSS__SS*********!*****W*W*W*****W*|z**z*|*z*|*W!W**WWW****T**********************************T,,,,,,,,,,,,,,,,,,,,,,,TT--TTT,,,,,,,,,,,,,,,,,,,,,,,T',
    'T~~~~T-TS,,,S-,,,//////~~~~~//////,,,,,,,,T,,,T,,,,,=~~~~~~..~~~~~~=,,,,,,,,,,,,,,,,,,,,,,TTSSSSSSSSSS__S_S______________________________SS******|W***W!****z*!WW*W!WW*!WzW*W**WW***WW*W*z*W**T**********************************T,,,,,,,,,,,,,,,,,,,,,,TT,,,,,TT,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTTT,TTTTTT-,,,,,,,////////,,,,,,,,,,,,,T,,,T,,,,,,==============,,,,,,,,,,,////////////TT____________S_S______________________________SS*****zWW*********z*****|**!*WW***W******z*z*!*W****T**************************TTTTT*TTT,,,,,,,,,,,,,,,,,,,,,TT,,,T,,,TT,,,,,,,,,,,,,,,,,,,,,T',
    'TT~~~~~~~~~TT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TTSSSSSSSSSS__S_S______________________________SS********W***W*W!zzz!W****W***z*WW*z*WW*****WWW**W**T************************TTT*******TTTTTTTTTTTTTTTTTTTTTTT,,T,T~T,,TTTTTTTTTTTTTTTTTTTTTTT',
    'TT~~SSSSS~~TT---,,,,,,,,,,,,,,,,,,,,,,,,TTT,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TT_________S_SS_S______________________________SS************z**W!z!W**z**WW****z*!***!W**W*********T************************T***TTTTTTT------@@@@TT~~T@@-----,,~,,,,,,-------@@@@TT~~T@@----T',
    'TT~SOOOOOS~TT@@-------,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,/~~~~~~~~~~~TTSSSSSSSS______S______________________________SS*********WW**W**W!W**W*****z********W**z*WWW***W***T************************T*T*******T------------TT----TTT-,TT,,,TT,-------------TT----TTTT',
    'TT~SOOOOOS~TT@@@-,,,,----------,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT!S!S!!!SSSSSSSSS!SSS!SSS!!SSS!S!!SSS!S!SS!!SSSS**********z|*W***W**WW*z**W***WW*****W***!****W****T***********************TTTTTTTTTT*T------@@@@T----TTT~~~T,,,,,,~,,-------@@@@T----TTT~~~T',
    'TT~SOOOOOS~TT@@--,,,,,,TTTTTTT--,,,,,,,,,,,,,,,,,,,,,,,,T,,,,TTT,,,TT,TT,,TTTTTTT,,TTT,,,TTS!S!!S!S!!S!SS!!S!S!!SS!S!S!!S!S!SS!SS!SS!_SS!SS***********zz****|*z*!*W**W**********|**W*zz***z***T***********************T**********TTTTTTTTTTTTTTTTTTTTTTT,,T~T,T,,TTTTTTTTTTTTTTTTTTTTTTT',
    'TT~SOSSSOS~TT@--BBB,,,TT~~~~~TT--,,,,,,,,,,,,,//////,,,,T,,,TTTT,,,TT,@,,,,TTT,T,,TTTT,,TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,TT,,,T,,,TT,,,,,,,,,,,,,,,,,,,,,T',
    'TT~SOSSSOS~TT--BBBBB,TT~~~~~~~TT-----,,,,,,,,/~~~~~~/,,,T,,,T,,T,,TT,,SSSS,,,,,TT,,TT,,,,TTSSS!SS!!S!!!!!S!!S!SS!S!S!S!S!!S!S!S!S!S!S!SS!SS,,,,,,,,,,TTTTTTTTT,,,,,TTTT,,,,,,,,,,,,,W,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,TT,,,,,TT,,,,,,,,,,,,,,,,,,,,,,T',
    'TT~_SS:SS_~TT-BBBBBBBT~~~~~~~~~T-TTT------,,,/~~~~~~/,,,TTT,T,@,,,T,,S~~~~S,,,,TT,,@,,,,TTTSSS_______~SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS,,,,,@,,,T,,,,,,,,,,TT,,@,,,T,,,,,,,,,,,WWW,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,TT---TT,,,,,,,,,,,,,,,,,,,,,,,T',
    'TT~~~~~~~~~TT-BBBBBBB,~~~~~~~~~,---TTTTT,--,,/~~~~~~/,,,TT,,,,TT,,W,,S~~~~S,@,,:W,,TT@,,TO,SSS_SSS!SS________S________SSSS____________~~~SS,,,,,,,,T,,,@,,TTTTT,,,TTTT,,T,,,,t,@,,WWWWW,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTTTTTTTTTT-BBB,BBB,~~~~~~~~~,-T---T-T,,---/~~~~~~/,,,TTTTT,,T,TT,,S~~~~S,,,,TT,,TT,,,,,,SSS_S__S_SSS!SSSS_S_SSSSSS_S____SSSSS!SSSSSS_SSS,@,,t,,,T,TTTTT,,,,,TTT,,,,,,,T,,@,,,,,WW|WWt,,,,@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,WWWWWWW,~~~~~~~~~,-TTT-T-T,,,,,/~~~~~~/,,,TOTT,,,,,TTT,S~~~~S,,,TTT,,,TT,,,,TSSS~___S~~______S_!__!!!!S_SSS!SSSSSSS___SSS_SSS,,,,,,,,T,,,,,,T,,,,,,,,,@,,TT,,,,,,t,@,,,,,,,,@,,,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,,,,,,,,,~~~~~~~~~,-T---T-T,,,,,/~~~~~~/,,,T,,TTTT,,,TT,,SSSS,,,TT,,T,,,,,,,TTSSSSSS!SSSSSS_S_!_!!$_!!!SSS_!!!_______S_S!S_SS!,,,,,@,,,TTTTTT,,,@,T,,,,,,T,,,,,,,,,@,,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,,,,,,,,,,~~~~~~~---T-T---T,,,,,,//////,,,,T,,TT,,,,T,,,,,,,,,,,W,,TTT@TT,,,,TSS__________!_S_S_!$$$!__S!S!!!$!__SSS_S_!!S_SSS,,,,,,,,,,@,,,,,T,,,,TTTTTT,,@,t,,,,@,,,,,,@,,,,,,@,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,,,,,,,,,,,~~~~~--TTT-TTT-T,,,,,,,,,,,,,,,,TT,,TTTTT,,T,,,TTT,,,TT,@T,,,,,,T,,SS_!SS!SS_S_S_S___$$$$$__SSS!!$$$__S!S_!!!!_~!!S,,,@~~~~,,TTTTTT,,,@,,,,,,,,,,,,,,,,,,,t,,@,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTTTTTTTTTTTTTTTTTT,,,,,,,--TT-----T-TTTTTTTTTTTTTTTTTTT,,,WTT,,,TT,,,TTTT,,T,,,,T,,,TTTTSS~___S_!_S_S_S__$$$$$$$_____$$$$$_SSS_SSS!S!!!S,~~~~,T,,,@,,,,,,,,,,,,@,,,,,t,,,,@,,,,,,@,,,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT-TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT,,,,,TTT,TTT@,,,TTT,T:,,,,TTTT,,,,,T,,TTT,TTT,,T,T,SS!SS_S_S_S_S_S~_$$$$$$$_!!__$$$$$____~SSSSSSS!S~~T,,,,,,,t,,,,,@,,,t,,,,,@,,,@,,,,,,,,@,,,,,t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTTT,,,,,,,/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,T,TT,TTT,TTWTT,TT,T,,,,TTT,,TT,,W,@,T,,,,,,SS~_S_!___S___S__$$$|$$$!!!__$$|$$___SSSS,,,,,~~~,,,,,@,,,,,,,,t,,,,,,,,,,,,,,,,,,,t,,,,,,,,,,,,,@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTTT,,,,,,,/~/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT,,,T,,,T,,T,,,T,,T,,,T,,TTTT@,T,,TTTWTTT,TTTSS~_S!!SSSSSS!SS_________!____________)))~~~,,~t,,@,,,,,,,,,,,,@,,,,,,@,,,,,,,@,,,,@,,,,@t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,TT--T,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTT,,,,/--/~~~/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT,T,,,T,,,TTTT,,,TT,TTT,,,,,T,,T,,TTT,,,TWT,,SS___!!!S______SSS_SS!S______SSSSSSSSSSSS,,~~~~,,,,,,,,,,,t@,,,,,,,,,,,,,,t@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,T--TT,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTTT,,,/~/--/~/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TT,,TTTT,,,,TTTTT,,,,TTT,,,T,,,TTT,,,,,,,,,,,TSS_S!SSSS_SS!S___S__S_~_____!SS,,,,,,,,,,,,@,~~,@,,,,@t,,,,,,,,,,,,@,,,,@,,,,,,,t,,,,,,@,,t@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTTTTTTTTTTTTTTTTTTTTTTT---TTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TT,,,,/~~~/--/@,,,,,,,,,,,,,,,,,,,,,,TTT,,,,,TTT,TTT,,,T,,T,,,,,T,,TTT,TTT,,,,,,TT,,,,TTT,TSS_S__~___S!!!__!!__S____SS!!SS,,,,,,t,,,,,,,,~,,,,,,,,,,,@,t,,,,,,t,,,,,,,,,@,,~,,,,@,,,,,,,,@t,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,S~~~~-~~~~S,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,/~~~~~/-@/,,,,,,,,,,,,,,,,,,,,,T~~~T,,,,TT,,,T,,TTTT,,,,,,TTT,,,,,TT@,,@@,,,T,,,TTTTT,SS_SS!SSS_SSS!SSSS__S!___S!!_SS,,,,,,@,,,,,,,,~~~,,,t,,,,,,,,,,,@,,,,@,,,,,,,t~~~,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S~~~S-S~~~S,,,,,,,,,,T,,,,,,,,,,T',
    'T,,,,,/~~~/--/~/,,,,,,,,,,,,,,,,,,,,T~~~T,,,,TTTT,,,TTTT,,,,,,TTT,,T@,,,T,,,SSS,,,,,,,TTT,,SS______S______$___!!!!___SS_SS,,,,,,,,,t@,,,,@@~@@,,,@,,,t@,,@,,,t@,,,,,~~~~~~,,,,,,,t,,,,,,,TTTTTTTTTTTTTTTTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S~~~S-S~~~S,,,,T,,,,,,,,,,,T~~~~T',
    'T,,,,,,/~/T-/~~~/,,/,,,,,,,,,,,,,,,,T~~~T,,,,SOTTTT,,,----,,,,TT,,TTT,,TT,,S~~~S,,,,TT,,T,TSS!SSS!_SSS!SS$$$__S!S____S~_SS,,@,,,,,,,,,,,,,,~~@,,,,,,,,,,,t~~~~,,,,~~~t@,,,,,,,,,,,,,@t,,,TT~~~~~~~TT~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,SSS~S-S~SSS,,,,,,,,,,,,,,,T~~~~~T',
    'T,,,,,,,/TT--/~/,,/~/,,,,,,,,,,,,,,,,TTT,,,------TT----TT---,,,,,T,TTT,,,,,S~~~S,,T,TT,,,,TSS!$____S~__S$$$$$_SSS____S__SS,,t,,,,,@,,,,,,,,,~,,t,,,,,@,,,~~@t~~,t@~,,,,,,,,,,,,t,,,,,,,,,TT~~~~~~~TT~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,B,,,,,,,,,,,,,///~S-S~///,,,,,,T,,,,,,TT~~~~TTT',
    'T,,,,,,TTTTT--/,,/~~~/,,,,,,,,,,,,,,,,,,,---TSTTTTT,,TTTT,,--,TTTT,TT,,,T@,S~~~S,TT,,,,,T,,SS$$$_SSSSS_S$$|$$_S~_____S__SS,,,,,,,,,,,t,,,,,@~@,,,,,,,t,,~~,,,,~~~~~,,,,,,t,,,,,,TTTTTT,,,TT~~~~~~~TT~~~~~~~TT,,,,,,,,,,,,,,,,,,,,,,,,,,,BBB,,,,,,,,,,,/~~~~S-S~~~~/,,,,,,,,,TTT~~~TTT,,T',
    'T,,,TTTWWWTTT-,,/~~~~~/,,,,,,,,,,,,,,,,---,TTTTTTT@,,@T,,,,T--T-----,,,TT@,,SSS,,TT@,,T,TT,SS$$$_S!!!S________S______S__SS,,,,@,,t,,,,,,,,,@~@@,,,,,SSSS~,,,,,,,t,,t@,,,,,,,,,,,-----TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,BBBBB,,,,,,,,//~~~~~S-S~~~~~//,,,,,TT~~~~WBWBW,,T',
    'T,,TTWWWWWWWTTTTTTTT,,,,,,,,,,,,,,,,,---,,,TTTTT,,,,,,,,,,,TT---,TT---TTTT,,,,,,,,,,,TTTTT,SS$|$_S!!!S_SSSSSSSS_________SS,,t,,,,@,,,,,,t,,@~~~,,,,,S~~S~,,,,,,,@,,,,,,,,,TTTTTTTTTT--TTT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,WTTTTT-,,,,,,,TBBBBBT,,,,,,/~~~~~~~S-S~~~~~~~/TTTT~~~~~~BWBWB,,T',
    'T,,TWWWWWWWWW,TTTT,,,,,,,,,,,,,,,,,,--,,,,TTTT,,,TT,@TTT,,TTT,,TTT@,,---TTT,,@T,,,,SSSSSSSSSS____SSSSS_S_~~~~___________SS,,,,,,,,,,,@,,,,,,,,~~@,,,S~~S~,,,t@,,,,,@t,,,,,----TTT~~~---TT-TTTTTTTTTTT------,,,,,,,,,,,,W.W,,,T-,,,,,,T@BB|BB@T,,,,,/~~~~~~~S-S~~~~~~~~~~~~~~~~TTWBWBW,,T',
    'TTTTW.......W,,,,T,,,,,,,,,,,,,,,,---,,,,,TTTT@TTTT,TTTT,,,T,,,,,TT,,,,-----@@TT,,SS_~!!~!!~$________S___SSSSSS_________SS,,@,,t,,,,,,,,,,,,,,@~@,,,SSSS~~,,,,,,,,,,,,,TTTTTT---T~~~-T--T-----------TTTTTT--,,,,,,,,,,W...W,,T-,,,,,,T@@---@@T,,,,/~~~~~~~~S-S~~~~~~~~~~~~~TTT@@BW|WB,,T',
    'TTT,W..WWW..W,,----,,,~,,,,--------W--,,,,,TTT,,T,T,,TT,,T@@,,TT,,,,T@,,,,T--TT---S:_~!!~!!~$____SSS_SS_SS____S_________SS,,t,,,,@,,,,,,,@t,,,@~~,,,,,,,t~,,,,,,t@,,,,,T----TTT-TTTT-TT-----TTTTTTT------TT--,,,,,,,,W.....W,T-@@,,,,T~@---@~T,,,/~~~~~~~~~S-S~~~~~~~~~/TT~~~~--T---T,,T',
    'T@OTWWWW|WWWWT--,,,,,,,,,,,,,,,,,,WWW--,,,,TTT,,,,,,,T@,@TTTT,TT,,@TTT,,,TTT----,,SS_~!!~!!~$______S_______SSSS_________SS,,,,,,,,,,t,,,,,,,,,,,-,,,,,,,@~,@,,,,,,,,,,,T------T----T-TTTTT--T~~~~~T@@W@@--TT-,,,,,,,W.......WT-@@,,,,T@@---@@T,,,/~~~~~~~~~S-S~~~~~~~~~/,,TTT~.-------,T',
    'T,,T,,,@-------,,,,,,,,,,,,,,,,,,WWWWW-,,,,,TT,TTT,,TTT,,TTT,,T,,,TTT,,,TTTT,,,@T@,SSSSSSSSSS______SSSSSSSSS____________SS,,,,,,,,,,@,,,@,,,,,,-~-,,,,,,~~,t,,,,,,@,,,,T-TTTT-TTTT---TT,,T--T~~~~~T@WWW@T--T--,,,,,W.........W----,,,TTT---TTT,,//~~~~~~~~~S-S~~~~~~~~~//,,,T.~.~~~~~~,T',
    'T,,@W,,--,,,,,,,,,,,,,,,,,,,,,,,,WWWWW-,,,,,TT,@TTT,,,T,,,T@,,,,,,,,,,,,,@TTT,TTTTT,,,TTTTTS____________________________SS,,,,,,,,,,,,,,t,,,,,,,-~@,t,,~~,,,,@,,,t,,,,TW-T~~T-T~~~T-TT,,,T--T~~~~~TWWWWWTT-TT---WWWWWWWWWWWWWWWWW-,,,T~~---~~T,,/~~~~~~~~~S---S~~~~~~~~~/,,,,T.TTTTTTT,T',
    'T,,WWW,-T,,,,,,,,,,,,,TTTTTTTTTT,WW|WW-,,,,TTT,TT@,,T,,,T,,,,,TTT,,@@TT,,,T@,,,TTTT,TWTT,,,S____________________________SS,,,,,,,,,,,,,,,,SSSS,,@~@,,@~~t,,,,,,,,,,,,,):-T~~T--TTT--T,,,,T--T~~~~~TWWWWW,T--TT@@W......WWW......W-,,,,T~~---~~T,/SSSSSSSSS-----SSSSSSSSS/,,,,,TT,,,,,,,T',
    'T,WWWWW-T,,,,,,,,,,,,,,,,,,,,,,,,,,----,,,,TTT@,,,TTT@,TTTTTT,,,,,,TTTTT,,,,,,,:WT,,T,,,,TTS____________________________SS,,,,,,,,,,,,,,,,S~~S,,@~~~~~~,,,,,,,t,,,,,,,TW-T~~T------TT,,,,T--T~~~~~TWW|WW,TT--T@@W.....WBBBW.....W-TT,,,T~~------------------------------/,,,,,,,,,,,,,,T',
    'T,WWWWW-T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTT,TTTTT,,TTT,,,TT,,,,T@,,,TTTT,,T,,TTT@@,,,TS____________________________SS,,,,,,,,,,,,,,,,S~~S,,@~t,@@,,,@,,,,,@,,t,,,,T-TTTT--TTTTT,,,,,T--TTTTTTT-------TT-T@@WWWWWWWB|BWWWWWWW-TT@,,@TTTTT-,,/SSSSSSSSS-----SSSSSSSSS/,,,,,,T,,,,,,,T',
    'T,WW|WW-T,,,,,,,,,,,,,,,,,,,,,,,////,,,,,,,,TTTT@,,T@,,,@TTT,,TTTT,,,TTT,,,TTT,TT,,TTTTT,,TS____________________________SS,,,,,,,,,,,,,,,,SSSS,,,~~~~@,,,,,,t,,,,,,,,,,T------TT,,T,,,,,,T-TT,,,,,,,,,,,,----TT-------------------------------,,/~~~~~~~~~S---S~~~~~~~~~/,,,,,,,,,,,,,,T',
    'T,T,,,,-,,,,,,,,,,,,,,,,,,,,,,,/~~~~/,,,,,,,,TTTT@,,,,,,,T,,T@,,TT,,TTT,,T,,T,,TTT@T,,T,,TTS____________________________SS,,,,,,,,,,,,,,,,,,,,,,t,,@~~~~,,,,,,,,t,,@,,,TT-TTTTT,,TT,,,,,,T-T,,,,,,,,,,,,,,,,----------------------------------,,//~~~~~~~~~S-S~~~~~~~~~/,,,,,,,,,,,,,,,T',
    'T,TT,,,--,,,,///,,,,,,,,,,TT,,,/~~~~/,,,,,,,,T,T,,,TT@@T,,@TTTT,,,,,@TT,TTT,,,,,,W@@,,T,,TTS____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,@@t~~~,,,@,,,,,,,,,TT-T------T,,TTT,,T-T,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T,,,,,,,,,,,,,-,,,/~~~~~~~~~S-S~~~~~~~~~/,,,,,,,,,,,,,,,T',
    'T,,TTT,,----/~~~/,,,,,,,,TT,T,T/~~~~/,,,,,,,,T@,,,,T@TTTTT,TT,,,TT,,,T,,TTTT,@T,,T,TT,,,TT,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~t,,,,,,,,,,,TT--T-TTTT-TTTT.TTTT-T,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T,WWW,,,,,,,,,-,,,/~~~~~~~~~S-S~~~~~~~~~/,,,,,,,,,,,,,,,T',
    'T,,,,TTTTTTT/~~~/,,,,,,TTT,,,TT/~~~~/,,,,,,,,TTTT,,,,T,TTT,,,,,,,TT,,,,,T,,,,@T,TT,T,,,,,,TS____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,.,,,,,@~~~~,,,,,,,,TT--TT-T,,T-----------T,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~TW...WTTTTTTTT-,,,,/~~~~~~~~S-S~~~~~~~~/,,,,,,,,,,,,,,,,T',
    'TTT,,,,T,,,T/~~~/,T,TT,T,,,,,,TT////,TT,,,,,,T@TTT,,,,,,T,,,,T,,TTTT,,,,,,TTT,TTTT,,,T,,,,TS____________________________SS,,,,,,,,WWWW,,,,,,,,,,,.~.,,,,@@,,~~~,,,,,,T--TT--T,,TTTT-TTTTTTTT,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~TTTTTT~~~~~@---@,,,,/~~~~~~~S-S~~~~~~~/,,,T,,,,,,,,,,,,,T',
    'T,TTTT,,,T,,T///,,TTT,,T,TTTT,,,TTTTT,,T,,,,,T@,,,,T,T,TTT,,TT,TTTTTT,TTTTTT,,W,T@,TTTT,,TTS__SSSSSSSSSSS))SSSSSSSSSSS__SS,,,,,,,,W~~W,,,,,,,,,,,,.,,,,,,,,,,@~~,TTTTT-TT--TT,,,,,T-WWWWWWWW,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~~~@@@@@---@,,,,,/~~~~~~~S-S~~~~~~~/,,,,,,,,,,,,,,,,,T',
    'T,,T,TTTTTT,,TT,,T,TT,TTTT,,,,,,T,,,,,TTT,,,,TTTTTTT,,,TTTT@T,,,@TTT@,,TTT@,,TT,@,TTTO,,,,TS_S________________________S_SS,,,,,,,,W~~W,,,,,,,,,,,,,,,,,,,,,,,@@~,T---T----TT,,,,,,T-W~~~~~~W,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~..-------@,,,,,,,//~~~~~S-S~~~~~//,,,,,,,,,,,,,T,,,,T',
    'T,T,,,T,,,T,T,TTTT,,TTT,,,,TTT,TT,,,TTT,T,,,,TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTSS__________________________SSS,,,,,,,,WWWW,,,,,,,,,,,,,,,,,,,,,,,,,~~T---TTT-TT,,,,,,,T-W~~~~~~W,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~..------@,,,,,,,,,,/~~~~S-S~~~~/,,,,,,,,,,,,,,,,,,,,T',
    'T,TT,,T,,TT,T,T,,,T,,,,,TT,TTT,,,,T,,T,TTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS__________________________SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~T-----T--T,,,,,,,T-WWWWWWWW,,,,,,,,,,,,,,,,,,T--T~~~~T---T~~~~T~~~~~@@@@@@,,,,,,,,,,,,///~S-S~///,,,,,,,,,,T,,,,,,,,,,T',
    'T,T,,,TTT,T///,,T,,TT,,TT,,TTT,,,TTT,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS________SSSSSSSSSS________SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~TTTTT-TT-T,,,,,,,T---------,,,,,,,,,,,,,,,,,,,,,,TTTT,,,,,TTTT,TTTTT,,,,,,,,,,,T,,,,,,,,,/////,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,O,T,T,,T/~~~/TTT,,TTTT,T,,T,,TTTT,,T,TTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS_______S~~~S~OS___S_______SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~@,,,T-TT-T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T,,,,,,,,,,,,,,,,,,,,T',
    'T,T,TT,TT,/~~~/T,TT,,,,T,,TTT,TT,,TTTT,T,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SS_SS___S~__!S))S____S___SS_SSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@~~,,,,T----TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,T,,T,T///T,,TTTTT,,T,,T,,TTT,,,T,,TT,TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSS~~S_S~__~_~~~~_____S_S~~SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~~~@,,,,TTTT--TTTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TTT,,,T,,T,,TT,TT,TT,TT,,,,,,,,,,,T,,,,,T,TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSS~~SS___S!!_~~___S___SS~~SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@~~~~~@@,,,,,,,,TT------TTT------,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,TT,T,TTTTTTT,,,,,TT,TTT,T,,T,TTTT,TT,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSS~~S~_~S!SS!__!SS!S___S~~SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@~~@@,,,,,,,,,,,,,TTTTTT-TT--TTTT--,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,TTT,T,,T,TT,,TT,TT,T,,TT,,,,T,TT,T,,,TTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSS~~S__~S!SS___SSS!S___S~~SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,~~~@,,,,,,,,,,,,,,,,,,TT-----TT,,TT---,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,TT,,,,,T,,,,,,,TTT,,,,T,,,,TT,,,,,,T,,T,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSS~~SSSSS!SSS~~SSS!SSSSS~~SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,@~@,,,,,,,,,,,,TTT,,TTTT--TTTTT@,,,TTT-----,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'TT,,TTTT,T,,,,TT,T,,TTTT,T,T,TT,,TTT,,TT,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSS~~SSSSS!SSS~~SSS!SSSSS~~SSSS,,,,,,,,,,,,,,,,,,,,,,,,,,@~~@,,,,,,,,,,,,T-T,TT----TT,,,@@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,T,,,T,,T,,,T,TT,,,,T,TT,,TTTT,,TT,TT,TT,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS,,,,,,,,,,,,,,,,,,,,,,,,,@~@@,,,,,,,,,,,,,T-TTT--TT-TTT,,,@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,,T,T,T,,,,T,,,TT,,,,TTTT,,,,,T,,,,,,,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,@,,,,,,,,,,,,,,,T-T---TTT---TTTT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'TTTTTTTTOST,TT,T,,,,TT,T,,,,TTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T-T-TTTTTTT---TT-,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,T,TT,,TTT,T,,TT,TTTT,,,TTTT,,,TT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T---T,,,,,,,,----,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,TT,,,,,T,,,T,,TT,,,TTTT/////,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,TTTTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,TTTTT,,,,TTT,,,,,,,,,,,/~~~~~/,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,T,,,,,,,,,,,,,,,,,,,,,,/~~~~~/,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~/,,TTT,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,S____________________________SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~/,,S,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,,,,,,,,,,,,,,,,,,,,,,,/~~~~~/,S,,S,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
	'T,,,,,,,,,,,,,,,,,,,,,,,,,/////,,S,SS,T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T'
], 0, 0, null, null, "Main Map")

var c = new Camera(200 * 75, 15 * 75, 15)


mainMap.solve = function() {
    //
    if (curMap == mainMap) {

        // Beginning of game
        // runOnce(() => {
        //     setTimeout(() => {
        //         larisa.x = ctr(44)
        //         larisa.y = ctr(23)
             
        //             // Larisa walks and talks to player
        //             larisa.curPath = [
        //                 [45, 23],
        //                 [56, 23],
        //                 function () {
        //                     // Default ON
        //                     larisa.dir = "U"
        //                     larisa.remote = true
        //                     p.dir = "D"
        //                     cameraStart(b(56), b(23), 5, "NPC", {
        //                         npcName: larisa,
        //                         lineStop: -1
        //                     })
        //                     larisa.lines = [
        //                         "HUH?!",
        //                         "Who are you?",
        //                         "...",
        //                         "Oh, you can talk!",
        //                         "Anyways, it looks like you are stuck buddy!",
        //                         "Maybe I should get someone.\nWait right here!"
        //                     ]

        //                     larisa.action = function () {
        //                         p.dir = "D"
        //                     }
        //                     larisa.actionLine = 0

        //                     larisa.action = function () {
        //                         Screen.fadeOut(0.01, function() {
        //                             oldMan.map = mainMap
        //                             oldMan.x = ctr(53)
        //                             oldMan.y = ctr(20)
        //                             larisa.x = ctr(59)
        //                             larisa.y = ctr(20)
        //                             larisa.dir = "L"
        //                             oldMan.dir = "R"
                                   
        //                             oldMan.lines = [
        //                                 "Oh my goodness...",
        //                                 "I can't believe it. How is this possible?",
        //                                 "I don't know how long it's been...",
        //                                 "Sorry, I need to get you out of this.\nI have too much to explain."
        //                             ]
                                    
        //                             oldMan.remote = true
        //                             oldMan.action = function () {
        //                                 oldMan.curPath = [
        //                                     [53, 23],
        //                                     [56, 23],
        //                                     function () {
        //                                         mainMap.changeBlock(56, 22, ",")
        //                                         oldMan.remote = true
        //                                         oldMan.lines = ["Follow me..."]
        //                                         // Still camera
        //                                         cameraStart(p.x, p.y, 5, "NPC", {
        //                                             npcName: oldMan,
        //                                             lineStop: -1
        //                                         })

                                                
        //                                         oldMan.action = function () {
        //                                             Screen.fadeOut(0.01, function() {
        //                                                 curMap = johnHouse
        //                                                 p.x = ctr(5)
        //                                                 p.y = ctr(2)
        //                                                 oldMan.x = ctr(1)
        //                                                 oldMan.y = ctr(2)
        //                                                 oldMan.map = johnHouse

        //                                                 oldMan.lines = ["Wow, I still can't fathom how you're alive...\nEspecially after the accident.",
        //                                                     "...",
        //                                                     "What? What do you mean no accident- oh no...",
        //                                                     "Surely you aren't brainwashed too!",
        //                                                     "...",
        //                                                     "Yes, I know this is all very confusing.",
        //                                                     "First off, is there anything at all that you remember?",
        //                                                     "Anything about yourself, me, or the others?",
        //                                                     "...",
        //                                                     "Yes, yes that's it! You were a soldier!\nThe bravest and most powerful soldier in all of Elria!",
        //                                                     "Anything else?\nAnything about, you know... Omnos?",
        //                                                     "...",
        //                                                     "Huh, I guess not.",
        //                                                     "Well, either way, it's a miracle that you're even alive.",
        //                                                     "Ok. We should start informing others that\nyou're, well, here!",
        //                                                     "Why don't you take a step outside and look for Wayne,\none of our fellow savants!",
        //                                                     "...",
        //                                                     "Wh- What's a savant?",
        //                                                     "Huh, I have a LOT of explaining to do.",
        //                                                     "Either way, you'll know when you see him.\nI trust you!",
        //                                                     "`He's also always swimming..."

        //                                                 ]

                                                        

        //                                                 larisa.lines = [
        //                                                     "Hi again buddy!",
        //                                                     "It's Larisa, the guy that found you!",
        //                                                     "I still don't really get how you got stuck there...",
        //                                                     "Either way, it's nice to meet ya!"
        //                                                 ]
        //                                                 p.cordSave = {x: 15, y: 8}
        //                                                 Screen.fadeIn(0.05, function () {
        //                                                     oldMan.remote = true
        //                                                     cameraStart(p.x, p.y, 5, "NPC", {
        //                                                         npcName: oldMan,
        //                                                         lineStop: -1
        //                                                     })
        //                                                     oldMan.action = function () {
        //                                                         oldMan.lines = 
        //                                                         [
        //                                                             "Go try finding Wayne.",
        //                                                             "I know this is still all very confusing,\nbut I trust you!",
        //                                                             "As you walk around, see if you can remember anything else...",
        //                                                             "`He's also always swimming..."
        //                                                         ]
        //                                                         addMission(aStrangeWorld)
        //                                                         oldMan.clearAction()
        //                                                     }
                                                           

        //                                                 })
                                                        

        //                                             })
    
        //                                         }
        //                                         oldMan.actionLine = "after"

                                                
                                               
                                                
                                                
        //                                     }
        //                                 ]
                                        
        //                             }
                                    
        //                             Screen.fadeIn(0.05, function() {
        //                                 oldMan.remote = true
        //                                 cameraStart(oldMan.x, oldMan.y, 5, "NPC", {
        //                                     npcName: oldMan,
        //                                     lineStop: -1
        //                                 })
        //                             })
        //                         })
                               
        //                         larisa.clearAction()
        //                     }
        //                     larisa.actionLine = "after"

        //                 }
        //             ]
                   
                
        //     }, 3000)
            
        // })
    }


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
            p.goTo(ctr(35), ctr(27))
        }
    }
	
    // Lonzo mannn
    // console.log(lonzo.playerDist)
    if (lonzo.playerDist <= 500 && lonzo.firstInteraction) {
        lonzo.remote = true
        lonzo.firstInteraction = false
        cameraStart(222 * 75, 11 * 75, 10, "NPC", {
            npcName: lonzo,
            lineStop: -1
        })
     }
    

    // Wanderer GV
    if (!!getGameAlertInfoByCords(205, 24, mainMap)) {
        if (getGameAlertInfoByCords(205, 24, mainMap).playerRead) {
            addMission(theWanderersRiddlesGV)
        }
    }
	
}


var imperilledPrison = new Landscape([
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$O______$____$$$$$$$$$$$$$$_$_________;$______;;;;$',
    '$$$$$$__$____$___________;$_$__$$$$$$_;$_______;;;$',
    '$;;__$__$____$_$___$__$$__$_$__$;;__$_;$__$$$$$$$$$',
    '$____$__$____$_$;;;$__$$__$$$__$____$_;$__________$',
    '$____$__$____$_$;;;$___________$____$_;$__$__;;___$',
    '$____$__$____$_$$$$$__$$$$$$$__$____$_;$__$$$;;$$$$',
    '$____$__$___;$___;;$_$!!!!!!!$_$____$__$__$;;;____$',
    '$____$__$$$$$$____;$_$!$$$$$!$_$_______$__________$',
    '$____$_______$_;$_;$_$!$$$$$!$_$_______$__$$$$;;$$$',
    '$____$__$$$$$$__$__$_$!$$;$$!$_$___;$__$__$___;;__$',
    '$___;$__$;;;;$__$__$_$!$$_$$!$_$___;$__$__$___;;__$',
    '$___;$__$____$__$__$_$!$___$!$_$$$$$$__$__$__;;;__$',
    '$___$$__$$$$$$__$$$$_$!$$_$$!$_$;;;____$__$_;;;;__$',
    '$___$___________$__$_$!!$_$!!$_$$$$$$__$__$;;;;;__$',
    '$___$___________$__$__$$$_$$$__$_______$__$;;_____$',
    '$__;$__$$$$$$$$$$__$___________$$$$$$__$__$_______$',
    '$__;$______;;;;;___$$$$$$_$$$$$$;;;____$__$_______$',
    '$;;;$______________$____$_$;;;;;;_____;$__$____;;;$',
    '$;;;$______________$____$_$_______________$____;;;$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
], 75 + 37.5, 75 + 37.5, 56, 20, "Imperilled Prison")

var prisonCameraActivated = false

imperilledPrison.solve = function () {
    if (curMap == imperilledPrison) {
        lighting = 1500
        if (!(p.cords.x == 25 && p.cords.y == 10)) {
            
            //playSound("Alarm", true)
            if (!prisonCameraActivated) {
                cutsceneFrame ++
                console.log(cutsceneFrame)
                //p.canMove = false
                // if (cutsceneFrame > 50) {
                //     alerts.push(new GameAlert(165, 17, ["WHAT? The alarm turned on?", "That must be an error..."], imperilledPrison, "NPC Prison Guard"))
                //     cameraStart(19 * 75, 2 * 75, 10, "", {})
                //     prisonGuard.lines = [
                //         "WHAT?! You escaped?!",
                //         "I don't have time to explain.\nNot that I could explain anyways...",
                //         "`I never thought this job would be eventful...\nI just do it for the trills.",
                //         "You have to follow me..."
                //     ]
                //     prisonCameraActivated = true
                // }
            }

        }
    }

    if (p.on(1, 1) && keys.space) {
        curMap = mainMap
        p.goTo(ctr(56), ctr(21))
       // p.goTo(ctr(1), ctr(2))
    }
    
}

var johnHouse = new Landscape([
    'BBBBBBB',
    'B=====B',
    'B=====B',
    'B=====B',
    'B=====B',
    'BBB|BBB'
], ctr(3), ctr(5), 15, 8, "John's House")

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
], ctr(4), ctr(6), 51, 8, "Mike's House")


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
], ctr(7), ctr(4), 13, 27, "Lyra's House")

var carolHouse = new Landscape([
    '=========',
    '=-----@@=',
    '===----@=',
    '=~=-----=',
    '====|====',
], ctr(4), ctr(4), 38, 27, "Carol's House")

var leyHouse = new Landscape([
    '.......',
    '.......',
    '.......',
    '.......',
    '...|...'
], ctr(3), ctr(4), 19, 28, "Ley's House")

var sarahsShop = new Landscape([
    'WWWWWWWWW',
    'W@W...W@W',
    'W,W...W,W',
    'W~W...W~W',
    'WWWW|WWWW',
], ctr(4), ctr(4), 71, 22, "Sarah's Shop")

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
], ctr(5), ctr(10), 78, 42, "Rowan's Dojo")

var wyattHouse = new Landscape([
    'BBBBBBBBB',
    'B.....=OB',
    'B.....==B',
    'B.......B',
    'BBBB....B',
    'B~~B..BBB',
    'B~~B..B@B',
    'BBBB|BBBB',
], ctr(4), ctr(7), 67, 30, "Wyatt's House", function() {
    if (wyatt.trusting != true) {
        if (p.in(6, 1, 7, 2) && wyatt.isMad != true) {
            wyatt.isMad = true
            wyatt.remoteSpeak = true
            wyatt.lineNum = 0
            wyatt.dir = "R"
            wyatt.lines = [
                "Woah, there!",
                "That's uh, a private place.",
                "It's where I like to hang out and, uh",
                "...do stuff. I only let my family and friends\ngo over there.",
                "And I don't really know you.",
                "*(gurgle)",
                "Sorry, that's my stomach. I usually eat a cookie every day,\nbut I ran out!"
            ]

            wyatt.action = function() {
                wyatt.dir = "D"
                wyatt.lines = [
                    "`I could really use a cookie right about now...",
                ]

                wyatt.clearAction()

                Screen.fadeOut(0.05, function() {
                    p.goTo(ctr(4), ctr(6))
                    wyatt.isMad = false
                    Screen.fadeIn(0.05, function() {
                        p.canMove = true
                    })
                })
            }

            wyatt.actionLine = "after"
        }
    } else {
        if (keys.space) {
            if (p.on(7, 1)) {
                Screen.fadeOut(0.05, function() {
                    curMap = mainMap
                    p.goTo(ctr(72), ctr(27))
                    Screen.fadeIn(0.05)
                })
            }
        }
    }
})

const ashHouse = new Landscape([
    'SSSSSSS',
    'S,S___S',
    'SSS___S',
    'S___SSS',
    'S___S@S',
    'S___S,S',
    'SSS|SSS'
], ctr(3), ctr(6), 113, 41, "Ash's House");

var smithHouse = new Landscape([
    '!SSSSSSSS',
    '!S___:S_S',
    'SS___SSSS',
    'S_______S',
    'S______SS',
    'S______S!',
    'SSSS|SSS!',
], 337.5, 412.5, 130, 37, "Smith's House")

var rickHouse = new Landscape([
    '!SSSSSSSSS',
    'SS___SS__S',
    '_________S',
    'SS___SS__S',
    '~S|SSSSSSS'
], ctr(2), ctr(4), 136, 23, "Rick's House")

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
], 75, 75, 6, 52, "Confounded Cave", function() {
    if (keys.space && !p.spaceActioned) {
        if (p.on(7, 1)) {
            Screen.fadeOut(0.05, function() {
                curMap = mainMap;
                p.goTo(ctr(6), ctr(52));
                Screen.fadeIn(0.05);
            })

            p.spaceActioned = true;
        }
    }
})

var noctosRoom = new Landscape([
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
], 75, 75, 0, 0, "Noctos Room", function() {
    bossfight = (noctos.health > 0);
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
], ctr(5), ctr(7), 190, 16, "Glacia Center")

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
], ctr(6), ctr(7), 165, 16, "Trail Shop")

var breezewayBuilds = new Landscape([
    'SSSSSSSSSSS',
    'S***zzz***S',
    'S*zSzzzSz*S',
    'S*zSSSSSz*S',
    'Szzzz*zzzzS',
    'Szzz***zzzS',
    'Szzzz*zzzzS',
    'S~zzzzzzz~S',
    'S~zzzzzzz~S',
    'S~~~zzz~~~S',
    'SSSSS|SSSSS',
], ctr(5), ctr(10), 206, 16, "Breezeway Builds")

var friosFoodFrenzy = new Landscape([
    'WWWWWWWWW',
    'W@W...W@W',
    'W@W...W@W',
    'WWW...WWW',
    'W.......W',
    'WWWW|WWWW',
], ctr(3), ctr(5), 211, 24, "Frio's Food Frenzy")

var lonzoHouse = new Landscape([
    '**W_$!!',
    'WWW_$$$',
    '_______',
    '_______',
    '___|___',
], ctr(3), ctr(3), 228, 16, "Lonzo's House")

var queensCastle = new Landscape([
    '|__W___W_____________________________$$$$$$$',             
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
], ctr(0), ctr(0), 159, 4, "The Queen's Castle")

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
], ctr(32), ctr(24), 156, 50, "Gale Cave")
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

            underneathGlaciaVillage.setInstructions("It looks like you opened a gate in Gale Cave.\nThis place doesn't really look like it seals an elemental master though.\nThere might be an entrance to the dungeon deeper into this cave.");
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

            if (!howlerHollow.visited) {

            }
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
], ctr(1), ctr(1), null, null, "Howler Hollow")

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
], ctr(13), ctr(23), 0, 0, "Stormed Room", function() {
    lighting = 2500
    bossfight = (stormed.health > 0);
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

        encompassedForest.brightened = true
        encompassedForest.forestTeleport = false

        lostTraveler.goTo(ctr(69420), ctr(69420))
        bora.goTo(ctr(252), ctr(47))
    } else {
        lighting = 500
    }

    if (keys.space) {
        if (p.on(9, 9) || p.on(10,9)
        || p.on(9, 10) || p.on(10, 10)) {
            curMap = mainMap
            p.goTo(ctr(252), ctr(49))
        }
    }
})

var droptonWaterWear = new Landscape([
    'WWWWWWWWWWWWWWWWW',
    'W.....W...W.....W',
    'W.....WWWWW.....W',
    'W...............W',
    'W...............W',
    'WWWWWWWW|WWWWWWWW'
], ctr(8), ctr(5), 216, 82, "Dropton Water Wear")

var coralsWatercolors = new Landscape([
    "BBBBBBBBBBB",
    "B.........B",
    "B.BBBBBBB.B",
    "B.........B",
    "B,,.....,,B",
    "B~@.....@~B",
    "BBBBB|BBBBB",
], ctr(5), ctr(6), 274, 75, "Coral's Watercolors")

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
            p.goTo(271 * 75 + 5, ctr(78))
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
    '~~~~~~~~~~~~~~~~~~SIIIIIS~~~~~~~~!^i^!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
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
            p.goTo(ctr(7), 6 * 75 - 5)
        }

        if (p.on(2, 11)) {
            curMap = lochNessHouse
            p.goTo(ctr(5), ctr(4))
        }
        
        if (p.on(35, 28) && theBlockedEntrance.complete) {
            curMap = mainMap
            p.goTo(ctr(252), ctr(80))
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
            p.goTo(ctr(4), 3 * 75 + 70)
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
            p.goTo(ctr(38), 20 * 75 + 5)
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
], null, null, null, null, "Loch Ness's House", function() {
    if (keys.space) {
        if (p.on(5, 5)) {
            curMap = droptonCity
            p.goTo(ctr(2), ctr(12))
        }
    }
})

var abandonedChannel = new Landscape([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSS~~~~~~~~~~~~~SSSSSSSSSSSSSSSSS^^^^SSSSSSSSSSSSSS',
    'SSSSSSSS~~~~~~~~SSSSSSSSSSSSSSSSSSSS^SSSSSSSSSSSSSS',
    'SSSSSSSS~iSSSSS~~SSSSSSSSSS^^^^^SSSS^SSSSSSSSSSSSSS',
    'SSSSSSSS~iSSSSS~~SSSSSSSSSS^SSS^SSSS^^^^^SSSSSSSSSS',
    'SSSSSSSS~iSSSSSIISSSSSSSSSS^SSS^^^^^^SSS^SSSSSSSSSS',
    'SSS~~~~~~~~iS~~~~SSSSSSSSSS^SSS^SSSSSSSS^SSSSSSSSSS',
    'SSS~~iiiiiiSS~~SSSSSSSSSSSS^SSS^SSSSSSSSSSSSSSSSSSS',
    'S~~~iSSSSSSS~~~S^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^S',
    'S~~iiSSSSO~~~SSS^^SSSSSSSSS^SSS^SSSSSSSSSSSSSSSSSSS',
    'S~iSSSSSS~~SSS^^^SSSSSSSSSS^SSS^SSSSS!~!~!~!SSSSSSS',
    'S~iSSSS~~~~S^^^^SSSSSSSSSSS^SSS^SS^SS~~~~~~~_SSSSSS',
    'S~iSSS~~~SSS^^^SSSSSSS~SSSS^^^^^^^^SS~SSSSSSSSSSSSS',
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
            cascade.x = ctr(9)
            cascade.y = ctr(9)
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
                "...",
                "Wait, you're right! It looks like ice is blocking the other way!",
                "Lucky for me I always come prepared.\nI have a raft to break the ice!",
                "You can track the water portion. Let's see if we find anything.",
                "I'll call out if I need anything. Good luck!"
            ]

            cascade.curPath = [
                [11, 9],
            ]
            cascade.action = function() {
                cameraStart(ctr(16), ctr(6), 7, "NPC", {
                    npcName: cascade,
                    lineStop: 12
                })
                
                cascade.action = function() {
                    cascade.lines = [
                        "Please explore the water passage while I investigate the suspensia.",
                        "I already told you once, we haven't got time for dillydallying!"
                    ]
                    //curMap.changeBlocks([[15, 3], [16,3]], '~')
                    interactives.push(new Raft(abandonedChannel, ctr(10), ctr(9)))
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
                cascade.actionLine = "after"
            }
            cascade.actionLine = 11
            

            
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
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(7), ctr(1))
                curMap = cryoUnderground
                Screen.fadeIn(0.05);
            });
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
    'W~~~~~~~~~~I!!!~~~zz~~~W.W!W~WWWWW..WWWW.WWWWW.WWW',
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
], ctr(1), ctr(1), 0, 0, "The Cryo Underground") // Don't enter from mainMap

cryoUnderground.solve = function() {
    this.temperature = -1
    lighting = 1500

    if (keys.space) {
        if (p.on(8, 1)) { // Exit to Abandoned Channel
            Screen.fadeOut(0.05, () => {
                p.goTo(ctr(47), ctr(19))
                curMap = abandonedChannel
                Screen.fadeIn(0.05);
            })
        }

        // if (p.on(42, 28)) {
        //    // curMap = stormedRoom
        //     //p.x = ctr(13)
        //     //p.y = ctr(23)
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

var hydrosRoom = new Landscape([
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
], ctr(15), ctr(26), 0, 0, "Hydros Room", function() {
    bossfight = (hydros.health > 0);
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

var fortuneFieldMeetingPlace = new Landscape([
    'WWWWWWW',
    'W@W...W',
    'WWW...W',
    'W.....W',
    'W...WWW',
    'W...W~W',
    'WWW|WWW',
], ctr(3), b(6), 180, 55, "Fortune Field Meeting Place", function() {

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

var litholianLegendPassageways = new Landscape([
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS~~~S',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS~~~S',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS~~~S',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS!!SSSSS~SS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS!~~~~~~~SS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS!!SSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS!SSSSSSSS',
    'SSSSSSSSSSSSSSSSS~~~~SSSSSSS!!!!SSSSSSSS',
    'SSSSSSSSSSSSSSSSSzSS~~~~!!!!!!!!SSSSSSSS',
    'SSSSSSSSSSSSSSSSS^S__SSS!!!!!!!!SSSSSSSS',
    'SSSSSSSSSSSSSSSSSzS_SSSSSSSS!!!!SSSSSSSS',
    'SSSSSSSSSSSSSSSSS~__SSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSS!!!!SSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSS!!!!~~~~SSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSS!!!!SSS~~SSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSS~SSSSSS~SSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSS~SSSSSS~~SSSSSSSSSSSSSS',
    'SSSSSSSSSSS~SS~~~~SSSSSSS~SSSSSSSSSSSSSS',
    'SSSSSSSS!!!~~~~SSSSSSSSSS~SSSSSSSSSSSSSS',
    'SSSS!!!!!!SSSSSSSSSSSSSSS~SSSSSSSSSSSSSS',
    'SS_~!!!!SSSSSSSSSSSSSSS!!!SSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSSS!!!SSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSS~~!!!SSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSS~SSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSS~SSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSS~~SSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSS~~SSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSS~SSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSS~~SSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSS___~!!~~SSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSS___S!!~SSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSS__SS~~~SSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSS!~z^z~SSSSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSS!!SSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSS!!SSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSS!SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSSSS!!!!!SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SO~!!!SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
    'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS',
], null, null, null, null, "Passages of Litholian Legend", function() {
    setLighting(1500)

    if (keys.space) {
        if (p.on(1, 38)) {
            curMap = mainMap
            p.goTo(b(106), b(101))
        }
    }
})

var stoneheartFortress = new Landscape([
    '$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$%%!%%%%%%~%%%%%$$$$',
    '$$$$$$%$$%O%%%~%!$$$!$$$$',
    '$$$$%%%$$%$$$$%!$%%%%$$$$',
    '$$$$%$$$$%%%%%%$$$$$%$$$$',
    '$$%%%$~~$$$$$$$$~~$$%$$$$',
    '$$%%%$~~$O)%%$$$~~$%%%$$$',
    '$$%%%$$$$$%%%%~$$$$%%%$$$',
    '$$%$$$$$$$$$$!%%%%%%%%$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$',
], ctr(12), ctr(1), 106, 94, "Stoneheart Fortress", function() {
    if (keys.space) {
        if (p.on(9, 6)) {
            Screen.fadeOut(0.05, function() {
                curMap = stoneheartSanctuary
                p.goTo(ctr(1), ctr(1))

                Screen.fadeIn(0.05, function() {
                    p.canMove = true
                })
            })
        }

        // Exit
        if (p.on(10, 2)) {
            Screen.fadeOut(0.05, function() {
                curMap = mainMap
                p.goTo(ctr(106), ctr(94))

                Screen.fadeIn(0.05, function() {
                    p.canMove = true
                })
            })
        }
    }
})

var stoneheartSanctuary = new Landscape([
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$O_____~__~______~!!%%%~%%%~$$~~~$$~~~~$',
    '$______~___!S_____!!!~%%%~%%%%%!%%%%%%~$',
    '$_SSSS_!_SSSSSSS____SSSS_$$$$$$$$$$~~_~$',
    '$_S__S_S_SSSSSSS_SSSS__~____________$)$$',
    '$____~_~_______~______$$$$$$$$$$$$$$$%$$',
    '$$$$$$$$$$$$$$$$$$$$$$$___!__!___$%%%%$$',
    '$______!!!!!!___~________!____!__$%%%%$$',
    '$!!!!!~~~~~~~___~________$$$$$$__$%%%%$$',
    '$!zzz!~$$$$$$$$_!$$$$$$_______$__%%%%%$$',
    '$!zzz!$$$$$$$$$$^$$$$$$$$$$$$$$$$$$$$$$$',
    '$!!!!!$!^^$!~~~$$$$$$_$_$$$$~~________$$',
    '$~~__~~~$!!!_~~~~$_z~_$!$_$$~$$%$~!%%~$$',
    '$$$$$$$__~$$~~$~$$__$$$$$_$$~$$$$~%%~~$$',
    '$$$$$$$$$$$$$z$$$$__!__~__)~~$!!!~%!!~$$',
    '$$$$$$$$$$$$$zz__!__!__$$_$$$$!$$~!%%~$$',
    '$$_________$$$$_$_$)$~_$__$$!!!$~~%%~$$$',
    '$$_$$$$$$$_$$$$_$$$_$!$$_$$$!$$$~!%%~$$$',
    '$$_$_____$_$$$$_____$_~!z$$$~$$$$$z$$$$$',
    '$$_$_$$$_$_$$$$$$$$$$$$$$$$__$$$zzz_)_$$',
    '$$_$_$O$_$_$$$$$$$$$$$$$$$___$$$$$$$$$$$',
    '$$_$_$___$_$$$$$$$$$$$$$$____$$$$$$$$$$$',
    '$$_$_$$$$$_$$$$$$$$$$$^!~~~~~$$$$$$$$$$$',
    '$$_$_______$$$$$$$_$$$$$$____$$$$$$$$$$$',
    '$$_$$$$$$$$$zzzzzzzzzzz)__$$$$$$$$$$$$$$',
    '$$_zzzzzzzzzz$$$$$$$$$$$_$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
], null, null, null, null, "Stoneheart Sanctuary", function() {
    setLighting(2000)

    if (!!!stoneheartSanctuary.intervalSet) {
        setInterval(function() {
            stoneheartSanctuary.switch(25, 7, "~", "!")
            stoneheartSanctuary.switch(26, 6, "~", "!")
            stoneheartSanctuary.switch(29, 6, "~", "!")
            stoneheartSanctuary.switch(30, 7, "~", "!")
        }, 2500)

        stoneheartSanctuary.intervalSet = true
    }

    // Places to go
    if (keys.space) {
        if (p.on(1, 1)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(9), ctr(6))
                curMap = stoneheartFortress

                Screen.fadeIn(0.05, function() {
                    p.canMove = true
                })
            })
        }
    }
})

var lithosRoom = new Landscape([
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
    '$%%%%%%%%%$%%%%%%%%$%%%%%%%%%$',
    '$%%%%%%%%%$%%%%%%%%$%%%%%%%%%$',
    '$%%~~%!!!%$%%%%%%%%$%!!!%~~%%$',
    '$%%~~%%%%%%%%%%%%%%%%%%%%~~%%$',
    '$%%%%%%%%%%%%%%%%%%%%%%%%%%%%$',
    '$%%!%%!!$$$$$!!!!$$$$$!!%%!%%$',
    '$%%!%%!%%%%%%%%%%%%%%%%!%%!%%$',
    '$%%!%%$%%%%%%%%%%%%%%%%$%%!%%$',
    '$%%%%%$%%%%%%%%%%%%%%%%$%%%%%$',
    '$$$$%%$%%%$$$$__$$$$%%%$%%$$$$',
    '$%%%%%$%%%$%%%%%%%%$%%%$%%%%%$',
    '$%%%%%$%%%$%%%%%%%%$%%%$%%%%%$',
    '$%%$$$!%%%$%%%%%%%%$%%%!%%%%%$',
    '$%%%%%!%%%_%%%!!%%%_%%%!%%%%%$',
    '$%%%%%!%%%_%%%!!%%%_%%%!%%%%%$',
    '$%%%%%!%%%$%%%%%%%%$%%%!%%%%%$',
    '$%%%%%$%%%$%%%%%%%%$%%%$%%%%%$',
    '$%%%%%$%%%$%%%%%%%%$%%%$%%%%%$',
    '$$$$%%$%%%$$$$__$$$$%%%$%%$$$$',
    '$%%%%%$%%%%%%%%%%%%%%%%$%%%%%$',
    '$%%!%%$%%%%%%%%%%%%%%%%$%%!%%$',
    '$%%!%%!%%%%%%%%%%%%%%%%!%%!%%$',
    '$%%!%%!!$$$$$!!!!$$$$$!!%%!%%$',
    '$%%%%%%%%%%%%%%%%%%%%%%%%%%%%$',
    '$%%~~%%%%%%%%%%%%%%%%%%%%~~%%$',
    '$%%~~%!!!%$%%%%%%%%$%!!!%~~%%$',
    '$%%%%%%%%%$%%%%%%%%$%%%%%%%%%$',
    '$%%%%%%%%%$%%%%%%%%$%%%%%%%%%$',
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
], b(15), ctr(19), null, null, "Lithos Room", function() {
    lighting = 2750;
    bossfight = (lithos.health > 0);
})

const mineraBurrow = new Landscape([
    'SSSSSSSSSSSSSSSSSSSSSSSSS',
    'SO#SSSSS#,SSSSSSSS#,SS#OS',
    'S###########SSSSSS##SS##S',
    'SS##SSS##SS,#SSSS,##SS#SS',
    'SSSSSSS###SS#SSSS####S##S',
    'SSSSSS,######SSSS##S####S',
    'SSSSS#####SSSSSSS#S####SS',
    'SSSSSSS###SSSSS,##SSS#,SS',
    'SSS,####SSS#SSS#S##,SSSSS',
    'SS####SSS,##S#SSS####SSSS',
    'SS##,SSS#############SSSS',
    'SS##SS###S#S####S,###SSSS',
    'SS#SSS###SSSSSSSSSSSSSSSS',
    'SS###SS,#SS,####SSSSS##SS',
    'SSS,#SS##SS###S##SS,###SS',
    'SSSS#S##SSSS#,S##SSS###SS',
    'SS###S#SSSSS#SS###SSS##,S',
    'S,#SSS###SS##SSS###SSS##S',
    'SS#S####,SS###SS####SS##S',
    'SSSS#SSSSSSS##SS,#S#SSS#S',
    'S##SSSSSSS####SSSSS##SS#S',
    'S#######SS###SSSSSSS##S#S',
    'SSSS#S##S####SSSSSS,####S',
    'SO)))SSSS##SSSSSSSSSSS#OS',
    'SSSSSSSSSSSSSSSSSSSSSSSSS',
], null, null, null, null, "Minera Burrow", function() {
    lighting = 1500;
    
    if (keys.space && !p.spaceActioned) {
        if (p.on(1, 1) || p.on(23, 1) || p.on(23, 23) || p.on(1, 23)) {
            Screen.fadeOut(0.05, function() {
                if (p.on(1, 1)) {
                    curMap = mainMap;
                    p.goTo(ctr(57), ctr(56));
                } else if (p.on(23, 1)) {
                    curMap = mainMap;
                    p.goTo(ctr(89), ctr(54));
                } else if (p.on(23, 23)) {
                    curMap = mainMap;
                    p.goTo(ctr(85), ctr(90));
                } else if (p.on(1, 23)) { // Exit that leads to Dawn's Landing path
                    curMap = mainMap
                    p.goTo(ctr(46), ctr(69));
                }

                Screen.fadeIn(0.05);
            })
        }
    }
})

const dawnsLandingSkywayStore = new Landscape([
    'WWWWWWWWW',
    'W5W...W5W',
    'W.WWWWW.W',
    'W.......W',
    'W.......W',
    'W.......W',
    'WWWW|WWWW',
], ctr(4), ctr(6), 8, 77, "Dawn's Landing Skyway Store", function() {

})

const willowHouse = new Landscape([
    'WWWWWWW',
    'WOW:..W',
    'WWWW..W',
    'W.....W',
    'WWW.WWW',
    'W~W.W,W',
    'WWW|WWW',
], ctr(3), ctr(6), 4, 83, "Willow's House", function() {
    setLighting(4500);

    if (keys.space && !p.spaceActioned) {
        if (p.on(1, 1)) {
            Screen.fadeOut(0.05, function() {
                curMap = mainMap;
                p.goTo(ctr(2), ctr(77));
                Screen.fadeIn(0.05);

                p.spaceActioned = true;
            })
        }
    }
});

const dawnsLandingForestTunnels = new Landscape([
    'SSSSSSSSSS',
    'SO#####SSS',
    'SSSSSSS##S',
    'S#####S#SS',
    'S#SSS#S#SS',
    'S#S#S#S##S',
    'SSS#S#SS#S',
    'S###S#SS#S',
    'S#SSS#SS#S',
    'S#S###SS#S',
    'S#S#SSS##S',
    'S#S###S#SS',
    'S#SSS####S',
    'S#SSSSSSOS',
    'SSSSSSSSSS',
], ctr(3), ctr(6), 4, 83, "Dawn's Landing Forest Tunnels", function() {
    lighting = 800;
    if (keys.space && !p.spaceActioned) {
        if (p.on(8, 13)) {
            Screen.fadeOut(0.05, function() {
                curMap = mainMap;
                p.goTo(ctr(8), ctr(104));
                Screen.fadeIn(0.05);
            })

            p.spaceActioned = true;
        } else if (p.on(1, 1)) {
            Screen.fadeOut(0.05, function() {
                curMap = mainMap;
                p.goTo(ctr(2), ctr(94));
                Screen.fadeIn(0.05);
            })
            
            p.spaceActioned = true;
        }
    }
});

const luminosIsle = new Landscape([
    '55555555555555555555555555555555555555555555555555',
    '5````````````````````````````````````````````````5',
    '5``````````````````222222222222``````````````````5',
    '5``````````22`````2````````````2`````22``````````5',
    '5``22222``2552```2``````````````2```2552``22222``5',
    '5`2~~l~~2``22```2``````2222``````2```22``2~~l~~2`5',
    '5`2~l|l~2``22``255555222OO222555552``22``2~l-l~2`5',
    '5`2~l-l~2``22``255555252``252555552``22``2~l-l~2`5',
    '5`2~l-l~2`l22l`222222222``222222222`l22l`2~l-l~2`5',
    '5``22)22`````````````lll``lll`````````````22-22``5',
    '5````````````````````````````````````````````````5',
    '5````````````````````````````````````````````````5',
    '5````````````````````````````````````````````````5',
    '5````````````````````````````````````````````````5',
    '5````````````````````````````````````````````````5',
    '5``````````````````````22````````````````````````5',
    '5```````````````````````22```````````````````````5',
    '5```````````````````````22```````````````````````5',
    '5```````````````````````22```````````````````````5',
    '5`````````````````````22~~22`````````````````````5',
    '5````````````````````2~~~~~~2````````````````````5',
    '5```````````````````2~~~~~~~~2```````````````````5',
    '5``````````````````2~~~~~~~~~~2``````````````````5',
    '5``````````````````2~~~~~~~~~~2```2``````````````5',
    '5```````````````222~~~~~~~~~~~~2222``````````````5',
    '5``````````````2222~~~~~~~~~~~~222```````````````5',
    '5``````````````2```2~~~~~~~~~~2``````````````````5',
    '5``````````````````2~~~~~~~~~~2``````````````````5',
    '5``````````````2````2~~~~~~~~2```````````````````5',
    '5`````````````222``--2~~~~~~2````````````````````5',
    '5````````````22222``--22~~22`````````````````````5',
    '5````````````22222```---22```````````````````````5',
    '5```````````l22|22l````-22```````````````````````5',
    '5`22222```2````-```````-22```````````````````````5',
    '5`2~~~2``222```----------22``````````````````````5',
    '5`2~~~2`22222```````````-``````-`````2```````````5',
    '5`2~~O2222222``````````l-l`````-````222``````````5',
    '5`22222`22|22```````````------`-```22222`````````5',
    '5````````````````````22222222-`-```22222`````````5',
    '5````````````````````2``````2-`-``l22|22l````````5',
    '5````````````````````22222222-`-`````-```````````5',
    '5```````````````````````--------------```````````5',
    '5``222```22222``````````----````l````l```````````5',
    '5`22222``2~~~2`````````l--l``````````````````````5',
    '52222222`2~~~2`````-------------`````````````````5',
    '52222222`2~~~2`````-```l--l``````````````````````5',
    '5222|222`22222`````-```2--2``````````````````````5',
    '5```-``````````````-```2--2``````````````````````5',
    '5```----------------```2~~2``````````````````````5',
    '55555555555555555555555555555555555555555555555555',
], null, null, null, null, "Luminos Isle", function() {
    lighting = 1000;

    if (underneathLuminosIsle.talkedToElenaAboutLightContainer && underneathLuminosIsle.elenaHasLightContainer) {
        if (keys.space && !p.spaceActioned) {
            if (p.on(4, 34)) {
                p.giveItem(items.lightContainer, true);
                underneathLuminosIsle.elenaHasLightContainer = false;

                elena.lines = [
                    "Hey there!\nDid you get that Light Container you needed?",
                    "...",
                    "Great! May I ask what you needed it for?",
                    "...",
                    "It's a secret? Wow, okay.",
                    "Well, you're welcome."
                ];
                elena.clearAction();
            }
        }
    }

    luminosIsle.manualDoors = true;

    if (keys.space && !p.spaceActioned) {
        if (p.on(24, 48) || p.on(25, 48)) { // Drop down to Dawn's Landing
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(22), ctr(76));
                curMap = mainMap;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }

        if (p.on(24, 6) || p.on(25, 6)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(b(18), ctr(19));
                curMap = empressAurorasPalace;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }

        if (p.on(4, 46)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(4), ctr(3));
                curMap = bobaysBitsAndBobs;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }

        if (p.on(5, 36)) { // Elena's House back pool entrance
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(1), ctr(3));
                curMap = elenaHouse;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }

        if (p.on(10, 37)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(3), ctr(4));
                curMap = elenaHouse;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }
    }
});

const elenaHouse = new Landscape([
    '2222222',
    '2`````2',
    '2`5`5`2',
    '2O5`5~2',
    '222|222',
], null, null, null, null, "Elena's House", function() {
    if (keys.space && !p.spaceActioned) {
        if (p.on(3, 4)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(10), ctr(37));
                curMap = luminosIsle;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }

        if (p.on(1, 3)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(5), ctr(36));
                curMap = luminosIsle;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }
    }
});

const bobaysBitsAndBobs = new Landscape([
    '555555555',
    '5~2```2~5',
    '5~2```2~5',
    '5555|5555',
], null, null, null, null, "Bobay's Bits and Bobs", function() {
    lighting = 900;

    if (keys.space && !p.spaceActioned) {
        if (p.on(4, 3)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(4), ctr(46));
                curMap = luminosIsle;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            });
        }
    }
});

const empressAurorasPalace = new Landscape([
    '222222222222222222222222222222222222',
    '2`2``````2`2`l2~5ll5~2l`2`2``````2`2',
    '2`l222222l`2``2~5``5~2``2`l222222l`2',
    '2``````````2``2~5``5~2``2``````````2',
    '25`````````2``2~~cc~~2``2`````````52',
    '2~5````````2`l222``222l`2````````5~2',
    '2~~5```````2````l``l````2```````5~~2',
    '2~~~5``````2222``````2222``````5~~~2',
    '2222222222````222))222````2222222222',
    '2````````22```222))222```22````````2',
    '2```5:5```2``````````````2```5:5```2',
    '2``55555``2222222``2222222``55555``2',
    '2``5~~~5``2``````````````2``5~~~5``2',
    '2``5~5~5``2```22222222```2``5~5~5``2',
    '2``5~5~5``````2~~~~~~2``````5~5~5``2',
    '2``5~~~5``2```22222222```2``5~~~5``2',
    '2``55555``2``````````````2``55555``2',
    '2`````````2222222222222222`````````2',
    '2``````````````````````````````````2',
    '22222222222222222OO22222222222222222',
], null, null, null, null, "Empress Aurora's Palace", function() {
    lighting = 5000;
    empressAurorasPalace.manualDoors = true;

    if (keys.space && !p.spaceActioned) {
        if (p.on(17, 19) || p.on(18, 19)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(b(25), ctr(6));
                curMap = luminosIsle;

                p.spaceActioned = true;

                Screen.fadeIn(0.05);
            });
        } else if (p.on(30, 13)) {
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(22), ctr(14));
                curMap = theCatacombs;

                p.spaceActioned = true;

                Screen.fadeIn(0.05);
            });
        }
    }

    if (empressAurora.lines[0] == 'Go into my palace!\nWhatever business you have to discuss, it must be done so in private.') {
        empressAurora.goTo(b(18), b(3));
        empressAurora.map = empressAurorasPalace;
        empressAurora.lines = [
            "Alright, now let's hear what you have to say.",
            "...",
            "So you're the man all the other leaders have been telling me about?",
            "Then this is big news! You can help us!",
            "...",
            "Oh yes, of course. I need to tell you what's wrong.",
            "Well, as I'm sure you've noticed, for a city known for\nbeing bright and luminous, it's very dark right now.",
            "We initially noticed the city getting darker a long time ago,\nbut recently it's gotten much, much worse.",
            "Our Luminos lamps are being affected too!\nThey aren't as bright as they used to be, and sometimes they stop working outright!",
            "The other leaders told me that there were elemental masters\nhidden in their various villages, causing trouble and chaos.",
            "...And they also told me you managed to slay all 4 of them.\nSo, how hard could a 5th one be?",
            "Anyway, does all that sound good to you?",
            "...",
            "Perfecto!",
            "As for where to start, I can only imagine whatever creature is\ncausing this darkness is somewhere inside Luminos Isle, beneath us.",
            "After all, there's not much above us!",
            "This palace has a very secret passage to a place I call\nThe Catacombs! Perhaps you might be able to find a clue there.",
            "Let me take you to the entrance. However,\nyou must not tell anyone else about this place!",
            "Follow me...",
        ];

        empressAurora.actionLine = "after";
        empressAurora.action = function() {
            meetingEmpressAurora.finish();

            setTimeout(() => {
                addMission(underneathLuminosIsle);
            }, 3500);

            empressAurora.lines = [
                "Come, follow me to The Catacombs.\nYou might find a clue to where this elemental master is hiding!"
            ];
            empressAurora.curPath = [
                [18, 3],
                [18, 12],
                [24, 12],
                [24, 14],
                [27, 14],
                [27, 9],
                [30, 9],
                [30, 10],
                function() {
                    empressAurorasPalace.changeBlock(30, 11, '`');

                    empressAurorasPalace.changeBlock(30, 13, 'O');

                    empressAurora.lines = [
                        "Here it is, the secret entrance.\nRemember, you cannot tell anyone else about this place!",
                        "Hopefully there's something that will help lead\nyou to a possible elemental master.",
                        "Have fun in there!"
                    ];

                    empressAurora.clearAction();
                }
            ];
        }
    }
});

const theCatacombs = new Landscape([
    '````````````````555555O555555````````````````',
    '`````````````````55555_55555```````!!!!``````',
    '555555``````````````55)55``````````!`!!555555',
    '~~~~~~5``````````````5)5```````````!`!~~~~~~~',
    '555555`````````````````````````````!!!!555555',
    '`````````````_````````_````````_`````````````',
    '555555``````___``````___``````___``````555555',
    '~~~~~~5`````___``````___``````___`````5~~~~~~',
    '555555``````___``````___``````___``````555555',
    '`````````````_````````_````````_`````````````',
    '555555`````````````````````````````````555555',
    '~~~~~~5``````~`````````````````~``````5~~~~~~',
    '555555``````~~~```````````````~~~``````555555',
    '`````````````~```````2`2```````~`````````````',
    '````````````````````52O25````````````````````',
], null, null, null, null, "The Catacombs", function() {
    lighting = 1200;
    theCatacombs.manualDoors = true;

    if (theCatacombs.getBlock(22, 2) == '(' && theCatacombs.getBlock(22, 3) == '(' && !theCatacombs.empressAuroraCheckIn) {
        theCatacombs.empressAuroraCheckIn = true;

        empressAurora.map = theCatacombs;
        empressAurora.goTo(ctr(21), ctr(4));
        empressAurora.dir = 'R';
        empressAurora.lines = [
            "Well, I see you have made progress.",
            "I originally came over to check on you,\nbut I happened to discover some new information.",
            "I'm afraid I must tell you rather quickly so that\nnobody wonders where I've gone.",
            "The other regional leaders have informed me that\nevery one of their elemental masters were in some sort of dungeon.",
            "If there is a dungeon underneath Luminos Isle, there is a\nvery good chance that it was built by Luminos's citizens long ago.",
            "And if this is the case, they most likely would have used a Light Gate.",
            "Light Gates require a beam of light to be opened, ensuring\nthat only a Luminos Isle citizen would be able to enter.",
            "*That is, unless you had Light Containers.",
            "Light Containers can do many wondrous things,\nand opening Light Gates is merely one use.",
            "I will give you my supply of Light Containers, however if this\ndungeon is to be truly secure, I suspect that many more are needed.",
            "You should head back up to Luminos Isle and get\nyour hands on some more Light Containers.",
            "*I suggest visiting shops and asking around for Light Containers.\nThey might not be free though.",
            "Anyway, I must get back up to my palace! The fate of Luminos Isle is in your hands!"
        ];

        empressAurora.action = function() {
            underneathLuminosIsle.setInstructions("You managed to open some sort of door to a deeper area! However,\nEmpress Aurora had some information to share with you.\nShe believes that if a super old dungeon does exist, its creators\nmost likely used Light Gates to keep unwanted visitors out.\nSo, you'll need to ask around Luminos Isle to find Light Containers, which will open the Light Gates!");

            empressAurora.curPath = [
                [20, 4],
                [20, 12],
                [22, 12],
                [22, 14],
                function() {
                    empressAurora.map = empressAurorasPalace;
                    empressAurora.goTo(b(18), b(3));
                }
            ];

            empressAurora.lines = [
                "Well, get to work!",
                "You're going to need those Light Containers, and\nasking around Luminos Isle is the quickest way!",
                "No time to waste!"
            ];

            empressAurora.clearAction();

            elena.lines = [
                "Well hello there! How's it going?",
                "...",
                "You're looking for a Light Container?",
                "Well, nowadays they're pretty hard to come by.\nI happen to have a spare one, so I suppose you could use it.",
                "If I remember correctly, I left in in the small pond next to my house.\nJust don't snoop around in there for too long!",
                "Oh right, I almost forgot to tell you.\nMy house is southwest of the central lake."
            ];
            elena.action = function() {
                underneathLuminosIsle.talkedToElenaAboutLightContainer = true;
                underneathLuminosIsle.elenaHasLightContainer = true;
            };
            elena.actionLine = "after";
        }
    }

    if (keys.space && !p.spaceActioned) {
        if (p.on(22, 14)) {
            Screen.fadeOut(0.05, function() {
                curMap = empressAurorasPalace;
                p.goTo(ctr(30), ctr(13));

                p.spaceActioned = true;

                Screen.fadeIn(0.05);
            });
        }

        if (p.on(22, 0)) {
            Screen.fadeOut(0.05, function() {
                curMap = luxosChamber;
                p.goTo(ctr(22), ctr(22));

                p.spaceActioned = true;

                Screen.fadeIn(0.05);
            });
        }
    }
});

const luxosChamber = new Landscape([
    '555555555555555555555555555555555555555555555',
    '55~~~~~~~~~~~5`````````````````5~~~~~~~~~~~55',
    '5`5~~~~~~~~~5```````````````````5~~~~~~~~~5`5',
    '5``5~~~~~~~5`````````````````````5~~~~~~~5``5',
    '5```5~~~~~5```````````````````````5~~~~~5```5',
    '5````5~~~5`````````````````````````5~~~5````5',
    '5`````5~5```````````````````````````5~5`````5',
    '5``````5`````````````````````````````5``````5',
    '5```````5```````````````````````````5```````5',
    '5````````5`````````````````````````5````````5',
    '5`````````5`````````````22222`````5`````````5',
    '5``````````5```````222222```222``5``````````5',
    '5```````````5````222``~````zz!225```````````5',
    '55555555`````5``2WWWW22222222z25````````````5',
    '5``````5``````5`2````2^W5555zz5`````````````5',
    '5``````5```````52`````2`2`2225``````````````5',
    '5``````5````````5```````~``55```````````````5',
    '5``````5`````````5``22222``5````````````````5',
    '5``````5``````````52`````25`````````````````5',
    '5````555`5555555552```````2`````````````````5',
    '5````5~~~~~~~2~~~2`````````2````````````````5',
    '5````5~5555555``52```~~~```2````````````````5',
    '5````525```````5`2```~O~```2````````````````5',
    '5````5^5``````5``2```~~~```2````````````````5',
    '55555555555555```2`````````2````````````````5',
    '5``````````555``5~2```````2`````````````````5',
    '5``````````55````~52`````25`````````````````5',
    '5```````````5```55~~22`22~~5````````````````5',
    '5````````````5~~5`55`````55`5```````````````5',
    '5`````````````55`````2)2`````5``````````````5',
    '5`````````````52222222)22222225`````````````5',
    '5````````````5`2``````)``````2`5````````````5',
    '5```````````5``2`22222222222`2``5```````````5',
    '5``````````5```2`2```````````2```5``````````5',
    '5`````````5````2`2`222222222`2````5`````````5',
    '5````````5`````2`2`2```````2`2`````5````````5',
    '5```````5```~``2`2`2`22222`2`2``````5```````5',
    '5``````5```~~``2`2`2`2```2`2`2```````5``````5',
    '5`````5```~~~``2`2`2`2O2`2`2`2````````5`````5',
    '5````5```~~~~``2`2`2`222`2`2`2`````````5````5',
    '5```5```~~~~~``2`2`2`````2`2`2``````````5```5',
    '5``5```~~~~~~``2`2`2222222`2`2```````````5``5',
    '5`5````````````2`2`````````2`2````````````5`5',
    '55`````````````2`22222222222`2`````````````55',
    '555555555555555555555555555555555555555555555',
], null, null, null, null, "Luxos Chamber", function() {
    lighting = 4999;
    
    if (keys.space && !p.spaceActioned) {
        if (p.on(22, 22)) {
            Screen.fadeOut(0.05, function() {
                curMap = theCatacombs;
                p.goTo(ctr(22), ctr(0));

                p.spaceActioned = true;

                Screen.fadeIn(0.05);
            });
        }
    }
});

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

class Region {
    constructor(name, bounds, active, passive) {
        this.name = name
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

    update() {
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

    static getRegionFromCords(blockX, blockY) {
        let regionResult = null

        regions.forEach((region) => {
            for (var i in region.bounds) {
                var b = region.bounds[i]
                if (blockX >= b.x1 && blockY >= b.y1 && blockX <= b.x2 && blockY <= b.y2 && curMap == mainMap) {
                    regionResult = region
                }
            }
        })

        return regionResult
    }
}

var chardTown = new Region("Chard Town", [
    {
        x1: 0,
        y1: 0,
        x2: 66,
        y2: 15
    },
    {
        x1: 0,
        y1: 12,
        x2: 91,
        y2: 49
    },
    {
        x1: 0,
        y1: 50,
        x2: 56,
        y2: 60
    },
], function() {
    setLighting(5000)

    if (keys.space && !p.spaceActioned) {
        if (p.on(72, 27)) {
            Screen.fadeOut(0.05, function() {
                curMap = wyattHouse
                p.goTo(ctr(7), ctr(1))
                Screen.fadeIn(0.05)
            })
        } else if (p.on(6, 52)) { // Confounded cave
            if (curMap.getBlock(6, 52) == 'O') { // Verify that the pathway is open
                Screen.fadeOut(0.05, function() {
                    curMap = confoundedCave
                    p.goTo(ctr(1), ctr(1))
                    Screen.fadeIn(0.05, function() {
                        if (curMissions.indexOf(secretsOfSteelField) != -1 && curMissions.indexOf(underneathChardTown) == -1) {
                            secretsOfSteelField.finish();

                            setTimeout(() => {
                                addMission(underneathChardTown);
                            }, 3500);
                        }
                    })
                })
            }
        }

    }

}, function() {
    playMusic("Chard", 0.45);
})

var steelField = new Region("Steel Field", [
    {
        x1: 67,
        y1: 0,
        x2: 138,
        y2: 11
    },
    {
        x1: 92,
        y1: 12,
        x2: 138,
        y2: 51
    }
], function() {
    setLighting(5000)
}, function() {
    playMusic("Steel Field")
})

var glaciaVillage = new Region("Glacia Village", [
    {
        x1: 138,
        y1: 11,
        x2: 270,
        y2: 31
    },
    {
        x1: 138,
        y1: 1,
        x2: 270,
        y2: 11
    },
    {
        x1: 190,
        y1: 31,
        x2: 224,
        y2: 50
    }
], function() {
    setLighting(5000)

    if (p.regionsDiscovered.indexOf(glaciaVillage) == -1) {
        elementsOfElria.setInstructions("Now that you have arrived in Glacia Village, you need to somehow defeat their Elemental Master.\nIf you're ever unsure what to do, just exploring and talking to different people\ncan be very useful!");
    }

    if (p.on(160, 4) && mainMap.getBlock(160, 4) == 'O') {
        if (keys.space && !p.spaceActioned) {
            Screen.fadeOut(0.05, function() {
                curMap = queensCastle;
                p.goTo(ctr(0), ctr(0));
                Screen.fadeIn(0.05);
            });

            // p.spaceActioned = true;
        }
    }
}, function() {
    playMusic("Glacia Village")
})

var windyWastelands = new Region("Windy Wastelands", [{
    x1: 139,
    y1: 32,
    x2: 189,
    y2: 50
}], function() {
    setLighting(5000)

    if (!p.has(items.stormedsSword)) { // Once player has defeated Stormed, wind will stop
        weather.wind.time += (perSec(1))
        weather.wind.x = weather.wind.equation(weather.wind.time % 10)
        weather.wind.y = weather.wind.equation(weather.wind.time % 7)

        if (getBlockById(curMap.getBlock(Math.floor((p.x + weather.wind.x) / 75), Math.floor((p.y) / 75))).through) {
            p.x += weather.wind.x
        }
        if (getBlockById(curMap.getBlock(Math.floor((p.x) / 75), Math.floor((p.y + weather.wind.y) / 75))).through) {
            p.y += weather.wind.y
        }
    }
}, function() {
    playMusic("Windy Wastelands")
})

var encompassedForest = new Region("Encompassed Forest", [{
    x1: 225,
    y1: 31,
    x2: 279,
    y2: 65
}], function() {

    var randNPCDir = ["U", "R", "D", "L"]
    var randDir = ["Forward", "Right", "Backward", "Left"] // Changed UP and DOWN to FORWARD and BACKWARD because it makes more sense if it's relative to where he is pointing
    var pDir = ""
    function changeDir () {
        // lostTraveler.dir = randNPCDir[Math.floor(Math.random() * 4)]
        // forestTeleport = false
    }

    if (!encompassedForest.brightened) {
        setLighting(1000)
        if (entityDistance(lostTraveler, p) <= 500) {
            encompassedForest.forestLoopStarted = true
            encompassedForest.forestTeleport = true
        }
    } else {
        setLighting(2500)
    }

    function moveLostToggle() {
        // Move lost traveler's toggle to next location in cycle
        lostToggleCurPos ++
        lostToggleCurPos = lostToggleCurPos % 4 // If it hits 4, it resets back to 0
        lostTravelerToggle.x = lostTogglePositions[lostToggleCurPos][0]
        lostTravelerToggle.y = lostTogglePositions[lostToggleCurPos][1]
    }

    // Teleports the player in a seamless loop so it looks like the forest never ends
    if (encompassedForest.forestLoopStarted && encompassedForest.forestTeleport && lostTravelerToggle.toggleState != 2) {
        if (p.x > 250 * 75 && p.x < 254 * 75) {
            if (p.y < 37 * 75){
                p.y = 59 * 75
                
                pDir = "U"
                
                if (getBlockInfoByCords(lostTraveler.x, lostTraveler.y - 75).id != "T"
                && getBlockInfoByCords(lostTraveler.x, lostTraveler.y - 75).id != "-") {
                    lostTraveler.y -= 75
                    moveLostToggle()
                }
                
            }

            if (p.y > 59 * 75) {
                p.y = 37 * 75
                changeDir()
                pDir = "D"

                if (getBlockInfoByCords(lostTraveler.x, lostTraveler.y + 75).id != "T" &&
                getBlockInfoByCords(lostTraveler.x, lostTraveler.y + 75).id != "-") {
                    lostTraveler.y += 75
                    moveLostToggle()
                }
               
            }
        }

        if (p.y > 46 * 75 && p.y < 50 * 75) {
            if (p.x < 236 * 75) {
                p.x = 268 * 75
                changeDir()
                pDir = "L"
                
                if (getBlockInfoByCords(lostTraveler.x - 75, lostTraveler.y).id != "T" &&
                getBlockInfoByCords(lostTraveler.x - 75, lostTraveler.y).id != "-") {
                    
                    lostTraveler.x -= 75
                    moveLostToggle()
                }
                
            }

            if (p.x > 268 * 75) {
                p.x = 236 * 75
                changeDir()
                pDir = "R"

                if (getBlockInfoByCords(lostTraveler.x + 75, lostTraveler.y).id != "T" &&
                getBlockInfoByCords(lostTraveler.x + 75, lostTraveler.y).id != "-") {
                    lostTraveler.x += 75
                    moveLostToggle()
                }
                
            }
        }
    }

    if (lostTraveler.cords.x == lostTravelerToggle.x && lostTraveler.cords.y == lostTravelerToggle.y) {
        lostTravelerToggle.toggleState = 2
        curMap.changeBlock(252, 48, "O")
        runOnce(() => {
            playSound("Toggle")
            saveGame()
        })
        
        // Entrance to Encompassed Labyrinth
        if (keys.space && p.on(252, 48)) {
            p.goTo(b(10), b(8));
            curMap = encompassedLabyrinth
        }
    } else {
        lostTravelerToggle.toggleState = 1
    }

}, function() {
    if (!encompassedForest.brightened) {
        playMusic("Encompassed Forest Dark")
    } else {
        playMusic("Encompassed Forest")
    }
})

var droptonDrylands = new Region("Dropton Drylands", [
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
    
    playMusic("Dropton Drylands")
})

var fortuneField = new Region("Fortune Field", [
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
    setLighting(5000);
}, function() {
    
    // changeme Add music for Fortune Field
})

var litholia = new Region("Litholia", [
    {
        x1: 92,
        y1: 52,
        x2: 128,
        y2: 63
    },
    {
        x1: 92,
        y1: 64,
        x2: 120,
        y2: 109
    },
    {
        x1: 128,
        y1: 52,
        x2: 138,
        y2: 61
    },
    {
        x1: 83,
        y1: 74,
        x2: 91,
        y2: 78,
    }
], function() {
    setLighting(5000)

    if (this.inRegion && !this.hasSetLeaderPositions) { // Move King Jasper and President Wells to the Fortune Field Meeting Place
        this.hasSetLeaderPositions = true
        
        kingJasper.map = fortuneFieldMeetingPlace
        kingJasper.goTo(ctr(3), ctr(2))

        presidentWells.map = fortuneFieldMeetingPlace
        presidentWells.goTo(ctr(5), ctr(2))
        presidentWells.dir = "L"
        presidentWells.lines = [
            "It's great to see you again!",
            "King Jasper and I are meeting up here to talk about a famous Litholian legend.\nIt may be more relevant than we thought.",
            "Of course, King Jasper has it memorized. I would ask him about it.",   
        ]
        presidentWells.clearAction()
    }


}, function() {
    playMusic("Litholia")
})

const mineraGrove = new Region("Minera Grove", [
    {
        x1: 57,
        y1: 50,
        x2: 91,
        y2: 60
    },
    {
        x1: 45,
        y1: 61,
        x2: 91,
        y2: 73
    },
    {
        x1: 45,
        y1: 74,
        x2: 82,
        y2: 78
    },
    {
        x1: 45,
        y1: 79,
        x2: 91,
        y2: 109,
    }
], function() {
    setLighting(5000)

    if (this.inRegion && !this.hasSetLeaderPositions) { // Move King Jasper and President Wells to the Fortune Field Meeting Place
        this.hasSetLeaderPositions = true
        
        kingJasper.map = fortuneFieldMeetingPlace
        kingJasper.goTo(ctr(3), ctr(2))

        presidentWells.map = fortuneFieldMeetingPlace
        presidentWells.goTo(ctr(5), ctr(2))
        presidentWells.dir = "L"
        presidentWells.lines = [
            "It's great to see you again!",
            "King Jasper and I are meeting up here to talk about a famous Litholian legend.\nIt may be more relevant than we thought.",
            "Of course, King Jasper has it memorized. I would ask him about it.",   
        ]
        presidentWells.clearAction()
    }


}, function() {
    playMusic("Minera Grove")
});

const dawnsLanding = new Region("Dawn's Landing", [
    {
        x1: 0,
        y1: 61,
        x2: 44,
        y2: 112
    }
], function() {
    setLighting(5000);
    
    if (keys.space && !p.spaceActioned) { // Places to go
        if (p.on(2, 77)) { // From backyard of Willow's House to inside Willow's House
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(1), ctr(1));
                curMap = willowHouse;

                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            })
        } else if (p.on(8, 104)) { // To the Dawn's Landing Forest Tunnels
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(8), ctr(13));
                curMap = dawnsLandingForestTunnels;
                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            })
        } else if (p.on(2, 94)) { // To the Dawn's Landing Forest Tunnels
            Screen.fadeOut(0.05, function() {
                p.goTo(ctr(1), ctr(1));
                curMap = dawnsLandingForestTunnels;
                Screen.fadeIn(0.05);
                p.spaceActioned = true;
            })
        }
    }

}, function() {
    
});

var regions = [chardTown, steelField, glaciaVillage, windyWastelands, encompassedForest, droptonDrylands, fortuneField, litholia, mineraGrove, dawnsLanding]