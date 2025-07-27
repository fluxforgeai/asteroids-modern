import { CONFIG } from '../config.js';

export class SoundSystem {
    constructor() {
        this.enabled = true;
        this.sounds = new Map();
        this.context = null;
        this.masterGain = null;
        
        this.initialize();
    }
    
    initialize() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = CONFIG.SOUNDS.VOLUME;
            this.masterGain.connect(this.context.destination);
            
            // Create sound generators
            this.createSounds();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }
    
    createSounds() {
        // Laser sound
        this.sounds.set('fire', () => {
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.3, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.1);
        });
        
        // Explosion sounds
        this.sounds.set('explosion_large', () => this.createExplosion(0.5, 100));
        this.sounds.set('explosion_medium', () => this.createExplosion(0.3, 150));
        this.sounds.set('explosion_small', () => this.createExplosion(0.2, 200));
        
        // Thrust sound
        this.sounds.set('thrust', () => {
            const noise = this.createNoise();
            const filter = this.context.createBiquadFilter();
            const gain = this.context.createGain();
            
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            
            gain.gain.setValueAtTime(0.1, this.context.currentTime);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            return { noise, gain };
        });
        
        // UFO sounds
        this.sounds.set('ufo_large', () => this.createUFOSound(100, 150));
        this.sounds.set('ufo_small', () => this.createUFOSound(200, 250));
        
        // Power-up sound
        this.sounds.set('powerup', () => {
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.2);
            
            gain.gain.setValueAtTime(0.3, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            oscillator.connect(gain);
            gain.connect(this.masterGain);
            
            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.3);
        });
        
        // Extra life sound
        this.sounds.set('extra_life', () => {
            for (let i = 0; i < 3; i++) {
                const oscillator = this.context.createOscillator();
                const gain = this.context.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = 440 * Math.pow(2, i / 12);
                
                gain.gain.setValueAtTime(0, this.context.currentTime + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.2, this.context.currentTime + i * 0.1 + 0.05);
                gain.gain.linearRampToValueAtTime(0, this.context.currentTime + i * 0.1 + 0.2);
                
                oscillator.connect(gain);
                gain.connect(this.masterGain);
                
                oscillator.start(this.context.currentTime + i * 0.1);
                oscillator.stop(this.context.currentTime + i * 0.1 + 0.2);
            }
        });
    }
    
    createExplosion(duration, frequency) {
        const noise = this.createNoise();
        const filter = this.context.createBiquadFilter();
        const gain = this.context.createGain();
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 4, this.context.currentTime);
        filter.frequency.exponentialRampToValueAtTime(frequency, this.context.currentTime + duration);
        
        gain.gain.setValueAtTime(0.5, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        setTimeout(() => noise.disconnect(), duration * 1000);
    }
    
    createUFOSound(freq1, freq2) {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        const lfo = this.context.createOscillator();
        const lfoGain = this.context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq1;
        
        lfo.type = 'sine';
        lfo.frequency.value = 3;
        lfoGain.gain.value = freq2 - freq1;
        
        gain.gain.value = 0.1;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start();
        lfo.start();
        
        return { oscillator, lfo };
    }
    
    createNoise() {
        const bufferSize = this.context.sampleRate * 2;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.context.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.start();
        
        return noise;
    }
    
    play(soundName) {
        if (!this.enabled || !this.sounds.has(soundName)) return null;
        
        try {
            // Resume context if suspended
            if (this.context.state === 'suspended') {
                this.context.resume();
            }
            
            const soundGenerator = this.sounds.get(soundName);
            return soundGenerator();
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
            return null;
        }
    }
    
    stop(soundHandle) {
        if (!soundHandle) return;
        
        try {
            if (soundHandle.oscillator) soundHandle.oscillator.stop();
            if (soundHandle.lfo) soundHandle.lfo.stop();
            if (soundHandle.noise) soundHandle.noise.stop();
        } catch (error) {
            // Already stopped
        }
    }
    
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }
    
    mute() {
        this.setVolume(0);
    }
    
    unmute() {
        this.setVolume(CONFIG.SOUNDS.VOLUME);
    }
}