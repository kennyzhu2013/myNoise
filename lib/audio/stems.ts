export type StemCredit = {
  id: string;
  src: string;
  title: string;
  author: string;
  sourceUrl: string;
  license: "CC0 1.0";
  licenseUrl: string;
};

const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/" as const;

export const STEMS: Record<string, StemCredit> = {
  "rain-roof": {
    id: "rain-roof",
    src: "/audio/stems/rain-roof.mp3",
    title: "Rain underneath the Hawaii Capitol roof",
    author: "YouMightLikeThis",
    sourceUrl: "https://freesound.org/s/788147/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  rainfall: {
    id: "rainfall",
    src: "/audio/stems/rainfall.mp3",
    title: "Rainfall",
    author: "colorsCrimsonTears",
    sourceUrl: "https://freesound.org/s/532681/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-trees": {
    id: "wind-trees",
    src: "/audio/stems/wind-trees.mp3",
    title: "Wind in forest trees (loop)",
    author: "Nox_Sound",
    sourceUrl: "https://freesound.org/s/530908/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "ocean-calm": {
    id: "ocean-calm",
    src: "/audio/stems/ocean-calm.mp3",
    title: "Calm ocean waves",
    author: "SamsterBirdies",
    sourceUrl: "https://freesound.org/s/578524/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "tide-lap": {
    id: "tide-lap",
    src: "/audio/stems/tide-lap.mp3",
    title: "Waves lapping the shore",
    author: "Tom_Kaszuba",
    sourceUrl: "https://freesound.org/s/659002/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  shingle: {
    id: "shingle",
    src: "/audio/stems/shingle.mp3",
    title: "Waves on a shingle beach",
    author: "Mr_Lamppost",
    sourceUrl: "https://freesound.org/s/800900/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-open": {
    id: "wind-open",
    src: "/audio/stems/wind-open.mp3",
    title: "Wind",
    author: "SamuelGremaud",
    sourceUrl: "https://freesound.org/s/547472/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "rain-leaves": {
    id: "rain-leaves",
    src: "/audio/stems/rain-leaves.mp3",
    title: "Rain close up on leaves",
    author: "gyzhor",
    sourceUrl: "https://freesound.org/s/874301/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "ocean-far": {
    id: "ocean-far",
    src: "/audio/stems/ocean-far.mp3",
    title: "Distant ocean roar",
    author: "Anya_Media",
    sourceUrl: "https://freesound.org/s/872757/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "sea-foam": {
    id: "sea-foam",
    src: "/audio/stems/sea-foam.mp3",
    title: "Ocean waves, sound of the foam",
    author: "davidgtr1",
    sourceUrl: "https://freesound.org/s/581487/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "shore-wash": {
    id: "shore-wash",
    src: "/audio/stems/shore-wash.mp3",
    title: "Sea shore, waves with water texture",
    author: "Chris.sonido.peru",
    sourceUrl: "https://freesound.org/s/855795/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "dry-leaves": {
    id: "dry-leaves",
    src: "/audio/stems/dry-leaves.mp3",
    title: "Dry branches rustling",
    author: "Fran Freesound",
    sourceUrl: "https://freesound.org/s/648170/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  seep: {
    id: "seep",
    src: "/audio/stems/seep.mp3",
    title: "Small stream trickle",
    author: "kyles",
    sourceUrl: "https://freesound.org/s/637977/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "brook-far": {
    id: "brook-far",
    src: "/audio/stems/brook-far.mp3",
    title: "Babbling brook",
    author: "hoshisato",
    sourceUrl: "https://freesound.org/s/853672/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "grass-wind": {
    id: "grass-wind",
    src: "/audio/stems/grass-wind.mp3",
    title: "Wind gusts in grass",
    author: "fran_marenco",
    sourceUrl: "https://freesound.org/s/853991/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "forest-bed": {
    id: "forest-bed",
    src: "/audio/stems/forest-bed.mp3",
    title: "Forest",
    author: "Antonio_Lai",
    sourceUrl: "https://freesound.org/s/546361/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "leaves-wind": {
    id: "leaves-wind",
    src: "/audio/stems/leaves-wind.mp3",
    title: "Wind and leaves",
    author: "SamuelGremaud",
    sourceUrl: "https://freesound.org/s/546527/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "forest-quiet": {
    id: "forest-quiet",
    src: "/audio/stems/forest-quiet.mp3",
    title: "Silent forest",
    author: "ZHRØ",
    sourceUrl: "https://freesound.org/s/753418/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "creek-close": {
    id: "creek-close",
    src: "/audio/stems/creek-close.mp3",
    title: "Close forest stream (loop)",
    author: "teadrinker",
    sourceUrl: "https://freesound.org/s/403049/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "creek-trickle": {
    id: "creek-trickle",
    src: "/audio/stems/creek-trickle.mp3",
    title: "Tiny trickling forest creek (loopable)",
    author: "Mjeno",
    sourceUrl: "https://freesound.org/s/405138/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  river: {
    id: "river",
    src: "/audio/stems/river.mp3",
    title: "Medium river flow (loop)",
    author: "Nox_Sound",
    sourceUrl: "https://freesound.org/s/479322/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
};

/** Short calls. These are scheduled one at a time, not looped as a bed. */
export const CALLS: Record<string, StemCredit[]> = {
  "coast:gulls": [
    {
      id: "gull-single",
      src: "/audio/stems/gull-single.mp3",
      title: "Seagull single call",
      author: "steaq",
      sourceUrl: "https://freesound.org/s/263786/",
      license: "CC0 1.0",
      licenseUrl: CC0,
    },
    {
      id: "gull-ring",
      src: "/audio/stems/gull-ring.mp3",
      title: "Ring-billed gull, single call",
      author: "TheKingOfGeeks360",
      sourceUrl: "https://freesound.org/s/861350/",
      license: "CC0 1.0",
      licenseUrl: CC0,
    },
    {
      id: "gull-cry-a",
      src: "/audio/stems/gull-cry-a.mp3",
      title: "Seagull cry, first take",
      author: "mycompasstv",
      sourceUrl: "https://freesound.org/s/738675/",
      license: "CC0 1.0",
      licenseUrl: CC0,
    },
    {
      id: "gull-cry-b",
      src: "/audio/stems/gull-cry-b.mp3",
      title: "Seagull cry, second take",
      author: "mycompasstv",
      sourceUrl: "https://freesound.org/s/738675/",
      license: "CC0 1.0",
      licenseUrl: CC0,
    },
    {
      id: "gull-cry-c",
      src: "/audio/stems/gull-cry-c.mp3",
      title: "Seagull cry, third take",
      author: "mycompasstv",
      sourceUrl: "https://freesound.org/s/738675/",
      license: "CC0 1.0",
      licenseUrl: CC0,
    },
  ],
};

/** Bed layers that play a recording. Each layer in a scene has its own file. */
const SCENE_STEMS: Record<string, Record<string, string>> = {
  "eave-rain": {
    curtain: "rain-roof",
    threads: "rain-leaves",
    distant: "rainfall",
    wind: "wind-trees",
  },
  coast: {
    deep: "ocean-calm",
    horizon: "ocean-far",
    break: "shingle",
    foam: "sea-foam",
    ripples: "tide-lap",
    wash: "shore-wash",
    breeze: "wind-open",
  },
  forest: {
    canopy: "leaves-wind",
    leaves: "dry-leaves",
    under: "forest-bed",
    gust: "wind-trees",
    floor: "forest-quiet",
  },
  creek: {
    main: "creek-close",
    shallows: "creek-trickle",
    seep: "seep",
    pool: "river",
    far: "brook-far",
    bank: "grass-wind",
  },
};

const LISTENING_NOTES: Record<string, string> = {
  "eave-rain":
    "雨幕、雨丝、远雨和斜风各用一段不同的 CC0 现场录音，接成无缝循环。滴答和水洼仍由程序合成。出处在关于页。",
  coast:
    "潮声来自各不相同的 CC0 现场录音，拍岸、碎沫、细浪和退浪仍按一次潮汐起伏。远鸥是偶尔响起的短录音，岸礁仍由程序合成。出处在关于页。",
  forest:
    "林冠、枝叶、林下、阵风和地面各用一段不同的 CC0 现场录音。鸟鸣和露水仍由程序合成。出处在关于页。",
  creek:
    "主流、浅濑、深潭、渗流、岸草和远溪各用一段不同的 CC0 现场录音。气泡、击石和潭滴仍由程序合成。出处在关于页。",
};

export function stemFor(slug: string, trackId: string): StemCredit | null {
  const id = SCENE_STEMS[slug]?.[trackId];
  return id ? STEMS[id] ?? null : null;
}

export function callsFor(slug: string, trackId: string): StemCredit[] {
  return CALLS[`${slug}:${trackId}`] ?? [];
}

export function sceneUsesRecordings(slug: string): boolean {
  return Boolean(SCENE_STEMS[slug] && Object.keys(SCENE_STEMS[slug]).length > 0);
}

export function sceneListeningNote(slug: string): string | null {
  return LISTENING_NOTES[slug] ?? null;
}

export function stemCredits(): StemCredit[] {
  const calls = Object.values(CALLS).flat();
  return [...Object.values(STEMS), ...calls];
}

/** Layers inside one scene that still point at the same file. Empty when each fader has its own stem. */
export function sharedBedStems(): string[] {
  const problems: string[] = [];
  for (const [slug, layers] of Object.entries(SCENE_STEMS)) {
    const owner = new Map<string, string>();
    for (const [trackId, stemId] of Object.entries(layers)) {
      const previous = owner.get(stemId);
      if (previous) problems.push(`${slug}: ${previous} and ${trackId} both use ${stemId}`);
      else owner.set(stemId, trackId);
    }
  }
  return problems;
}
