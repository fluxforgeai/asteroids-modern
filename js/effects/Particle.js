import { Vector2 } from '../utils.js';

export class Particle {
    constructor(x, y, velocity, color, size, lifetime) {
        this.position = new Vector2(x, y);
        this.velocity = velocity;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.alive = true;
    }
    
    update(deltaTime) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        this.lifetime -= deltaTime;
        
        if (this.lifetime <= 0) {
            this.alive = false;
        }
    }
    
    render(ctx) {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        
        const currentSize = this.size * alpha;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
    
    reset(x, y, velocity, color, size, lifetime) {
        this.position.x = x;
        this.position.y = y;
        this.velocity = velocity;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.alive = true;
    }
}