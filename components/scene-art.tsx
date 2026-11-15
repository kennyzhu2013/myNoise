import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SceneArtProps = {
  slug: string;
  accent: string;
  playing?: boolean;
  className?: string;
};

export function SceneArt({ slug, accent, playing = false, className }: SceneArtProps) {
  return (
    <div
      className={cn("scene-art h-full w-full", playing && "is-playing", className)}
      style={{ color: accent }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 360 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {renderArt(slug)}
      </svg>
    </div>
  );
}

function renderArt(slug: string): ReactNode {
  switch (slug) {
    case "eave-rain":
      return (
        <g>
          {Array.from({ length: 22 }, (_, i) => {
            const x = 10 + ((i * 47) % 344);
            const len = 16 + (i % 5) * 9;
            return (
              <line
                key={i}
                className="fall"
                x1={x}
                y1={24}
                x2={x - 7}
                y2={24 + len}
                stroke="currentColor"
                strokeWidth={i % 4 === 0 ? 1.7 : 1.05}
                strokeLinecap="round"
                opacity={0.35 + (i % 3) * 0.18}
                style={{ animationDelay: `${(i % 7) * 0.17}s` }}
              />
            );
          })}
        </g>
      );
    case "coast":
      return (
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path className="drift" d="M-20 108 C 40 86, 90 132, 150 108 S 250 84, 330 112 S 420 140, 470 108" strokeWidth="2" />
          <path className="drift drift-slow" d="M-30 128 C 50 112, 110 152, 180 128 S 280 104, 390 136" strokeWidth="1.4" opacity="0.75" />
          <path d="M0 152 C 70 140, 130 166, 210 150 S 300 136, 360 156" strokeWidth="1.1" opacity="0.45" />
        </g>
      );
    case "forest":
      return (
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M30 168 C 80 78, 140 36, 184 32 C 236 36, 300 82, 340 168" opacity="0.75" />
          <path d="M70 168 C 110 104, 160 72, 198 68 C 240 74, 280 112, 312 168" opacity="0.4" />
          <path d="M118 168 L 116 86" strokeWidth="2" />
          <path d="M176 168 L 172 58" strokeWidth="2.4" />
          <path d="M236 168 L 242 92" strokeWidth="2" />
        </g>
      );
    case "waterfall":
      return (
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M150 26 C 168 78, 156 120, 166 168" strokeWidth="12" opacity="0.28" />
          <path className="drift" d="M172 24 C 196 80, 182 124, 194 168" strokeWidth="6" opacity="0.7" />
          <path d="M188 30 C 206 90, 198 130, 208 168" strokeWidth="2" opacity="0.5" />
          <ellipse cx="186" cy="164" rx="74" ry="8" opacity="0.55" />
        </g>
      );
    case "thunder-night":
      return (
        <g>
          <g fill="currentColor">
            <ellipse cx="132" cy="68" rx="48" ry="22" opacity="0.22" />
            <ellipse cx="186" cy="60" rx="62" ry="28" opacity="0.34" />
            <ellipse cx="236" cy="72" rx="40" ry="18" opacity="0.22" />
          </g>
          <polyline className="bolt" points="198,86 180,118 204,118 172,164" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      );
    case "creek":
      return (
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path className="drift" d="M-10 100 C 40 88, 70 112, 110 100 S 170 78, 220 104 S 290 130, 370 96" />
          <path d="M0 124 C 60 112, 100 140, 160 122 S 250 108, 360 128" opacity="0.55" />
          <circle cx="96" cy="138" r="10" fill="currentColor" stroke="none" opacity="0.35" />
          <circle cx="168" cy="146" r="14" fill="currentColor" stroke="none" opacity="0.28" />
          <circle cx="246" cy="140" r="9" fill="currentColor" stroke="none" opacity="0.32" />
        </g>
      );
    case "wind":
      return (
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path className="drift" d="M-10 70 C 70 58, 120 86, 190 70 S 280 50, 380 74" strokeWidth="1.6" />
          <path className="drift drift-slow" d="M-20 98 C 80 84, 140 116, 220 98 S 300 78, 390 104" opacity="0.7" />
          <path className="drift" d="M0 128 C 90 116, 150 146, 240 126 S 310 112, 370 132" opacity="0.45" style={{ animationDelay: "0.8s" }} />
        </g>
      );
    case "night-insects":
      return (
        <g fill="none" stroke="currentColor">
          {[
            [70, 78],
            [128, 54],
            [190, 88],
            [250, 48],
            [300, 96],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="2.2" fill="currentColor" stroke="none" />
              <circle cx={x} cy={y} r="10" opacity="0.45" />
            </g>
          ))}
          <path d="M40 150 C 120 132, 200 162, 320 140" opacity="0.4" />
        </g>
      );
    case "campfire":
      return (
        <g fill="currentColor">
          <path className="flicker" d="M180 150 C 168 120, 150 108, 166 78 C 174 104, 188 96, 184 70 C 210 104, 206 124, 198 150 Z" opacity="0.85" />
          <path className="flicker" d="M156 152 C 148 128, 138 118, 150 96 C 158 116, 166 112, 162 152 Z" opacity="0.45" style={{ animationDelay: "0.2s" }} />
          <path className="flicker" d="M204 154 C 214 130, 226 116, 214 94 C 206 116, 196 112, 200 154 Z" opacity="0.4" style={{ animationDelay: "0.45s" }} />
        </g>
      );
    default:
      return <circle cx="180" cy="90" r="28" fill="none" stroke="currentColor" />;
  }
}
