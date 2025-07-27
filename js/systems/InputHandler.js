export class InputHandler {
    constructor() {
        this.keys = new Map();
        this.touches = new Map();
        this.mousePosition = { x: 0, y: 0 };
        
        this.setupKeyboardListeners();
        this.setupTouchListeners();
        this.setupMouseListeners();
    }
    
    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys.set(e.code, true);
            e.preventDefault();
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            e.preventDefault();
        });
    }
    
    setupTouchListeners() {
        // Mobile controls
        const controls = {
            leftBtn: 'ArrowLeft',
            rightBtn: 'ArrowRight',
            thrustBtn: 'ArrowUp',
            fireBtn: 'Space',
            hyperBtn: 'KeyH'
        };
        
        Object.entries(controls).forEach(([buttonId, key]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.keys.set(key, true);
                });
                
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.keys.set(key, false);
                });
                
                // Also handle mouse events for testing
                button.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.keys.set(key, true);
                });
                
                button.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.keys.set(key, false);
                });
            }
        });
        
        // Touch controls on canvas
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                if (this.touches.has(touch.identifier)) {
                    this.touches.set(touch.identifier, {
                        x: touch.clientX,
                        y: touch.clientY
                    });
                }
            }
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
    }
    
    setupMouseListeners() {
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });
    }
    
    isKeyPressed(key) {
        return this.keys.get(key) || false;
    }
    
    isKeyJustPressed(key) {
        const pressed = this.keys.get(key);
        if (pressed) {
            this.keys.set(key, false);
            return true;
        }
        return false;
    }
    
    getMovement() {
        return {
            left: this.isKeyPressed('ArrowLeft'),
            right: this.isKeyPressed('ArrowRight'),
            up: this.isKeyPressed('ArrowUp'),
            fire: this.isKeyPressed('Space'),
            hyperspace: this.isKeyJustPressed('KeyH'),
            pause: this.isKeyJustPressed('KeyP')
        };
    }
    
    getTouchCount() {
        return this.touches.size;
    }
    
    getTouches() {
        return Array.from(this.touches.values());
    }
    
    getMousePosition() {
        return this.mousePosition;
    }
    
    clear() {
        this.keys.clear();
        this.touches.clear();
    }
}