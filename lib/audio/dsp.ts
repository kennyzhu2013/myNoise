import type { NoiseColor } from "@/lib/audio/types";

export function renderNoise(kind: NoiseColor, frames: number): Float32Array {
  const out = new Float32Array(frames);
  if (kind === "white") {
    for (let i = 0; i < frames; i++) out[i] = Math.random() * 2 - 1;
    return out;
  }
  if (kind === "pink") {
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    const warmup = 3000;
    for (let i = 0; i < warmup + frames; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      if (i >= warmup) out[i - warmup] = pink;
    }
    return out;
  }
  let last = 0;
  for (let i = 0; i < 2000; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
  }
  for (let i = 0; i < frames; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    out[i] = last;
  }
  return out;
}

export function removeDc(data: Float32Array) {
  let mean = 0;
  for (let i = 0; i < data.length; i++) mean += data[i];
  mean /= data.length || 1;
  for (let i = 0; i < data.length; i++) data[i] -= mean;
}

export function normalize(data: Float32Array, targetRms: number) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  const rms = Math.sqrt(sum / (data.length || 1));
  if (rms < 1e-8) return;
  const gain = targetRms / rms;
  for (let i = 0; i < data.length; i++) data[i] = Math.tanh(data[i] * gain);
}

/** Crossfade the extra tail into the head so a loop has no click. */
export function seamless(samples: Float32Array, fade: number): Float32Array {
  if (fade <= 1 || fade >= samples.length) return samples;
  const length = samples.length - fade;
  const out = samples.slice(0, length);
  for (let i = 0; i < fade; i++) {
    const w = i / fade;
    const fadeIn = Math.sin(w * Math.PI * 0.5);
    const fadeOut = Math.cos(w * Math.PI * 0.5);
    out[i] = samples[i] * fadeIn + samples[length + i] * fadeOut;
  }
  return out;
}

export function renderBurst(frames: number, decay: number): Float32Array {
  const out = new Float32Array(frames);
  const attack = Math.min(48, Math.max(1, Math.floor(frames * 0.08)));
  for (let i = 0; i < frames; i++) {
    const env = Math.exp((-decay * i) / frames);
    const edge = i < attack ? i / attack : 1;
    out[i] = (Math.random() * 2 - 1) * env * edge;
  }
  let peak = 0;
  for (let i = 0; i < frames; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 0) {
    const gain = 0.95 / peak;
    for (let i = 0; i < frames; i++) out[i] *= gain;
  }
  return out;
}

/** Periodic smooth random curve. The last sample meets the first. */
export function renderControl(
  frames: number,
  min: number,
  max: number,
  smoothnessSec: number,
  sampleRate: number,
): Float32Array {
  const duration = frames / sampleRate;
  const knots = Math.max(3, Math.round(duration / Math.max(0.04, smoothnessSec)));
  const values = Array.from({ length: knots }, () => min + Math.random() * (max - min));
  const out = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    const x = (i / frames) * knots;
    const i0 = Math.floor(x) % knots;
    const i1 = (i0 + 1) % knots;
    const frac = x - Math.floor(x);
    const s = 0.5 - 0.5 * Math.cos(Math.PI * frac);
    out[i] = values[i0] * (1 - s) + values[i1] * s;
  }
  return out;
}

export function renderWave(
  frames: number,
  attackIn: number,
  holdIn: number,
  decayIn: number,
  floor: number,
): Float32Array {
  let attack = Math.max(0, attackIn);
  let hold = Math.max(0, holdIn);
  let decay = Math.max(0, decayIn);
  const sum = attack + hold + decay;
  if (sum > 0.98) {
    const scale = 0.98 / sum;
    attack *= scale;
    hold *= scale;
    decay *= scale;
  }
  const holdEnd = attack + hold;
  const decayEnd = holdEnd + decay;
  const out = new Float32Array(frames);
  const low = Math.min(1, Math.max(0, floor));
  for (let i = 0; i < frames; i++) {
    const p = i / frames;
    if (p < attack && attack > 0) {
      const u = p / attack;
      out[i] = low + (1 - low) * Math.pow(u, 1.7);
    } else if (p < holdEnd) {
      out[i] = 1;
    } else if (p < decayEnd && decay > 0) {
      const u = (p - holdEnd) / decay;
      out[i] = low + (1 - low) * Math.pow(1 - u, 1.35);
    } else {
      out[i] = low;
    }
  }
  return out;
}

export function renderCricket(
  sampleRate: number,
  chirpHz: number,
  phraseSec: number,
  gapSec: number,
): Float32Array {
  const total = Math.max(0.2, phraseSec + gapSec);
  const frames = Math.max(1, Math.floor(sampleRate * total));
  const out = new Float32Array(frames);
  const phraseN = Math.min(frames, Math.floor(sampleRate * phraseSec));
  const period = Math.max(1, sampleRate / Math.max(1, chirpHz));
  const width = Math.max(1, period * 0.38);
  const fade = Math.max(1, Math.floor(sampleRate * 0.008));
  for (let i = 0; i < phraseN; i++) {
    const phase = i % period;
    if (phase >= width) continue;
    let amp = Math.sin(Math.PI * (phase / width));
    if (i < fade) amp *= i / fade;
    if (i > phraseN - fade) amp *= Math.max(0, (phraseN - i) / fade);
    out[i] = amp;
  }
  return out;
}

export function renderKatydid(sampleRate: number, phraseSec: number, gapSec: number, seed: number): Float32Array {
  const frames = Math.max(1, Math.floor(sampleRate * Math.max(0.2, phraseSec + gapSec)));
  const out = new Float32Array(frames);
  const phraseFrames = Math.min(frames, Math.floor(sampleRate * phraseSec));
  let cursor = 0;
  let group = 0;
  while (cursor < phraseFrames) {
    const ticks = 2 + ((group + seed) % 2);
    for (let tick = 0; tick < ticks && cursor < phraseFrames; tick++) {
      const len = Math.floor(sampleRate * 0.014);
      for (let i = 0; i < len && cursor + i < phraseFrames; i++) {
        out[cursor + i] = Math.sin(Math.PI * (i / len));
      }
      cursor += Math.floor(sampleRate * 0.05);
    }
    cursor += Math.floor(sampleRate * (0.16 + ((group + seed) % 3) * 0.045));
    group += 1;
  }
  return out;
}
