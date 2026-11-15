import type { Metadata } from "next";
import { SceneBrowser } from "@/components/scene-browser";
import { MissingScene } from "@/components/missing-scene";
import { USE_CASES, getUseCase, isUseCase, scenesForUse, summaries } from "@/lib/catalog";

export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({ use: useCase.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ use: string }> }): Promise<Metadata> {
  const { use } = await params;
  if (!isUseCase(use)) return { title: "未找到用途" };
  const useCase = getUseCase(use);
  return { title: useCase.title, description: useCase.description };
}

export default async function UseCasePage({ params }: { params: Promise<{ use: string }> }) {
  const { use } = await params;
  if (!isUseCase(use)) {
    return <MissingScene title="没有这个用途" body="可以从专注、冥想放松、助眠或自然噪里重新选。" />;
  }
  const useCase = getUseCase(use);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <p className="font-display text-sm tracking-[0.16em] text-primary">{useCase.english}</p>
      <h1 className="mt-2 text-4xl">{useCase.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{useCase.description}</p>
      <div className="mt-8">
        <SceneBrowser active={use} scenes={summaries(scenesForUse(use))} />
      </div>
    </div>
  );
}
