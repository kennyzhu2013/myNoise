import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatClock } from "@/lib/format";

const TIMER_OPTIONS = [0, 15, 30, 45, 60] as const;

type TransportProps = {
  playing: boolean;
  master: number;
  muted: boolean;
  fading: boolean;
  timerChoice: number;
  remaining: number | null;
  onToggle: () => void;
  onMaster: (value: number) => void;
  onMute: () => void;
  onTimer: (minutes: number) => void;
};

export function Transport({
  playing,
  master,
  muted,
  fading,
  timerChoice,
  remaining,
  onToggle,
  onMaster,
  onMute,
  onTimer,
}: TransportProps) {
  const status = fading
    ? "音量正在慢慢降下"
    : playing
      ? remaining != null
        ? `播放中，定时还剩 ${formatClock(remaining)}`
        : "播放中，声音连续循环"
      : "已暂停";
  return (
    <section aria-label="播放控制" className="rounded-3xl border border-border bg-card p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <Button type="button" size="lg" aria-pressed={playing} onClick={onToggle} className="min-w-32">
          {playing ? "暂停" : "播放"}
        </Button>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span id="master-volume-label" className="text-sm">
              总音量
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">{muted ? "静音" : master}</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[master]}
            onValueChange={([value]) => onMaster(value ?? 0)}
            aria-labelledby="master-volume-label"
            aria-valuetext={muted ? `${master}，总音量已静音` : `${master}`}
            disabled={muted}
          />
        </div>
        <Button type="button" variant={muted ? "default" : "outline"} aria-pressed={muted} onClick={onMute}>
          {muted ? "取消静音" : "总静音"}
        </Button>
        <div className="flex items-center gap-2">
          <label htmlFor="sleep-timer" className="text-sm text-muted-foreground">
            定时
          </label>
          <select
            id="sleep-timer"
            value={timerChoice}
            onChange={(event) => onTimer(Number(event.target.value))}
            className="h-10 rounded-full border border-border bg-background px-3 text-sm"
          >
            {TIMER_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes === 0 ? "关闭" : `${minutes} 分钟`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        {status}
        <span className="hidden sm:inline"> · 空格播放或暂停，M 总静音</span>
      </p>
    </section>
  );
}
