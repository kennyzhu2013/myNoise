import Link from "next/link";
import { SceneCard } from "@/components/scene-card";
import { UseCaseCard } from "@/components/use-case-card";
import { Button } from "@/components/ui/button";
import { SCENES, USE_CASES, summaries } from "@/lib/catalog";

const steps = [
  { n: "01", title: "选一处声景", body: "按专注、放松、助眠或自然噪挑，也可以直接点名字。" },
  { n: "02", title: "按下播放", body: "九处声景都播放现场录音，并一直无缝循环。个别短音和低频仍在浏览器里合成。" },
  { n: "03", title: "再调每一层", body: "轻柔、均衡、强烈是起点。推子决定远近和浓淡。" },
];

export default function HomePage() {
  const scenes = summaries(SCENES);
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(230,185,138,0.18),transparent_62%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="font-display text-sm tracking-[0.2em] text-primary">Shengjing</p>
          <h1 className="mt-3 text-5xl leading-tight md:text-7xl">声境</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            雨落在屋檐上，潮水爬上沙滩，虫鸣停在夏夜。声境把这些自然纹理做成可以现场调的多层混音。九处声景的主体都是可再分发的现场录音，滴答、雷声和少数层次仍在浏览器里合成。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/scenes">进入声景</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/scenes/for/sleep">先听助眠</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">九处声景 · 现场录音做主体 · 个别层次仍是程序合成</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" aria-labelledby="usecases-heading">
        <h2 id="usecases-heading" className="text-2xl">
          此刻想要什么
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">从用途进去，只看适合这件事的声景。</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {USE_CASES.map((useCase) => (
            <li key={useCase.id}>
              <UseCaseCard useCase={useCase} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card/40">
        <ol className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n}>
              <p className="font-display text-sm text-primary">{step.n}</p>
              <h2 className="mt-2 text-lg">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" aria-labelledby="scenes-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="scenes-heading" className="text-2xl">
              九处声景
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">点进去就是调音台。每处 9 层，可以单独拉高或压低。</p>
          </div>
          <Link href="/scenes" className="text-sm text-primary hover:underline">
            按用途筛选
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <li key={scene.slug}>
              <SceneCard scene={scene} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
