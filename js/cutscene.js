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
        ctx.translate(width / 2, height / 2)
        ctx.scale(this.scale, this.scale);
        ctx.translate(- width / 2, - height / 2)
        ctx.translate(- this.location.x + width / 2, - this.location.y + height / 2)
        this.map.draw(p, "Cutscene View", this.location.x * this.scale - width / 2, this.location.y * this.scale - height / 2, this.scale)
        for (var i in bosses) {
            if (curMap.name == bosses[i].map) {
                curBoss = bosses[i]
                if (curBoss.health > 0) {
                    curBoss.update()
                }
            }
        }

        ctx.scale(1 / this.scale, 1 / this.scale);

        ctx.restore()
        ctx.fillStyle = `rgba(0, 0, 0, ${this.fade})`;
        ctx.fillRect(0, 0, width, height);

        this.curFrame ++

        if (!!this.always) {
            this.always(this)
        }

        if (!!this.onEnd && this.curFrame >= this.length) {
            this.onEnd(this)
            curCutscene = null;
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

const lithosCutscenePhase2 = new Cutscene({
    name: "Lithos Cutscene Phase 2",
    map: lithosRoom,
    x: lithos.x, y: lithos.y, scale: 1,
    length: 310,
    nodes: [
        {start: 0, display: (cutscene) => {
            lithos.manual = true;
            lithos.curAngle = Math.PI / 2;
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
})