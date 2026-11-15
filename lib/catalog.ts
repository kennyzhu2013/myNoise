import type { BedTrack, CricketTrack, ParticleTrack, Preset, Scene, UseCaseId } from "@/lib/audio/types";

export type { UseCaseId };

export type SceneSummary = {
  slug: string;
  title: string;
  english: string;
  summary: string;
  useCases: UseCaseId[];
  accent: string;
  accentSoft: string;
  trackCount: number;
};

export type UseCase = {
  id: UseCaseId;
  title: string;
  english: string;
  description: string;
  href: string;
};

export const USE_CASES: UseCase[] = [
  {
    id: "focus",
    title: "专注",
    english: "Focus",
    description: "起伏少、可一直铺在背景里的纹理，适合阅读和需要长时间坐住的工作。",
    href: "/scenes/for/focus",
  },
  {
    id: "calm",
    title: "冥想放松",
    english: "Calm",
    description: "慢的潮汐、林风和溪水。没有节拍，方便把呼吸放慢。",
    href: "/scenes/for/calm",
  },
  {
    id: "sleep",
    title: "助眠",
    english: "Sleep",
    description: "偏低、偏闷的夜间声床，用来盖住走廊、马路和屋里的零碎声音。",
    href: "/scenes/for/sleep",
  },
  {
    id: "noise",
    title: "自然噪",
    english: "Natural noise",
    description: "连续的雨、瀑和风，接近一块稳定的声毯，而不是一段有情节的风景。",
    href: "/scenes/for/noise",
  },
];

const USE_CASE_IDS = new Set<string>(USE_CASES.map((item) => item.id));

export function isUseCase(value: string): value is UseCaseId {
  return USE_CASE_IDS.has(value);
}

export function getUseCase(id: UseCaseId) {
  const found = USE_CASES.find((item) => item.id === id);
  if (!found) throw new Error(`未知用途 ${id}`);
  return found;
}

function bed(track: Omit<BedTrack, "type">): BedTrack {
  return { type: "bed", ...track };
}

function particles(track: Omit<ParticleTrack, "type">): ParticleTrack {
  return { type: "particles", ...track };
}

function crickets(track: Omit<CricketTrack, "type">): CricketTrack {
  return { type: "crickets", ...track };
}

function seal(
  draft: Omit<Scene, "presets"> & { soft: number[]; balanced: number[]; intense: number[] },
): Scene {
  const names = [
    ["soft", "轻柔", draft.soft],
    ["balanced", "均衡", draft.balanced],
    ["intense", "强烈", draft.intense],
  ] as const;
  const presets: Preset[] = names.map(([id, name, values]) => {
    if (values.length !== draft.tracks.length) {
      throw new Error(`${draft.slug} 的${name}预设有 ${values.length} 个推子，声景有 ${draft.tracks.length} 层`);
    }
    return {
      id,
      name,
      gains: Object.fromEntries(draft.tracks.map((track, index) => [track.id, values[index] ?? 0])),
    };
  });
  return {
    slug: draft.slug,
    title: draft.title,
    english: draft.english,
    summary: draft.summary,
    description: draft.description,
    useCases: draft.useCases,
    accent: draft.accent,
    accentSoft: draft.accentSoft,
    warnDynamic: draft.warnDynamic,
    tracks: draft.tracks,
    presets,
  };
}

const eaveRain = seal({
  slug: "eave-rain",
  title: "檐下雨声",
  english: "Eave rain",
  summary: "细密的雨幕落在屋檐、水洼和落水管上。",
  description: "近处是屋檐的滴答，远处是一整片被压低的雨。适合铺在阅读和夜里，把房间里的零碎声音盖住。",
  useCases: ["focus", "sleep", "noise"],
  accent: "#8eb7d6",
  accentSoft: "#1a2830",
  tracks: [
    bed({
      id: "curtain",
      name: "雨幕",
      hint: "整片落下的雨，是这块声景的主体",
      level: 0.62,
      noise: "brown",
      filter: { type: "lowpass", freq: 680, q: 0.7 },
      gain: { kind: "gust", min: 0.78, max: 1, smoothness: 3.2, duration: 26 },
    }),
    bed({
      id: "threads",
      name: "雨丝",
      hint: "偏高、偏细的一层，像雨丝打在叶子上",
      level: 0.28,
      noise: "pink",
      filter: { type: "bandpass", freq: 3200, q: 0.65 },
      gain: { kind: "lfo", rate: 0.07, depth: 0.12 },
    }),
    particles({
      id: "eaves",
      name: "屋檐",
      hint: "不规则的滴答，来自屋檐边缘",
      level: 0.72,
      variant: "drop",
      rate: 3.3,
      jitter: 0.82,
      tone: 0.62,
      spread: 0.85,
      cluster: 0.22,
    }),
    particles({
      id: "close",
      name: "近处雨点",
      hint: "更少、更低的雨点，像落在窗台",
      level: 0.6,
      variant: "drop",
      rate: 1.05,
      jitter: 0.9,
      tone: 0.28,
      spread: 0.55,
    }),
    bed({
      id: "distant",
      name: "远雨",
      hint: "闷在远处的低频雨声",
      level: 0.42,
      noise: "brown",
      filter: { type: "lowpass", freq: 240, q: 0.6 },
      gain: { kind: "gust", min: 0.7, max: 1, smoothness: 4.5, duration: 32 },
      stereo: false,
    }),
    bed({
      id: "air",
      name: "湿气",
      hint: "很轻的高频空气，别开太大",
      level: 0.1,
      noise: "white",
      filter: { type: "highpass", freq: 6800, q: 0.5 },
      gain: { kind: "steady" },
    }),
    bed({
      id: "wind",
      name: "斜风",
      hint: "把雨吹斜的一阵阵风",
      level: 0.24,
      noise: "pink",
      filter: { type: "bandpass", freq: 1400, q: 0.55 },
      filterLfo: { rate: 0.05, depth: 420 },
      gain: { kind: "gust", min: 0.25, max: 1, smoothness: 2.2, duration: 24 },
    }),
    particles({
      id: "puddle",
      name: "水洼",
      hint: "偶尔溅开的水声",
      level: 0.48,
      variant: "splash",
      rate: 0.28,
      jitter: 1,
      tone: 0.42,
      spread: 0.7,
    }),
    particles({
      id: "pipe",
      name: "落水管",
      hint: "比较规律的滴水，像一根管子",
      level: 0.46,
      variant: "drop",
      rate: 0.72,
      jitter: 0.28,
      tone: 0.46,
      spread: 0.2,
    }),
  ],
  soft: [58, 22, 16, 8, 48, 14, 8, 4, 8],
  balanced: [72, 44, 58, 34, 54, 18, 28, 22, 26],
  intense: [86, 68, 82, 64, 60, 30, 56, 48, 42],
});

const coast = seal({
  slug: "coast",
  title: "海岸长潮",
  english: "Long tide",
  summary: "长周期的涌浪爬上沙滩，再慢慢退回去。",
  description: "深潮、拍岸和退浪锁在同一次潮汐里，细浪则自己走得更快。适合放空，不适合需要绝对平稳的阅读。",
  useCases: ["calm", "sleep"],
  accent: "#7eb8c4",
  accentSoft: "#163033",
  tracks: [
    bed({
      id: "deep",
      name: "深潮",
      hint: "一次长浪的身体，低而慢",
      level: 0.66,
      noise: "brown",
      filter: { type: "lowpass", freq: 260, q: 0.65 },
      gain: { kind: "waves", period: 15, attack: 0.46, hold: 0.08, decay: 0.28, floor: 0.16, offset: 0 },
      stereo: false,
    }),
    bed({
      id: "break",
      name: "拍岸",
      hint: "浪头打在沙滩上的中频",
      level: 0.4,
      noise: "pink",
      filter: { type: "bandpass", freq: 720, q: 0.7 },
      gain: { kind: "waves", period: 15, attack: 0.16, hold: 0.05, decay: 0.16, floor: 0, offset: 5.1 },
    }),
    bed({
      id: "foam",
      name: "碎沫",
      hint: "浪尖上短促的泡沫",
      level: 0.22,
      noise: "white",
      filter: { type: "bandpass", freq: 2500, q: 0.75 },
      gain: { kind: "waves", period: 15, attack: 0.08, hold: 0.04, decay: 0.1, floor: 0, offset: 6.5 },
    }),
    bed({
      id: "ripples",
      name: "细浪",
      hint: "岸边自己来回的小浪，周期更短",
      level: 0.26,
      noise: "pink",
      filter: { type: "bandpass", freq: 1250, q: 0.7 },
      gain: { kind: "waves", period: 6.4, attack: 0.34, hold: 0.06, decay: 0.26, floor: 0.08, offset: 1.2 },
    }),
    bed({
      id: "breeze",
      name: "海风",
      hint: "贴着海面的风",
      level: 0.22,
      noise: "pink",
      filter: { type: "bandpass", freq: 1600, q: 0.55 },
      filterLfo: { rate: 0.04, depth: 380 },
      gain: { kind: "gust", min: 0.35, max: 1, smoothness: 2.4, duration: 28 },
    }),
    bed({
      id: "horizon",
      name: "远海",
      hint: "地平线上几乎不变的低鸣",
      level: 0.38,
      noise: "brown",
      filter: { type: "lowpass", freq: 140, q: 0.55 },
      gain: { kind: "lfo", rate: 0.03, depth: 0.18 },
      stereo: false,
    }),
    bed({
      id: "wash",
      name: "退浪",
      hint: "海水从沙子里退走",
      level: 0.32,
      noise: "brown",
      filter: { type: "bandpass", freq: 420, q: 0.8 },
      gain: { kind: "waves", period: 15, attack: 0.1, hold: 0.04, decay: 0.32, floor: 0, offset: 8.8 },
    }),
    particles({
      id: "rocks",
      name: "岸礁",
      hint: "偶尔打在石头上的溅水",
      level: 0.4,
      variant: "splash",
      rate: 0.14,
      jitter: 1,
      tone: 0.36,
      spread: 0.65,
    }),
    particles({
      id: "gulls",
      name: "远鸥",
      hint: "偶尔远远叫一声，取自很短的录音",
      level: 0.85,
      variant: "gull",
      rate: 0.028,
      jitter: 0.85,
      tone: 0.4,
      spread: 0.55,
    }),
  ],
  soft: [66, 26, 8, 24, 12, 42, 18, 0, 0],
  balanced: [72, 50, 28, 40, 30, 48, 36, 16, 18],
  intense: [84, 72, 50, 60, 52, 54, 58, 32, 30],
});

const forest = seal({
  slug: "forest",
  title: "林间清晨",
  english: "Morning woods",
  summary: "林冠里的风，加上零星鸟鸣和露水。",
  description: "风是连续的，鸟和露水是点状的。把鸟鸣拉低，它就会变成一块安静的林中底噪。",
  useCases: ["focus", "calm"],
  accent: "#8eaa78",
  accentSoft: "#1c2618",
  tracks: [
    bed({
      id: "canopy",
      name: "林冠",
      hint: "高处叶子一起响",
      level: 0.36,
      noise: "pink",
      filter: { type: "bandpass", freq: 1500, q: 0.7 },
      filterLfo: { rate: 0.041, depth: 520 },
      filterLfo2: { rate: 0.017, depth: 180 },
      gain: { kind: "gust", min: 0.45, max: 1, smoothness: 2.1, duration: 27 },
    }),
    bed({
      id: "leaves",
      name: "枝叶",
      hint: "更干、更高的沙沙声",
      level: 0.2,
      noise: "pink",
      filter: { type: "bandpass", freq: 3400, q: 0.85 },
      filterLfo: { rate: 0.09, depth: 700 },
      gain: { kind: "gust", min: 0.3, max: 1, smoothness: 1.3, duration: 18 },
    }),
    bed({
      id: "under",
      name: "林下",
      hint: "树干之间偏低的空气",
      level: 0.34,
      noise: "brown",
      filter: { type: "lowpass", freq: 380, q: 0.65 },
      gain: { kind: "gust", min: 0.62, max: 1, smoothness: 3.4, duration: 30 },
    }),
    bed({
      id: "gust",
      name: "阵风",
      hint: "偶尔穿过林子的一阵",
      level: 0.32,
      noise: "pink",
      filter: { type: "bandpass", freq: 900, q: 0.5 },
      gain: { kind: "gust", min: 0.05, max: 1, smoothness: 2.6, duration: 34 },
    }),
    particles({
      id: "tits",
      name: "山雀",
      hint: "短、高、会连叫两下的小鸟",
      level: 0.72,
      variant: "chirp",
      rate: 0.42,
      jitter: 0.78,
      tone: 0.84,
      spread: 0.8,
      cluster: 0.48,
    }),
    particles({
      id: "dove",
      name: "斑鸠",
      hint: "更低、更慢的一声",
      level: 0.62,
      variant: "chirp",
      rate: 0.11,
      jitter: 0.7,
      tone: 0.16,
      spread: 0.45,
    }),
    particles({
      id: "dew",
      name: "露水",
      hint: "叶子上落下的水滴",
      level: 0.4,
      variant: "drip",
      rate: 0.22,
      jitter: 0.9,
      tone: 0.58,
      spread: 0.7,
    }),
    particles({
      id: "far-birds",
      name: "远鸟",
      hint: "退到林子深处的鸟",
      level: 0.4,
      variant: "chirp",
      rate: 0.16,
      jitter: 0.86,
      tone: 0.48,
      spread: 0.35,
      cluster: 0.3,
    }),
    bed({
      id: "floor",
      name: "地面",
      hint: "脚下很轻的一层",
      level: 0.2,
      noise: "brown",
      filter: { type: "bandpass", freq: 220, q: 0.7 },
      gain: { kind: "steady" },
      stereo: false,
    }),
  ],
  soft: [42, 16, 38, 14, 12, 8, 6, 4, 24],
  balanced: [60, 36, 46, 34, 42, 28, 22, 18, 26],
  intense: [74, 58, 52, 64, 68, 44, 36, 32, 30],
});

const waterfall = seal({
  slug: "waterfall",
  title: "峡谷飞瀑",
  english: "Canyon fall",
  summary: "近乎稳定的宽带水声，中间夹着溅沫。",
  description: "主瀑几乎不歇。潭面带一点峡谷回声，侧瀑偏在一边。用来盖住环境噪音很有效。",
  useCases: ["focus", "noise"],
  accent: "#8fd0cf",
  accentSoft: "#16302f",
  tracks: [
    bed({
      id: "roar",
      name: "主瀑",
      hint: "瀑布主体的轰鸣",
      level: 0.68,
      noise: "brown",
      filter: { type: "lowpass", freq: 340, q: 0.6 },
      gain: { kind: "lfo", rate: 0.05, depth: 0.08 },
    }),
    bed({
      id: "sheet",
      name: "水幕",
      hint: "水帘中段，比主瀑亮一点",
      level: 0.38,
      noise: "pink",
      filter: { type: "bandpass", freq: 860, q: 0.6 },
      gain: { kind: "gust", min: 0.8, max: 1, smoothness: 2.8, duration: 20 },
    }),
    bed({
      id: "mist",
      name: "水雾",
      hint: "飞溅出去的高频雾气",
      level: 0.16,
      noise: "pink",
      filter: { type: "highpass", freq: 4600, q: 0.55 },
      gain: { kind: "lfo", rate: 0.11, depth: 0.15 },
    }),
    bed({
      id: "pool",
      name: "潭面",
      hint: "落到潭里之后的低频，带一点岩壁回声",
      level: 0.36,
      noise: "brown",
      filter: { type: "lowpass", freq: 170, q: 0.6 },
      gain: { kind: "steady" },
      delay: { time: 0.19, feedback: 0.28, wet: 0.34 },
      stereo: false,
    }),
    particles({
      id: "spray",
      name: "溅珠",
      hint: "连续的水珠打在石头上",
      level: 0.42,
      variant: "splash",
      rate: 2.5,
      jitter: 0.75,
      tone: 0.58,
      spread: 0.8,
    }),
    bed({
      id: "side",
      name: "侧瀑",
      hint: "偏在右侧的第二条水帘",
      level: 0.26,
      noise: "pink",
      filter: { type: "bandpass", freq: 1480, q: 0.7 },
      pan: 0.42,
      gain: { kind: "lfo", rate: 0.06, depth: 0.1 },
    }),
    bed({
      id: "gap",
      name: "岩风",
      hint: "从岩缝里吹过来的风",
      level: 0.14,
      noise: "pink",
      filter: { type: "bandpass", freq: 2000, q: 0.6 },
      filterLfo: { rate: 0.08, depth: 500 },
      gain: { kind: "gust", min: 0.2, max: 0.9, smoothness: 1.8, duration: 22 },
    }),
    particles({
      id: "drops",
      name: "落水",
      hint: "从岩沿滴下来的水",
      level: 0.4,
      variant: "drop",
      rate: 1.5,
      jitter: 0.7,
      tone: 0.4,
      spread: 0.6,
    }),
    bed({
      id: "sub",
      name: "深处",
      hint: "潭底的很低一层",
      level: 0.3,
      noise: "brown",
      filter: { type: "lowpass", freq: 85, q: 0.6 },
      gain: { kind: "lfo", rate: 0.04, depth: 0.12 },
      stereo: false,
    }),
  ],
  soft: [58, 26, 10, 36, 8, 14, 6, 6, 32],
  balanced: [76, 48, 24, 44, 38, 32, 16, 26, 36],
  intense: [90, 68, 42, 52, 64, 54, 30, 48, 46],
});

const thunderNight = seal({
  slug: "thunder-night",
  title: "雷雨深夜",
  english: "Thunder night",
  summary: "隔着窗子的闷雨，远处偶尔滚过一声雷。",
  description: "夜雨和隔窗是连续的。雷是合成的低频滚动，近雷会带一声短促的爆响。音量会突然抬起，建议从轻柔开始。",
  useCases: ["sleep", "noise"],
  accent: "#a0a6d4",
  accentSoft: "#222433",
  warnDynamic: true,
  tracks: [
    bed({
      id: "rain",
      name: "夜雨",
      hint: "外面正在下的雨",
      level: 0.55,
      noise: "brown",
      filter: { type: "lowpass", freq: 540, q: 0.65 },
      gain: { kind: "gust", min: 0.75, max: 1, smoothness: 3.5, duration: 28 },
    }),
    bed({
      id: "threads",
      name: "雨丝",
      hint: "夜里偏细的一层",
      level: 0.18,
      noise: "pink",
      filter: { type: "bandpass", freq: 2600, q: 0.6 },
      gain: { kind: "steady" },
    }),
    bed({
      id: "indoor",
      name: "隔窗",
      hint: "像关着窗听，闷、近、稳",
      level: 0.48,
      noise: "brown",
      filter: { type: "lowpass", freq: 220, q: 0.7 },
      gain: { kind: "steady" },
      stereo: false,
    }),
    particles({
      id: "drips",
      name: "滴水",
      hint: "窗台或屋檐上的稀疏滴答",
      level: 0.5,
      variant: "drop",
      rate: 0.75,
      jitter: 0.8,
      tone: 0.38,
      spread: 0.4,
    }),
    particles({
      id: "far",
      name: "远雷",
      hint: "很远的滚雷，长而低",
      level: 0.85,
      variant: "thunder",
      rate: 0.065,
      jitter: 0.7,
      tone: 0.18,
      spread: 0.25,
    }),
    particles({
      id: "near",
      name: "近雷",
      hint: "更近的一声，可能带爆响",
      level: 0.9,
      variant: "thunder",
      rate: 0.03,
      jitter: 0.65,
      tone: 0.78,
      spread: 0.35,
    }),
    bed({
      id: "pressure",
      name: "低压",
      hint: "雷雨前那种压着的低频",
      level: 0.36,
      noise: "brown",
      filter: { type: "lowpass", freq: 100, q: 0.55 },
      gain: { kind: "gust", min: 0.55, max: 1, smoothness: 4, duration: 30 },
      stereo: false,
    }),
    bed({
      id: "wetwind",
      name: "湿风",
      hint: "贴着墙吹过去的湿风",
      level: 0.2,
      noise: "pink",
      filter: { type: "bandpass", freq: 1000, q: 0.55 },
      gain: { kind: "gust", min: 0.2, max: 1, smoothness: 2, duration: 22 },
    }),
    bed({
      id: "burst",
      name: "雨势",
      hint: "雨忽然密起来的那一层",
      level: 0.28,
      noise: "pink",
      filter: { type: "bandpass", freq: 1800, q: 0.55 },
      gain: { kind: "gust", min: 0.15, max: 1, smoothness: 1.6, duration: 16 },
    }),
  ],
  soft: [50, 14, 58, 16, 20, 0, 42, 10, 8],
  balanced: [64, 30, 60, 32, 50, 18, 46, 24, 28],
  intense: [80, 54, 50, 48, 72, 56, 58, 42, 54],
});

const creek = seal({
  slug: "creek",
  title: "石涧溪流",
  english: "Stony creek",
  summary: "浅水绕过石头，带着气泡和滴答。",
  description: "比瀑布更近、更轻。水流的起伏是不规则的，不是一个固定的颤音。气泡是音高往下掉的短音。",
  useCases: ["calm", "focus"],
  accent: "#79c2ae",
  accentSoft: "#16302b",
  tracks: [
    bed({
      id: "main",
      name: "主流",
      hint: "溪水的主体，有不规则的起伏",
      level: 0.46,
      noise: "pink",
      filter: { type: "bandpass", freq: 680, q: 0.7 },
      gain: { kind: "burble", min: 0.48, max: 1, smoothness: 0.22, duration: 9 },
    }),
    bed({
      id: "shallows",
      name: "浅濑",
      hint: "薄水过石，更快、更亮",
      level: 0.26,
      noise: "white",
      filter: { type: "bandpass", freq: 1750, q: 0.85 },
      gain: { kind: "burble", min: 0.32, max: 1, smoothness: 0.14, duration: 7 },
    }),
    bed({
      id: "pool",
      name: "深潭",
      hint: "溪边一小潭较稳的低声",
      level: 0.34,
      noise: "brown",
      filter: { type: "lowpass", freq: 210, q: 0.65 },
      gain: { kind: "gust", min: 0.7, max: 1, smoothness: 3, duration: 24 },
      stereo: false,
    }),
    particles({
      id: "bubbles",
      name: "气泡",
      hint: "音高下滑的小气泡",
      level: 0.55,
      variant: "bubble",
      rate: 3.1,
      jitter: 0.72,
      tone: 0.55,
      spread: 0.55,
      cluster: 0.25,
    }),
    particles({
      id: "stones",
      name: "击石",
      hint: "水打在石头上",
      level: 0.36,
      variant: "splash",
      rate: 1.25,
      jitter: 0.8,
      tone: 0.42,
      spread: 0.6,
    }),
    bed({
      id: "seep",
      name: "渗流",
      hint: "从石缝里渗出来的细流",
      level: 0.18,
      noise: "pink",
      filter: { type: "bandpass", freq: 480, q: 0.8 },
      gain: { kind: "burble", min: 0.4, max: 0.9, smoothness: 0.35, duration: 11 },
    }),
    bed({
      id: "bank",
      name: "岸草",
      hint: "岸边草叶上很轻的风",
      level: 0.1,
      noise: "pink",
      filter: { type: "bandpass", freq: 2300, q: 0.7 },
      gain: { kind: "gust", min: 0.15, max: 0.8, smoothness: 1.5, duration: 20 },
    }),
    particles({
      id: "drips",
      name: "潭滴",
      hint: "滴进潭里的水",
      level: 0.38,
      variant: "drip",
      rate: 0.42,
      jitter: 0.85,
      tone: 0.5,
      spread: 0.35,
    }),
    bed({
      id: "far",
      name: "远溪",
      hint: "退到弯道后面的溪声",
      level: 0.26,
      noise: "brown",
      filter: { type: "bandpass", freq: 380, q: 0.7 },
      gain: { kind: "steady" },
    }),
  ],
  soft: [50, 20, 42, 16, 8, 22, 6, 6, 32],
  balanced: [64, 42, 48, 50, 30, 28, 14, 22, 34],
  intense: [80, 66, 52, 74, 54, 38, 24, 36, 42],
});

const wind = seal({
  slug: "wind",
  title: "旷野风声",
  english: "Open wind",
  summary: "开阔地上的长风，草叶和风口轻轻作响。",
  description: "没有雨，也没有节奏。强风会忽然起来再落下。风口是一条很窄的噪声，像从缝里钻过去。",
  useCases: ["noise", "calm"],
  accent: "#d2c2a4",
  accentSoft: "#2a261e",
  tracks: [
    bed({
      id: "field",
      name: "长风",
      hint: "旷野上一直在的风",
      level: 0.46,
      noise: "pink",
      filter: { type: "bandpass", freq: 820, q: 0.45 },
      filterLfo: { rate: 0.031, depth: 280 },
      gain: { kind: "gust", min: 0.45, max: 1, smoothness: 2.4, duration: 30 },
    }),
    bed({
      id: "grass",
      name: "草浪",
      hint: "干草被吹过",
      level: 0.24,
      noise: "white",
      filter: { type: "bandpass", freq: 2600, q: 0.7 },
      gain: { kind: "gust", min: 0.12, max: 0.95, smoothness: 1.4, duration: 18 },
    }),
    bed({
      id: "low",
      name: "空地",
      hint: "开阔处的低频",
      level: 0.4,
      noise: "brown",
      filter: { type: "lowpass", freq: 180, q: 0.6 },
      gain: { kind: "gust", min: 0.5, max: 1, smoothness: 4, duration: 36 },
      stereo: false,
    }),
    bed({
      id: "ear",
      name: "掠耳",
      hint: "从一侧掠到另一侧",
      level: 0.2,
      noise: "pink",
      filter: { type: "bandpass", freq: 1700, q: 0.6 },
      panLfo: { rate: 0.07, depth: 0.45 },
      gain: { kind: "gust", min: 0.2, max: 1, smoothness: 1.7, duration: 21 },
    }),
    bed({
      id: "far",
      name: "远处",
      hint: "地平线上更稳的一层",
      level: 0.26,
      noise: "brown",
      filter: { type: "bandpass", freq: 360, q: 0.55 },
      gain: { kind: "gust", min: 0.55, max: 1, smoothness: 3.2, duration: 26 },
    }),
    bed({
      id: "gap",
      name: "风口",
      hint: "从窄缝里钻过的风，容易偏尖",
      level: 0.12,
      noise: "white",
      filter: { type: "bandpass", freq: 860, q: 7 },
      wander: { min: 520, max: 1280, interval: 2.6 },
      gain: { kind: "gust", min: 0.05, max: 0.85, smoothness: 1.8, duration: 19 },
    }),
    bed({
      id: "dust",
      name: "细沙",
      hint: "很轻的沙尘，只在风大时露出来",
      level: 0.08,
      noise: "white",
      filter: { type: "highpass", freq: 5200, q: 0.5 },
      gain: { kind: "gust", min: 0, max: 0.7, smoothness: 1.2, duration: 15 },
    }),
    bed({
      id: "blast",
      name: "强风",
      hint: "忽然起来的一阵",
      level: 0.38,
      noise: "pink",
      filter: { type: "bandpass", freq: 640, q: 0.5 },
      gain: { kind: "gust", min: 0.04, max: 1, smoothness: 1.15, duration: 18 },
    }),
    bed({
      id: "twigs",
      name: "枯枝",
      hint: "细枝被吹动",
      level: 0.14,
      noise: "pink",
      filter: { type: "bandpass", freq: 1200, q: 1.3 },
      filterLfo: { rate: 0.13, depth: 220 },
      gain: { kind: "gust", min: 0.2, max: 0.9, smoothness: 0.8, duration: 14 },
    }),
  ],
  soft: [52, 16, 44, 8, 30, 0, 4, 10, 6],
  balanced: [66, 36, 50, 28, 34, 22, 12, 32, 18],
  intense: [82, 60, 58, 50, 44, 40, 26, 66, 34],
});

const nightInsects = seal({
  slug: "night-insects",
  title: "夏夜虫鸣",
  english: "Night insects",
  summary: "蟋蟀、纺织娘，和远处偶尔的蛙。",
  description: "这是点状的夜间节奏，不是一整片噪声。虫鸣由短脉冲调制的振荡器做成，每只的音高和停顿都不一样。",
  useCases: ["sleep", "calm"],
  accent: "#d2b56a",
  accentSoft: "#2a2416",
  tracks: [
    crickets({
      id: "crickets",
      name: "蟋蟀",
      hint: "近处的连续唧鸣",
      level: 0.34,
      style: "cricket",
      voices: 3,
      baseFreq: 4300,
      chirpHz: 42,
      phrase: 1.35,
      gap: 0.85,
      spread: 0.75,
    }),
    crickets({
      id: "other",
      name: "另一侧",
      hint: "更远、停顿更长的几只",
      level: 0.22,
      style: "cricket",
      voices: 2,
      baseFreq: 5050,
      chirpHz: 34,
      phrase: 0.7,
      gap: 1.55,
      spread: 0.9,
    }),
    crickets({
      id: "katydid",
      name: "纺织娘",
      hint: "两三下一组的金属感虫鸣",
      level: 0.28,
      style: "katydid",
      voices: 2,
      baseFreq: 5200,
      chirpHz: 12,
      phrase: 1.15,
      gap: 1.25,
      spread: 0.55,
    }),
    particles({
      id: "frogs",
      name: "蛙鸣",
      hint: "远处的短促蛙声",
      level: 0.48,
      variant: "frog",
      rate: 0.32,
      jitter: 0.8,
      tone: 0.4,
      spread: 0.6,
    }),
    bed({
      id: "night-wind",
      name: "夜风",
      hint: "草地上很轻的风",
      level: 0.12,
      noise: "pink",
      filter: { type: "bandpass", freq: 1500, q: 0.55 },
      gain: { kind: "gust", min: 0.25, max: 0.8, smoothness: 2.2, duration: 26 },
    }),
    bed({
      id: "grassbed",
      name: "草丛",
      hint: "虫鸣下面一层细的底",
      level: 0.08,
      noise: "pink",
      filter: { type: "highpass", freq: 2800, q: 0.5 },
      gain: { kind: "steady" },
    }),
    particles({
      id: "dew",
      name: "露水",
      hint: "偶尔一滴",
      level: 0.28,
      variant: "drip",
      rate: 0.08,
      jitter: 1,
      tone: 0.62,
      spread: 0.5,
    }),
    particles({
      id: "night-bird",
      name: "夜鸟",
      hint: "很稀的一声，不要开太大",
      level: 0.4,
      variant: "chirp",
      rate: 0.035,
      jitter: 0.9,
      tone: 0.36,
      spread: 0.4,
    }),
    bed({
      id: "low-night",
      name: "夜色",
      hint: "把高频托住的低频",
      level: 0.22,
      noise: "brown",
      filter: { type: "lowpass", freq: 140, q: 0.6 },
      gain: { kind: "steady" },
      stereo: false,
    }),
  ],
  soft: [34, 12, 8, 10, 16, 8, 4, 0, 30],
  balanced: [58, 32, 36, 34, 22, 14, 12, 8, 32],
  intense: [78, 56, 64, 54, 30, 22, 20, 18, 36],
});

const campfire = seal({
  slug: "campfire",
  title: "篝火夜谈",
  english: "Campfire",
  summary: "炭火的低鸣，和不规则的噼啪。",
  description: "火焰底床是慢的，爆裂是突然的。火星很碎，柴薪是偶尔的一声低响。建议先从轻柔听，再把噼啪加上去。",
  useCases: ["sleep", "calm"],
  accent: "#e09a6a",
  accentSoft: "#2c1c16",
  warnDynamic: true,
  tracks: [
    bed({
      id: "bed",
      name: "火床",
      hint: "炭火持续的低鸣",
      level: 0.46,
      noise: "brown",
      filter: { type: "bandpass", freq: 280, q: 0.8 },
      gain: { kind: "lfo", rate: 0.08, depth: 0.12 },
    }),
    particles({
      id: "crackle",
      name: "噼啪",
      hint: "小的、密的爆裂",
      level: 0.55,
      variant: "crackle",
      rate: 6.5,
      jitter: 0.92,
      tone: 0.55,
      spread: 0.55,
    }),
    bed({
      id: "coal",
      name: "木炭",
      hint: "炭块本身的中频",
      level: 0.26,
      noise: "pink",
      filter: { type: "bandpass", freq: 900, q: 0.7 },
      gain: { kind: "gust", min: 0.65, max: 1, smoothness: 1.6, duration: 16 },
    }),
    particles({
      id: "pops",
      name: "爆裂",
      hint: "偶尔很响的一声，会带一点低响",
      level: 0.62,
      variant: "pop",
      rate: 0.42,
      jitter: 0.9,
      tone: 0.35,
      spread: 0.4,
    }),
    particles({
      id: "sparks",
      name: "火星",
      hint: "又短又碎的高音",
      level: 0.22,
      variant: "crackle",
      rate: 8,
      jitter: 0.95,
      tone: 0.9,
      spread: 0.7,
    }),
    bed({
      id: "heat",
      name: "热气",
      hint: "火上面很轻的空气",
      level: 0.1,
      noise: "pink",
      filter: { type: "highpass", freq: 2400, q: 0.5 },
      gain: { kind: "gust", min: 0.3, max: 0.9, smoothness: 1.4, duration: 14 },
    }),
    bed({
      id: "night",
      name: "夜气",
      hint: "火光照不到的地方",
      level: 0.24,
      noise: "brown",
      filter: { type: "lowpass", freq: 160, q: 0.6 },
      gain: { kind: "steady" },
      stereo: false,
    }),
    particles({
      id: "shift",
      name: "柴薪",
      hint: "木头塌一下的低响",
      level: 0.5,
      variant: "thump",
      rate: 0.11,
      jitter: 0.85,
      tone: 0.3,
      spread: 0.2,
    }),
    bed({
      id: "ember",
      name: "余烬",
      hint: "快要熄的时候那一层",
      level: 0.2,
      noise: "brown",
      filter: { type: "bandpass", freq: 480, q: 0.7 },
      gain: { kind: "lfo", rate: 0.05, depth: 0.16 },
    }),
  ],
  soft: [48, 20, 32, 6, 8, 10, 30, 4, 26],
  balanced: [60, 50, 42, 26, 22, 16, 34, 16, 30],
  intense: [72, 74, 54, 58, 42, 26, 38, 30, 40],
});

export const SCENES: Scene[] = [
  eaveRain,
  coast,
  forest,
  waterfall,
  thunderNight,
  creek,
  wind,
  nightInsects,
  campfire,
];

function assertCatalog(scenes: Scene[]) {
  const slugs = new Set<string>();
  for (const scene of scenes) {
    if (slugs.has(scene.slug)) throw new Error(`重复的声景 ${scene.slug}`);
    slugs.add(scene.slug);
    if (scene.tracks.length < 8 || scene.tracks.length > 10) {
      throw new Error(`${scene.slug} 需要 8 到 10 层，现在是 ${scene.tracks.length}`);
    }
    const ids = new Set<string>();
    for (const track of scene.tracks) {
      if (ids.has(track.id)) throw new Error(`${scene.slug} 有重复的层 ${track.id}`);
      ids.add(track.id);
    }
    for (const preset of scene.presets) {
      for (const track of scene.tracks) {
        const gain = preset.gains[track.id];
        if (typeof gain !== "number" || gain < 0 || gain > 100) {
          throw new Error(`${scene.slug} / ${preset.id} / ${track.id} 音量无效`);
        }
      }
    }
  }
}

assertCatalog(SCENES);

export function getScene(slug: string) {
  return SCENES.find((scene) => scene.slug === slug);
}

export function scenesForUse(id: UseCaseId) {
  return SCENES.filter((scene) => scene.useCases.includes(id));
}

export function toSummary(scene: Scene): SceneSummary {
  return {
    slug: scene.slug,
    title: scene.title,
    english: scene.english,
    summary: scene.summary,
    useCases: scene.useCases,
    accent: scene.accent,
    accentSoft: scene.accentSoft,
    trackCount: scene.tracks.length,
  };
}

export function summaries(scenes: Scene[] = SCENES) {
  return scenes.map(toSummary);
}

export function labelForUseCase(id: UseCaseId) {
  return getUseCase(id).title;
}
