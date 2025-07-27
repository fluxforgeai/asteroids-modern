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
        
        // Draw SpaceX Starship-inspired design
        ctx.beginPath();
        
        // Main body (cylindrical section)
        const bodyWidth = this.radius * 0.4;
        const bodyHeight = this.radius * 1.6;
        
        // Nose cone (pointed top)
        ctx.moveTo(this.radius, 0); // Tip
        ctx.lineTo(this.radius * 0.6, -bodyWidth);
        ctx.lineTo(-bodyHeight * 0.3, -bodyWidth);
        
        // Main cylindrical body
        ctx.lineTo(-bodyHeight, -bodyWidth);
        ctx.lineTo(-bodyHeight, bodyWidth);
        
        // Bottom section
        ctx.lineTo(-bodyHeight * 0.3, bodyWidth);
        ctx.lineTo(this.radius * 0.6, bodyWidth);
        ctx.closePath();
        ctx.stroke();
        
        // Draw fins/landing legs
        ctx.beginPath();
        // Left fin
        ctx.moveTo(-bodyHeight * 0.8, -bodyWidth);
        ctx.lineTo(-bodyHeight * 1.1, -bodyWidth * 1.5);
        ctx.lineTo(-bodyHeight * 0.9, -bodyWidth * 1.3);
        
        // Right fin
        ctx.moveTo(-bodyHeight * 0.8, bodyWidth);
        ctx.lineTo(-bodyHeight * 1.1, bodyWidth * 1.5);
        ctx.lineTo(-bodyHeight * 0.9, bodyWidth * 1.3);
        ctx.stroke();
        
        // Add some detail lines (panels and segments)
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        // Vertical panel lines
        ctx.moveTo(-bodyHeight * 0.2, -bodyWidth * 0.8);
        ctx.lineTo(-bodyHeight * 0.2, bodyWidth * 0.8);
        ctx.moveTo(-bodyHeight * 0.6, -bodyWidth * 0.8);
        ctx.lineTo(-bodyHeight * 0.6, bodyWidth * 0.8);
        
        // Horizontal segment lines
        ctx.moveTo(-bodyHeight * 0.1, -bodyWidth);
        ctx.lineTo(-bodyHeight * 0.1, bodyWidth);
        ctx.moveTo(-bodyHeight * 0.4, -bodyWidth);
        ctx.lineTo(-bodyHeight * 0.4, bodyWidth);
        ctx.moveTo(-bodyHeight * 0.7, -bodyWidth);
        ctx.lineTo(-bodyHeight * 0.7, bodyWidth);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Draw raptor engines (thrust)
        if (this.thrustPower > 0) {
            ctx.strokeStyle = CONFIG.COLORS.THRUST;
            ctx.fillStyle = CONFIG.COLORS.THRUST;
            
            // Multiple engine plumes
            const enginePositions = [-bodyWidth * 0.3, 0, bodyWidth * 0.3];
            
            for (let engineY of enginePositions) {
                if (Math.random() > 0.1) { // Flickering effect
                    ctx.beginPath();
                    
                    // Engine bell
                    ctx.arc(-bodyHeight, engineY, bodyWidth * 0.15, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Flame plume
                    const flameLength = this.radius * (1 + this.thrustPower * 0.8);
                    ctx.beginPath();
                    ctx.moveTo(-bodyHeight - bodyWidth * 0.1, engineY - bodyWidth * 0.1);
                    ctx.lineTo(-bodyHeight - flameLength, engineY + (Math.random() - 0.5) * bodyWidth * 0.3);
                    ctx.lineTo(-bodyHeight - bodyWidth * 0.1, engineY + bodyWidth * 0.1);
                    ctx.closePath();
                    ctx.globalAlpha = 0.8;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        // Draw shield
        if (this.shields > 0) {
            ctx.strokeStyle = CONFIG.COLORS.POWERUP.SHIELD;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.8, 0, Math.PI * 2);
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