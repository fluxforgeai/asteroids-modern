import { Game } from './Game.js';
import { CONFIG } from './config.js';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Setup button handlers
    document.getElementById('startButton').addEventListener('click', () => {
        game.start();
    });
    
    document.getElementById('resumeButton').addEventListener('click', () => {
        game.resume();
    });
    
    // Game loop
    let lastTime = 0;
    function gameLoop(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        const cappedDeltaTime = Math.min(deltaTime, 1 / 30);
        
        game.update(cappedDeltaTime);
        game.render();
        
        requestAnimationFrame(gameLoop);
    }
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
    
    // Show/hide mobile controls based on touch support
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.querySelector('.mobile-controls').style.display = 'flex';
    }
    
    // Prevent context menu on game canvas
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Handle visibility change to pause game
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.state === 'playing') {
            game.pause();
        }
    });
});