import type { Scene } from "@/lib/audio/types";
import type { Mix } from "@/lib/mix";

/**
 * Shareable mix query on a scene player URL.
 *
 * - m: fader levels 0–100, comma-separated, in scene track order
 * - v: master volume 0–100
 * - u: optional mute bitmask (bit i mutes track i); omitted when none are muted
 * - s=1: master mute; omitted when the master is audible
 *
 * Other query keys are left alone. A bad `m` drops the layer mix; a bad `v` or `u` is skipped.
 */
export type SharedMix = {
  mix: Mix | null;
  master: number | null;
  masterMuted: boolean | null;
};

const LEVEL = /^(?:100|[1-9]?\d)$/;

export function encodeShareParams(scene: Scene, mix: Mix, master: number, masterMuted: boolean): URLSearchParams {
  const params = new URLSearchParams();
  params.set(
    "m",
    scene.tracks.map((track) => String(clampLevel(mix.gains[track.id] ?? 0))).join(","),
  );
  params.set("v", String(clampLevel(master)));
  let mask = 0;
  scene.tracks.forEach((track, index) => {
    if (mix.mutes[track.id]) mask |= 1 << index;
  });
  if (mask > 0) params.set("u", String(mask));
  if (masterMuted) params.set("s", "1");
  return params;
}

export function parseShareSearch(scene: Scene, search: string): SharedMix | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (!params.has("m") && !params.has("v") && !params.has("u") && !params.has("s")) return null;

  let mix: Mix | null = null;
  const rawLevels = params.get("m");
  if (rawLevels != null) {
    const parts = rawLevels.split(",");
    if (parts.length === scene.tracks.length && parts.every((part) => LEVEL.test(part))) {
      const gains: Record<string, number> = {};
      const mutes: Record<string, boolean> = {};
      const mask = readMuteMask(params.get("u"), scene.tracks.length);
      scene.tracks.forEach((track, index) => {
        gains[track.id] = Number(parts[index]);
        mutes[track.id] = mask != null && (mask & (1 << index)) !== 0;
      });
      mix = { gains, mutes };
    }
  }

  const rawMaster = params.get("v");
  const master = rawMaster != null && LEVEL.test(rawMaster) ? Number(rawMaster) : null;
  const rawSilence = params.get("s");
  const masterMuted = rawSilence === "1" ? true : rawSilence === "0" || mix != null || master != null ? false : null;

  if (mix == null && master == null && masterMuted == null) return null;
  return { mix, master, masterMuted };
}

export function shareUrl(scene: Scene, mix: Mix, master: number, masterMuted: boolean): string {
  const url = new URL(window.location.href);
  applyShareParams(url.searchParams, scene, mix, master, masterMuted);
  const query = toReadableQuery(url.searchParams);
  url.search = query;
  return url.toString();
}

export function replaceShareUrl(scene: Scene, mix: Mix, master: number, masterMuted: boolean) {
  const params = new URLSearchParams(window.location.search);
  applyShareParams(params, scene, mix, master, masterMuted);
  const query = toReadableQuery(params);
  const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;
  window.history.replaceState(window.history.state, "", next);
}

function applyShareParams(params: URLSearchParams, scene: Scene, mix: Mix, master: number, masterMuted: boolean) {
  const encoded = encodeShareParams(scene, mix, master, masterMuted);
  for (const key of ["m", "v", "u", "s"]) {
    const value = encoded.get(key);
    if (value == null) params.delete(key);
    else params.set(key, value);
  }
}

function readMuteMask(raw: string | null, count: number): number | null {
  if (raw == null || raw === "") return 0;
  if (!/^\d+$/.test(raw)) return null;
  const mask = Number(raw);
  const max = 2 ** count - 1;
  if (!Number.isSafeInteger(mask) || mask < 0 || mask > max) return null;
  return mask;
}

function toReadableQuery(params: URLSearchParams) {
  return params.toString().replace(/%2C/gi, ",");
}

function clampLevel(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
