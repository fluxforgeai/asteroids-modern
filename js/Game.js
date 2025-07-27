import { CONFIG } from './config.js';
import { Ship } from './entities/Ship.js';
import { Asteroid } from './entities/Asteroid.js';
import { Bullet } from './entities/Bullet.js';
import { UFO } from './entities/UFO.js';
import { PowerUp } from './entities/PowerUp.js';
import { ParticleSystem } from './effects/ParticleSystem.js';
import { SoundSystem } from './systems/SoundSystem.js';
import { InputHandler } from './systems/InputHandler.js';
import { Vector2, randomRange, circleCollision, ObjectPool, QuadTree } from './utils.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.inputHandler = new InputHandler();
        this.soundSystem = new SoundSystem();
        this.particleSystem = new ParticleSystem();
        
        // Game state
        this.state = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = CONFIG.GAME.STARTING_LIVES;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('asteroids_highScore') || '0');
        
        // Game objects
        this.ship = null;
        this.asteroids = [];
        this.bullets = [];
        this.ufo = null;
        this.powerUps = [];
        
        // Object pools
        this.bulletPool = new ObjectPool(
            () => new Bullet(0, 0, 0),
            (bullet) => bullet.alive = false,
            CONFIG.BULLETS.MAX_BULLETS
        );
        
        // Timers
        this.ufoTimer = 0;
        this.extraLifeScore = 10000;
        this.thrustSound = null;
        
        // Performance
        this.quadTree = null;
        
        this.setupCanvas();
        this.updateUI();
    }
    
    setupCanvas() {
        this.canvas.width = CONFIG.CANVAS.WIDTH;
        this.canvas.height = CONFIG.CANVAS.HEIGHT;
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }
    
    handleResize() {
        const container = document.getElementById('gameContainer');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const scale = Math.min(
            containerWidth / CONFIG.CANVAS.WIDTH,
            containerHeight / CONFIG.CANVAS.HEIGHT
        ) * 0.9;
        
        this.canvas.style.transform = `scale(${scale})`;
    }
    
    start() {
        this.state = 'playing';
        this.score = 0;
        this.lives = CONFIG.GAME.STARTING_LIVES;
        this.level = 1;
        
        // Create ship
        this.ship = new Ship(this.canvas.width / 2, this.canvas.height / 2);
        this.ship.makeInvulnerable();
        
        // Clear arrays
        this.asteroids = [];
        this.bullets = [];
        this.powerUps = [];
        this.ufo = null;
        
        // Create initial asteroids
        this.createAsteroidWave();
        
        // Hide menu
        document.getElementById('gameMenu').style.display = 'none';
        
        this.updateUI();
    }
    
    createAsteroidWave() {
        const asteroidCount = CONFIG.ASTEROIDS.INITIAL_COUNT + this.level - 1;
        
        for (let i = 0; i < asteroidCount; i++) {
            let x, y;
            do {
                x = randomRange(0, this.canvas.width);
                y = randomRange(0, this.canvas.height);
            } while (this.ship && 
                     new Vector2(x, y).distance(this.ship.position) < 100);
            
            this.asteroids.push(new Asteroid(x, y, 'large'));
        }
    }
    
    update(deltaTime) {
        if (this.state !== 'playing') return;
        
        // Handle input
        const input = this.inputHandler.getMovement();
        
        if (input.pause) {
            this.pause();
            return;
        }
        
        // Update ship
        if (this.ship) {
            // Rotation
            if (input.left) this.ship.setRotation(-1);
            else if (input.right) this.ship.setRotation(1);
            else this.ship.setRotation(0);
            
            // Thrust
            if (input.up) {
                this.ship.setThrust(1);
                if (!this.thrustSound) {
                    this.thrustSound = this.soundSystem.play('thrust');
                }
                // Create thrust particles
                const thrustPos = this.ship.position.add(
                    Vector2.fromAngle(this.ship.rotation + Math.PI, this.ship.radius)
                );
                this.particleSystem.createThrust(thrustPos.x, thrustPos.y, this.ship.rotation);
            } else {
                this.ship.setThrust(0);
                if (this.thrustSound) {
                    this.soundSystem.stop(this.thrustSound);
                    this.thrustSound = null;
                }
            }
            
            // Fire
            if (input.fire && this.ship.fire()) {
                this.createBullet();
                this.soundSystem.play('fire');
            }
            
            // Hyperspace
            if (input.hyperspace && this.ship.hyperspace()) {
                const newX = randomRange(50, this.canvas.width - 50);
                const newY = randomRange(50, this.canvas.height - 50);
                this.ship.position = new Vector2(newX, newY);
                this.ship.velocity = new Vector2();
            }
            
            this.ship.update(deltaTime, this.canvas);
        }
        
        // Update quadtree
        this.quadTree = new QuadTree({
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        });
        
        // Update asteroids
        this.asteroids.forEach(asteroid => {
            asteroid.update(deltaTime, this.canvas);
            this.quadTree.insert(asteroid.getBounds());
        });
        
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update(deltaTime, this.canvas);
            
            if (!bullet.alive) {
                this.bullets.splice(i, 1);
                this.bulletPool.release(bullet);
            }
        }
        
        // Update UFO
        if (this.ufo) {
            this.ufo.update(deltaTime, this.canvas, this.ship.position);
            
            if (!this.ufo.alive) {
                this.soundSystem.stop(this.ufoSound);
                this.ufo = null;
            } else if (this.ufo.canFire() && this.ship) {
                const angle = this.ufo.getAimAngle(this.ship.position);
                const bullet = this.bulletPool.get();
                bullet.reset(this.ufo.position.x, this.ufo.position.y, angle, false);
                this.bullets.push(bullet);
                this.soundSystem.play('fire');
            }
        } else {
            // Spawn UFO periodically
            this.ufoTimer += deltaTime * 1000;
            if (this.ufoTimer > CONFIG.UFO.SPAWN_TIME) {
                this.spawnUFO();
                this.ufoTimer = 0;
            }
        }
        
        // Update power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.update(deltaTime, this.canvas);
            
            if (!powerUp.alive) {
                this.powerUps.splice(i, 1);
            }
        }
        
        // Update particles
        this.particleSystem.update(deltaTime);
        
        // Check collisions
        this.checkCollisions();
        
        // Check for level complete
        if (this.asteroids.length === 0) {
            this.level++;
            this.createAsteroidWave();
        }
        
        // Check for extra life
        if (this.score >= this.extraLifeScore) {
            this.lives++;
            this.extraLifeScore += 10000;
            this.soundSystem.play('extra_life');
        }
        
        this.updateUI();
    }
    
    createBullet() {
        if (this.bullets.length >= CONFIG.BULLETS.MAX_BULLETS) return;
        
        const bullet = this.bulletPool.get();
        const bulletPos = this.ship.position.add(
            Vector2.fromAngle(this.ship.rotation, this.ship.radius)
        );
        
        if (this.ship.multiShot) {
            // Create 3 bullets
            for (let i = -1; i <= 1; i++) {
                const spreadAngle = this.ship.rotation + i * 0.1;
                const b = i === 0 ? bullet : this.bulletPool.get();
                b.reset(bulletPos.x, bulletPos.y, spreadAngle, true);
                this.bullets.push(b);
            }
        } else {
            bullet.reset(bulletPos.x, bulletPos.y, this.ship.rotation, true);
            this.bullets.push(bullet);
        }
    }
    
    spawnUFO() {
        const size = Math.random() > 0.5 ? 'large' : 'small';
        const side = Math.random() > 0.5 ? 0 : this.canvas.width;
        const y = randomRange(50, this.canvas.height - 50);
        
        this.ufo = new UFO(side, y, size);
        this.ufoSound = this.soundSystem.play(`ufo_${size}`);
    }
    
    checkCollisions() {
        // Ship-Asteroid collisions
        if (this.ship && !this.ship.invulnerable) {
            for (const asteroid of this.asteroids) {
                if (circleCollision(
                    this.ship.position,
                    this.ship.radius,
                    asteroid.position,
                    asteroid.radius
                )) {
                    if (this.ship.takeDamage()) {
                        this.destroyShip();
                        break;
                    }
                }
            }
        }
        
        // Bullet-Asteroid collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (!bullet.isPlayerBullet) continue;
            
            const possibleCollisions = this.quadTree.retrieve(bullet.getBounds());
            
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                const asteroid = this.asteroids[j];
                
                if (circleCollision(
                    bullet.position,
                    bullet.radius,
                    asteroid.position,
                    asteroid.radius
                )) {
                    // Remove bullet
                    this.bullets.splice(i, 1);
                    this.bulletPool.release(bullet);
                    
                    // Score
                    this.score += asteroid.getPoints();
                    
                    // Create explosion
                    this.particleSystem.createExplosion(
                        asteroid.position.x,
                        asteroid.position.y,
                        `asteroid_${asteroid.size}`
                    );
                    
                    // Sound
                    this.soundSystem.play(`explosion_${asteroid.size}`);
                    
                    // Split asteroid
                    const newAsteroids = asteroid.split();
                    this.asteroids.splice(j, 1);
                    this.asteroids.push(...newAsteroids);
                    
                    // Chance to spawn power-up
                    if (Math.random() < CONFIG.POWERUPS.SPAWN_CHANCE) {
                        this.spawnPowerUp(asteroid.position.x, asteroid.position.y);
                    }
                    
                    break;
                }
            }
        }
        
        // Ship-UFO collision
        if (this.ship && this.ufo && !this.ship.invulnerable) {
            if (circleCollision(
                this.ship.position,
                this.ship.radius,
                this.ufo.position,
                this.ufo.radius
            )) {
                if (this.ship.takeDamage()) {
                    this.destroyShip();
                }
                this.destroyUFO();
            }
        }
        
        // Bullet-UFO collisions
        if (this.ufo) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                if (!bullet.isPlayerBullet) continue;
                
                if (circleCollision(
                    bullet.position,
                    bullet.radius,
                    this.ufo.position,
                    this.ufo.radius
                )) {
                    this.bullets.splice(i, 1);
                    this.bulletPool.release(bullet);
                    this.destroyUFO();
                    break;
                }
            }
        }
        
        // Ship-Bullet collisions (enemy bullets)
        if (this.ship && !this.ship.invulnerable) {
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                const bullet = this.bullets[i];
                if (bullet.isPlayerBullet) continue;
                
                if (circleCollision(
                    this.ship.position,
                    this.ship.radius,
                    bullet.position,
                    bullet.radius
                )) {
                    if (this.ship.takeDamage()) {
                        this.destroyShip();
                    }
                    this.bullets.splice(i, 1);
                    this.bulletPool.release(bullet);
                    break;
                }
            }
        }
        
        // Ship-PowerUp collisions
        if (this.ship) {
            for (let i = this.powerUps.length - 1; i >= 0; i--) {
                const powerUp = this.powerUps[i];
                
                if (circleCollision(
                    this.ship.position,
                    this.ship.radius,
                    powerUp.position,
                    powerUp.radius
                )) {
                    this.collectPowerUp(powerUp);
                    this.powerUps.splice(i, 1);
                }
            }
        }
    }
    
    spawnPowerUp(x, y) {
        const types = ['shield', 'rapid_fire', 'multi_shot'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push(new PowerUp(x, y, type));
    }
    
    collectPowerUp(powerUp) {
        this.soundSystem.play('powerup');
        this.particleSystem.createPowerUpCollect(
            powerUp.position.x,
            powerUp.position.y,
            CONFIG.COLORS.POWERUP[powerUp.type.toUpperCase()]
        );
        
        switch (powerUp.type) {
            case 'shield':
                this.ship.shields = 3;
                break;
            case 'rapid_fire':
                this.ship.rapidFire = true;
                setTimeout(() => this.ship.rapidFire = false, powerUp.getDuration());
                break;
            case 'multi_shot':
                this.ship.multiShot = true;
                setTimeout(() => this.ship.multiShot = false, powerUp.getDuration());
                break;
        }
        
        this.updatePowerUpUI(powerUp.type, true);
        setTimeout(() => this.updatePowerUpUI(powerUp.type, false), powerUp.getDuration());
    }
    
    destroyShip() {
        this.particleSystem.createExplosion(
            this.ship.position.x,
            this.ship.position.y,
            'ship'
        );
        this.soundSystem.play('explosion_large');
        
        this.lives--;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.ship.reset(this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    destroyUFO() {
        this.score += this.ufo.getPoints();
        this.particleSystem.createExplosion(
            this.ufo.position.x,
            this.ufo.position.y,
            'ufo'
        );
        this.soundSystem.play('explosion_medium');
        this.soundSystem.stop(this.ufoSound);
        this.ufo = null;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render particles (behind everything)
        this.particleSystem.render(this.ctx);
        
        // Render game objects
        if (this.ship) {
            this.ship.render(this.ctx);
        }
        
        this.asteroids.forEach(asteroid => asteroid.render(this.ctx));
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
        
        if (this.ufo) {
            this.ufo.render(this.ctx);
        }
        
        // Draw pause overlay
        if (this.state === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = CONFIG.COLORS.SHIP;
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('gameMenu').style.display = 'block';
            document.getElementById('startButton').style.display = 'none';
            document.getElementById('resumeButton').style.display = 'block';
        }
    }
    
    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('gameMenu').style.display = 'none';
        }
    }
    
    gameOver() {
        this.state = 'gameOver';
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('asteroids_highScore', this.highScore.toString());
        }
        
        // Show menu
        document.getElementById('gameMenu').style.display = 'block';
        document.getElementById('startButton').style.display = 'block';
        document.getElementById('startButton').textContent = 'Play Again';
        document.getElementById('resumeButton').style.display = 'none';
        
        this.updateHighScores();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    updatePowerUpUI(type, active) {
        const indicator = document.getElementById(`${type}Indicator`);
        if (indicator) {
            if (active) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        }
    }
    
    updateHighScores() {
        const highScoresList = document.getElementById('highScoresList');
        const scores = JSON.parse(localStorage.getItem('asteroids_scores') || '[]');
        
        scores.push(this.score);
        scores.sort((a, b) => b - a);
        scores.splice(5); // Keep top 5
        
        localStorage.setItem('asteroids_scores', JSON.stringify(scores));
        
        highScoresList.innerHTML = scores
            .map((score, index) => `<li>${index + 1}. ${score}</li>`)
            .join('');
    }
}