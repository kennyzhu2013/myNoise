export type SavedMix = {
  gains: Record<string, number>;
  mutes: Record<string, boolean>;
};

export type Prefs = {
  master: number;
  muted: boolean;
  mixes: Record<string, SavedMix>;
};

export const PREFS_KEY = "shengjing.v1";

export const DEFAULT_PREFS: Prefs = {
  master: 68,
  muted: false,
  mixes: {},
};

const listeners = new Set<() => void>();
let cached: string | null = null;

function readRaw(): string {
  if (typeof window === "undefined") return "";
  if (cached == null) cached = window.localStorage.getItem(PREFS_KEY) ?? "";
  return cached;
}

export function subscribePrefs(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== PREFS_KEY) return;
    cached = event.newValue ?? "";
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getPrefsSnapshot() {
  return readRaw();
}

export function getPrefsServerSnapshot() {
  return "";
}

function emit() {
  for (const listener of listeners) listener();
}

export function parsePrefs(raw: string): Prefs {
  if (!raw) return DEFAULT_PREFS;
  try {
    const data = JSON.parse(raw) as Partial<Prefs>;
    const master = typeof data.master === "number" && data.master >= 0 && data.master <= 100 ? data.master : DEFAULT_PREFS.master;
    const muted = typeof data.muted === "boolean" ? data.muted : false;
    const mixes: Prefs["mixes"] = {};
    if (data.mixes && typeof data.mixes === "object") {
      for (const [slug, mix] of Object.entries(data.mixes)) {
        if (!mix || typeof mix !== "object") continue;
        const gains: Record<string, number> = {};
        const mutes: Record<string, boolean> = {};
        if (mix.gains && typeof mix.gains === "object") {
          for (const [id, value] of Object.entries(mix.gains)) {
            if (typeof value === "number" && value >= 0 && value <= 100) gains[id] = value;
          }
        }
        if (mix.mutes && typeof mix.mutes === "object") {
          for (const [id, value] of Object.entries(mix.mutes)) {
            if (value === true) mutes[id] = true;
          }
        }
        mixes[slug] = { gains, mutes };
      }
    }
    return { master, muted, mixes };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function updatePrefs(mutator: (prev: Prefs) => Prefs) {
  if (typeof window === "undefined") return;
  const next = mutator(parsePrefs(readRaw()));
  cached = JSON.stringify(next);
  window.localStorage.setItem(PREFS_KEY, cached);
  emit();
}
