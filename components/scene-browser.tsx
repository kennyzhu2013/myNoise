import Link from "next/link";
import { SceneCard } from "@/components/scene-card";
import { USE_CASES, type SceneSummary, type UseCaseId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function SceneBrowser({ active, scenes }: { active: "all" | UseCaseId; scenes: SceneSummary[] }) {
  return (
    <div>
      <nav aria-label="按用途筛选" className="flex gap-2 overflow-x-auto pb-1">
        <FilterLink href="/scenes" current={active === "all"}>
          全部
        </FilterLink>
        {USE_CASES.map((useCase) => (
          <FilterLink key={useCase.id} href={useCase.href} current={active === useCase.id}>
            {useCase.title}
          </FilterLink>
        ))}
      </nav>
      {scenes.length === 0 ? (
        <p className="mt-8 text-muted-foreground">这个用途下还没有声景。</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <li key={scene.slug}>
              <SceneCard scene={scene} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterLink({ href, current, children }: { href: string; current: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-sm",
        current ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
