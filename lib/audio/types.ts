export type NoiseColor = "white" | "pink" | "brown";

export type FilterSpec = {
  type: BiquadFilterType;
  freq: number;
  q: number;
};

export type GainShape =
  | { kind: "steady" }
  | { kind: "lfo"; rate: number; depth: number }
  | { kind: "gust"; min: number; max: number; smoothness: number; duration: number }
  | { kind: "burble"; min: number; max: number; smoothness: number; duration: number }
  | {
      kind: "waves";
      period: number;
      attack: number;
      hold: number;
      decay: number;
      floor: number;
      offset: number;
    };

export type BedTrack = {
  type: "bed";
  id: string;
  name: string;
  hint: string;
  /** Linear trim at slider 100, before the perceptual curve. */
  level: number;
  noise: NoiseColor;
  filter: FilterSpec;
  /** Extra high-pass in front of the main filter, in hertz. */
  highpass?: number;
  filterLfo?: { rate: number; depth: number };
  filterLfo2?: { rate: number; depth: number };
  /** Slow random walk of the filter frequency. */
  wander?: { min: number; max: number; interval: number };
  gain: GainShape;
  pan?: number;
  panLfo?: { rate: number; depth: number };
  stereo?: boolean;
  delay?: { time: number; feedback: number; wet: number };
};

export type ParticleVariant =
  | "drop"
  | "splash"
  | "crackle"
  | "pop"
  | "thunder"
  | "chirp"
  | "bubble"
  | "frog"
  | "gull"
  | "drip"
  | "thump";

export type ParticleTrack = {
  type: "particles";
  id: string;
  name: string;
  hint: string;
  level: number;
  variant: ParticleVariant;
  /** Average events per second. */
  rate: number;
  /** 0 = metronomic, 1 = fully irregular. */
  jitter: number;
  /** 0–1 brightness, pitch, or distance depending on the variant. */
  tone: number;
  /** 0–1 stereo spread. */
  spread: number;
  /** Chance that one event is followed by a short cluster. */
  cluster?: number;
};

export type CricketTrack = {
  type: "crickets";
  id: string;
  name: string;
  hint: string;
  level: number;
  style: "cricket" | "katydid";
  voices: number;
  baseFreq: number;
  chirpHz: number;
  phrase: number;
  gap: number;
  spread: number;
};

export type Track = BedTrack | ParticleTrack | CricketTrack;

export type PresetId = "soft" | "balanced" | "intense";

export type Preset = {
  id: PresetId;
  name: string;
  /** Slider positions, 0–100, keyed by track id. */
  gains: Record<string, number>;
};

export type UseCaseId = "focus" | "calm" | "sleep" | "noise";

export type Scene = {
  slug: string;
  title: string;
  english: string;
  summary: string;
  description: string;
  useCases: UseCaseId[];
  accent: string;
  accentSoft: string;
  warnDynamic?: boolean;
  tracks: Track[];
  presets: Preset[];
};

export type MixState = {
  master: number;
  muted: boolean;
  tracks: { id: string; gain: number; muted: boolean }[];
};
