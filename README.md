# 声境 Shengjing

A small natural-soundscape player. The interface is in Chinese. Continuous layers play CC0 field recordings, with a synthesizer underneath when a layer has no recording. Nothing here is taken from myNoise or any other soundscape product: no name, logo, copy, or audio.

Shengjing (声境) is a mixer. Each scene is a set of nine layers — rain curtain, eaves, distant thunder, crickets — with its own fader. Presets are starting points. The loops do not end.

## Listen

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Pick a scene, press 播放, then move the faders. Headphones make the stereo drops and insects easier to place.

Keyboard, when focus is not on a control:

- Space: play or pause
- M: mute the master output

A sleep timer (15 / 30 / 45 / 60 minutes) fades the master out over about 14 seconds and then pauses. Your fader positions stay put.

## Scenes

| Scene | What you hear |
| --- | --- |
| 檐下雨声 | Rain bed, eaves, puddles, a downspout |
| 海岸长潮 | One long tide, plus smaller shore waves |
| 林间清晨 | Canopy wind, a few birds, dew |
| 峡谷飞瀑 | Steady waterfall, spray, a short canyon slap |
| 雷雨深夜 | Muffled night rain and occasional thunder |
| 石涧溪流 | Burbling water and bubbles |
| 旷野风声 | Open wind, grass, a narrow gap tone |
| 夏夜虫鸣 | Crickets, katydids, a distant frog |
| 篝火夜谈 | Coal bed and irregular crackle |

Thunder and the campfire are marked in the player: those layers get suddenly louder. Start them on 轻柔.

## How the audio works

All nine scenes play CC0 field recordings on the continuous layers that have a licensed stem. Each of those faders has its own file in `public/audio/stems/`. The engine crossfades the loop after decode and plays the take at its natural speed. The catalog filters were tuned for synthesized noise, so a recording skips them and is trimmed to about the level that filter used to leave. Coast beds keep their tide envelopes, and wind and rain beds keep their gust curves. Short events — gulls, spray, drips, thunder, frogs, night birds, and fire ticks — are separate takes scheduled on the original sparse clock, not looped beds. A layer with no clear CC0 recording, and any file that fails to load, stays on the synthesizer. Credits and source URLs are in `lib/audio/stems.ts` and on `/about`.

Everything else is generated when you press play.

```
Recorded bed: decoded stem -> loop crossfade -> level trim -> amplitude shape -> pan -> fader
Synth bed:    noise buffer -> BiquadFilter (optional LFO or wander)
              -> amplitude shape -> optional short delay -> pan -> fader
Both:         fader -> bus -> high-pass -> compressor -> soft clip -> master
```

One-shots (drops, splashes, crackles, thunder, chirps, bubbles, frogs, gulls) are scheduled on the audio clock a few hundred milliseconds ahead, so pausing the `AudioContext` pauses them too. When a one-shot layer has short CC0 takes, those takes are picked at random on the same clock; otherwise the synthesizer voice is used. Cricket and katydid layers play a looped field recording when one is licensed, and otherwise oscillators plus filtered noise, amplitude-modulated by a looping pulse phrase. Each synthesized voice is detuned and offset so they do not lock together.

Synthesized noise hides its loop with an equal-power crossfade, a random start, and a slight per-layer playback rate. A recorded loop uses that same crossfade after decode and a random start, at playback rate 1, so the resampler does not click on the wrap or pitch the take. Slow control curves (gusts, tides, insect phrases) are `AudioBuffer`s at 8 kHz, which is enough for envelopes and much smaller than full-rate audio.

Presets (轻柔 / 均衡 / 强烈) are stored slider positions from 0 to 100. The fader curve is `pow(slider, 1.65)` so the quiet half of the slider stays usable. Moving a fader marks the mix as 自定义. Mixes and the master volume are saved in `localStorage` under `shengjing.v1`.

A mix can also be shared on the scene URL. The player writes it with `history.replaceState` (no extra history entries) and the 复制分享链接 button copies the full URL. On open, these parameters win over `localStorage` for that visit; later edits are still saved locally.

- `m` — fader levels `0`–`100`, comma-separated, in the scene's track order
- `v` — master volume `0`–`100`
- `u` — optional mute bitmask; bit `i` mutes track `i`. Left out when every layer is audible
- `s=1` — master mute. Left out when the master is audible

A malformed `m` (wrong count, or a value outside `0`–`100`) is ignored and the saved mix is used. A bad `v` or `u` is ignored on its own. Example: `/scenes/thunder-night?m=64,30,60,32,50,18,46,24,28&v=68`.

The master chain is intentionally light: a 20 Hz high-pass, a compressor that mostly catches thunder and pops, and a tanh waveshaper. It is not a hearing test and it is not a limiter you should trust at high system volume.

## Project layout

- `app/` — routes: home, scene index, use-case filter, player
- `components/player/` — transport, presets, faders
- `lib/catalog.ts` — the nine scenes, their layers, and the three presets
- `lib/audio/engine.ts` — the graph
- `lib/audio/dsp.ts` — noise, envelopes, cricket phrases
- `lib/audio/spawn.ts` — one-shot voices

Pages are static. `generateStaticParams` lists every scene and every use case. The audio engine is client-only and starts from a click, which is what browsers require before they will make sound.

## Deploy on Vercel

No environment variables. The build does not call an audio API.

1. Push the repository.
2. Import it in Vercel and leave the framework preset on Next.js.
3. Build command: `npm run build`. Output is the default Next.js build.

Or from a machine that is already logged in:

```bash
npm install
npm run build
npx vercel
```

## License of the sound

The synthesis code in this repository is original. It does not include field recordings, CC0 sample packs, or anyone else's loops. If you add a sample later, keep it to something that is clearly CC0 and name the source in this file.
