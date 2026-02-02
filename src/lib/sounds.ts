export const SOUNDS = {
  CLICK: '/sounds/click.wav',
  SUCCESS: '/sounds/success.wav',
  ERROR: '/sounds/error.wav',
  TRANSITION: '/sounds/transition.wav',
} as const;

class SoundManager {
  private static instance: SoundManager;
  private enabled: boolean = true;

  private constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sound_effects_enabled');
      this.enabled = saved === null ? true : saved === 'true';
    }
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
      const audio = new Audio(soundPath);
      audio.volume = 0.3; // Set a reasonable volume
      audio.play().catch(err => {
        // Ignore errors caused by browser autoplay policies or missing files
        if (err.name !== 'NotAllowedError') {
          console.warn('Sound playback failed:', err);
        }
      });
    } catch (err) {
      console.warn('Audio object creation failed:', err);
    }
  }
}

export const soundManager = SoundManager.getInstance();
