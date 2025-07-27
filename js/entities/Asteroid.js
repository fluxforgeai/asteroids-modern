import { Entity } from './Entity.js';
import { Vector2, randomRange } from '../utils.js';
import { CONFIG } from '../config.js';

export class Asteroid extends Entity {
    constructor(x, y, size = 'large') {
        const radius = CONFIG.ASTEROIDS.SIZE[size.toUpperCase()];
        super(x, y, radius);
        
        this.size = size;
        this.vertices = [];
        this.offsets = [];
        this.rotationSpeed = randomRange(-CONFIG.ASTEROIDS.SPIN_SPEED, CONFIG.ASTEROIDS.SPIN_SPEED);
        
        // Generate random shape
        const vertexCount = Math.floor(randomRange(CONFIG.ASTEROIDS.VERTICES.MIN, CONFIG.ASTEROIDS.VERTICES.MAX));
        for (let i = 0; i < vertexCount; i++) {
            const angle = (i / vertexCount) * Math.PI * 2;
            const offset = randomRange(1 - CONFIG.ASTEROIDS.JAGGEDNESS, 1);
            this.vertices.push(angle);
            this.offsets.push(offset);
        }
        
        // Set random velocity
        const speed = randomRange(CONFIG.ASTEROIDS.SPEED.MIN, CONFIG.ASTEROIDS.SPEED.MAX);
        const angle = randomRange(0, Math.PI * 2);
        this.velocity = Vector2.fromAngle(angle, speed);
    }
    
    update(deltaTime, bounds) {
        super.update(deltaTime, bounds);
        this.rotation += this.rotationSpeed;
    }
    
    draw(ctx) {
        ctx.strokeStyle = CONFIG.COLORS.ASTEROID;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < this.vertices.length; i++) {
            const angle = this.vertices[i];
            const offset = this.offsets[i];
            const x = Math.cos(angle) * this.radius * offset;
            const y = Math.sin(angle) * this.radius * offset;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    split() {
        if (this.size === 'small') return [];
        
        const newSize = this.size === 'large' ? 'medium' : 'small';
        const asteroids = [];
        
        // Create 2-3 smaller asteroids
        const count = Math.random() > 0.5 ? 2 : 3;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + randomRange(-0.5, 0.5);
            const speed = randomRange(
                CONFIG.ASTEROIDS.SPEED.MIN * 1.5,
                CONFIG.ASTEROIDS.SPEED.MAX * 1.5
            );
            
            const asteroid = new Asteroid(this.position.x, this.position.y, newSize);
            asteroid.velocity = Vector2.fromAngle(angle, speed);
            asteroids.push(asteroid);
        }
        
        return asteroids;
    }
    
    getPoints() {
        return CONFIG.ASTEROIDS.POINTS[this.size.toUpperCase()];
    }
}