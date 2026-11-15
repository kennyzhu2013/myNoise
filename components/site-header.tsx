"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const onScenes = pathname.startsWith("/scenes");
  const onAbout = pathname === "/about";
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-md">
          <Mark />
          <span className="text-base font-medium">声境</span>
          <span className="font-display hidden text-sm text-muted-foreground sm:inline">Shengjing</span>
        </Link>
        <nav aria-label="站点" className="flex items-center gap-1">
          <Link
            href="/scenes"
            aria-current={onScenes ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              onScenes ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            全部声景
          </Link>
          <Link
            href="/about"
            aria-current={onAbout ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              onAbout ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#24302b" />
      <path d="M6 20c2.2-5 4-5 6.2 0s4 5 6.2 0 4-5 6.2 0" fill="none" stroke="#e6b98a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 13.5c2.2-3.4 4-3.4 6.2 0s4 3.4 6.2 0 4-3.4 6.2 0" fill="none" stroke="#b7c4bc" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
