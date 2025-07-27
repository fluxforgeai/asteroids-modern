export class MobileResponsive {
    constructor() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.isPortrait = this.screenHeight > this.screenWidth;
        
        console.log('[MOBILE] Screen dimensions:', this.screenWidth, 'x', this.screenHeight);
        console.log('[MOBILE] Device pixel ratio:', this.devicePixelRatio);
        console.log('[MOBILE] Is portrait:', this.isPortrait);
        
        // Delay setup to ensure DOM is ready
        setTimeout(() => {
            this.setupResponsiveLayout();
            this.setupResizeListener();
        }, 100);
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
        
        // Calculate button size based on screen width - be more conservative
        const buttonCount = 5;
        const margins = 20; // 10px on each side
        const padding = 20; // 10px padding inside control panel
        const minGap = 5; // Minimum gap between buttons
        const totalGaps = (buttonCount - 1) * minGap;
        const availableWidth = this.screenWidth - margins - padding - totalGaps;
        const buttonSize = Math.max(40, Math.min(55, Math.floor(availableWidth / buttonCount)));
        
        console.log('[MOBILE] Screen width:', this.screenWidth);
        console.log('[MOBILE] Available width for buttons:', availableWidth);
        console.log('[MOBILE] Button size calculated:', buttonSize);
        
        // Force show all buttons first
        const allButtons = ['leftBtn', 'rightBtn', 'thrustBtn', 'fireBtn', 'hyperBtn'];
        allButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.style.display = 'flex';
                btn.style.visibility = 'visible';
                btn.style.opacity = '1';
            }
        });
        
        // Apply dynamic styles
        mobileControls.style.cssText = `
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            position: fixed !important;
            bottom: 10px !important;
            left: 10px !important;
            right: 10px !important;
            height: ${Math.max(70, controlsHeight)}px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border-radius: 10px !important;
            padding: 10px !important;
            z-index: 1000 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
        `;
        
        // Style all control buttons with specific order
        const buttonOrder = [
            { id: 'leftBtn', label: '←' },
            { id: 'rightBtn', label: '→' },
            { id: 'thrustBtn', label: '↑' },
            { id: 'fireBtn', label: 'FIRE' },
            { id: 'hyperBtn', label: 'H' }
        ];
        
        buttonOrder.forEach((btnInfo, index) => {
            const button = document.getElementById(btnInfo.id);
            if (!button) return;
            
            const isFireButton = btnInfo.id === 'fireBtn';
            const size = isFireButton ? Math.min(buttonSize + 8, 60) : buttonSize;
            const fontSize = isFireButton ? Math.max(10, size * 0.25) : Math.max(12, size * 0.35);
            
            button.style.cssText = `
                width: ${size}px !important;
                height: ${size}px !important;
                border-radius: 50% !important;
                border: 2px solid #0ff !important;
                background: rgba(0, 255, 255, 0.3) !important;
                color: #0ff !important;
                font-size: ${fontSize}px !important;
                font-weight: bold !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                touch-action: manipulation !important;
                user-select: none !important;
                -webkit-tap-highlight-color: transparent !important;
                flex-shrink: 0 !important;
                position: relative !important;
                order: ${index} !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
            `;
            
            if (isFireButton) {
                button.style.background = 'rgba(255, 100, 0, 0.4) !important';
                button.style.borderColor = '#ff6400 !important';
                button.style.color = '#ff6400 !important';
            }
            
            // Ensure text content is correct
            if (button.textContent !== btnInfo.label) {
                button.textContent = btnInfo.label;
            }
        });
        
        console.log('[MOBILE] All 5 buttons configured');
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