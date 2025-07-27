export class MobileResponsive {
    constructor() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.isPortrait = this.screenHeight > this.screenWidth;
        
        console.log('[MOBILE] Screen dimensions:', this.screenWidth, 'x', this.screenHeight);
        console.log('[MOBILE] Device pixel ratio:', this.devicePixelRatio);
        console.log('[MOBILE] Is portrait:', this.isPortrait);
        
        this.setupResponsiveLayout();
        this.setupResizeListener();
    }
    
    setupResponsiveLayout() {
        // Calculate optimal sizes based on actual screen dimensions
        const canvas = document.getElementById('gameCanvas');
        const gameUI = document.getElementById('gameUI');
        const mobileControls = document.querySelector('.mobile-controls');
        
        if (!canvas || !mobileControls) return;
        
        // Calculate available space
        const headerHeight = 60; // Space for game stats
        const controlsHeight = Math.min(100, this.screenHeight * 0.15); // 15% of screen or max 100px
        const margins = 20;
        
        const availableWidth = this.screenWidth - (margins * 2);
        const availableHeight = this.screenHeight - headerHeight - controlsHeight - (margins * 3);
        
        console.log('[MOBILE] Available space:', availableWidth, 'x', availableHeight);
        
        // Set canvas size
        canvas.style.width = `${availableWidth}px`;
        canvas.style.height = `${availableHeight}px`;
        canvas.style.maxWidth = 'none';
        canvas.style.maxHeight = 'none';
        
        // Position and size controls
        this.setupMobileControls(controlsHeight);
        
        // Adjust game stats
        if (gameUI) {
            gameUI.style.position = 'relative';
            gameUI.style.width = '100%';
            gameUI.style.padding = '10px';
            gameUI.style.textAlign = 'center';
        }
    }
    
    setupMobileControls(controlsHeight) {
        const mobileControls = document.querySelector('.mobile-controls');
        if (!mobileControls) return;
        
        // Calculate button size based on screen width
        const buttonCount = 5;
        const gaps = (buttonCount - 1) * 10; // 10px gaps between buttons
        const margins = 40; // 20px on each side
        const availableWidth = this.screenWidth - margins - gaps;
        const buttonSize = Math.min(60, Math.floor(availableWidth / buttonCount));
        
        console.log('[MOBILE] Button size calculated:', buttonSize);
        
        // Apply dynamic styles
        mobileControls.style.cssText = `
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-evenly !important;
            align-items: center !important;
            position: fixed !important;
            bottom: 10px !important;
            left: 10px !important;
            right: 10px !important;
            height: ${controlsHeight}px !important;
            background: rgba(0, 0, 0, 0.7) !important;
            border-radius: 10px !important;
            padding: 10px !important;
            z-index: 1000 !important;
            gap: 10px !important;
        `;
        
        // Style all control buttons
        const buttons = mobileControls.querySelectorAll('.control-btn');
        buttons.forEach((button, index) => {
            const isFireButton = button.id === 'fireBtn';
            const size = isFireButton ? buttonSize + 10 : buttonSize;
            
            button.style.cssText = `
                width: ${size}px !important;
                height: ${size}px !important;
                border-radius: 50% !important;
                border: 2px solid #0ff !important;
                background: rgba(0, 255, 255, 0.3) !important;
                color: #0ff !important;
                font-size: ${Math.max(12, size * 0.3)}px !important;
                font-weight: bold !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                touch-action: manipulation !important;
                user-select: none !important;
                -webkit-tap-highlight-color: transparent !important;
                flex-shrink: 0 !important;
            `;
            
            if (isFireButton) {
                button.style.background = 'rgba(255, 100, 0, 0.3) !important';
                button.style.borderColor = '#ff6400 !important';
                button.style.color = '#ff6400 !important';
            }
        });
    }
    
    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.screenWidth = window.innerWidth;
                this.screenHeight = window.innerHeight;
                this.isPortrait = this.screenHeight > this.screenWidth;
                console.log('[MOBILE] Resize detected:', this.screenWidth, 'x', this.screenHeight);
                this.setupResponsiveLayout();
            }, 100);
        });
        
        // Also listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.screenWidth = window.innerWidth;
                this.screenHeight = window.innerHeight;
                this.isPortrait = this.screenHeight > this.screenWidth;
                console.log('[MOBILE] Orientation change:', this.screenWidth, 'x', this.screenHeight);
                this.setupResponsiveLayout();
            }, 500); // Delay to let orientation change complete
        });
    }
    
    getOptimalCanvasSize() {
        return {
            width: this.screenWidth - 40,
            height: this.screenHeight * 0.7
        };
    }
    
    getControlsConfig() {
        return {
            buttonSize: Math.min(60, this.screenWidth / 8),
            height: Math.min(100, this.screenHeight * 0.15)
        };
    }
}