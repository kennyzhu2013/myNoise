"use client";

import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <h1 className="text-3xl">页面没有打开</h1>
      <p className="mt-3 leading-7 text-muted-foreground">声景这一页出了问题。可以再试一次，或刷新之后重新进来。</p>
      <Button type="button" className="mt-6" onClick={() => reset()}>
        再试一次
      </Button>
    </div>
  );
}
