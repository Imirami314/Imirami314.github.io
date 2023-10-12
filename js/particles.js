function Particle(x, y, vx, vy, size, r, g, b) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.size = size
    this.r = r
    this.g = g
    this.b = b
    this.a = 0.2
}

Particle.prototype.draw = function() {
    ellipse(this.x, this.y, this.size, this.size, "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")")
}

Particle.prototype.update = function() {
    this.x += Math.random() * this.vx
    this.y += Math.random() * this.vy

    this.a -= Math.random() * 0.025
    
    if (this.x > width || this.x < 0) {
        this.vx *= -1
    }

    if (this.y > height || this.y < 0) {
        this.vy *= -1
    }
}

function ParticleSystem(x, y, num, size, r, g, b) {
    this.particles = []
    this.x = x
    this.y = y
    this.num = num
    this.size = size
    this.r = r
    this.g = g
    this.b = b
}

ParticleSystem.prototype.create = function() {
    for (var i = 0; i < this.num; i ++) {
        this.particles.push(new Particle(this.x, this.y, Math.random() * 4 - 2, Math.random() * 4 - 2, this.size, this.r, this.g, this.b))
    }
}

ParticleSystem.prototype.draw = function() {
    for (var i = 0; i < this.particles.length; i ++) {
        var pcl = this.particles[i]
        pcl.draw()
        pcl.update()
        if (pcl.a <= 0) {
            this.particles.splice(i, 1)
        }
    }
}