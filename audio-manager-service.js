import backgroundTrackUrl from "./audio/Kirby dream land theme song 4.mp3";

const AUDIO_STATE_KEY = "sti-background-music-state";
const AUDIO_TIME_KEY = "sti-background-music-time";
const DEFAULT_VOLUME = 0.28;
const FADE_STEP_MS = 40;

class AudioManager {
  constructor() {
    this.audio = new Audio(backgroundTrackUrl);
    this.audio.loop = true;
    this.audio.preload = "auto";
    this.audio.volume = 0;
    this.targetVolume = DEFAULT_VOLUME;
    this.fadeTimer = null;
    this.pendingAutoplay = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const savedTime = Number(sessionStorage.getItem(AUDIO_TIME_KEY));
    if (Number.isFinite(savedTime) && savedTime > 0) {
      this.audio.currentTime = savedTime;
    }

    window.addEventListener("beforeunload", () => this.persistTime());
    window.addEventListener("pagehide", () => this.persistTime());
    window.setInterval(() => this.persistTime(), 1500);

    if (this.getState() !== "muted") {
      this.play();
    }

    const unlock = () => {
      if (this.pendingAutoplay && this.getState() !== "muted") {
        this.play();
      }
    };

    document.addEventListener("pointerdown", unlock, { passive: true });
    document.addEventListener("keydown", unlock);
  }

  getState() {
    return localStorage.getItem(AUDIO_STATE_KEY) || "playing";
  }

  persistTime() {
    if (!Number.isNaN(this.audio.currentTime)) {
      sessionStorage.setItem(AUDIO_TIME_KEY, String(this.audio.currentTime));
    }
  }

  async play() {
    localStorage.setItem(AUDIO_STATE_KEY, "playing");
    this.audio.muted = false;
    try {
      await this.audio.play();
      this.pendingAutoplay = false;
      this.fadeTo(this.targetVolume, 520);
      return true;
    } catch {
      this.pendingAutoplay = true;
      return false;
    }
  }

  pause() {
    localStorage.setItem(AUDIO_STATE_KEY, "muted");
    this.pendingAutoplay = false;
    this.fadeTo(0, 420, () => {
      this.audio.pause();
      this.persistTime();
    });
  }

  setVolume(volume) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.getState() !== "muted") {
      this.fadeTo(this.targetVolume, 280);
    }
  }

  fadeTo(target, duration = 400, onDone) {
    window.clearInterval(this.fadeTimer);
    const start = this.audio.volume;
    const delta = target - start;
    const steps = Math.max(1, Math.round(duration / FADE_STEP_MS));
    let currentStep = 0;

    this.fadeTimer = window.setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;
      this.audio.volume = Math.max(0, Math.min(1, start + delta * progress));
      if (currentStep >= steps) {
        window.clearInterval(this.fadeTimer);
        this.audio.volume = target;
        onDone?.();
      }
    }, FADE_STEP_MS);
  }

  status() {
    return {
      state: this.getState(),
      paused: this.audio.paused,
      currentTime: this.audio.currentTime,
      volume: this.audio.volume
    };
  }
}

export const backgroundMusic = new AudioManager();
