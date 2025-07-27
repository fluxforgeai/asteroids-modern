import { Game } from './Game.js';
import { CONFIG } from './config.js';
import { Logger } from './Logger.js';

// Initialize logger
const logger = new Logger('DEBUG');
logger.setupGlobalErrorHandling();

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    logger.info('DOM Content Loaded - Initializing game');
    
    try {
        // Check for required elements
        const canvas = document.getElementById('gameCanvas');
        const startButton = document.getElementById('startButton');
        const resumeButton = document.getElementById('resumeButton');
        
        if (!canvas) {
            logger.error('Game canvas not found!');
            return;
        }
        
        if (!startButton) {
            logger.error('Start button not found!');
            return;
        }
        
        if (!resumeButton) {
            logger.error('Resume button not found!');
            return;
        }
        
        logger.info('All required DOM elements found');
        
        // Initialize game
        logger.info('Creating game instance...');
        const game = new Game(canvas);
        logger.info('Game instance created successfully');
        
        // Make game accessible for debugging
        window.game = game;
        window.logger = logger;
        
        // Setup button handlers with error handling
        startButton.addEventListener('click', () => {
            logger.gameEvent('START_BUTTON_CLICKED');
            try {
                game.start();
                logger.gameEvent('GAME_STARTED');
            } catch (error) {
                logger.error('Error starting game:', error);
            }
        });
        
        resumeButton.addEventListener('click', () => {
            logger.gameEvent('RESUME_BUTTON_CLICKED');
            try {
                game.resume();
                logger.gameEvent('GAME_RESUMED');
            } catch (error) {
                logger.error('Error resuming game:', error);
            }
        });
        
        logger.info('Button event handlers set up');
        
        // Game loop with error handling
        let lastTime = 0;
        let frameCount = 0;
        let fpsStartTime = performance.now();
        
        function gameLoop(currentTime) {
            try {
                const deltaTime = (currentTime - lastTime) / 1000;
                lastTime = currentTime;
                
                // Cap delta time to prevent large jumps
                const cappedDeltaTime = Math.min(deltaTime, 1 / 30);
                
                // Performance monitoring
                const updateStart = performance.now();
                game.update(cappedDeltaTime);
                const updateEnd = performance.now();
                
                const renderStart = performance.now();
                game.render();
                const renderEnd = performance.now();
                
                // Log performance every 60 frames (roughly every second)
                frameCount++;
                if (frameCount % 60 === 0) {
                    const fps = 60 / ((currentTime - fpsStartTime) / 1000);
                    logger.performance('Update', updateEnd - updateStart);
                    logger.performance('Render', renderEnd - renderStart);
                    logger.debug(`FPS: ${fps.toFixed(1)}`);
                    fpsStartTime = currentTime;
                }
                
                requestAnimationFrame(gameLoop);
            } catch (error) {
                logger.error('Error in game loop:', error);
                // Try to continue the loop despite errors
                requestAnimationFrame(gameLoop);
            }
        }
        
        // Start the game loop
        logger.info('Starting game loop');
        requestAnimationFrame(gameLoop);
        
        // Show/hide mobile controls based on touch support
        const mobileControls = document.querySelector('.mobile-controls');
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            if (mobileControls) {
                mobileControls.style.display = 'flex';
                logger.info('Mobile controls enabled');
            }
        }
        
        // Prevent context menu on game canvas
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle visibility change to pause game
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && game.state === 'playing') {
                logger.gameEvent('GAME_PAUSED_BY_VISIBILITY_CHANGE');
                game.pause();
            }
        });
        
        // Add debugging keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'l':
                        e.preventDefault();
                        logger.exportLogs();
                        break;
                    case 'd':
                        e.preventDefault();
                        console.log('Game State:', game);
                        console.log('Recent Logs:', logger.getLogs().slice(-10));
                        break;
                }
            }
        });
        
        logger.info('Game initialization complete');
        
    } catch (error) {
        logger.error('Critical error during initialization:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff0000;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: monospace;
        `;
        errorDiv.innerHTML = `
            <h2>Game Initialization Error</h2>
            <p>${error.message}</p>
            <p>Check console for details</p>
            <button onclick="this.parentElement.remove()">Close</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Debug info
logger.info('Main.js loaded', {
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio,
    touchSupport: 'ontouchstart' in window
});