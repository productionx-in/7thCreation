import { getAudioContext } from './audioContext';

// A short decaying-noise impulse, used as a synthetic reverb tail — there's
// no licensed impulse-response file to load, so it's generated on the fly.
function impulseResponse(ac: AudioContext, duration: number, decay: number): AudioBuffer {
  const length = Math.floor(ac.sampleRate * duration);
  const impulse = ac.createBuffer(2, length, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return impulse;
}

// A synthesized "trailer sting" — a filtered-noise riser swelling into a
// deep sub-bass impact with a bright high-frequency shimmer and a short
// synthetic reverb tail — standing in for a licensed cinematic SFX file so
// there's nothing extra to fetch or ship (same reasoning as shutterSound.ts).
export function playCinematicIntro() {
  try {
    const ac = getAudioContext();
    const now = ac.currentTime;

    const reverb = ac.createConvolver();
    reverb.buffer = impulseResponse(ac, 1.8, 2.5);
    const reverbGain = ac.createGain();
    reverbGain.gain.value = 0.3;
    reverb.connect(reverbGain).connect(ac.destination);

    const dry = ac.createGain();
    dry.gain.value = 1;
    dry.connect(ac.destination);
    dry.connect(reverb);

    // Riser: bandpass-filtered noise sweeping upward, swelling in.
    const riserDuration = 0.9;
    const riserSize = Math.floor(ac.sampleRate * riserDuration);
    const riserBuffer = ac.createBuffer(1, riserSize, ac.sampleRate);
    const riserData = riserBuffer.getChannelData(0);
    for (let i = 0; i < riserSize; i++) riserData[i] = Math.random() * 2 - 1;
    const riserSource = ac.createBufferSource();
    riserSource.buffer = riserBuffer;
    const riserFilter = ac.createBiquadFilter();
    riserFilter.type = 'bandpass';
    riserFilter.Q.value = 0.8;
    riserFilter.frequency.setValueAtTime(300, now);
    riserFilter.frequency.exponentialRampToValueAtTime(4200, now + riserDuration);
    const riserGain = ac.createGain();
    riserGain.gain.setValueAtTime(0.0001, now);
    riserGain.gain.exponentialRampToValueAtTime(0.5, now + riserDuration * 0.92);
    riserGain.gain.exponentialRampToValueAtTime(0.0001, now + riserDuration + 0.05);
    riserSource.connect(riserFilter).connect(riserGain).connect(dry);
    riserSource.start(now);
    riserSource.stop(now + riserDuration + 0.1);

    // Impact: deep sine drop, landing right as the riser peaks.
    const hitStart = now + riserDuration * 0.85;
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, hitStart);
    osc.frequency.exponentialRampToValueAtTime(38, hitStart + 0.35);
    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(0.0001, hitStart);
    oscGain.gain.linearRampToValueAtTime(0.85, hitStart + 0.012);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, hitStart + 1.4);
    osc.connect(oscGain).connect(dry);
    osc.start(hitStart);
    osc.stop(hitStart + 1.5);

    // High-frequency shimmer at the hit, for cinematic brightness.
    const shimmerSize = Math.floor(ac.sampleRate * 0.6);
    const shimmerBuffer = ac.createBuffer(1, shimmerSize, ac.sampleRate);
    const shimmerData = shimmerBuffer.getChannelData(0);
    for (let i = 0; i < shimmerSize; i++) shimmerData[i] = Math.random() * 2 - 1;
    const shimmerSource = ac.createBufferSource();
    shimmerSource.buffer = shimmerBuffer;
    const shimmerFilter = ac.createBiquadFilter();
    shimmerFilter.type = 'highpass';
    shimmerFilter.frequency.value = 6000;
    const shimmerGain = ac.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, hitStart);
    shimmerGain.gain.linearRampToValueAtTime(0.16, hitStart + 0.01);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, hitStart + 0.5);
    shimmerSource.connect(shimmerFilter).connect(shimmerGain).connect(dry);
    shimmerSource.start(hitStart);
    shimmerSource.stop(hitStart + 0.6);
  } catch {
    // Audio isn't guaranteed (autoplay policy, unsupported browser) — silent no-op.
  }
}
