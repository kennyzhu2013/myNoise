import type { PresetId, Scene } from "@/lib/audio/types";
import type { Prefs } from "@/lib/prefs";

export type Mix = {
  gains: Record<string, number>;
  mutes: Record<string, boolean>;
};

export function presetIdFor(scene: Scene, gains: Record<string, number>, mutes: Record<string, boolean>): PresetId | null {
  if (Object.values(mutes).some(Boolean)) return null;
  for (const preset of scene.presets) {
    const same = scene.tracks.every((track) => preset.gains[track.id] === gains[track.id]);
    if (same) return preset.id;
  }
  return null;
}

export function mixForScene(scene: Scene, prefs: Prefs): Mix & { presetId: PresetId | null } {
  const balanced = scene.presets.find((preset) => preset.id === "balanced") ?? scene.presets[0];
  const saved = prefs.mixes[scene.slug];
  const gains: Record<string, number> = {};
  const mutes: Record<string, boolean> = {};
  for (const track of scene.tracks) {
    const savedGain = saved?.gains[track.id];
    gains[track.id] = typeof savedGain === "number" ? savedGain : (balanced?.gains[track.id] ?? 40);
    mutes[track.id] = Boolean(saved?.mutes[track.id]);
  }
  return { gains, mutes, presetId: presetIdFor(scene, gains, mutes) };
}

export function balancedGain(scene: Scene, id: string) {
  const preset = scene.presets.find((item) => item.id === "balanced");
  return preset?.gains[id] ?? 40;
}
