import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>声境 Shengjing · 九处声景都含 CC0 现场录音，个别层次仍在浏览器里合成。</p>
        <nav aria-label="页脚" className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">
            关于
          </Link>
          <Link href="/scenes" className="hover:text-foreground">
            去听一处声景
          </Link>
        </nav>
      </div>
    </footer>
  );
}
