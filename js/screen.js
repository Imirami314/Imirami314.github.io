var Screen = {
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
    if (this.shakeTime < duration) {
        this.shakeOffset.x = intensity * Math.pow(Math.random() - 0.5, 0) // Returns either -1 or 1
        this.shakeOffset.y = intensity * Math.pow(Math.random() - 0.5, 0)
        this.shakeTime += 1 / 66.67
    } else {
        this.shakeTime = 0
        this.shakeOffset = {
            x: 0,
            y: 0
        }
        return
    }
}