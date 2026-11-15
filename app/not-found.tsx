import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <p className="font-display text-sm text-primary">404</p>
      <h1 className="mt-2 text-3xl">没有这处声景</h1>
      <p className="mt-3 leading-7 text-muted-foreground">链接可能写错了。回到目录，另选一层声音。</p>
      <Button asChild className="mt-6">
        <Link href="/scenes">查看全部声景</Link>
      </Button>
    </div>
  );
}
