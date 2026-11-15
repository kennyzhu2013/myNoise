/** Map a 0–100 fader to amplitude. The curve keeps the lower half usable. */
export function sliderToGain(slider: number): number {
  const v = Math.min(100, Math.max(0, slider)) / 100;
  if (v <= 0.001) return 0;
  return Math.pow(v, 1.65);
}

export function glide(param: AudioParam, value: number, ctx: BaseAudioContext, seconds = 0.03) {
  param.setTargetAtTime(Math.max(0, value), ctx.currentTime, Math.max(0.01, seconds));
}
