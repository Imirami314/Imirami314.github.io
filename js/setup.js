var tabIsActive = true
var pauseGameLoop = false
var readyStateConfirmed = false

const FPS = 60
const interval = 1000 / FPS
var then;

document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        tabIsActive = true
    } else {
        tabIsActive = false
    }
})


/**
 * Sets localStorage property
 * @param {*} key Key to get data by
 * @param {*} value The actual data (JSON.parse this stuff if it doens't work, it sometimes fixes things)
 */
function lset(key, value) {
    localStorage.setItem(key, value)
}

/**
 * Gets localStorage data
 * @param {*} key Key to get data by
 * @returns 
 */
function lget(key) {
    return localStorage.getItem(key)
}

const canvas = document.querySelector('.myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const width = 1440;
const height = 675;
const ctx = canvas.getContext('2d');
ctx.scale(window.innerWidth / 1440, window.innerHeight / 675)

var save;

if (!!lget("player")) {
    save = {
        player: JSON.parse(lget("player")),
        npcs: JSON.parse(lget("npcs")),
        maps: JSON.parse(lget("maps")),
        npcActions: JSON.parse(lget("npcActions")),
        npcPathActions: JSON.parse(lget("npcPathActions")),
        interactives: JSON.parse(lget("interactives")),
        lighting: lget("lighting"),
        dev: lget("dev"),
        curMissions: JSON.parse(lget("curMissions")),
        commandsRun: JSON.parse(lget("commandsRun")),
    }
}

var finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
})

var elapsed = 0
// alert(typeof localStorage.getItem('save'))

// localStorage.setItem('save', null) // DEFAULT GONE
// if (!!localStorage.getItem('save')) {
//     save = JSON.parse(localStorage.getItem('save'))
// }

var keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
	q: false,
    b: false,
	n: false,
	x: false,
    space: false,
    shift: false,
    slash: false,
    esc: false
}

var mouseIsDown = false
var mouseClicked = false
var holding = false
var mouseX
var mouseY

function stopAtZero(num) {
    if (num < 0) {
        return 0
    } else {
        return num
    }
}

let randomsSeeded = []

function randomSeed(seed) {
    if (!!randomsSeeded[seed]) {
        return randomsSeeded[seed]
    } else {
        let x = Math.sin(seed++) * 1000
        let result = x - Math.floor(x)
        randomsSeeded[seed] = result
        return result
    }
}


String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function fillTextMultiLine(text, x, y) {
    var lineHeight = ctx.measureText("M").width * 1.2;
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
        ctx.fillText(lines[i], x, y);
        y += lineHeight;
    }
}

function splitEveryN(str, n) { // https://bobbyhadz.com/blog/javascript-split-string-substrings-n-characters
    const arr = [];

    for (let index = 0; index < str.length; index += n) {
        arr.push(str.slice(index, index + n));
    }

    return arr;
}

var MANUAL_DIALOGUE = 0
var MANUAL_DIALOGUE_NUM = 0

function manualDialogue(lines) { // WIP
    ctx.fillStyle = "rgba(255, 255, 255, 0.60)"
    ctx.roundRect(width / 4, height * 3 / 4 - 10, width / 2, height / 4, 10)
    ctx.fill()
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.font = "15px serif"
    ctx.textBaseline = 'middle'
    ctx.font = "20px serif"
    ctx.textAlign = 'center'
    fillTextMultiLine(lines[MANUAL_DIALOGUE_NUM], width / 2, (height * 3 / 4) + 60)
    if (this.nextIndicator == true) {
        triangle(width / 2 - 10, height - 60 + this.nextIndicatorY, width/2 + 10, height - 60 + this.nextIndicatorY, width/2, height - 40 + this.nextIndicatorY, "rgb(0, 0, 0)")	
    }
}

manualDialogue.start = function(lines) {
    MANUAL_DIALOGUE = lines
}

manualDialogue.stop = function() {
    MANUAL_DIALOGUE = 0
}

function ellipse(x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, w / 2, 0, 2 * Math.PI, true);
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.fillStyle = "rgb(255, 255, 255)";
}

function triangle(x1, y1, x2, y2, x3, y3, color) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
    ctx.fillStyle = color
    ctx.fill()
	
}

function Rotate(x, y, rad) {
    ctx.translate(x, y)
    ctx.rotate(rad)
    ctx.translate(-x, -y)
}

function b(n) {
    return n * 75
}

function ctr(n) {
    return n * 75 + 37.5
}

function perSec(n) {
    return n * 1 / FPS
}

var eventDelays = []

function eventsDelay(f1, f2, delay) { // Must occur in animation loop
    eventDelays.push({f1: f1, f2: f2, delay: delay, timer: delay})
}

let commandsRun = []

if (!!save) {
    commandsRun = save.commandsRun
}

function runOnce(command) {
    if (commandsRun.indexOf(command.toString()) == -1) {
        command()
        commandsRun.push(command.toString())
    }
}

function entityDistance(entity1, entity2) {
    if (!!entity1.x && !!entity1.y && !!entity2.x && !!entity2.y) {
        return Math.hypot((entity1.x - entity2.x), (entity1.y - entity2.y))
    }
}

function poo() {
    console.log('g')
}

function setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = window.setInterval(function () {

             callback();

             if (++x === repetitions) {
                     window.clearInterval(intervalID);
             }
        }, delay);
} // https://stackoverflow.com/questions/2956966/javascript-telling-setinterval-to-only-fire-x-amount-of-times

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + Math.abs(r), y);
    this.arcTo(x + w, y, x + w, y + h, Math.abs(r));
    this.arcTo(x + w, y + h, x, y + h, Math.abs(r));
    this.arcTo(x, y + h, x, y, Math.abs(r));
    this.arcTo(x, y, x + w, y, Math.abs(r));
    this.closePath();
    return this;
}

var wrapper = function(f, args) { // https://stackoverflow.com/questions/5054926/javascript-create-instance-with-array-of-arguments
    return function() {
        f.apply(this, args);
    };
};

function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 68:
            keys.d = true
            break
        case 83:
            keys.s = true
            break
        case 65:
            keys.a = true
            break
        case 87:
            keys.w = true
            break
        case 32:
            keys.space = true
            break
        case 16:
            keys.shift = true
            break
        case 69:
            keys.e = true
            break
		case 81:
			keys.q = true
			break
        case 191:
            keys.slash = true
            break
        case 66:
            keys.b = true
            break
        case 27:
            keys.esc = true
            break
		case 78:
			keys.n = true
			break
		case 88:
			keys.x = true
			break
        case 189:
            keys.minus = true
            break
        case 187:
            keys.plus = false
            break
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 68:
            keys.d = false
        	break
        case 83:
            keys.s = false
        	break
        case 65: 
            keys.a = false
            break
        	case 87:
            keys.w = false
        	break
        case 32:
            keys.space = false
            break
        case 16:
            keys.shift = false
            break
        case 69:
            keys.e = false
            break
        case 81:
			keys.q = false
			break
        case 191:
            keys.slash = false
            break
        case 66:
            keys.b = false
            break
        case 27:
            keys.esc = false
            break
		case 78:
			keys.n = false
			break
		case 88:
			keys.x = false
			break
        case 189:
            keys.minus = false
            break
        case 187:
            keys.plus = false
            break
    }
}


window.addEventListener("keydown", onKeyDown, false);

window.addEventListener("keyup", onKeyUp, false);

document.addEventListener('mousemove', (event) => {
	mouseX = event.clientX * (width / window.innerWidth)
    mouseY = event.clientY * (height / window.innerHeight)
})

window.addEventListener('mousedown', function() {
    mouseIsDown = true
    mouseClicked = true
    holding = false
    setTimeout(function() {
        if(mouseIsDown) {
            holding = true
            mouseClicked = false
            // mouse was held down for > 0.45 second
        }
    }, 250);
});

window.addEventListener('mouseup', function() {
    mouseIsDown = false
    mouseClicked = false
});


function mouseRect(x, y, w, h) {
    return (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h)
}

class Cooldown {
    constructor(time) {
        this.maxTime = time
        this.time = this.maxTime
    }

    run() {
        this.time -= perSec(1)
    }

    ended() {
        return this.time <= 0
    }

    onEnd(action) {
        if (this.ended()) {
            action()
        }

        this.reset()
    }

    reset() {
        this.time = this.maxTime
    }
}

var playing = false

var curMusic;
var curSound;

var music = [
    {
		name: "Puzzle",
        audio: new Audio('audio/puzzle2.mp3')
	},
    {
		name: "Chard",
        audio: new Audio('audio/chard.mp3')
	},
    {
		name: "Steel Field",
        audio: new Audio('audio/steelField.mp3')
	},
    {
		name: "Boss Cutscene",
        audio: new Audio('audio/boss_cutscene.mp3')
	},
	{
		name: "Noctos Battle",
        audio: new Audio('audio/noctos_battle.mp3')
	},
    {
		name: "Noctos Battle Phase 2",
        audio: new Audio('audio/noctos_battle_phase_2.mp3')
	},
    {
		name: "Sacred Star Cutscene",
        audio: new Audio('audio/sacredStarCutscene.mp3')
	},
    {
		name: "Glacia Village",
        audio: new Audio('audio/glaciaVillage.mp3')
	},
    {
		name: "Adventure",
        audio: new Audio('audio/adventure.mp3')
	},
    {
        name: "Lonzo House",
        audio: new Audio('audio/lonzoHouse.mp3')
    },
	{
		name: "Queen's Castle",
        audio: new Audio('audio/queens_castle.mp3')
	},
	{
		name: "Windy Wastelands",
        audio: new Audio('audio/windy_wastelands.mp3')
	},
    {
		name: "Gale Cave Dark",
        audio: new Audio('audio/gale_cave_dark.mp3')
	},
	{
		name: "Gale Cave Light",
        audio: new Audio('audio/gale_cave.mp3')
	},
    {
        name: "Howler Hollow",
        audio: new Audio('audio/howlerHollow.mp3')
    },
    {
        name: "Encompassed Forest",
        audio: new Audio('audio/encompassedForest.mp3')
    },
    {
        name: "Encompassed Forest Dark",
        audio: new Audio('audio/encompassedForestDark.mp3')
    },
    {
        name: "Dropton Drylands",
        audio: new Audio('audio/droptonDrylands.mp3')
    },
    {
        name: "Dropton City",
        audio: new Audio('audio/droptonCity.mp3')
    },
    {
		name: "Cryo Underground",
        audio: new Audio('audio/cryo_underground.mp3')
	},
    {
        name: "Litholia",
        audio: new Audio('audio/litholia.mp3')
    },
    {
        name: "Stoneheart Sanctuary",
        audio: new Audio('audio/stoneheartSanctuary.mp3')
    },
    {
		name: "New Location",
        audio: new Audio('audio/new_location.mp3')
	},
]

var sounds = [
	{
		name: "Splash",
        audio: new Audio('audio/splash.mp3')
	},
    {
		name: "Grass Walking",
        audio: new Audio('audio/grass-walking.mp3')
	},
    {
        name: "Trail Walking",
        audio: new Audio('audio/trail-walking.mp3')
    },
	{
		name: "Sand Walking",
		audio: new Audio('audio/sand-walking.mp3')
	},
	{
		name: "Speedy Snow Walking",
		audio: new Audio('audio/speedysnow-walking.mp3')
	},
    {
        name: "Sword",
        audio: new Audio("audio/sword.mp3")
    },
	{
		name: "Spear",
		audio: new Audio('audio/spear.mp3')
	},
    {
        name: "New Mission",
        audio: new Audio('audio/newMission.mp3')
    },
    {
        name: "Mission Complete",
        audio: new Audio('audio/missionComplete.mp3')
    },
    {
        name: "Alarm",
        audio: new Audio('audio/alarm.mp3')
    },
    {
        name: "Ice Cracks",
        audio: new Audio('audio/ice-cracks.mp3')
    },
    {
        name: "Purchase",
        audio: new Audio('audio/purchase.mp3')
    },
    {
        name: "Toggle",
        audio: new Audio('audio/toggle.mp3')
    }
]


var musicFading = false

function playMusic(name) {
    for (var i in music) {
        var msc = music[i]
        if (msc.name == name) {
            msc.audio.play()
            msc.audio.volume = 0.2
            msc.audio.isPlaying = true
            curMusic = msc[i]
        } else {
            msc.audio.pause()
            msc.audio.currentTime = 0
            msc.audio.isPlaying = false
        }
    }
    
    // for (var i in music) {
    //     var M = music[i]
    //     if (M.name != name) {
    //         M.audio.pause()
    //     }
    // }

    // var m = getMusic(name)
    // if (!!m && !m.audio.playing()) {
    //     m.audio.play()
    //     console.log("Playing started")
    //     //alert(m.audio.volume(0.3))
    //     curMusic = m
    // }
    
}

function getMusic(name) {
    for (var i in music) {
        if (music[i].name == name) {
            return music[i]
        }
    }
    return
}

function playSound(name, loop) {
    for (var i in sounds) {
        var sound = sounds[i]
        if (sound.name == name) {
            sound.audio.play()
            sound.audio.volume = 0.2
            sound.audio.loop = loop
            curSound = sound
        }
    }
}

function stopSound(name) {
    for (var i in sounds) {
        var sound = sounds[i]
        if (sound.name == name) {
            sound.audio.currentTime = 0 // Resets audio
            sound.audio.pause()
        }
    }
}