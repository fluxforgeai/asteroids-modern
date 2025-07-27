export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    
    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }
    
    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    divide(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2();
        return this.divide(mag);
    }
    
    distance(vector) {
        return this.subtract(vector).magnitude();
    }
    
    angle() {
        return Math.atan2(this.y, this.x);
    }
    
    static fromAngle(angle, magnitude = 1) {
        return new Vector2(
            Math.cos(angle) * magnitude,
            Math.sin(angle) * magnitude
        );
    }
}

export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

export function wrapPosition(position, bounds) {
    const wrapped = new Vector2(position.x, position.y);
    
    if (wrapped.x < 0) wrapped.x = bounds.width;
    if (wrapped.x > bounds.width) wrapped.x = 0;
    if (wrapped.y < 0) wrapped.y = bounds.height;
    if (wrapped.y > bounds.height) wrapped.y = 0;
    
    return wrapped;
}

export function circleCollision(pos1, radius1, pos2, radius2) {
    return pos1.distance(pos2) < radius1 + radius2;
}

export function lerp(start, end, t) {
    return start + (end - start) * t;
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
        
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        this.active.push(obj);
        return obj;
    }
    
    release(obj) {
        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }
    
    releaseAll() {
        while (this.active.length > 0) {
            this.release(this.active[0]);
        }
    }
}

export class QuadTree {
    constructor(bounds, maxObjects = 10, maxLevels = 5, level = 0) {
        this.bounds = bounds;
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
        this.objects = [];
        this.nodes = [];
    }
    
    clear() {
        this.objects = [];
        this.nodes.forEach(node => node.clear());
        this.nodes = [];
    }
    
    split() {
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;
        
        this.nodes[0] = new QuadTree({
            x: x + subWidth,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, this.level + 1);
        
        this.nodes[1] = new QuadTree({
            x: x,
            y: y,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, this.level + 1);
        
        this.nodes[2] = new QuadTree({
            x: x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, this.level + 1);
        
        this.nodes[3] = new QuadTree({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.maxObjects, this.maxLevels, this.level + 1);
    }
    
    getIndex(rect) {
        const indexes = [];
        const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
        
        const topQuadrant = rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint;
        const bottomQuadrant = rect.y > horizontalMidpoint;
        
        if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
            if (topQuadrant) indexes.push(1);
            else if (bottomQuadrant) indexes.push(2);
        }
        
        if (rect.x > verticalMidpoint) {
            if (topQuadrant) indexes.push(0);
            else if (bottomQuadrant) indexes.push(3);
        }
        
        return indexes;
    }
    
    insert(rect) {
        if (this.nodes.length > 0) {
            const indexes = this.getIndex(rect);
            indexes.forEach(index => this.nodes[index].insert(rect));
            return;
        }
        
        this.objects.push(rect);
        
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (this.nodes.length === 0) {
                this.split();
            }
            
            let i = 0;
            while (i < this.objects.length) {
                const indexes = this.getIndex(this.objects[i]);
                if (indexes.length > 0) {
                    const removed = this.objects.splice(i, 1)[0];
                    indexes.forEach(index => this.nodes[index].insert(removed));
                } else {
                    i++;
                }
            }
        }
    }
    
    retrieve(rect) {
        const returnObjects = [];
        
        if (this.nodes.length > 0) {
            const indexes = this.getIndex(rect);
            indexes.forEach(index => {
                returnObjects.push(...this.nodes[index].retrieve(rect));
            });
        }
        
        returnObjects.push(...this.objects);
        
        return returnObjects;
    }
}