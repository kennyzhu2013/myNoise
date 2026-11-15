import type { Metadata } from "next";
import { MissingScene } from "@/components/missing-scene";
import { SoundscapePlayer } from "@/components/player/soundscape-player";
import { SCENES, getScene, summaries } from "@/lib/catalog";

export function generateStaticParams() {
  return SCENES.map((scene) => ({ slug: scene.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const scene = getScene(slug);
  if (!scene) return { title: "未找到声景" };
  return { title: scene.title, description: scene.description };
}

export default async function ScenePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scene = getScene(slug);
  if (!scene) {
    return <MissingScene title="没有这处声景" body="这处声景不在目录里。回到列表，另选一层声音。" />;
  }
  const others = summaries().filter((item) => item.slug !== scene.slug);
  return <SoundscapePlayer key={scene.slug} scene={scene} others={others} />;
}
