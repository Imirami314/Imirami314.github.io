var Screen = {
    effects: [],
    fade: 0,
    shakeTime: 0,
    shakeOffset: {
        x: 0,
        y: 0
    }
}

Screen.fadeOut = function(speed, action) {
    ctx.fillStyle = "rgb(0, 0, 0, " + this.fade + ")"
    ctx.fillRect(0, 0, width, height)
    cutsceneFrame = 0
    this.fade += speed
    if (this.fade >= 1) {
        action()
        this.fade = 0
    }
}

Screen.shake = function(intensity, duration) {
    if (!this.checkEffectActive("SHAKE")) {
        this.effects.push({
            type: "SHAKE",
            intensity: intensity,
            duration: duration
        })
    } else {
        console.log("Cannot add another effect if one of the same type is active")
    }

    // if (this.shakeTime < duration) {
    //     this.shakeOffset.x = intensity * (Math.random() < 0.5 ? -1 : 1) // Returns either -1 or 1
    //     this.shakeOffset.y = intensity * (Math.random() < 0.5 ? -1 : 1)
    //     this.shakeTime += 1 / 66.67
    // } else {
    //     this.shakeTime = 0
    //     this.shakeOffset = {
    //         x: 0,
    //         y: 0
    //     }
    //     return
    // }
}

Screen.checkEffectActive = function(type) {
    for (var i in this.effects) {
        if (this.effects[i].type == type) {
            return true
        }
    }

    return false
}

Screen.stopEffect = function(type) {
    for (var i in this.effects) {
        if (this.effects[i].type == type) {
            this.effects.splice(i, 1)
        }
    }
}

Screen.update = function() {
    for (var i in this.effects) {
        var e = this.effects[i]
        switch (e.type) {
            case "SHAKE":
                if (this.shakeTime < e.duration) {
                    this.shakeOffset.x = e.intensity * (Math.random() < 0.5 ? -1 : 1) // Returns either -1 or 1
                    this.shakeOffset.y = e.intensity * (Math.random() < 0.5 ? -1 : 1)
                    this.shakeTime += 1 / 66.67
                } else {
                    this.stopEffect("SHAKE")
                }
                break
        }
    }
}