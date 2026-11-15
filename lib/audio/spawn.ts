import type { Palette } from "@/lib/audio/buffers";
import type { ParticleVariant } from "@/lib/audio/types";

type Source = AudioBufferSourceNode | OscillatorNode;

export type VoiceKit = {
  ctx: AudioContext;
  dest: AudioNode;
  palette: Palette;
  when: number;
  tone: number;
  spread: number;
  keep: (node: Source, cleanup?: () => void) => void;
};

function release(nodes: AudioNode[]) {
  for (const node of nodes) {
    try {
      node.disconnect();
    } catch {
      /* already disconnected */
    }
  }
}

function panValue(spread: number) {
  if (spread <= 0) return 0;
  return (Math.random() * 2 - 1) * Math.min(1, spread);
}

function envGain(ctx: AudioContext, when: number, peak: number, attack: number, duration: number) {
  const gain = ctx.createGain();
  const safePeak = Math.max(0.0002, peak);
  const safeAttack = Math.max(0.004, Math.min(attack, duration * 0.4));
  const end = when + Math.max(duration, safeAttack + 0.02);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(safePeak, when + safeAttack);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  return { gain, end };
}

function burstSource(ctx: AudioContext, buffer: AudioBuffer, when: number, rate: number, duration: number) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = Math.max(0.25, rate);
  src.start(when);
  src.stop(when + duration);
  return src;
}

function loopSlice(ctx: AudioContext, buffer: AudioBuffer, when: number, duration: number) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const offset = Math.random() * Math.max(0.01, buffer.duration * 0.9);
  src.start(when, offset);
  src.stop(when + duration);
  return src;
}

function place(ctx: AudioContext, spread: number) {
  const panner = ctx.createStereoPanner();
  panner.pan.value = panValue(spread);
  return panner;
}

export function spawnParticle(variant: ParticleVariant, kit: VoiceKit) {
  switch (variant) {
    case "drop":
      spawnDrop(kit, false);
      break;
    case "splash":
      spawnSplash(kit);
      break;
    case "crackle":
      spawnCrackle(kit, false);
      break;
    case "pop":
      spawnCrackle(kit, true);
      break;
    case "thunder":
      spawnThunder(kit);
      break;
    case "chirp":
      spawnChirp(kit);
      break;
    case "bubble":
      spawnBubble(kit);
      break;
    case "frog":
      spawnFrog(kit);
      break;
    case "gull":
      spawnGull(kit);
      break;
    case "drip":
      spawnDrop(kit, true);
      break;
    case "thump":
      spawnThump(kit, 0.34);
      break;
    default:
      break;
  }
}

function spawnDrop(kit: VoiceKit, tonal: boolean) {
  const { ctx, dest, palette, when, tone, spread } = kit;
  const panner = place(ctx, spread);
  if (tonal) {
    const duration = 0.09 + Math.random() * 0.04;
    const freq = 1100 + tone * 1600 + Math.random() * 280;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, when);
    osc.frequency.exponentialRampToValueAtTime(Math.max(320, freq * 0.52), when + duration);
    const { gain, end } = envGain(ctx, when, 0.09 + Math.random() * 0.04, 0.006, duration);
    const tick = burstSource(ctx, palette.tick, when, 1.1 + Math.random() * 0.4, 0.04);
    const tickGain = ctx.createGain();
    tickGain.gain.value = 0.18;
    osc.connect(gain);
    gain.connect(panner);
    tick.connect(tickGain);
    tickGain.connect(panner);
    panner.connect(dest);
    osc.start(when);
    osc.stop(end);
    kit.keep(osc, () => release([osc, gain, tick, tickGain, panner]));
    kit.keep(tick);
    return;
  }
  const rate = 0.78 + tone * 0.55 + Math.random() * 0.28;
  const buffer = palette.drop;
  const duration = buffer.duration / rate + 0.02;
  const src = burstSource(ctx, buffer, when, rate, duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  const freq = 780 + tone * 2600 + Math.random() * 420;
  filter.frequency.setValueAtTime(freq * 1.12, when);
  filter.frequency.exponentialRampToValueAtTime(Math.max(220, freq * 0.7), when + 0.08);
  filter.Q.value = 0.85 + Math.random() * 0.5;
  const peak = 0.16 + Math.random() * 0.38;
  const { gain, end } = envGain(ctx, when, peak, 0.005, Math.min(0.12, duration));
  src.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(dest);
  kit.keep(src, () => release([src, filter, gain, panner]));
  void end;
}

function spawnSplash(kit: VoiceKit) {
  const { ctx, dest, palette, when, tone, spread } = kit;
  const rate = 0.85 + Math.random() * 0.35;
  const duration = palette.splash.duration / rate + 0.03;
  const src = burstSource(ctx, palette.splash, when, rate, duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 500 + tone * 1400 + Math.random() * 300;
  filter.Q.value = 0.55;
  const { gain } = envGain(ctx, when, 0.18 + Math.random() * 0.22, 0.012, 0.2);
  const panner = place(ctx, spread);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(dest);
  kit.keep(src, () => release([src, filter, gain, panner]));
}

function spawnCrackle(kit: VoiceKit, big: boolean) {
  const { ctx, dest, palette, when, tone, spread } = kit;
  const rate = 0.7 + Math.random() * (big ? 0.6 : 1.5);
  const duration = palette.crack.duration / rate + 0.03;
  const src = burstSource(ctx, palette.crack, when, rate, duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = (big ? 900 : 1400) + tone * 2800 + Math.random() * 800;
  filter.Q.value = big ? 0.6 : 0.8;
  const loud = big ? 0.55 : 0.06 + Math.pow(Math.random(), 1.6) * 0.42;
  const { gain } = envGain(ctx, when, loud, 0.003, big ? 0.09 : 0.045);
  const panner = place(ctx, spread * 0.8);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(dest);
  const nodes: AudioNode[] = [src, filter, gain, panner];
  if (big || Math.random() < 0.18) spawnThump(kit, big ? 0.42 : 0.16);
  kit.keep(src, () => release(nodes));
}

function spawnThump(kit: VoiceKit, peak: number) {
  const { ctx, dest, palette, when, spread } = kit;
  const duration = 0.16 + Math.random() * 0.08;
  const src = loopSlice(ctx, palette.brownMono, when, duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(180 + Math.random() * 40, when);
  filter.frequency.exponentialRampToValueAtTime(70, when + duration);
  filter.Q.value = 0.7;
  const { gain } = envGain(ctx, when, peak, 0.008, duration);
  const panner = place(ctx, spread * 0.25);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  panner.connect(dest);
  kit.keep(src, () => release([src, filter, gain, panner]));
}

function spawnThunder(kit: VoiceKit) {
  const { ctx, dest, palette, when, tone, spread } = kit;
  const near = tone > 0.5;
  const duration = near ? 1.5 + Math.random() * 1.4 : 3 + Math.random() * 2.2;
  const src = loopSlice(ctx, palette.brownMono, when, duration + 0.05);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  const startFreq = near ? 170 + Math.random() * 80 : 80 + Math.random() * 40;
  filter.frequency.setValueAtTime(startFreq, when);
  filter.frequency.exponentialRampToValueAtTime(near ? 58 : 38, when + duration);
  filter.Q.value = 0.65;
  const { gain } = envGain(ctx, when, near ? 0.52 : 0.32, near ? 0.05 : 0.32 + Math.random() * 0.28, duration);
  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(near ? 64 : 46, when);
  body.frequency.exponentialRampToValueAtTime(30, when + duration * 0.85);
  const { gain: bodyGain } = envGain(ctx, when, near ? 0.2 : 0.11, near ? 0.06 : 0.4, duration);
  const panner = place(ctx, spread * 0.3);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(panner);
  body.connect(bodyGain);
  bodyGain.connect(panner);
  panner.connect(dest);
  body.start(when);
  body.stop(when + duration);
  const nodes: AudioNode[] = [src, filter, gain, body, bodyGain, panner];
  if (near || Math.random() < 0.4) {
    const crack = burstSource(ctx, palette.tick, when, near ? 0.85 : 0.6, 0.12);
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = near ? 700 : 500;
    const { gain: crackGain } = envGain(ctx, when, near ? 0.42 : 0.14, 0.004, 0.1);
    crack.connect(highpass);
    highpass.connect(crackGain);
    crackGain.connect(panner);
    nodes.push(crack, highpass, crackGain);
    kit.keep(crack);
  }
  kit.keep(src, () => release(nodes));
  kit.keep(body);
}

function spawnChirp(kit: VoiceKit) {
  const { ctx, dest, when, tone, spread } = kit;
  const duration = 0.07 + (1 - tone) * 0.2 + Math.random() * 0.06;
  const f0 = Math.max(360, 520 + tone * 3100 + Math.random() * 220);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(f0, when);
  const steps = 2 + Math.floor(Math.random() * 3);
  let freq = f0;
  for (let i = 1; i <= steps; i++) {
    freq = Math.max(280, Math.min(6800, freq * (0.78 + Math.random() * 0.42)));
    osc.frequency.exponentialRampToValueAtTime(freq, when + (duration * i) / steps);
  }
  const { gain, end } = envGain(ctx, when, 0.07 + tone * 0.06, 0.012, duration);
  const panner = place(ctx, spread);
  const nodes: AudioNode[] = [osc, gain, panner];
  osc.connect(gain);
  if (tone > 0.55) {
    const overtone = ctx.createOscillator();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(f0 * 1.5, when);
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.value = 0.22;
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    overtone.start(when);
    overtone.stop(end);
    nodes.push(overtone, overtoneGain);
    kit.keep(overtone);
  }
  gain.connect(panner);
  panner.connect(dest);
  osc.start(when);
  osc.stop(end);
  kit.keep(osc, () => release(nodes));
}

function spawnBubble(kit: VoiceKit) {
  const { ctx, dest, when, tone, spread } = kit;
  const duration = 0.07 + Math.random() * 0.1;
  const freq = 320 + tone * 560 + Math.random() * 260;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, when);
  osc.frequency.exponentialRampToValueAtTime(Math.max(90, freq * 0.32), when + duration);
  const { gain, end } = envGain(ctx, when, 0.08 + Math.random() * 0.05, 0.004, duration);
  const panner = place(ctx, spread);
  osc.connect(gain);
  gain.connect(panner);
  panner.connect(dest);
  osc.start(when);
  osc.stop(end);
  kit.keep(osc, () => release([osc, gain, panner]));
}

function spawnFrog(kit: VoiceKit) {
  const { ctx, dest, palette, when, tone, spread } = kit;
  const pulses = 2 + Math.floor(Math.random() * 3);
  const panner = place(ctx, spread * 0.7);
  panner.connect(dest);
  let cursor = when;
  const nodes: AudioNode[] = [panner];
  let primary: AudioBufferSourceNode | null = null;
  for (let i = 0; i < pulses; i++) {
    const duration = 0.05 + Math.random() * 0.02;
    const freq = Math.max(180, 300 + tone * 180 - i * 14 + Math.random() * 20);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 1.08, cursor);
    osc.frequency.exponentialRampToValueAtTime(freq, cursor + duration);
    const { gain, end } = envGain(ctx, cursor, 0.16, 0.006, duration);
    const noise = burstSource(ctx, palette.drop, cursor, 0.55, duration + 0.02);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq * 1.3;
    filter.Q.value = 2.2;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.35;
    osc.connect(gain);
    gain.connect(panner);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(panner);
    osc.start(cursor);
    osc.stop(end);
    nodes.push(osc, gain, noise, filter, noiseGain);
    kit.keep(osc);
    if (!primary) primary = noise;
    else kit.keep(noise);
    cursor += duration + 0.03 + Math.random() * 0.02;
  }
  if (primary) kit.keep(primary, () => release(nodes));
}

function spawnGull(kit: VoiceKit) {
  const { ctx, dest, when, spread } = kit;
  const duration = 0.5 + Math.random() * 0.35;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1480, when);
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const p = i / steps;
    const base = 1480 * Math.pow(0.64, p);
    const wobble = 1 + 0.035 * Math.sin(i * 1.6);
    osc.frequency.exponentialRampToValueAtTime(Math.max(420, base * wobble), when + duration * p);
  }
  const { gain, end } = envGain(ctx, when, 0.16, 0.08, duration);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2400;
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.16;
  const wet = ctx.createGain();
  wet.gain.value = 0.28;
  const panner = place(ctx, Math.min(0.45, spread));
  osc.connect(gain);
  gain.connect(filter);
  filter.connect(panner);
  filter.connect(delay);
  delay.connect(wet);
  wet.connect(panner);
  panner.connect(dest);
  osc.start(when);
  osc.stop(end);
  kit.keep(osc, () => release([osc, gain, filter, delay, wet, panner]));
}
