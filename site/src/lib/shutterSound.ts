let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function noiseBurst(ac: AudioContext, start: number, duration: number, freq: number, peak: number) {
  const size = Math.max(1, Math.floor(ac.sampleRate * duration));
  const buffer = ac.createBuffer(1, size, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;

  const source = ac.createBufferSource();
  source.buffer = buffer;

  const bandpass = ac.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = freq;
  bandpass.Q.value = 1.1;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(bandpass).connect(gain).connect(ac.destination);
  source.start(start);
  source.stop(start + duration);
}

// A two-part synthetic "clack" — mirror-up then shutter-close — standing in
// for a licensed SFX file so there's nothing extra to fetch or ship.
export function playShutterSound() {
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    noiseBurst(ac, now, 0.035, 2000, 0.55);
    noiseBurst(ac, now + 0.05, 0.02, 3400, 0.35);
  } catch {
    // Audio isn't guaranteed (autoplay policy, unsupported browser) — silent no-op.
  }
}
