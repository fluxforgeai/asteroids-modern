import { Entity } from './Entity.js';
import { Vector2 } from '../utils.js';
import { CONFIG } from '../config.js';

export class Bullet extends Entity {
    constructor(x, y, angle, isPlayerBullet = true) {
        super(x, y, CONFIG.BULLETS.SIZE);
        this.velocity = Vector2.fromAngle(angle, CONFIG.BULLETS.SPEED);
        this.lifetime = CONFIG.BULLETS.LIFETIME;
        this.isPlayerBullet = isPlayerBullet;
        this.rotation = angle;
    }
    
    update(deltaTime, bounds) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        this.lifetime -= deltaTime;
        
        if (this.lifetime <= 0) {
            this.destroy();
        }
        
        // Bullets don't wrap around screen edges
        if (this.position.x < 0 || this.position.x > bounds.width ||
            this.position.y < 0 || this.position.y > bounds.height) {
            this.destroy();
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.isPlayerBullet ? CONFIG.COLORS.BULLET : CONFIG.COLORS.UFO;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    reset(x, y, angle, isPlayerBullet = true) {
        this.position.x = x;
        this.position.y = y;
        this.velocity = Vector2.fromAngle(angle, CONFIG.BULLETS.SPEED);
        this.lifetime = CONFIG.BULLETS.LIFETIME;
        this.isPlayerBullet = isPlayerBullet;
        this.rotation = angle;
        this.alive = true;
    }
}