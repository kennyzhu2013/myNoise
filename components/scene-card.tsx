import Link from "next/link";
import { SceneArt } from "@/components/scene-art";
import { labelForUseCase } from "@/lib/catalog";
import type { SceneSummary } from "@/lib/catalog";

export function SceneCard({ scene }: { scene: SceneSummary }) {
  return (
    <Link
      href={`/scenes/${scene.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
      style={{ background: `linear-gradient(180deg, ${scene.accentSoft} 0%, transparent 46%), var(--card)` }}
    >
      <div className="h-28 border-b border-border/70">
        <SceneArt slug={scene.slug} accent={scene.accent} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-xs tracking-wide text-muted-foreground">{scene.english}</p>
        <h3 className="mt-1 text-xl">{scene.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{scene.summary}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          {scene.trackCount} 层可调
          <span className="px-1.5">·</span>
          {scene.useCases.map((id) => labelForUseCase(id)).join(" / ")}
        </p>
      </div>
    </Link>
  );
}
