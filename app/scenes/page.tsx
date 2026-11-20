import { SceneBrowser } from "@/components/scene-browser";
import { summaries } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "全部声景",
  description: "九处声景的连续层使用 CC0 现场录音，个别短音和低频仍由程序合成。",
};

export default function ScenesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <p className="font-display text-sm tracking-[0.16em] text-primary">Scenes</p>
      <h1 className="mt-2 text-4xl">全部声景</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        每处声景都可以现场混合。九处声景的连续层是现场录音，个别短音和低频仍是合成纹理。筛选只按用途，不改变声音本身。
      </p>
      <div className="mt-8">
        <SceneBrowser active="all" scenes={summaries()} />
      </div>
    </div>
  );
}
