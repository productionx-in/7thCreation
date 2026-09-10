let ctx: AudioContext | null = null;

// Shared across every synthesized sound on the site (shutter click,
// cinematic intro) — a page should only ever have one AudioContext.
export function getAudioContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}
