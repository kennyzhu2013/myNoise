import assert from "node:assert/strict";
import test from "node:test";
import { sculptAttenuation, seamless } from "./dsp.ts";

test("seamless loop wraps on samples that were already neighbors", () => {
  const n = 2000;
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) samples[i] = Math.sin(i * 0.05);
  samples[0] = 0.9;
  samples[n - 1] = -0.9;
  const fade = 100;
  const out = seamless(samples, fade);
  const length = n - fade;
  assert.equal(out.length, length);
  assert.equal(out[0], samples[length]);
  assert.equal(out[length - 1], samples[length - 1]);
  const boundary = Math.abs(out[0] - out[length - 1]);
  assert.ok(boundary < 0.1, `boundary jump ${boundary}`);
  assert.ok(Math.abs(samples[0] - samples[n - 1]) > 1);
});

test("a lowpass under the tone attenuates, one above it does not", () => {
  const sampleRate = 8000;
  const frames = sampleRate;
  const samples = new Float32Array(frames);
  for (let i = 0; i < frames; i++) samples[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate);
  const open = sculptAttenuation(samples, sampleRate, { type: "lowpass", freq: 3000, q: 0.7 });
  const closed = sculptAttenuation(samples, sampleRate, { type: "lowpass", freq: 40, q: 0.7 });
  assert.ok(open > 0.85, `open ${open}`);
  assert.equal(closed, 0.35);
});

test("a bandpass on its own tone stays near unity and an off-tune one drops", () => {
  const sampleRate = 8000;
  const frames = sampleRate;
  const samples = new Float32Array(frames);
  for (let i = 0; i < frames; i++) samples[i] = Math.sin((2 * Math.PI * 1000 * i) / sampleRate);
  const on = sculptAttenuation(samples, sampleRate, { type: "bandpass", freq: 1000, q: 0.7 });
  const off = sculptAttenuation(samples, sampleRate, { type: "bandpass", freq: 200, q: 2 });
  assert.ok(on > 0.7, `on ${on}`);
  assert.ok(off < on, `off ${off} on ${on}`);
});

test("unknown filter types are left at unity", () => {
  const samples = new Float32Array(2000);
  samples.fill(0.2);
  assert.equal(sculptAttenuation(samples, 44100, { type: "peaking", freq: 1000, q: 1 }), 1);
});
