import { Vector2, wrapPosition } from '../utils.js';

export class Entity {
    constructor(x, y, radius) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2();
        this.radius = radius;
        this.rotation = 0;
        this.alive = true;
    }
    
    update(deltaTime, bounds) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
        this.position = wrapPosition(this.position, bounds);
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        this.draw(ctx);
        ctx.restore();
    }
    
    draw(ctx) {
        // Override in subclasses
    }
    
    getBounds() {
        return {
            x: this.position.x - this.radius,
            y: this.position.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
    
    destroy() {
        this.alive = false;
    }
}