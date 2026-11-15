import { normalize, removeDc, renderBurst, renderNoise, seamless } from "@/lib/audio/dsp";
import type { NoiseColor } from "@/lib/audio/types";

export type Palette = {
  whiteStereo: AudioBuffer;
  pinkStereo: AudioBuffer;
  brownStereo: AudioBuffer;
  whiteMono: AudioBuffer;
  pinkMono: AudioBuffer;
  brownMono: AudioBuffer;
  tick: AudioBuffer;
  drop: AudioBuffer;
  splash: AudioBuffer;
  crack: AudioBuffer;
};

export function bufferFrom(ctx: BaseAudioContext, channels: Float32Array[], sampleRate: number): AudioBuffer {
  const length = channels[0]?.length ?? 1;
  const buffer = ctx.createBuffer(channels.length, length, sampleRate);
  channels.forEach((data, index) => {
    buffer.getChannelData(index).set(data.subarray(0, length));
  });
  return buffer;
}

function prepNoise(kind: NoiseColor, frames: number, fade: number): Float32Array {
  const raw = renderNoise(kind, frames);
  removeDc(raw);
  const looped = seamless(raw, fade);
  normalize(looped, 0.2);
  return looped;
}

export function createPalette(ctx: AudioContext): Palette {
  const sampleRate = ctx.sampleRate;
  const fade = Math.floor(sampleRate * 0.12);
  const frames = Math.floor(sampleRate * 8) + fade;
  const noise = (kind: NoiseColor, stereo: boolean) => {
    const count = stereo ? 2 : 1;
    const channels = Array.from({ length: count }, () => prepNoise(kind, frames, fade));
    return bufferFrom(ctx, channels, sampleRate);
  };
  const burst = (seconds: number, decay: number) => {
    const data = renderBurst(Math.max(1, Math.floor(sampleRate * seconds)), decay);
    return bufferFrom(ctx, [data], sampleRate);
  };
  return {
    whiteStereo: noise("white", true),
    pinkStereo: noise("pink", true),
    brownStereo: noise("brown", true),
    whiteMono: noise("white", false),
    pinkMono: noise("pink", false),
    brownMono: noise("brown", false),
    tick: burst(0.02, 6.4),
    drop: burst(0.08, 3.1),
    splash: burst(0.22, 2.05),
    crack: burst(0.034, 5.6),
  };
}

export function noiseBuffer(palette: Palette, kind: NoiseColor, stereo: boolean): AudioBuffer {
  if (stereo) {
    if (kind === "white") return palette.whiteStereo;
    if (kind === "pink") return palette.pinkStereo;
    return palette.brownStereo;
  }
  if (kind === "white") return palette.whiteMono;
  if (kind === "pink") return palette.pinkMono;
  return palette.brownMono;
}
