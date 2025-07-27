export class Logger {
    constructor(level = 'INFO') {
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        
        this.currentLevel = this.levels[level] || this.levels.INFO;
        this.enabled = true;
        
        // Store logs for debugging
        this.logs = [];
        this.maxLogs = 1000;
        
        this.info('Logger initialized with level:', level);
    }
    
    error(message, ...args) {
        this._log('ERROR', message, ...args);
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(`[ASTEROIDS ERROR]`, message, ...args);
        }
    }
    
    warn(message, ...args) {
        this._log('WARN', message, ...args);
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(`[ASTEROIDS WARN]`, message, ...args);
        }
    }
    
    info(message, ...args) {
        this._log('INFO', message, ...args);
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`[ASTEROIDS INFO]`, message, ...args);
        }
    }
    
    debug(message, ...args) {
        this._log('DEBUG', message, ...args);
        if (this.currentLevel >= this.levels.DEBUG) {
            console.log(`[ASTEROIDS DEBUG]`, message, ...args);
        }
    }
    
    gameEvent(event, data = {}) {
        this.info(`GAME EVENT: ${event}`, data);
    }
    
    performance(operation, duration) {
        this.debug(`PERFORMANCE: ${operation} took ${duration.toFixed(2)}ms`);
    }
    
    _log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            args,
            stack: new Error().stack
        };
        
        this.logs.push(logEntry);
        
        // Keep logs under limit
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }
    
    getLogs(level = null) {
        if (!level) return this.logs;
        return this.logs.filter(log => log.level === level);
    }
    
    clearLogs() {
        this.logs = [];
        this.info('Logs cleared');
    }
    
    setLevel(level) {
        this.currentLevel = this.levels[level] || this.levels.INFO;
        this.info('Log level set to:', level);
    }
    
    exportLogs() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], 
                            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `asteroids-logs-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.info('Logs exported');
    }
    
    // Add global error handler
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.error('Global Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled Promise Rejection:', event.reason);
        });
        
        this.info('Global error handling setup complete');
    }
}