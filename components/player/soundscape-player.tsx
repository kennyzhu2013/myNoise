"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SceneArt } from "@/components/scene-art";
import { Mixer } from "@/components/player/mixer";
import { Transport } from "@/components/player/transport";
import { Button } from "@/components/ui/button";
import { SoundscapeEngine } from "@/lib/audio/engine";
import type { MixState, Preset, Scene } from "@/lib/audio/types";
import type { SceneSummary } from "@/lib/catalog";
import { labelForUseCase } from "@/lib/catalog";
import { balancedGain, mixForScene, presetIdFor, type Mix } from "@/lib/mix";
import { getPrefsServerSnapshot, getPrefsSnapshot, parsePrefs, subscribePrefs, updatePrefs } from "@/lib/prefs";
import { sceneListeningNote, sceneUsesRecordings } from "@/lib/audio/stems";
import { parseShareSearch, replaceShareUrl, shareUrl } from "@/lib/share-mix";
import { cn } from "@/lib/utils";

const PRESET_ORDER = ["soft", "balanced", "intense"] as const;

export function SoundscapePlayer({ scene, others }: { scene: Scene; others: SceneSummary[] }) {
  const rawPrefs = useSyncExternalStore(subscribePrefs, getPrefsSnapshot, getPrefsServerSnapshot);
  const search = useSyncExternalStore(subscribeSearch, getSearchSnapshot, getSearchServerSnapshot);
  const prefs = useMemo(() => parsePrefs(rawPrefs), [rawPrefs]);
  const stored = useMemo(() => mixForScene(scene, prefs), [scene, prefs]);
  const shared = useMemo(() => parseShareSearch(scene, search), [scene, search]);
  const [local, setLocal] = useState<Mix | null>(null);
  const [masterLocal, setMasterLocal] = useState<number | null>(null);
  const [mutedLocal, setMutedLocal] = useState<boolean | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerChoice, setTimerChoice] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [fading, setFading] = useState(false);

  const gains = local?.gains ?? shared?.mix?.gains ?? stored.gains;
  const mutes = local?.mutes ?? shared?.mix?.mutes ?? stored.mutes;
  const master = masterLocal ?? shared?.master ?? prefs.master;
  const muted = mutedLocal ?? shared?.masterMuted ?? prefs.muted;
  const activePreset = presetIdFor(scene, gains, mutes);

  const engineRef = useRef<SoundscapeEngine | null>(null);
  const playingRef = useRef(false);
  const deadlineRef = useRef<number | null>(null);
  const armedMs = useRef<number | null>(null);
  const fadeLock = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startingRef = useRef(false);
  const toggleRef = useRef<() => void>(() => undefined);
  const muteRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const engine = new SoundscapeEngine();
    engineRef.current = engine;
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (shareTimer.current) clearTimeout(shareTimer.current);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.isContentEditable || target.closest("button, a, input, textarea, select, [role='slider']")) return;
      if (event.code === "Space") {
        event.preventDefault();
        toggleRef.current();
      } else if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        muteRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline == null || fadeLock.current) return;
      const left = deadline - Date.now();
      if (left <= 0) {
        fadeLock.current = true;
        setRemaining(0);
        setFading(true);
      } else {
        setRemaining(left);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (!fading) return;
    const engine = engineRef.current;
    const started = performance.now();
    const duration = 14000;
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      engine?.setFade(1 - progress);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
        return;
      }
      void engine?.pause();
      engine?.setFade(1);
      deadlineRef.current = null;
      armedMs.current = null;
      fadeLock.current = false;
      playingRef.current = false;
      setPlaying(false);
      setFading(false);
      setTimerChoice(0);
      setRemaining(null);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [fading]);

  function stateFor(next: Mix, masterValue: number, mutedValue: boolean): MixState {
    return {
      master: masterValue,
      muted: mutedValue,
      tracks: scene.tracks.map((track) => ({
        id: track.id,
        gain: next.gains[track.id] ?? 0,
        muted: Boolean(next.mutes[track.id]),
      })),
    };
  }

  function pushEngine(next: Mix, masterValue: number, mutedValue: boolean, fadeIn = false) {
    const engine = engineRef.current;
    if (!engine?.isBuilt()) return;
    engine.applyMix(stateFor(next, masterValue, mutedValue), fadeIn);
  }

  function save(next: Mix, masterValue: number, mutedValue: boolean, immediate = false) {
    const run = () => {
      updatePrefs((prev) => ({
        master: masterValue,
        muted: mutedValue,
        mixes: { ...prev.mixes, [scene.slug]: { gains: next.gains, mutes: next.mutes } },
      }));
    };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (immediate) {
      run();
      return;
    }
    saveTimer.current = setTimeout(run, 160);
  }

  function publishShare(next: Mix, masterValue: number, mutedValue: boolean) {
    replaceShareUrl(scene, next, masterValue, mutedValue);
  }

  function commit(next: Mix, masterValue = master, mutedValue = muted, immediate = false) {
    setLocal(next);
    pushEngine(next, masterValue, mutedValue);
    save(next, masterValue, mutedValue, immediate);
    publishShare(next, masterValue, mutedValue);
  }

  function copyShareLink() {
    const next = { gains, mutes };
    const href = shareUrl(scene, next, master, muted);
    publishShare(next, master, muted);
    const clipboard = navigator.clipboard?.writeText(href);
    if (!clipboard) {
      showShareNote(copyWithFallback(href) ? "已复制" : "没能复制，请从地址栏手动复制");
      return;
    }
    void clipboard.then(
      () => showShareNote("已复制"),
      () => showShareNote(copyWithFallback(href) ? "已复制" : "没能复制，请从地址栏手动复制"),
    );
  }

  function showShareNote(message: string) {
    setShareNote(message);
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareNote(null), 2000);
  }

  async function toggle() {
    const engine = engineRef.current;
    if (!engine) {
      setError("音频引擎还没准备好。请再按一次播放。");
      return;
    }
    if (startingRef.current) return;
    if (playingRef.current) {
      if (deadlineRef.current) {
        armedMs.current = msUntil(deadlineRef.current);
        deadlineRef.current = null;
        setRemaining(armedMs.current);
      }
      setFading(false);
      fadeLock.current = false;
      engine.setFade(1);
      await engine.pause();
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    startingRef.current = true;
    playingRef.current = true;
    setPlaying(true);
    setError(null);
    try {
      const next = { gains, mutes };
      if (armedMs.current && deadlineRef.current == null) {
        deadlineRef.current = fromNow(armedMs.current);
      }
      await engine.start(scene, stateFor(next, master, muted));
    } catch (err) {
      playingRef.current = false;
      setPlaying(false);
      const detail = err instanceof Error ? err.message : "";
      setError(
        detail
          ? `这次没能启动音频（${detail}）。请再按一次播放。`
          : "这次没能启动音频。请再按一次播放；如果仍然没有声音，检查系统音量，以及浏览器是否允许这个页面发声。",
      );
    } finally {
      startingRef.current = false;
    }
  }

  function toggleMute() {
    const nextMuted = !muted;
    const next = { gains, mutes };
    setMutedLocal(nextMuted);
    pushEngine(next, master, nextMuted);
    save(next, master, nextMuted, true);
    publishShare(next, master, nextMuted);
  }

  useEffect(() => {
    toggleRef.current = () => {
      void toggle();
    };
    muteRef.current = toggleMute;
  });

  function applyPreset(preset: Preset) {
    const next: Mix = {
      gains: { ...preset.gains },
      mutes: Object.fromEntries(scene.tracks.map((track) => [track.id, false])),
    };
    commit(next, master, muted, true);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:py-10">
      <p className="text-sm">
        <Link href="/scenes" className="text-muted-foreground hover:text-foreground">
          ← 全部声景
        </Link>
      </p>
      <header
        className="relative overflow-hidden rounded-3xl border border-border"
        style={{ background: `linear-gradient(160deg, ${scene.accentSoft}, transparent 58%), var(--card)` }}
      >
        <div className="h-36 md:h-48">
          <SceneArt slug={scene.slug} accent={scene.accent} playing={playing} />
        </div>
        <div className="relative px-5 pb-6 md:px-8 md:pb-8">
          <p className="font-display text-sm tracking-[0.16em] text-primary">{scene.english}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{scene.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{scene.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {sceneUsesRecordings(scene.slug) ? "现场录音 · 无缝循环" : "程序合成 · 连续循环"}
              </span>
            </li>
            {scene.useCases.map((id) => (
              <li key={id}>
                <Link href={`/scenes/for/${id}`} className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary/50">
                  {labelForUseCase(id)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {scene.warnDynamic ? (
        <p className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-6">
          这个声景里有突然变响的声音。建议从「轻柔」开始，并把总音量先放低。
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-2xl border border-primary/40 px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      <Transport
        playing={playing}
        master={master}
        muted={muted}
        fading={fading}
        timerChoice={timerChoice}
        remaining={remaining}
        onToggle={() => {
          void toggle();
        }}
        onMaster={(value) => {
          const nextMaster = clamp(value);
          const next = { gains, mutes };
          setMasterLocal(nextMaster);
          pushEngine(next, nextMaster, muted);
          save(next, nextMaster, muted);
          publishShare(next, nextMaster, muted);
        }}
        onMute={toggleMute}
        onTimer={(minutes) => {
          setTimerChoice(minutes);
          setFading(false);
          fadeLock.current = false;
          engineRef.current?.setFade(1);
          if (minutes === 0) {
            deadlineRef.current = null;
            armedMs.current = null;
            setRemaining(null);
            return;
          }
          const ms = minutes * 60_000;
          armedMs.current = ms;
          deadlineRef.current = playingRef.current ? Date.now() + ms : null;
          setRemaining(ms);
        }}
      />

      <section aria-label="预设" className="flex min-w-0 flex-wrap items-center gap-2">
        <div role="group" aria-label="预设混音" className="flex flex-wrap gap-2">
          {PRESET_ORDER.map((id) => {
            const preset = scene.presets.find((item) => item.id === id);
            if (!preset) return null;
            const selected = activePreset === id;
            return (
              <Button key={id} type="button" variant={selected ? "default" : "outline"} aria-pressed={selected} onClick={() => applyPreset(preset)}>
                {preset.name}
              </Button>
            );
          })}
        </div>
        {activePreset == null ? <span className="text-sm text-muted-foreground">自定义</span> : null}
        <Button type="button" variant="outline" onClick={() => void copyShareLink()}>
          {shareNote ?? "复制分享链接"}
        </Button>
        <p className="sr-only" role="status">
          {shareNote ?? ""}
        </p>
        <p className="w-full min-w-0 basis-full text-sm leading-6 text-muted-foreground">轻柔、均衡、强烈是三条起点。推动任意一层之后，就是你自己的混音。复制分享链接可以让别人打开同一组推子。</p>
      </section>

      <Mixer
        scene={scene}
        gains={gains}
        mutes={mutes}
        onGain={(id, value) => {
          commit({ gains: { ...gains, [id]: clamp(value) }, mutes: { ...mutes } });
        }}
        onMute={(id) => {
          commit({ gains, mutes: { ...mutes, [id]: !mutes[id] } }, master, muted, true);
        }}
        onReset={(id) => {
          commit({
            gains: { ...gains, [id]: balancedGain(scene, id) },
            mutes: { ...mutes, [id]: false },
          });
        }}
      />

      <p className="text-sm leading-6 text-muted-foreground">
        {sceneListeningNote(scene.slug) ??
          "这些声音不是实地录音。雨、风和水是循环的滤波噪声，浪和虫鸣是循环包络，雷声、水滴和鸟鸣是按时间排进去的短音。耳机能听出雨点和虫子的左右位置。"}
      </p>

      <section aria-label="其他声景">
        <h2 className="text-lg">其他声景</h2>
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {others.map((item) => (
            <li key={item.slug} className="w-44 shrink-0">
              <Link
                href={`/scenes/${item.slug}`}
                className={cn("block overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40")}
              >
                <div className="h-16">
                  <SceneArt slug={item.slug} accent={item.accent} />
                </div>
                <span className="block px-3 py-2 text-sm">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function subscribeSearch() {
  return () => {};
}

function getSearchSnapshot() {
  return window.location.search;
}

function getSearchServerSnapshot() {
  return "";
}

function copyWithFallback(value: string) {
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

function clamp(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function msUntil(deadline: number) {
  return Math.max(0, deadline - Date.now());
}

function fromNow(ms: number) {
  return Date.now() + ms;
}
