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
    if (!this.checkEffectActive("FADE OUT")) {
        this.effects.push({
            type: "FADE OUT",
            speed: speed,
            action: action
        })
    } else {
        console.log("Cannot add another effect if one of the same type is active")
    }
}

Screen.fadeIn = function(speed, action) {
    if (!this.checkEffectActive("FADE IN")) {
        this.effects.push({
            type: "FADE IN",
            speed: speed,
            action: action
        })
        this.fade = 1
    } else {
        console.log("Cannot add another effect if one of the same type is active")
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
            case "FADE OUT":
                cutsceneFrame = 0
                this.fade += e.speed
                if (this.fade >= 1) {
                    this.fade = 0
                    this.stopEffect("FADE OUT")
                    e.action()
                }
                break
            case "FADE IN":
                cutsceneFrame = 0
                this.fade -= e.speed
                if (this.fade <= 0) {
                    e.action()
                    this.fade = 0
                    this.stopEffect("FADE IN")
                }
                break
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