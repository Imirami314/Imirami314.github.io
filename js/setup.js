const canvas = document.querySelector('.myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const width = 1440;
const height = 675;
const ctx = canvas.getContext('2d');
ctx.scale(window.innerWidth / 1440, window.innerHeight / 675)

var save;

var elapsed = 0
// alert(typeof localStorage.getItem('save'))

// localStorage.setItem('save', null) // DEFAULT GONE
if (!!localStorage.getItem('save')) {
  save = JSON.parse(localStorage.getItem('save'))
}
// alert(save.player.x)  

var keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  e: false,
	q: false,
  b: false,
  space: false,
  shift: false,
  slash: false,
  esc: false
}

var mouseIsDown = false
var holding = false
var mouseX
var mouseY

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
      // mouse was held down for > 1 second
    }
  }, 1000);
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
    audio: new Howl({
      src: [
      'audio/puzzle2.mp3'
      ],
      loop: true,
    })
  },
  {
    name: "Chard",
    audio: new Howl({
      src: [
      'audio/chard.mp3'
      ],
      loop: true,
    })
  },
  {
    name: "Steel Field",
    audio: new Howl({
      src: [
      'audio/steelField.mp3'
      ],
      loop: true,
    })
  },
  {
    name: "Boss Cutscene",
    audio: new Howl({
      src: [
      'audio/boss_cutscene.mp3'
      ],
      loop: false,
    })
  },
	{
		name: "Darkened Battle",
		audio: new Howl({
      src: [
      'audio/darkened_battle.mp3'
      ],
      loop: true,
    })
	},
  {
    name: "Darkened Battle Phase 2",
    audio: new Howl({
      src: [
      'audio/darkened_battle_phase_2.mp3'
      ],
      loop: true,
    })
  },
  {
    name: "Sacred Star Cutscene",
    audio: new Howl({
      src: [
      'audio/sacred_star_cutscene.mp3'
      ],
      loop: true,
    })
  },
  {
    name: "Glacia Village",
    audio: new Howl({
      src: [
      'audio/glaciaVillage.mp3'
      ],
      loop: true,
    })
  },
  {
    name: "Adventure",
    audio: new Howl({
      src: [
      'audio/adventure.mp3'
      ]
    })
  },
  {
    name: "Dramatic Music",
    audio: new Howl({
      src: [
      'audio/dramatic_music.mp3'
      ]
    })
  },
	{
    name: "Queen's Castle",
    audio: new Howl({
      src: [
      'audio/queens_castle.mp3'
      ]
    })
  },
  {
    name: "Gale Cave Dark",
    audio: new Howl({
      src: [
      'audio/gale_cave_dark.mp3'
      ]
    })
  },
	{
    name: "Gale Cave Light",
    audio: new Howl({
      src: [
      'audio/gale_cave.mp3'
      ]
    })
  },
	{
    name: "Windy Wastelands",
    audio: new Howl({
      src: [
      'audio/windy_wastelands.mp3'
      ]
    })
  },
  {
    name: "New Location",
    audio: new Howl({
      src: [
        'audio/new_location.mp3'
      ],
      loop: false
    })
  }
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
]


var musicFading = false

function playMusic(name) {
  // for (var i in music) {
  //   var msc = music[i]
  //   if (msc.name == name) {
  //     msc.audio.play()
  //     msc.audio.volume = 0.2
  //     msc.audio.isPlaying = true
  //     curMusic = msc[i]
  //   } else {
  //     msc.audio.pause()
  //     msc.audio.isPlaying = false
  //   }
  // }
  
  for (var i in music) {
    var M = music[i]
    if (M.name != name) {
      M.audio.pause()
    }
  }

  var m = getMusic(name)
  if (!!m && !m.audio.playing()) {
    m.audio.play()
    //alert(m.audio.volume(0.3))
    curMusic = m
  }
  
}

function getMusic(name) {
  for (var i in music) {
    if (music[i].name == name) {
      return music[i]
    }
  }
  return
}

function playSound(name) {
  for (var i in sounds) {
    var sound = sounds[i]
    if (sound.name == name) {
      sound.audio.play()
      sound.audio.loop = true
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