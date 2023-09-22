var tabIsActive = true
var pauseGameLoop = false
var readyStateConfirmed = false

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    tabIsActive = true
  } else {
    tabIsActive = false
  }
})

function lset(key, value) {
  localStorage.setItem(key, value)
}

function lget(key) {
  return localStorage.getItem(key)
}

const canvas = document.querySelector('.myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// var curWidth = canvas.width
// var curHeight = canvas.height
const width = 1440;
const height = 675;
const ctx = canvas.getContext('2d');
ctx.scale(window.innerWidth / 1440, window.innerHeight / 675)

// var scaleInterval = setInterval(function() {
//   canvas.width = window.innerWidth;
//   console.log(curWidth + " " + canvas.width)
//   canvas.height = window.innerHeight;
//   if ((curWidth != canvas.width) || (curHeight != canvas.height)) {
//     ctx.scale(1 / (curWidth / 1440), 1 / (curHeight / 675))
//     ctx.scale(curWidth / 1440, curHeight / 675)
//     curWidth = canvas.width
//     curHeight = canvas.height
//   }
// }, 1000)
var save;

if (!!lget("player")) {
  save = {
    player: JSON.parse(lget("player")),
    npcs: JSON.parse(lget("npcs")),
    maps: JSON.parse(lget("maps")),
    npcActions: JSON.parse(lget("npcActions")),
    interactives: JSON.parse(lget("interactives")),
    lighting: lget("lighting"),
    dev: lget("dev")
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
//   save = JSON.parse(localStorage.getItem('save'))
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

var eventDelays = []

function eventsDelay(f1, f2, delay) { // Must occur in animation loop
  eventDelays.push({f1: f1, f2: f2, delay: delay, timer: delay})
}

function entityDistance(entity1, entity2) {
  if (!!entity1.x && !!entity1.y && !!entity2.x && !!entity2.y) {
    return Math.hypot((entity1.x - entity2.x), (entity1.y - entity2.y))
  }
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
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
}

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
  }
}


window.addEventListener("keydown", onKeyDown, false);

window.addEventListener("keyup", onKeyUp, false);

document.addEventListener('mousemove', (event) => {
	mouseX = event.clientX * (width / window.innerWidth)
  mouseY = event.clientY * (height / window.innerHeight)
})

window.addEventListener('mousedown', function() {
  mouseIsDown = true;
  holding = false
  setTimeout(function() {
    if(mouseIsDown) {
      holding = true
      // mouse was held down for > 0.45 second
    }
  }, 450);
});

window.addEventListener('mouseup', function() {
  mouseIsDown = false;
});

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
		name: "Darkened Battle",
    audio: new Audio('audio/darkened_battle.mp3')
	},
  {
		name: "Darkened Battle Phase 2",
    audio: new Audio('audio/darkened_battle_phase_2.mp3')
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
		name: "Cryo Underground",
    audio: new Audio('audio/cryo_underground.mp3')
	},
	{
		name: "Queen's Castle",
    audio: new Audio('audio/queens_castle.mp3')
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
		name: "Windy Wastelands",
    audio: new Audio('audio/windy_wastelands.mp3')
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
		name: "Sand Walking",
		audio: new Audio('audio/sand-walking.mp3')
	},
	{
		name: "Speedy Snow Walking",
		audio: new Audio('audio/speedysnow-walking.mp3')
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
    name: "Alarm",
    audio: new Audio('audio/alarm.mp3')
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
      msc.audio.isPlaying = false
    }
  }
  
  // for (var i in music) {
  //   var M = music[i]
  //   if (M.name != name) {
  //     M.audio.pause()
  //   }
  // }

  // var m = getMusic(name)
  // if (!!m && !m.audio.playing()) {
  //   m.audio.play()
  //   console.log("Playing started")
  //   //alert(m.audio.volume(0.3))
  //   curMusic = m
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
      sound.audio.pause()
    }
  }
}