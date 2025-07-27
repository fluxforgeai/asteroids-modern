export class SimpleSoundSystem {
    constructor() {
        this.enabled = false;
        console.log('[SOUND] SimpleSoundSystem initialized (audio disabled for testing)');
    }
    
    play(soundName) {
        console.log(`[SOUND] Would play: ${soundName}`);
        return null;
    }
    
    stop(soundHandle) {
        console.log('[SOUND] Would stop sound');
    }
    
    setVolume(volume) {
        console.log(`[SOUND] Would set volume to: ${volume}`);
    }
    
    mute() {
        console.log('[SOUND] Would mute');
    }
    
    unmute() {
        console.log('[SOUND] Would unmute');
    }
}