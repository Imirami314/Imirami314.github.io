var Screen = {
    fade: 0
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