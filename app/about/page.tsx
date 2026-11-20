import type { Metadata } from "next";
import Link from "next/link";
import { stemCredits } from "@/lib/audio/stems";

export const metadata: Metadata = {
  title: "关于",
  description: "声境 Shengjing：九处声景使用 CC0 现场录音，个别层次仍由浏览器合成。与 myNoise 无关。",
};

const sections = [
  {
    title: "这是什么",
    body: "声境（Shengjing）是一套在浏览器里听、也在浏览器里调的自然声景。雨、海潮、林风、瀑布、溪流、夜虫和篝火，用来垫在专注、放松和入睡的时候。首页按用途挑选，进入一处声景之后，每一层都可以单独拉高或压低。",
  },
  {
    title: "声音从哪里来",
    body: "九处声景里，连续的层次尽量各用一段不同的 CC0 现场录音，剪短后接成循环。海岸的潮汐、旷野的阵风，以及原来写在声景里的起伏，都还在。远鸥、溅珠、落水、滴水、雷声、蛙鸣、露水、夜鸟、噼啪、爆裂和火星不是循环声床，而是分开的短录音，按原来的疏密响起。屋檐上的滴答、溪里的气泡、林间的鸟鸣，还有岩风、潭底、隔窗、低压、掠耳、木炭、夜气、余烬和柴薪，仍由浏览器里的滤波噪声、包络和振荡器合成。这些录音不是 myNoise 的音频，也没有使用他们的采样或工程文件。",
  },
  {
    title: "版权与声明",
    body: "界面、名称「声境 / Shengjing」和这些文案都是原创的。声境不是 myNoise，也不隶属于它。请不要把两者当成同一个产品，也不要把它的标志、文案或声音安到声境上。录音按各自的 CC0 1.0 许可再分发，作者和原始页面记在下面。",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(230,185,138,0.16),transparent_62%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 md:py-20">
          <p className="font-display text-sm tracking-[0.2em] text-primary">Shengjing</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">关于声境</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            一套独立的自然声景。名字和界面是原创的。九处声景使用可再分发的现场录音，个别层次仍在浏览器里合成。
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-12 md:py-16">
        {sections.map((section) => (
          <section key={section.title} className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl">{section.title}</h2>
            <p className="mt-3 text-base leading-8 text-muted-foreground">{section.body}</p>
          </section>
        ))}

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl">录音出处</h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            下列文件都以 CC0 1.0 发布。声境把它们剪短、做成无缝循环，并在混音里叠用。许可不要求署名，这里仍记下作者和原始页面。
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-sm leading-6">
            {stemCredits().map((stem) => (
              <li key={stem.id} className="rounded-2xl border border-border px-4 py-3">
                <p className="text-foreground">{stem.title}</p>
                <p className="text-muted-foreground">
                  {stem.author}
                  <span className="px-1.5">·</span>
                  {stem.license}
                </p>
                <p className="mt-1 flex flex-col gap-1">
                  <a href={stem.sourceUrl} className="text-primary underline-offset-4 hover:underline">
                    {stem.sourceUrl}
                  </a>
                  <a href={stem.licenseUrl} className="text-muted-foreground underline-offset-4 hover:underline">
                    {stem.licenseUrl}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl">怎么听</h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            在项目目录里先安装依赖，再启动本地页面。
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 text-foreground">
            <code>npm install{"\n"}npm run dev</code>
          </pre>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            打开首页，从
            <Link href="/scenes/for/focus" className="mx-1 text-foreground underline decoration-primary/60 underline-offset-4">
              专注
            </Link>
            或其他用途进入一处声景，按下播放。空格键播放或暂停，M 键控制总静音。戴耳机时，雨点和虫鸣的左右位置会更清楚。
          </p>
        </section>
      </div>
    </div>
  );
}
