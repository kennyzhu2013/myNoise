import Link from "next/link";
import type { UseCase } from "@/lib/catalog";
import { scenesForUse } from "@/lib/catalog";

export function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const names = scenesForUse(useCase.id)
    .slice(0, 3)
    .map((scene) => scene.title)
    .join("、");
  return (
    <Link
      href={useCase.href}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <p className="font-display text-xs tracking-[0.14em] text-primary">{useCase.english}</p>
      <h3 className="mt-2 text-2xl">{useCase.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{useCase.description}</p>
      <p className="mt-5 text-sm text-foreground/80">{names}</p>
    </Link>
  );
}
