import { Entity } from './Entity.js';
import { Vector2, randomRange } from '../utils.js';
import { CONFIG } from '../config.js';

export class UFO extends Entity {
    constructor(x, y, size = 'large') {
        const radius = size === 'large' ? CONFIG.UFO.SIZE : CONFIG.UFO.SIZE * 0.5;
        super(x, y, radius);
        
        this.size = size;
        this.fireTimer = 0;
        this.directionChangeTimer = 0;
        this.accuracy = CONFIG.UFO.ACCURACY[size.toUpperCase()];
        
        // Set initial velocity
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.velocity = new Vector2(CONFIG.UFO.SPEED * direction, 0);
    }
    
    update(deltaTime, bounds, playerPosition) {
        // Move horizontally across screen
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        
        // Change vertical direction occasionally
        this.directionChangeTimer += deltaTime;
        if (this.directionChangeTimer > randomRange(1, 3)) {
            this.directionChangeTimer = 0;
            this.velocity.y = randomRange(-50, 50);
        }
        
        // Wrap vertically, destroy when off screen horizontally
        if (this.position.y < 0) this.position.y = bounds.height;
        if (this.position.y > bounds.height) this.position.y = 0;
        
        if (this.position.x < -this.radius || this.position.x > bounds.width + this.radius) {
            this.destroy();
        }
        
        // Update fire timer
        this.fireTimer += deltaTime;
    }
    
    draw(ctx) {
        ctx.strokeStyle = CONFIG.COLORS.UFO;
        ctx.lineWidth = 2;
        
        // Draw UFO body
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw dome
        ctx.beginPath();
        ctx.arc(0, -this.radius * 0.2, this.radius * 0.6, Math.PI, 0);
        ctx.stroke();
        
        // Draw details
        if (this.size === 'large') {
            ctx.beginPath();
            ctx.moveTo(-this.radius * 0.3, 0);
            ctx.lineTo(-this.radius * 0.3, this.radius * 0.2);
            ctx.moveTo(this.radius * 0.3, 0);
            ctx.lineTo(this.radius * 0.3, this.radius * 0.2);
            ctx.stroke();
        }
    }
    
    canFire() {
        if (this.fireTimer >= CONFIG.UFO.FIRE_RATE) {
            this.fireTimer = 0;
            return true;
        }
        return false;
    }
    
    getAimAngle(targetPosition) {
        const direction = targetPosition.subtract(this.position);
        let angle = direction.angle();
        
        // Add inaccuracy for large UFOs
        if (this.size === 'large') {
            angle += randomRange(-Math.PI * (1 - this.accuracy), Math.PI * (1 - this.accuracy));
        }
        
        return angle;
    }
    
    getPoints() {
        return CONFIG.UFO.POINTS[this.size.toUpperCase()];
    }
}