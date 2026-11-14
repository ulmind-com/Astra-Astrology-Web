"use client";

/**
 * Celestial Web Audio Synthesizer
 *
 * Produces crisp, luxury, zero-latency chimes for the AI Astrologer.
 * Synthesizes pure harmonic chords directly via Web Audio API so there
 * are zero network requests, zero broken assets, and zero buffering delays.
 */

class CelestialAudio {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("astra_ai_sound_enabled");
      this.soundEnabled = stored !== null ? stored === "true" : true;

      // Register gesture listener to resume audio context if suspended by browser autoplay policy
      const unlock = () => {
        const audioCtx = this.getAudioContext();
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume().catch(() => {});
        }
      };

      for (const evt of ["pointerdown", "keydown", "touchstart"] as const) {
        window.addEventListener(evt, unlock, { once: true, passive: true });
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("astra_ai_sound_enabled", String(enabled));
    }
  }

  public getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * ChatGPT Voice Mode Style "Toong" / Celestial Crystal Chime
   *
   * Harmonic ascending chime chord:
   * 1. Warm root: D5 (587.33 Hz)
   * 2. Pure fifth: A5 (880.00 Hz)
   * 3. Celestial octave: D6 (1174.66 Hz)
   * 4. Harmonic sparkle: F#6 (1479.98 Hz)
   *
   * Has a quick 20ms attack and a long resonant 1.4s exponential decay.
   */
  public playOpeningChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const tones = [
        { freq: 587.33, delay: 0.0, gain: 0.22, duration: 1.4 },
        { freq: 880.0, delay: 0.05, gain: 0.16, duration: 1.25 },
        { freq: 1174.66, delay: 0.11, gain: 0.12, duration: 1.1 },
        { freq: 1479.98, delay: 0.17, gain: 0.06, duration: 0.9 },
      ];

      tones.forEach(({ freq, delay, gain: maxGain, duration }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + delay);

        // Smooth attack then exponential fade-out
        gainNode.gain.setValueAtTime(0.0001, now + delay);
        gainNode.gain.exponentialRampToValueAtTime(maxGain, now + delay + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.05);
      });
    } catch {
      // Safe fallback if browser security prevents audio
    }
  }

  /**
   * Crisp, soft celestial send tone
   */
  public playSendChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.08); // B5

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.09, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // safe ignore
    }
  }

  /**
   * Gentle, soft arrival chime when AI completes reading
   */
  public playReceiveChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.06);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // safe ignore
    }
  }
}

export const celestialAudio = new CelestialAudio();
