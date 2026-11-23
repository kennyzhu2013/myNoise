import { normalize, removeDc, renderBurst, renderNoise, sculptAttenuation, seamless } from "@/lib/audio/dsp";
import type { FilterSpec, NoiseColor } from "@/lib/audio/types";

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

/** Long enough to hide an MP3 edge step, short enough not to double a wave or a chirp. */
const LOOP_FADE_SECONDS = 0.36;

/**
 * Equal-power crossfade so `AudioBufferSourceNode.loop` does not click.
 * Short one-shots are returned unchanged.
 */
export function prepareLoop(ctx: BaseAudioContext, buffer: AudioBuffer): AudioBuffer {
  const fade = Math.floor(buffer.sampleRate * LOOP_FADE_SECONDS);
  if (fade < 8 || fade * 2 >= buffer.length) return buffer;
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) =>
    seamless(buffer.getChannelData(index), fade),
  );
  return bufferFrom(ctx, channels, buffer.sampleRate);
}

/** Gain that keeps a dry recording near the level its noise-sculpting filter used to set. */
export function recordingTrim(buffer: AudioBuffer, filter: FilterSpec): number {
  const data = buffer.getChannelData(0);
  const start = Math.min(Math.max(0, data.length - 1), Math.floor(data.length * 0.15));
  const count = Math.min(data.length - start, Math.floor(buffer.sampleRate * 4));
  if (count < 64) return 1;
  return sculptAttenuation(data.subarray(start, start + count), buffer.sampleRate, filter);
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
