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
  "fall-roar": {
    id: "fall-roar",
    src: "/audio/stems/fall-roar.mp3",
    title: "Haifoss waterfall",
    author: "tammarpokk",
    sourceUrl: "https://freesound.org/s/416318/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "fall-sheet": {
    id: "fall-sheet",
    src: "/audio/stems/fall-sheet.mp3",
    title: "Small waterfall, close loop",
    author: "Nox_Sound",
    sourceUrl: "https://freesound.org/s/698306/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "fall-mist": {
    id: "fall-mist",
    src: "/audio/stems/fall-mist.mp3",
    title: "Splashy waterfall into a pool",
    author: "kyles",
    sourceUrl: "https://freesound.org/s/454340/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "fall-pool": {
    id: "fall-pool",
    src: "/audio/stems/fall-pool.mp3",
    title: "Plunge pool at the Loup of Fintry",
    author: "Sandy-Ogilvie",
    sourceUrl: "https://freesound.org/s/828407/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "fall-side": {
    id: "fall-side",
    src: "/audio/stems/fall-side.mp3",
    title: "Small waterfall onto rock",
    author: "Brikaro",
    sourceUrl: "https://freesound.org/s/855677/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "night-rain": {
    id: "night-rain",
    src: "/audio/stems/night-rain.mp3",
    title: "Rain loop",
    author: "richwise",
    sourceUrl: "https://freesound.org/s/584943/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "night-threads": {
    id: "night-threads",
    src: "/audio/stems/night-threads.mp3",
    title: "Light rain on leaves",
    author: "TRP",
    sourceUrl: "https://freesound.org/s/572267/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "night-wetwind": {
    id: "night-wetwind",
    src: "/audio/stems/night-wetwind.mp3",
    title: "Wind in dry grass with light rain",
    author: "felix.blume",
    sourceUrl: "https://freesound.org/s/666178/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "night-burst": {
    id: "night-burst",
    src: "/audio/stems/night-burst.mp3",
    title: "Heavy rain on a plastic roof",
    author: "RealSquink",
    sourceUrl: "https://freesound.org/s/788020/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-field": {
    id: "wind-field",
    src: "/audio/stems/wind-field.mp3",
    title: "Cold wind blowing outside",
    author: "Lewisounds",
    sourceUrl: "https://freesound.org/s/686064/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-grass": {
    id: "wind-grass",
    src: "/audio/stems/wind-grass.mp3",
    title: "Wind in dry tall grass",
    author: "felix.blume",
    sourceUrl: "https://freesound.org/s/666175/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-low": {
    id: "wind-low",
    src: "/audio/stems/wind-low.mp3",
    title: "Low wind gusts in a desert canyon",
    author: "fran_marenco",
    sourceUrl: "https://freesound.org/s/852882/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-far": {
    id: "wind-far",
    src: "/audio/stems/wind-far.mp3",
    title: "Wind at night in open bush",
    author: "David_0109",
    sourceUrl: "https://freesound.org/s/750028/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-gap": {
    id: "wind-gap",
    src: "/audio/stems/wind-gap.mp3",
    title: "Wind whistling in a window frame",
    author: "pavelvon",
    sourceUrl: "https://freesound.org/s/396533/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-dust": {
    id: "wind-dust",
    src: "/audio/stems/wind-dust.mp3",
    title: "Wind-blown desert sand",
    author: "Vrymaa",
    sourceUrl: "https://freesound.org/s/825860/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-blast": {
    id: "wind-blast",
    src: "/audio/stems/wind-blast.mp3",
    title: "Heavy wind through grass and bushes",
    author: "Kinoton",
    sourceUrl: "https://freesound.org/s/656680/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "wind-twigs": {
    id: "wind-twigs",
    src: "/audio/stems/wind-twigs.mp3",
    title: "Dry branches in a mistral wind",
    author: "silencyo",
    sourceUrl: "https://freesound.org/s/81794/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "insects-crickets": {
    id: "insects-crickets",
    src: "/audio/stems/insects-crickets.mp3",
    title: "Crickets chirping at night",
    author: "Borgory",
    sourceUrl: "https://freesound.org/s/751468/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "insects-other": {
    id: "insects-other",
    src: "/audio/stems/insects-other.mp3",
    title: "Night crickets in a garden",
    author: "Vrymaa",
    sourceUrl: "https://freesound.org/s/805466/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "insects-katydid": {
    id: "insects-katydid",
    src: "/audio/stems/insects-katydid.mp3",
    title: "Katydids at night",
    author: "JPBILLINGSLEYJR",
    sourceUrl: "https://freesound.org/s/475261/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "insects-breeze": {
    id: "insects-breeze",
    src: "/audio/stems/insects-breeze.mp3",
    title: "Wind in dry tall grass, later stretch",
    author: "felix.blume",
    sourceUrl: "https://freesound.org/s/666175/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "insects-low": {
    id: "insects-low",
    src: "/audio/stems/insects-low.mp3",
    title: "Quiet night in a park",
    author: "Federico_Casazza",
    sourceUrl: "https://freesound.org/s/539817/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "fire-bed": {
    id: "fire-bed",
    src: "/audio/stems/fire-bed.mp3",
    title: "Campfire, close",
    author: "SKrafft",
    sourceUrl: "https://freesound.org/s/681366/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
  "fire-heat": {
    id: "fire-heat",
    src: "/audio/stems/fire-heat.mp3",
    title: "Sizzling bonfire",
    author: "florianreichelt",
    sourceUrl: "https://freesound.org/s/563012/",
    license: "CC0 1.0",
    licenseUrl: CC0,
  },
};

/** Short calls. These are scheduled one at a time, not looped as a bed. */
function call(id: string, file: string, title: string, author: string, soundId: string): StemCredit {
  return {
    id,
    src: `/audio/stems/${file}`,
    title,
    author,
    sourceUrl: `https://freesound.org/s/${soundId}/`,
    license: "CC0 1.0",
    licenseUrl: CC0,
  };
}

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
  "waterfall:spray": [
    call("spray-1", "spray-1.mp3", "Water splashes on cement", "martinimeniscus", "199452"),
    call("spray-2", "spray-2.mp3", "Water splash in a lake, first take", "vero.marengere", "524524"),
    call("spray-3", "spray-3.mp3", "Water splash in a lake, second take", "vero.marengere", "524524"),
    call("spray-4", "spray-4.mp3", "Water splashes", "ClumsyBoomers", "867713"),
  ],
  "waterfall:drops": [
    call("fall-drop-1", "fall-drop-1.mp3", "Rain gutter drip, first take", "ProductionNow", "232300"),
    call("fall-drop-2", "fall-drop-2.mp3", "Rain gutter drip, second take", "ProductionNow", "232300"),
    call("fall-drop-3", "fall-drop-3.mp3", "Rain gutter drip, third take", "ProductionNow", "232300"),
  ],
  "thunder-night:drips": [
    call("drip-1", "drip-1.mp3", "Single water drop", "AardsReal", "842164"),
    call("drip-2", "drip-2.mp3", "Droplet hitting liquid", "MasterSuite", "667386"),
    call("drip-3", "drip-3.mp3", "Rain gutter drip, fourth take", "ProductionNow", "232300"),
    call("drip-4", "drip-4.mp3", "Water drip", "erkanozan", "51754"),
  ],
  "thunder-night:far": [
    call("far-thunder-1", "far-thunder-1.mp3", "Extremely distant thunder", "supercell10", "393634"),
    call("far-thunder-2", "far-thunder-2.mp3", "Distant gentle thunder", "mikala_oidua", "347562"),
    call("far-thunder-3", "far-thunder-3.mp3", "Distant peal of thunder", "bastipictures", "243782"),
  ],
  "thunder-night:near": [
    call("near-thunder-1", "near-thunder-1.mp3", "Close thunder strike", "loganzsound", "840628"),
    call("near-thunder-2", "near-thunder-2.mp3", "Pretty close thunder crack", "TRP", "567945"),
    call("near-thunder-3", "near-thunder-3.mp3", "Spectacular thunder clap", "Valerie-Vivegnis", "865693"),
    call("near-thunder-4", "near-thunder-4.mp3", "Very close lightning strike", "csengeri", "434359"),
  ],
  "night-insects:frogs": [
    call("frog-1", "frog-1.mp3", "Boana pulchella night call, first take", "Oseledchik_Sergey", "833854"),
    call("frog-2", "frog-2.mp3", "Boana pulchella night call, second take", "Oseledchik_Sergey", "833854"),
    call("frog-3", "frog-3.mp3", "Boana pulchella night call, third take", "Oseledchik_Sergey", "833854"),
    call("frog-4", "frog-4.mp3", "Tropical frogs at night, first take", "Talasrum", "451635"),
    call("frog-5", "frog-5.mp3", "Tropical frogs at night, second take", "Talasrum", "451635"),
    call("frog-6", "frog-6.mp3", "Distant frogs at night", "Kamix0", "391520"),
  ],
  "night-insects:dew": [
    call("dew-1", "dew-1.mp3", "Single water drops, first take", "16G_Panska_Sand_Nikolas", "498999"),
    call("dew-2", "dew-2.mp3", "Single water drops, second take", "16G_Panska_Sand_Nikolas", "498999"),
    call("dew-3", "dew-3.mp3", "Dripping water", "julietclarke", "444193"),
  ],
  "night-insects:night-bird": [
    call("nightbird-1", "nightbird-1.mp3", "Tawny owl call", "Cinetony", "558214"),
    call("nightbird-2", "nightbird-2.mp3", "Owl hoot", "Breviceps", "465697"),
    call("nightbird-3", "nightbird-3.mp3", "Chuck-will's-widow, distant", "TheKingOfGeeks360", "860186"),
    call("nightbird-4", "nightbird-4.mp3", "Owl hooting at night", "Gerent", "558396"),
  ],
  "campfire:crackle": [
    call("fire-crackle-1", "fire-crackle-1.mp3", "Fire crackle, first take", "ahriik", "508110"),
    call("fire-crackle-2", "fire-crackle-2.mp3", "Fire crackle, second take", "ahriik", "508110"),
    call("fire-crackle-3", "fire-crackle-3.mp3", "Fire crackle, third take", "ahriik", "508110"),
    call("fire-crackle-4", "fire-crackle-4.mp3", "Fire crackle, fourth take", "ahriik", "508110"),
    call("fire-crackle-5", "fire-crackle-5.mp3", "Fire crackle, fifth take", "ahriik", "508110"),
  ],
  "campfire:pops": [
    call("fire-pop-1", "fire-pop-1.mp3", "Pinewood fire pop, first take", "YouMightLikeThis", "785057"),
    call("fire-pop-2", "fire-pop-2.mp3", "Pinewood fire pop, second take", "YouMightLikeThis", "785057"),
    call("fire-pop-3", "fire-pop-3.mp3", "Pinewood fire pop, third take", "YouMightLikeThis", "785057"),
    call("fire-pop-4", "fire-pop-4.mp3", "Pinewood fire pop, fourth take", "YouMightLikeThis", "785057"),
  ],
  "campfire:sparks": [
    call("fire-spark-1", "fire-spark-1.mp3", "Fireplace tick, first take", "AlexanderChe", "410404"),
    call("fire-spark-2", "fire-spark-2.mp3", "Fireplace tick, second take", "AlexanderChe", "410404"),
    call("fire-spark-3", "fire-spark-3.mp3", "Fireplace tick, third take", "AlexanderChe", "410404"),
    call("fire-spark-4", "fire-spark-4.mp3", "Fireplace tick, fourth take", "AlexanderChe", "410404"),
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
  waterfall: {
    roar: "fall-roar",
    sheet: "fall-sheet",
    mist: "fall-mist",
    pool: "fall-pool",
    side: "fall-side",
  },
  "thunder-night": {
    rain: "night-rain",
    threads: "night-threads",
    wetwind: "night-wetwind",
    burst: "night-burst",
  },
  wind: {
    field: "wind-field",
    grass: "wind-grass",
    low: "wind-low",
    far: "wind-far",
    gap: "wind-gap",
    dust: "wind-dust",
    blast: "wind-blast",
    twigs: "wind-twigs",
  },
  "night-insects": {
    crickets: "insects-crickets",
    other: "insects-other",
    katydid: "insects-katydid",
    "night-wind": "insects-breeze",
    grassbed: "grass-wind",
    "low-night": "insects-low",
  },
  campfire: {
    bed: "fire-bed",
    heat: "fire-heat",
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
  waterfall:
    "主瀑、水幕、水雾、潭面和侧瀑各用一段不同的 CC0 现场录音，接成无缝循环。溅珠和落水是短录音。岩风和深处仍由程序合成。出处在关于页。",
  "thunder-night":
    "夜雨、雨丝、湿风和雨势各用一段不同的 CC0 现场录音，雨势仍会忽然抬起。滴水、远雷和近雷是分开的短录音。隔窗和低压仍由程序合成。出处在关于页。",
  wind:
    "长风、草浪、空地、远处、风口、细沙、强风和枯枝各用一段不同的 CC0 现场录音，强弱仍按原来的风势起伏。掠耳仍由程序合成。出处在关于页。",
  "night-insects":
    "蟋蟀、另一侧、纺织娘、夜风、草丛和夜色各用一段不同的 CC0 现场录音。蛙鸣、露水和夜鸟是偶尔响起的短录音。出处在关于页。",
  campfire:
    "火床和热气用两段不同的 CC0 现场录音。噼啪、爆裂和火星是分开的短录音。木炭、夜气、余烬和柴薪仍由程序合成。出处在关于页。",
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
