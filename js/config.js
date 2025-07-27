export const CONFIG = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    
    GAME: {
        FPS: 60,
        STARTING_LIVES: 3,
        INVULNERABILITY_TIME: 3000,
        HYPERSPACE_COOLDOWN: 2000,
        PAUSE_KEY: 'p',
        HYPERSPACE_KEY: 'h'
    },
    
    SHIP: {
        SIZE: 15,
        THRUST: 300,
        TURN_SPEED: 360,
        FRICTION: 0.7,
        MAX_SPEED: 500,
        BLINK_RATE: 0.1,
        EXPLOSION_DURATION: 0.4
    },
    
    BULLETS: {
        SPEED: 500,
        SIZE: 2,
        LIFETIME: 1.2,
        MAX_BULLETS: 10,
        FIRE_RATE: 0.15
    },
    
    ASTEROIDS: {
        INITIAL_COUNT: 4,
        SPEED: {
            MIN: 20,
            MAX: 80
        },
        SIZE: {
            LARGE: 40,
            MEDIUM: 20,
            SMALL: 10
        },
        POINTS: {
            LARGE: 20,
            MEDIUM: 50,
            SMALL: 100
        },
        VERTICES: {
            MIN: 8,
            MAX: 12
        },
        JAGGEDNESS: 0.4,
        SPIN_SPEED: 0.02
    },
    
    UFO: {
        SIZE: 20,
        SPEED: 100,
        FIRE_RATE: 2,
        SPAWN_TIME: 20000,
        POINTS: {
            LARGE: 200,
            SMALL: 1000
        },
        ACCURACY: {
            LARGE: 0.3,
            SMALL: 0.8
        }
    },
    
    POWERUPS: {
        SPAWN_CHANCE: 0.1,
        DURATION: {
            SHIELD: 5000,
            RAPID_FIRE: 10000,
            MULTI_SHOT: 8000
        },
        SIZE: 15
    },
    
    PARTICLES: {
        EXPLOSION: {
            COUNT: 15,
            SPEED: 200,
            LIFETIME: 0.6,
            SIZE: 3
        },
        THRUST: {
            COUNT: 3,
            SPEED: 100,
            LIFETIME: 0.3,
            SIZE: 2
        }
    },
    
    SOUNDS: {
        VOLUME: 0.3,
        THRUST: 'thrust',
        FIRE: 'fire',
        EXPLOSION_LARGE: 'explosion_large',
        EXPLOSION_MEDIUM: 'explosion_medium',
        EXPLOSION_SMALL: 'explosion_small',
        UFO_LARGE: 'ufo_large',
        UFO_SMALL: 'ufo_small',
        POWERUP: 'powerup',
        EXTRA_LIFE: 'extra_life'
    },
    
    COLORS: {
        SHIP: '#00ffff',
        THRUST: '#ff9900',
        ASTEROID: '#00ffff',
        BULLET: '#ffff00',
        UFO: '#ff00ff',
        PARTICLE: '#ffffff',
        POWERUP: {
            SHIELD: '#00ff00',
            RAPID_FIRE: '#ff0000',
            MULTI_SHOT: '#ffff00'
        }
    }
};