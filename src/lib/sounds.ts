export const SOUNDS = {
  CLICK: '/sounds/click.mp3',
  SUCCESS: '/sounds/success.mp3',
  ERROR: '/sounds/error.mp3',
  TRANSITION: '/sounds/transition.mp3',
} as const;

class SoundManager {
  private static instance: SoundManager;
  private enabled: boolean = true;
  private sounds: Map<string, HTMLAudioElement> = new Map();

  private constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sound_effects_enabled');
      this.enabled = saved === null ? true : saved === 'true';
      this.preloadSounds();
    }
  }

  private preloadSounds() {
    Object.values(SOUNDS).forEach(path => {
      const audio = new Audio(path);
      audio.volume = 0.3;
      audio.load();
      this.sounds.set(path, audio);
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_effects_enabled', String(enabled));
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public play(soundPath: string) {
    if (!this.enabled) return;

    try {
      let audio = this.sounds.get(soundPath);

      if (!audio) {
        audio = new Audio(soundPath);
        audio.volume = 0.3;
        this.sounds.set(soundPath, audio);
      }

      // Reset sound to start if it's already playing
      audio.currentTime = 0;
      audio.play().catch(err => {
        // Ignore errors caused by browser autoplay policies or missing files
        if (err.name !== 'NotAllowedError') {
          console.warn('Sound playback failed:', err);
        }
      });
    } catch (err) {
      console.warn('Audio playback failed:', err);
    }
  }
}

export const soundManager = SoundManager.getInstance();
