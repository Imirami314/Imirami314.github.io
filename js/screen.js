var Screen = {
  fade: 0
}

Screen.fadeOut = function(r, g, b, speed, nextScene) {
  if (scene == nextScene) {
    return
  }
  
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fade})`
  ctx.fillRect(0, 0, width, height)

  fade += speed
  
  if (fade >= 1) {
    fade = 0
    scene = nextScene
  }
}