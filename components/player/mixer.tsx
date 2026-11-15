"use client";

import { useSyncExternalStore } from "react";
import { Slider } from "@/components/ui/slider";
import type { Scene } from "@/lib/audio/types";
import { cn } from "@/lib/utils";

type MixerProps = {
  scene: Scene;
  gains: Record<string, number>;
  mutes: Record<string, boolean>;
  onGain: (id: string, value: number) => void;
  onMute: (id: string) => void;
  onReset: (id: string) => void;
};

export function Mixer({ scene, gains, mutes, onGain, onMute, onReset }: MixerProps) {
  const wide = useWide();
  return (
    <section aria-label="分层混音" className="rounded-3xl border border-border bg-card p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg">分层</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
            每一层都是单独的音量。双击推子回到均衡预设。
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{scene.tracks.length} 层 · 连续循环</p>
      </div>
      {wide ? (
        <div className="mt-6">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3">
            {scene.tracks.map((track) => (
              <li key={track.id} className="w-44 shrink-0 snap-start">
                <TrackFader
                  vertical
                  name={track.name}
                  hint={track.hint}
                  value={gains[track.id] ?? 0}
                  muted={Boolean(mutes[track.id])}
                  onGain={(value) => onGain(track.id, value)}
                  onMute={() => onMute(track.id)}
                  onReset={() => onReset(track.id)}
                />
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">列比较宽，向右滑就能看到后面的层。</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {scene.tracks.map((track) => (
            <li key={track.id} className="min-w-0 py-4">
              <TrackFader
                name={track.name}
                hint={track.hint}
                value={gains[track.id] ?? 0}
                muted={Boolean(mutes[track.id])}
                onGain={(value) => onGain(track.id, value)}
                onMute={() => onMute(track.id)}
                onReset={() => onReset(track.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TrackFader({
  name,
  hint,
  value,
  muted,
  vertical = false,
  onGain,
  onMute,
  onReset,
}: {
  name: string;
  hint: string;
  value: number;
  muted: boolean;
  vertical?: boolean;
  onGain: (value: number) => void;
  onMute: () => void;
  onReset: () => void;
}) {
  const label = `${name}，${hint}`;
  const slider = (
    <Slider
      orientation={vertical ? "vertical" : "horizontal"}
      min={0}
      max={100}
      step={1}
      value={[value]}
      onValueChange={([next]) => onGain(next ?? 0)}
      onDoubleClick={onReset}
      aria-label={label}
      aria-valuetext={muted ? `${value}，已静音` : `${value}`}
      className={cn(vertical ? "mx-auto" : "py-3", muted && "opacity-40")}
      style={vertical ? { height: 192, width: 40 } : undefined}
    />
  );
  const mute = (
    <button
      type="button"
      aria-pressed={muted}
      onClick={onMute}
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-xs whitespace-nowrap",
        muted ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {muted ? "已静音" : "静音"}
    </button>
  );
  if (vertical) {
    return (
      <div className={cn("flex w-full min-w-0 flex-col items-center gap-2 overflow-hidden", muted && "opacity-80")}>
        <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
        {slider}
        <p className="w-full text-center text-sm leading-6 font-medium">{name}</p>
        <p className="w-full text-center text-xs leading-5 text-muted-foreground">{hint}</p>
        {mute}
      </div>
    );
  }
  return (
    <div className={cn("grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3", muted && "opacity-80")}>
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
        </div>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{hint}</p>
        {slider}
      </div>
      {mute}
    </div>
  );
}

function subscribeWide(onChange: () => void) {
  const query = window.matchMedia("(min-width: 1024px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useWide() {
  return useSyncExternalStore(subscribeWide, () => window.matchMedia("(min-width: 1024px)").matches, () => false);
}
