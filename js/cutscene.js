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
        this.length = config.length;
        this.nodes = config.nodes;

        this.onEnd = config.onEnd;
        this.always = config.always;

        this.curFrame = 0
        this.curNode = 0
    }

    begin() {
        curCutscene = this
        scene = "CUTSCENE"
    }

    draw() {
        if (!!this.getNode()) {
            this.getNode().display(this)
        }
        ctx.save()
        ctx.translate(- this.location.x, - this.location.y)
        this.map.draw(p, "Cutscene View", width / 2, height / 2, 0.5)
        ctx.restore()
        this.curFrame ++

        if (!!this.always) {
            this.always(this)
        }

        if (!!this.onEnd && this.curFrame >= this.length) {
            this.onEnd(this)
            curCutscene = null;
        }
    }

    getNode() {
        let nodeResult;
        this.nodes.forEach((node) => {
            if (this.curFrame >= node.start) {
                nodeResult = node;
            }
        })

        return nodeResult;
    }

    setLocation(x, y) {
        this.location.x = x
        this.location.y = y
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