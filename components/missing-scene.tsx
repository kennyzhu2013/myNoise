import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MissingScene({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <p className="font-display text-sm text-primary">声境</p>
      <h1 className="mt-2 text-3xl">{title}</h1>
      <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
      <Button asChild className="mt-6">
        <Link href="/scenes">查看全部声景</Link>
      </Button>
    </div>
  );
}
