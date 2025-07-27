import { Entity } from './Entity.js';
import { Vector2 } from '../utils.js';
import { CONFIG } from '../config.js';

export class Ship extends Entity {
    constructor(x, y) {
        console.log('[SHIP] Creating ship at position:', x, y);
        super(x, y, CONFIG.SHIP.SIZE);
        this.thrustPower = 0;
        this.rotationSpeed = 0;
        this.canFire = true;
        this.lastFireTime = 0;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.visible = true;
        this.blinkTime = 0;
        this.shields = 0;
        this.rapidFire = false;
        this.multiShot = false;
        this.hyperspaceReady = true;
        this.lastHyperspaceTime = 0;
    }
    
    update(deltaTime, bounds) {
        super.update(deltaTime, bounds);
        
        // Apply rotation
        this.rotation += this.rotationSpeed * CONFIG.SHIP.TURN_SPEED * Math.PI / 180 * deltaTime;
        
        // Apply thrust
        if (this.thrustPower > 0) {
            const thrust = Vector2.fromAngle(this.rotation, CONFIG.SHIP.THRUST * this.thrustPower);
            this.velocity = this.velocity.add(thrust.multiply(deltaTime));
            
            // Limit max speed
            if (this.velocity.magnitude() > CONFIG.SHIP.MAX_SPEED) {
                this.velocity = this.velocity.normalize().multiply(CONFIG.SHIP.MAX_SPEED);
            }
        }
        
        // Apply friction
        this.velocity = this.velocity.multiply(Math.pow(CONFIG.SHIP.FRICTION, deltaTime));
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTime -= deltaTime * 1000;
            this.blinkTime += deltaTime;
            
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
                this.visible = true;
            } else {
                // Blink effect
                this.visible = Math.sin(this.blinkTime * 20) > 0;
            }
        }
        
        // Update fire cooldown
        const fireRate = this.rapidFire ? CONFIG.BULLETS.FIRE_RATE / 3 : CONFIG.BULLETS.FIRE_RATE;
        if (!this.canFire) {
            this.lastFireTime += deltaTime;
            if (this.lastFireTime >= fireRate) {
                this.canFire = true;
                this.lastFireTime = 0;
            }
        }
        
        // Update hyperspace cooldown
        if (!this.hyperspaceReady) {
            this.lastHyperspaceTime += deltaTime * 1000;
            if (this.lastHyperspaceTime >= CONFIG.GAME.HYPERSPACE_COOLDOWN) {
                this.hyperspaceReady = true;
                this.lastHyperspaceTime = 0;
            }
        }
    }
    
    draw(ctx) {
        if (!this.visible) return;
        
        ctx.strokeStyle = CONFIG.COLORS.SHIP;
        ctx.lineWidth = 2;
        
        // Draw ship
        ctx.beginPath();
        ctx.moveTo(this.radius, 0);
        ctx.lineTo(-this.radius, -this.radius * 0.7);
        ctx.lineTo(-this.radius * 0.5, 0);
        ctx.lineTo(-this.radius, this.radius * 0.7);
        ctx.closePath();
        ctx.stroke();
        
        // Draw thrust
        if (this.thrustPower > 0 && Math.random() > 0.1) {
            ctx.strokeStyle = CONFIG.COLORS.THRUST;
            ctx.beginPath();
            ctx.moveTo(-this.radius * 0.5, -this.radius * 0.3);
            ctx.lineTo(-this.radius * (1 + this.thrustPower * 0.5), 0);
            ctx.lineTo(-this.radius * 0.5, this.radius * 0.3);
            ctx.stroke();
        }
        
        // Draw shield
        if (this.shields > 0) {
            ctx.strokeStyle = CONFIG.COLORS.POWERUP.SHIELD;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
    
    setThrust(value) {
        this.thrustPower = Math.max(0, Math.min(1, value));
    }
    
    setRotation(value) {
        this.rotationSpeed = value;
    }
    
    fire() {
        if (this.canFire) {
            this.canFire = false;
            return true;
        }
        return false;
    }
    
    hyperspace() {
        if (this.hyperspaceReady) {
            this.hyperspaceReady = false;
            return true;
        }
        return false;
    }
    
    makeInvulnerable(duration = CONFIG.GAME.INVULNERABILITY_TIME) {
        this.invulnerable = true;
        this.invulnerabilityTime = duration;
        this.blinkTime = 0;
    }
    
    takeDamage() {
        if (this.invulnerable) return false;
        
        if (this.shields > 0) {
            this.shields--;
            return false;
        }
        
        return true;
    }
    
    reset(x, y) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2();
        this.rotation = 0;
        this.thrustPower = 0;
        this.rotationSpeed = 0;
        this.makeInvulnerable();
    }
}