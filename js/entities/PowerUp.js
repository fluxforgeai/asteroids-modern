import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y, CONFIG.POWERUPS.SIZE);
        this.type = type;
        this.pulseTime = 0;
        this.lifetime = 10; // 10 seconds before disappearing
    }
    
    update(deltaTime, bounds) {
        super.update(deltaTime, bounds);
        this.pulseTime += deltaTime;
        this.lifetime -= deltaTime;
        
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }
    
    draw(ctx) {
        const pulse = Math.sin(this.pulseTime * 4) * 0.2 + 0.8;
        ctx.globalAlpha = this.lifetime < 2 ? this.lifetime / 2 : 1;
        
        // Draw outer ring
        ctx.strokeStyle = CONFIG.COLORS.POWERUP[this.type.toUpperCase()];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw icon based on type
        ctx.fillStyle = CONFIG.COLORS.POWERUP[this.type.toUpperCase()];
        ctx.font = `${this.radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let icon = '';
        switch (this.type) {
            case 'shield': icon = 'S'; break;
            case 'rapid_fire': icon = 'R'; break;
            case 'multi_shot': icon = 'M'; break;
        }
        
        ctx.fillText(icon, 0, 0);
        ctx.globalAlpha = 1;
    }
    
    getDuration() {
        return CONFIG.POWERUPS.DURATION[this.type.toUpperCase()];
    }
}