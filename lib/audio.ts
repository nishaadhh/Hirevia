// Web Audio API notification chime generator (subtle high-end "ting")
export function playNotificationTing() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Create oscillator and gain
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Harmonic pleasant chime (E6 to G6)
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
    osc.frequency.exponentialRampToValueAtTime(1567.98, ctx.currentTime + 0.08); // G6

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.debug("Audio playback ignored:", e);
  }
}
