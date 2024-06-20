class Cutscene {
    /**
     * 
     * @param {*} config An object containing: name, map, x, y, length, nodes, onEnd, always*)
     */
    constructor(config) {
        this.name = config.name;
        this.map = config.map;
        this.location = {
            x: config.x,
            y: config.y
        };
        this.scale = config.scale ?? 1;
        this.length = config.length;
        this.nodes = config.nodes;

        this.onEnd = config.onEnd;
        this.always = config.always;

        this.curFrame = 0;
        this.curNode = 0;
        this.fade = 0;
    }

    // Starts playing the cutscene, you should use this function
    begin() {
        curCutscene = this
        scene = "CUTSCENE"
    }

    // Don't use this function manually
    draw() {
        if (!!this.getNode()) {
            this.getNode().display(this)
        }
        ctx.save()

        ctx.translate(width / 2, height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(- width / 2, - height / 2);

        ctx.translate(- this.location.x + width / 2, - this.location.y + height / 2);
        this.map.draw(p, "Cutscene View", this.location.x * this.scale, this.location.y * this.scale, this.scale);

        for (var i in bosses) {
            if (curMap.name == bosses[i].map) {
                curBoss = bosses[i];
                if (curBoss.health > 0) {
                    curBoss.update();
                }
            }
        }

        ctx.restore()
        ctx.fillStyle = `rgba(0, 0, 0, ${this.fade})`;
        ctx.fillRect(0, 0, width, height);

        this.curFrame ++

        if (!!this.always) {
            this.always(this)
        }

        if (!!this.onEnd && this.curFrame >= this.length) {
            curCutscene = null;
            this.onEnd(this);
        }
    }

    // Or this one
    getNode() {
        let nodeResult;
        this.nodes.forEach((node) => {
            if (this.curFrame >= node.start) {
                nodeResult = node;
            }
        })

        return nodeResult;
    }

    // You should use this one though
    setLocation(x, y) {
        this.location.x = x
        this.location.y = y
    }

    static set(cutscene) {
        curCutscene = cutscene;
    }
}

/* Cutscene template

var cutsceneTemplate = new Cutscene({
    name: "[name]",
    map: [map],
    x: [pixel cord x], y: [pixel cord y],
    length: [# of frames the cutscene lasts for],
    nodes: [
        {start: [frame to start animation here], display: (cutscene) => {
            // animation code
        }},
        {start: [frame to start animation here], display: (cutscene) => {
            // animation code
        }},
    ],
    onEnd: (cutscene) => {
        // code to run when cutscene ends
    },

    // Optional
    always: (cutscene) => {
        // code that always runs, regardless of what frame it is
    }
})

HERE IS AN EXAMPLE

var exampleCutscene = new Cutscene({
    name: "Example Cutscene",
    map: stoneheartSanctuary,
    x: ctr(0), y: ctr(0),
    length: 200,
    nodes: [
        {start: 0, display: (cutscene) => {
            cutscene.location.x += 10
        }},
        {start: 100, display: (cutscene) => {
            cutscene.location.x += 5
        }},
    ],
    onEnd: (cutscene) => {
        scene = "GAME";
    }
})

sorry i know it's confusing but it should be better than what we were doing before

*/

var exampleCutscene = new Cutscene({
    name: "Example Cutscene",
    map: stoneheartSanctuary,
    x: ctr(0), y: ctr(0),
    length: 200,
    nodes: [
        {start: 0, display: (cutscene) => {
            cutscene.location.x += 10
        }},
        {start: 100, display: (cutscene) => {
            cutscene.location.x += 5
        }},
    ],
    onEnd: (cutscene) => {
        scene = "GAME";
    }
})

var noctosCutscene = new Cutscene({
    name: "Noctos Cutscene",
    map: noctosRoom,
    x: bosses[0].x - width / 2, y: bosses[0].y - height / 2,
    length: 535,
    nodes: [
        {start: 0, display: (cutscene) => {
            
        }},
        {start: 360, display: (cutscene) => {
            
        }},
    ],
    always: (cutscene) => {
        playMusic("Boss Cutscene")

        models.bosses.noctos.draw()
    },
    onEnd: (cutscene) => {
        scene = "GAME";
    }
})

const lithosCutscene = new Cutscene({
    name: "Lithos Cutscene",
    map: lithosRoom,
    x: b(15), y: b(15) + 35, scale: 10,
    length: 500,
    nodes: [
        {start: 0, display: (cutscene) => {
            lithos.manual = true;
            lithos.curAngle = Math.PI / 2;
            cutscene.fade = 1;
            cutscene.bossNameFade = 0;
        }},
        {start: 60, display: (cutscene) => {
            cutscene.fade = Math.max(0.75, cutscene.fade - perSec(0.25)); // Stops at 0.75
        }},
        {start: 180, display: (cutscene) => {
            cutscene.fade = Math.max(0.5, cutscene.fade - perSec(0.25)); // Stops at 0.5
            cutscene.scale = Math.max(5, cutscene.scale - perSec(5)); // Stops at 5
        }},
        {start: 280, display: (cutscene) => {
            cutscene.fade = Math.max(0, cutscene.fade - perSec(0.25));  // Stops at 0
            cutscene.scale = Math.max(1.25, cutscene.scale - perSec(5));  // Stops at 1.25
        }},
        {start: 310, display: (cutscene) => {
            cutscene.bossNameFade += perSec(2);
        }},
        {start: 440, display: (cutscene) => {
            cutscene.fade += perSec(1);
            // cutscene.bossNameFade -= perSec(1);
            cutscene.bossNameFade = 0;
        }}
    ],
    always: (cutscene) => {
        ctx.fillStyle = `rgba(150, 0, 0, ${cutscene.bossNameFade})`;
        displayText("Lithos", width / 2, 600, 150);
        playMusic("Boss Cutscene");
    },
    onEnd: (cutscene) => {
        lithos.manual = false;
        scene = "GAME";
    }
});

const lithosCutscenePhase2 = new Cutscene({
    name: "Lithos Cutscene Phase 2",
    map: lithosRoom,
    x: lithos.x, y: lithos.y, scale: 1,
    length: 310,
    nodes: [
        {start: 0, display: (cutscene) => {
            lithos.goTo(b(15), b(15));
            lithos.scaleFactor = 1;
            lithos.armAngle = 0;
            lithos.curAngle = Math.PI / 2;

            lithos.manual = true;

            p.goTo(b(15), b(19));
            p.dir = 'U';
        }},
        {start: 60, display: (cutscene) => {
            if (lithos.curAngle < Math.PI * 6.5) {
                lithos.curAngle += perSec(Math.PI * 4);

                if (lithos.curAngle >= Math.PI * 4) {
                    lithos.phase = 2;
                }
            } else {
                lithos.curAngle = Math.PI * 6.5;
            }
        }},
        {start: 200, display: (cutscene) => {
            if (cutscene.scale < 1.5) {
                cutscene.scale += perSec(1.5);
            } else {
                cutscene.scale = 1.5;
            }
        }},
        {start: 240, display: (cutscene) => {
            cutscene.fade += perSec(1);
        }},
    ],
    always: (cutscene) => {
        playMusic("Boss Cutscene")

        // curBoss.update();
        // models.bosses.lithos.x = width / 2;
        // models.bosses.lithos.x = height / 2;
        // models.bosses.lithos.draw();

        // ellipse(300, 300, 50, 50, "rgb(0, 0, 0)");
    },
    onEnd: (cutscene) => {
        lithos.phase2Played = true;
        lithos.manual = false;
        scene = "GAME";
    }
});

const lithosCutsceneDeath = new Cutscene({
    name: "Lithos Cutscene Death",
    map: lithosRoom,
    x: lithos.x, y: lithos.y, scale: 1,
    length: 330,
    nodes: [
        {start: 0, display: (cutscene) => {
            // Set cutscene to lithos's newest location
            cutscene.location = {
                x: lithos.x,
                y: lithos.y
            }

            lithos.health = 1; // Makes him not dead so that he shows up in cutscene
            lithos.manual = true;
            lithos.curAngle = Math.PI / 2;
        }},
        {start: 30, display: (cutscene) => {
            lithos.curAngle += perSec(Math.PI * 2);
            cutscene.scale += perSec(1);
        }},
        {start: 180, display: (cutscene) => {
            lithos.curAngle += perSec(Math.PI * 6);
            lithos.scaleFactor -= perSec(2);
            cutscene.scale -= perSec(5);
        }},
        {start: 210, display: (cutscene) => {
            // Break
        }},
        {start: 270, display: (cutscene) => {
            cutscene.fade += perSec(1);
        }},
    ],
    always: (cutscene) => {
    },
    onEnd: (cutscene) => {
        curMap = mainMap;
        p.goTo(ctr(105), ctr(94));
        lithos.health = 0;
        Screen.clearEffects(); // Necessary to prevent a second fade out idk why
        scene = "GAME";

        p.giveItem(items.lithosArm);

        kingJasper.map = mainMap;
        kingJasper.goTo(ctr(105), ctr(87));
        kingJasper.lines = [
            "Oh, it's you again!",
            "Hold on, were you in that stone fortress just now?",
            "...",
            "You were?? What was in there?",
            "...",
            "Incredible! I had only heard of Lithos in stories before.",
            "I assume Lithos was responsible for all the lava rising into Litholia,\nsince it seems to have receded now.",
            "In that case, thank you!",
            "Ah yes, one last thing...\nSome strange man entered Litholia and said he was looking for you.",
            "I don't know where he is, but Litholia is small.\nI'm sure you'll be able to find him!",
            "Anyway, I've got to go soon to some sort of secret meeting.",
            "The leaders of the other regions on this island will be there.\nApparently the borders dividing us have mysteriously opened.",
            "So I guess I'll see you later!"
        ];

        kingJasper.action = function() {
            
        };
        

        console.log(kingJasper.cords)
        console.log(kingJasper.map)
        mainMap.changeBlocks([
            [97, 57],
            [103, 58],
            [107, 57],
            [107, 57],
            [109, 56],
            [109, 57],
            [110, 57],
            [109, 58],
            [112, 56],
            [113, 56],
            [114, 56],
            [115, 56],
            [113, 57],
            [114, 57],
            [115, 57],
            [113, 58],
            [116, 61],
            [117, 61],
            [115, 62],
            [116, 62],
            [117, 62],
            [116, 63],
            [121, 56],
            [120, 55],
            [121, 55],
            [122, 55],
            [120, 57],
            [121, 57],
            [122, 57],
            [119, 58],
            [120, 58],
            [121, 58],
            [119, 59],
            [120, 59],
            [123, 58],
            [119, 65],
            [118, 66],
            [119, 66],
            [117, 67],
            [118, 67],
        ], '_'); // Removes a lot of lava from Litholia (changeme add more)

        wayne.map = mainMap;
        wayne.goTo(ctr(100), ctr(58));
        wayne.dir = 'R';
        wayne.lines = [
            "At last, we meet again!",
            "It was quite a journey to find you.\nSo, I'm checking out this place while I'm here.",
            "I take it you've defeated Lithos, the master of stone. Very impressive!",
            "You've got one more elemental master to take down, then it's time to fight " + badGuy + "!",
            "You'll need to head to Luminos Isle, a city in the sky!\nI've never been, but it's supposed to be amazing!",
            "There, you'll need to meet with their head, Empress Aurora.\nShe'll give you the details.",
            "I don't know what sort of details she'll tell you, I'm just the messenger.",
            "To get to Luminos Isle, you'll need to head to Dawn's Landing, which is west of here.\nIt's also directly south of Chard Town. Kind of a full circle, huh?",
            "Ah yes! One more thing...",
            "There's a locked door on the west side of Litholia that you'll need to open.\nThe Old Man gave me a key that I'm supposed to give you now.",
            "I don't know where he gets all these keys from, but it should open that door.",
            "I recommend you begin your journey as soon as possible!\nIf all goes well, I'll see you there.",
            "Goodbye!"
        ];
        wayne.action = function() {
            addMission(journeyToLuminosIsle);

            wayne.lines = [
                "One more elemental master to go. You're so close!",
                "Remember, to get to Luminos Isle, you first need\nto get to Dawn's Landing which is west of here.",
                "Good luck!"
            ];

            wayne.clearAction();
        }
        wayne.actionLine = "after";

        mainMap.changeBlocks([[92, 75], [92, 76], [92, 77]], "_");
        alerts.push(new GameAlert(92, 75, ["SEGREME STONE FO RETSAM WEN A SA SKAERB LLAW EHT"], mainMap, "SIGN"));

        pearl.lines = [
            "Hello there!",
            "I've been guarding the border over here for a while, and suddenly\nit opened!",
            "I'm going to stay here to make sure nothing weird happens,\nso if you want to cross, do it at your own risk!"
        ];
    }
});