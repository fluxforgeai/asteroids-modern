import { CONFIG } from './config.js';
import { Ship } from './entities/Ship.js';
import { Asteroid } from './entities/Asteroid.js';
import { SimpleSoundSystem } from './systems/SimpleSoundSystem.js';
import { InputHandler } from './systems/InputHandler.js';

export class GameSimple {
    constructor(canvas) {
        console.log('[GAME-SIMPLE] Constructor called with canvas:', canvas);
        
        if (!canvas) {
            throw new Error('Canvas is required for Game constructor');
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        if (!this.ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        
        console.log('[GAME-SIMPLE] Canvas context acquired');
        
        try {
            console.log('[GAME-SIMPLE] Initializing InputHandler...');
            this.inputHandler = new InputHandler();
            console.log('[GAME-SIMPLE] InputHandler initialized');
            
            console.log('[GAME-SIMPLE] Initializing SimpleSoundSystem...');
            this.soundSystem = new SimpleSoundSystem();
            console.log('[GAME-SIMPLE] SimpleSoundSystem initialized');
            
        } catch (error) {
            console.error('[GAME-SIMPLE] Error during subsystem initialization:', error);
            throw error;
        }
        
        // Game state
        this.state = 'menu';
        this.score = 0;
        this.lives = CONFIG.GAME.STARTING_LIVES;
        this.level = 1;
        this.highScore = 0;
        
        // Game objects
        this.ship = null;
        this.asteroids = [];
        this.bullets = [];
        
        this.setupCanvas();
        this.updateUI();
        
        console.log('[GAME-SIMPLE] Constructor completed successfully');
    }
    
    setupCanvas() {
        this.canvas.width = CONFIG.CANVAS.WIDTH;
        this.canvas.height = CONFIG.CANVAS.HEIGHT;
        console.log('[GAME-SIMPLE] Canvas setup:', this.canvas.width, 'x', this.canvas.height);
    }
    
    start() {
        console.log('[GAME-SIMPLE] start() method called');
        
        try {
            this.state = 'playing';
            this.score = 0;
            this.lives = CONFIG.GAME.STARTING_LIVES;
            this.level = 1;
            
            console.log('[GAME-SIMPLE] Game state reset to:', this.state);
            
            // Create ship
            console.log('[GAME-SIMPLE] Creating ship...');
            this.ship = new Ship(this.canvas.width / 2, this.canvas.height / 2);
            console.log('[GAME-SIMPLE] Ship created at:', this.ship.position);
            
            // Clear arrays
            this.asteroids = [];
            this.bullets = [];
            
            // Create a simple asteroid for testing
            console.log('[GAME-SIMPLE] Creating test asteroid...');
            this.asteroids.push(new Asteroid(100, 100, 'large'));
            console.log('[GAME-SIMPLE] Created', this.asteroids.length, 'asteroids');
            
            // Hide menu
            const gameMenu = document.getElementById('gameMenu');
            if (gameMenu) {
                gameMenu.style.display = 'none';
                console.log('[GAME-SIMPLE] Game menu hidden');
            }
            
            this.updateUI();
            console.log('[GAME-SIMPLE] Game started successfully');
            
        } catch (error) {
            console.error('[GAME-SIMPLE] Error in start() method:', error);
            throw error;
        }
    }
    
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // Update ship
        if (this.ship) {
            this.ship.update(deltaTime, this.canvas);
        }
        
        // Update asteroids
        this.asteroids.forEach(asteroid => {
            asteroid.update(deltaTime, this.canvas);
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render game objects
        if (this.ship) {
            this.ship.render(this.ctx);
        }
        
        this.asteroids.forEach(asteroid => asteroid.render(this.ctx));
        
        // Draw simple status
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px monospace';
        this.ctx.fillText(`State: ${this.state}`, 10, 30);
        this.ctx.fillText(`Objects: Ship + ${this.asteroids.length} asteroids`, 10, 50);
    }
    
    updateUI() {
        const scoreEl = document.getElementById('score');
        const livesEl = document.getElementById('lives');
        const levelEl = document.getElementById('level');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (livesEl) livesEl.textContent = this.lives;
        if (levelEl) levelEl.textContent = this.level;
    }
}