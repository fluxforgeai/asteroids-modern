import { Particle } from './Particle.js';
import { Vector2, randomRange, ObjectPool } from '../utils.js';
import { CONFIG } from '../config.js';

export class ParticleSystem {
    constructor() {
        this.particlePool = new ObjectPool(
            () => new Particle(0, 0, new Vector2(), '#fff', 1, 1),
            (particle) => particle.alive = false,
            50
        );
        this.activeParticles = [];
    }
    
    update(deltaTime) {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            particle.update(deltaTime);
            
            if (!particle.alive) {
                this.activeParticles.splice(i, 1);
                this.particlePool.release(particle);
            }
        }
    }
    
    render(ctx) {
        this.activeParticles.forEach(particle => particle.render(ctx));
    }
    
    createExplosion(x, y, type = 'ship') {
        let config;
        let color = CONFIG.COLORS.PARTICLE;
        
        switch (type) {
            case 'asteroid_large':
                config = { count: 20, speed: 150, lifetime: 0.8, size: 4 };
                break;
            case 'asteroid_medium':
                config = { count: 15, speed: 120, lifetime: 0.6, size: 3 };
                break;
            case 'asteroid_small':
                config = { count: 10, speed: 100, lifetime: 0.4, size: 2 };
                break;
            case 'ufo':
                config = { count: 25, speed: 200, lifetime: 1, size: 4 };
                color = CONFIG.COLORS.UFO;
                break;
            case 'ship':
            default:
                config = CONFIG.PARTICLES.EXPLOSION;
                color = CONFIG.COLORS.SHIP;
                break;
        }
        
        for (let i = 0; i < config.count; i++) {
            const angle = randomRange(0, Math.PI * 2);
            const speed = randomRange(config.speed * 0.5, config.speed);
            const velocity = Vector2.fromAngle(angle, speed);
            const size = randomRange(config.size * 0.5, config.size);
            
            const particle = this.particlePool.get();
            particle.reset(x, y, velocity, color, size, config.lifetime);
            this.activeParticles.push(particle);
        }
    }
    
    createThrust(x, y, angle) {
        const config = CONFIG.PARTICLES.THRUST;
        
        for (let i = 0; i < config.count; i++) {
            const spreadAngle = angle + Math.PI + randomRange(-0.3, 0.3);
            const speed = randomRange(config.speed * 0.5, config.speed);
            const velocity = Vector2.fromAngle(spreadAngle, speed);
            
            const particle = this.particlePool.get();
            particle.reset(
                x + randomRange(-5, 5),
                y + randomRange(-5, 5),
                velocity,
                CONFIG.COLORS.THRUST,
                config.size,
                config.lifetime
            );
            this.activeParticles.push(particle);
        }
    }
    
    createPowerUpCollect(x, y, color) {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = randomRange(50, 150);
            const velocity = Vector2.fromAngle(angle, speed);
            
            const particle = this.particlePool.get();
            particle.reset(x, y, velocity, color, 3, 0.8);
            this.activeParticles.push(particle);
        }
    }
    
    clear() {
        this.activeParticles = [];
        this.particlePool.releaseAll();
    }
}