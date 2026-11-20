import { bufferFrom, createPalette, noiseBuffer, type Palette } from "@/lib/audio/buffers";
import { renderControl, renderCricket, renderKatydid, renderWave } from "@/lib/audio/dsp";
import { glide, sliderToGain } from "@/lib/audio/gain";
import { spawnParticle } from "@/lib/audio/spawn";
import { callsFor, stemFor } from "@/lib/audio/stems";
import type { BedTrack, CricketTrack, GainShape, MixState, ParticleTrack, ParticleVariant, Scene, Track } from "@/lib/audio/types";

const CONTROL_RATE = 8000;

type Source = AudioBufferSourceNode | OscillatorNode;

type Fader = {
  gain: GainNode;
  level: number;
  audible: number;
};

/**
 * Realtime mixer. Scenes play seamless recorded loops on the bed and
 * cricket layers that have a licensed stem. Sparse layers with short
 * takes play those takes instead of a synthesized one-shot. Every other
 * layer stays on the synthesized noise, envelope, and one-shot graph.
 */
export class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private bus: GainNode | null = null;
  private master: GainNode | null = null;
  private palette: Palette | null = null;
  private stems = new Map<string, AudioBuffer>();
  private calls = new Map<string, AudioBuffer>();
  private live: Source[] = [];
  private timers: number[] = [];
  private faders = new Map<string, Fader>();
  private built = false;
  private builtSlug: string | null = null;
  private disposed = false;
  private masterSlider = 68;
  private masterMuted = false;
  private fade = 1;

  isBuilt() {
    return this.built;
  }

  dispose() {
    this.disposed = true;
    this.teardown();
    const ctx = this.ctx;
    this.ctx = null;
    this.bus = null;
    this.master = null;
    this.palette = null;
    if (ctx && ctx.state !== "closed") {
      void ctx.close().catch(() => undefined);
    }
  }

  async start(scene: Scene, mix: MixState) {
    if (this.disposed) return;
    const ctx = this.ensure();
    if (!this.palette) this.palette = createPalette(ctx);
    const fresh = !this.built || this.builtSlug !== scene.slug;
    if (fresh) {
      this.teardown();
      if (this.master) {
        this.master.gain.cancelScheduledValues(ctx.currentTime);
        this.master.gain.setValueAtTime(0, ctx.currentTime);
      }
      await this.loadSceneStems(scene);
      if (this.disposed) return;
      this.build(scene);
    }
    this.applyMix(mix, fresh);
    if (ctx.state !== "running") await ctx.resume();
  }

  async pause() {
    if (this.ctx && this.ctx.state === "running") await this.ctx.suspend();
  }

  applyMix(mix: MixState, fadeIn = false) {
    this.masterSlider = mix.master;
    this.masterMuted = mix.muted;
    this.pushMaster(fadeIn ? 0.14 : 0.03);
    if (!this.ctx || !this.built) return;
    for (const track of mix.tracks) {
      const fader = this.faders.get(track.id);
      if (!fader) continue;
      const value = track.muted ? 0 : sliderToGain(track.gain) * fader.level;
      fader.audible = value;
      glide(fader.gain.gain, value, this.ctx, fadeIn ? 0.12 : 0.025);
    }
  }

  setFade(amount: number) {
    this.fade = Math.min(1, Math.max(0, amount));
    if (!this.master || !this.ctx) return;
    const now = this.ctx.currentTime;
    const value = this.masterMuted ? 0 : sliderToGain(this.masterSlider) * this.fade;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(value, now);
  }

  private pushMaster(seconds: number) {
    if (!this.master || !this.ctx) return;
    const value = this.masterMuted ? 0 : sliderToGain(this.masterSlider) * this.fade;
    glide(this.master.gain, value, this.ctx, seconds);
  }

  private ensure() {
    if (this.disposed) throw new Error("音频引擎已关闭");
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) throw new Error("这个浏览器没有 Web Audio");
    const ctx = new Ctor({ latencyHint: "interactive" });
    const bus = ctx.createGain();
    bus.gain.value = 0.85;
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 20;
    highpass.Q.value = 0.7;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -8;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.22;
    const clip = makeSoftClip(ctx);
    const master = ctx.createGain();
    master.gain.value = 0;
    bus.connect(highpass);
    highpass.connect(compressor);
    compressor.connect(clip);
    clip.connect(master);
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.bus = bus;
    this.master = master;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  private async loadSceneStems(scene: Scene) {
    const beds = new Map<string, string>();
    const calls = new Map<string, string>();
    for (const track of scene.tracks) {
      const stem = stemFor(scene.slug, track.id);
      if (stem && !this.stems.has(stem.id)) beds.set(stem.id, stem.src);
      for (const call of callsFor(scene.slug, track.id)) {
        if (!this.calls.has(call.id)) calls.set(call.id, call.src);
      }
    }
    await Promise.all([this.loadBuffers(beds, this.stems), this.loadBuffers(calls, this.calls)]);
  }

  private async loadBuffers(needed: Map<string, string>, into: Map<string, AudioBuffer>) {
    const ctx = this.ctx;
    if (!ctx || needed.size === 0) return;
    await Promise.all(
      [...needed.entries()].map(async ([id, src]) => {
        try {
          const response = await fetch(src);
          if (!response.ok) return;
          const encoded = await response.arrayBuffer();
          const audio = await ctx.decodeAudioData(encoded.slice(0));
          into.set(id, audio);
        } catch {
          // This layer falls back to the synthesizer.
        }
      }),
    );
  }

  private build(scene: Scene) {
    for (const track of scene.tracks) {
      if (track.type === "particles") {
        const calls = callsFor(scene.slug, track.id)
          .map((call) => this.calls.get(call.id))
          .filter((buffer): buffer is AudioBuffer => Boolean(buffer));
        if (calls.length > 0) this.buildSampleParticles(track, calls);
        else this.buildParticles(track);
        continue;
      }
      if (track.type === "bed") this.buildBed(scene.slug, track);
      else this.buildCrickets(scene.slug, track);
    }
    this.built = true;
    this.builtSlug = scene.slug;
  }

  private buildSampleParticles(track: ParticleTrack, buffers: AudioBuffer[]) {
    const ctx = this.ctx;
    const bus = this.bus;
    if (!ctx || !bus || buffers.length === 0) return;
    const dest = this.fader(track, bus);
    let next = ctx.currentTime + initialDelay(track.variant, track.rate);
    const id = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;
      if (next < now - 0.05) next = now + 0.02;
      const horizon = now + 0.4;
      const audible = this.faders.get(track.id)?.audible ?? 0;
      while (next < horizon) {
        if (audible > 0.008) this.spawnRecordedCall(track, dest, next, buffers);
        next += gapFor(track.rate, track.jitter, track.variant);
      }
    }, 90);
    this.timers.push(id);
  }

  private spawnRecordedCall(track: ParticleTrack, dest: GainNode, when: number, buffers: AudioBuffer[]) {
    const ctx = this.ctx;
    if (!ctx) return;
    const buffer = buffers[Math.floor(Math.random() * buffers.length)];
    if (!buffer) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const rate = 0.96 + Math.random() * 0.08;
    src.playbackRate.value = rate;
    const duration = buffer.duration / rate;
    const gain = ctx.createGain();
    const peak = 0.32;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(peak, when + 0.02);
    gain.gain.setValueAtTime(peak, when + Math.max(0.05, duration - 0.06));
    gain.gain.linearRampToValueAtTime(0, when + duration);
    // Gull calls were trimmed with a gentle lowpass. Other recorded
    // one-shots (thunder, drips, frogs, fire) keep their own spectrum.
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = track.variant === "gull" ? 1900 + Math.random() * 700 : 16000;
    lowpass.Q.value = 0.7;
    const panner = ctx.createStereoPanner();
    panner.pan.value = (Math.random() * 2 - 1) * Math.min(0.7, track.spread);
    src.connect(gain);
    gain.connect(lowpass);
    lowpass.connect(panner);
    panner.connect(dest);
    src.start(when);
    src.stop(when + duration + 0.02);
    this.own(src, () => {
      try {
        src.disconnect();
        gain.disconnect();
        lowpass.disconnect();
        panner.disconnect();
      } catch {
        /* already disconnected */
      }
    });
  }

  private buildBed(slug: string, track: BedTrack) {
    const ctx = this.ctx;
    const palette = this.palette;
    const bus = this.bus;
    if (!ctx || !palette || !bus) return;
    const stem = stemFor(slug, track.id);
    const recorded = stem ? this.stems.get(stem.id) : undefined;
    const stereo = track.stereo ?? !(track.filter.type === "lowpass" && track.filter.freq <= 340);
    const src = recorded
      ? playLoop(ctx, recorded, Math.random() * recorded.duration, 0.992 + Math.random() * 0.016)
      : playLoop(ctx, noiseBuffer(palette, track.noise, stereo), Math.random() * 7, 0.985 + Math.random() * 0.03);
    this.own(src);
    const filter = ctx.createBiquadFilter();
    filter.type = track.filter.type;
    filter.frequency.value = track.filter.freq;
    filter.Q.value = track.filter.q;
    if (track.highpass) {
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = track.highpass;
      highpass.Q.value = 0.7;
      src.connect(highpass);
      highpass.connect(filter);
    } else {
      src.connect(filter);
    }
    // Filter sweeps were tuned to keep noise from sitting still. On a recording
    // they turn the layer into a wah. Tide, burble and gust curves stay, so a
    // coast bed still rises and falls with the others.
    if (!recorded && track.filterLfo) this.lfo(filter.frequency, track.filterLfo.rate, track.filterLfo.depth);
    if (!recorded && track.filterLfo2) this.lfo(filter.frequency, track.filterLfo2.rate, track.filterLfo2.depth);
    if (!recorded && track.wander) this.wander(filter.frequency, track.wander.min, track.wander.max, track.wander.interval);
    const shape = this.shapeGain(track.gain);
    filter.connect(shape);
    const panner = ctx.createStereoPanner();
    panner.pan.value = track.pan ?? 0;
    if (track.panLfo) this.lfo(panner.pan, track.panLfo.rate, track.panLfo.depth);
    if (track.delay) {
      const wetDry = this.delaySplit(shape, track.delay);
      wetDry.connect(panner);
    } else {
      shape.connect(panner);
    }
    panner.connect(this.fader(track, bus));
  }

  private buildParticles(track: ParticleTrack) {
    const ctx = this.ctx;
    const palette = this.palette;
    const bus = this.bus;
    if (!ctx || !palette || !bus) return;
    const dest = this.fader(track, bus);
    let next = ctx.currentTime + initialDelay(track.variant, track.rate);
    const id = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;
      if (next < now - 0.05) next = now + 0.02;
      const horizon = now + 0.4;
      const audible = this.faders.get(track.id)?.audible ?? 0;
      while (next < horizon) {
        if (audible > 0.008) {
          this.spawn(track, dest, next);
          if (track.cluster && Math.random() < track.cluster) {
            const extra = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < extra; i++) this.spawn(track, dest, next + 0.06 + Math.random() * 0.14);
          }
        }
        next += gapFor(track.rate, track.jitter, track.variant);
      }
    }, 90);
    this.timers.push(id);
  }

  private spawn(track: ParticleTrack, dest: GainNode, when: number) {
    const ctx = this.ctx;
    const palette = this.palette;
    if (!ctx || !palette) return;
    spawnParticle(track.variant, {
      ctx,
      dest,
      palette,
      when,
      tone: track.tone,
      spread: track.spread,
      keep: (node, cleanup) => this.own(node, cleanup),
    });
  }

  private buildCrickets(slug: string, track: CricketTrack) {
    const ctx = this.ctx;
    const palette = this.palette;
    const bus = this.bus;
    if (!ctx || !palette || !bus) return;
    const stem = stemFor(slug, track.id);
    const recorded = stem ? this.stems.get(stem.id) : undefined;
    if (recorded) {
      const dest = this.fader(track, bus);
      const src = playLoop(ctx, recorded, Math.random() * recorded.duration, 0.992 + Math.random() * 0.016);
      this.own(src);
      const motion = ctx.createGain();
      motion.gain.value = 1;
      // The chorus already pulses. This slow lift keeps the layer from sitting flat.
      this.lfo(motion.gain, 0.05, 0.08);
      src.connect(motion);
      motion.connect(dest);
      return;
    }
    const dest = this.fader(track, bus);
    const voices = Math.max(1, Math.round(track.voices));
    for (let i = 0; i < voices; i++) {
      const detune = 1 + (i - (voices - 1) / 2) * 0.028;
      const freq = track.baseFreq * detune;
      const chirpHz = track.chirpHz * (0.94 + i * 0.045);
      const phrase = track.phrase * (0.86 + (i % 3) * 0.1);
      const gap = track.gap * (0.82 + ((i + 1) % 3) * 0.16);
      const data =
        track.style === "katydid"
          ? renderKatydid(CONTROL_RATE, phrase, gap, i + 1)
          : renderCricket(CONTROL_RATE, chirpHz, phrase, gap);
      const phraseBuffer = bufferFrom(ctx, [data], CONTROL_RATE);
      const pan = voices === 1 ? 0 : (i / (voices - 1) - 0.5) * 2 * track.spread;
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      const sineGain = ctx.createGain();
      sineGain.gain.value = 0;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0;
      const offset = Math.random() * phraseBuffer.duration;
      const envA = playLoop(ctx, phraseBuffer, offset);
      const envB = playLoop(ctx, phraseBuffer, offset);
      this.own(envA);
      this.own(envB);
      envA.connect(sineGain.gain);
      envB.connect(noiseGain.gain);
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const trim = ctx.createGain();
      trim.gain.value = track.style === "katydid" ? 0.12 : 0.075;
      const rasp = ctx.createOscillator();
      rasp.type = "sine";
      rasp.frequency.value = freq * 1.97;
      const raspTrim = ctx.createGain();
      raspTrim.gain.value = 0.028;
      osc.connect(trim);
      rasp.connect(raspTrim);
      trim.connect(sineGain);
      raspTrim.connect(sineGain);
      const noise = playLoop(ctx, noiseBuffer(palette, "white", false), Math.random() * 5, 1);
      this.own(noise);
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = freq;
      band.Q.value = track.style === "katydid" ? 8 : 14;
      const noiseTrim = ctx.createGain();
      noiseTrim.gain.value = 0.2;
      noise.connect(band);
      band.connect(noiseTrim);
      noiseTrim.connect(noiseGain);
      const voice = ctx.createGain();
      voice.gain.value = 0.9;
      this.lfo(voice.gain, 0.05 + i * 0.02, 0.08);
      sineGain.connect(voice);
      noiseGain.connect(voice);
      voice.connect(panner);
      panner.connect(dest);
      osc.start();
      rasp.start();
      this.own(osc);
      this.own(rasp);
    }
  }

  private fader(track: Track, bus: GainNode) {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(bus);
    this.faders.set(track.id, { gain, level: track.level, audible: 0 });
    return gain;
  }

  private shapeGain(shape: GainShape) {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    if (shape.kind === "steady") {
      gain.gain.value = 1;
      return gain;
    }
    if (shape.kind === "lfo") {
      gain.gain.value = 1;
      this.lfo(gain.gain, shape.rate, Math.min(0.85, shape.depth));
      return gain;
    }
    gain.gain.value = 0;
    if (shape.kind === "waves") {
      const frames = Math.max(2, Math.floor(CONTROL_RATE * shape.period));
      const data = renderWave(frames, shape.attack, shape.hold, shape.decay, shape.floor);
      const buffer = bufferFrom(ctx, [data], CONTROL_RATE);
      const src = playLoop(ctx, buffer, shape.offset);
      src.connect(gain.gain);
      this.own(src);
      return gain;
    }
    const frames = Math.max(2, Math.floor(CONTROL_RATE * shape.duration));
    const data = renderControl(frames, shape.min, shape.max, shape.smoothness, CONTROL_RATE);
    const buffer = bufferFrom(ctx, [data], CONTROL_RATE);
    const src = playLoop(ctx, buffer, Math.random() * buffer.duration);
    src.connect(gain.gain);
    this.own(src);
    return gain;
  }

  private delaySplit(input: AudioNode, spec: { time: number; feedback: number; wet: number }) {
    const ctx = this.ctx!;
    const mix = ctx.createGain();
    const dry = ctx.createGain();
    dry.gain.value = 1 - Math.min(0.6, spec.wet) * 0.45;
    const wet = ctx.createGain();
    wet.gain.value = spec.wet;
    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = spec.time;
    const feedback = ctx.createGain();
    feedback.gain.value = Math.min(0.4, spec.feedback);
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 1400;
    input.connect(dry);
    input.connect(delay);
    delay.connect(damp);
    damp.connect(feedback);
    feedback.connect(delay);
    damp.connect(wet);
    dry.connect(mix);
    wet.connect(mix);
    return mix;
  }

  private lfo(param: AudioParam, rate: number, depth: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.value = rate;
    const gain = ctx.createGain();
    gain.gain.value = depth;
    osc.connect(gain);
    gain.connect(param);
    osc.start();
    this.own(osc);
  }

  private wander(param: AudioParam, min: number, max: number, interval: number) {
    const id = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== "running") return;
      const value = min * Math.pow(max / Math.max(1, min), Math.random());
      param.setTargetAtTime(value, this.ctx.currentTime, Math.max(0.2, interval * 0.4));
    }, Math.max(400, interval * 1000));
    this.timers.push(id);
  }

  private own(node: Source, cleanup?: () => void) {
    this.live.push(node);
    if (!cleanup) return;
    node.onended = () => {
      const index = this.live.indexOf(node);
      if (index >= 0) this.live.splice(index, 1);
      cleanup();
    };
  }

  private teardown() {
    for (const id of this.timers) window.clearInterval(id);
    this.timers = [];
    const nodes = this.live.splice(0, this.live.length);
    const now = this.ctx?.currentTime ?? 0;
    for (const node of nodes) {
      node.onended = null;
      try {
        node.stop(now);
      } catch {
        /* already stopped */
      }
      try {
        node.disconnect();
      } catch {
        /* already disconnected */
      }
    }
    for (const fader of this.faders.values()) {
      try {
        fader.gain.disconnect();
      } catch {
        /* already disconnected */
      }
    }
    this.faders.clear();
    this.built = false;
    this.builtSlug = null;
  }
}

function playLoop(ctx: AudioContext, buffer: AudioBuffer, offset: number, rate = 1) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.playbackRate.value = rate;
  const duration = Math.max(0.001, buffer.duration);
  const off = ((offset % duration) + duration) % duration;
  src.start(ctx.currentTime, off);
  return src;
}

function makeSoftClip(ctx: AudioContext) {
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.15);
  }
  const shaper = ctx.createWaveShaper();
  shaper.curve = curve;
  shaper.oversample = "2x";
  return shaper;
}

function initialDelay(variant: ParticleVariant, rate: number) {
  if (variant === "thunder") return 2.5 + Math.random() * 8;
  if (variant === "gull") return 5 + Math.random() * 12;
  return Math.random() * (1 / Math.max(0.05, rate));
}

function gapFor(rate: number, jitter: number, variant: ParticleVariant) {
  const mean = 1 / Math.max(0.02, rate);
  const roll = Math.random();
  const poisson = -Math.log(1 - Math.min(0.999, roll)) * mean;
  const mixed = mean * (1 - jitter) + poisson * jitter;
  const min = variant === "thunder" ? 5 : variant === "gull" ? 4 : variant === "pop" ? 0.35 : 0.04;
  return Math.max(min, mixed);
}
