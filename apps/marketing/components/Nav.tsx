import type { ReactNode } from 'react';

const HEAT = [
  [0, 0, 1, 1, 0, 0, 0],
  [0, 1, 2, 3, 1, 0, 0],
  [1, 2, 3, 4, 3, 1, 0],
  [1, 3, 4, 4, 4, 2, 1],
  [0, 1, 3, 4, 3, 1, 0],
  [0, 0, 1, 3, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];

function heatAt(x: number, y: number) {
  const col = Math.round(x + 3);
  const row = Math.round(y + 3);
  return HEAT[row]?.[col] ?? 0;
}

const DOTS = Array.from({ length: 7 }, (_, row) =>
  Array.from({ length: 9 }, (_, col) => {
    const j = row - 3;
    const x = (col - 4 + (Math.abs(j) % 2) * 0.5) * 1.06;
    const y = j * 0.95;
    const level = heatAt(x, y);
    return { x, y, level, r: level ? 0.37 : 0.16 };
  })
)
  .flat()
  .filter(dot => Math.hypot(dot.x, dot.y) <= 3.3);

function Mark() {
  return (
    <svg viewBox="-3.6 -3.6 7.2 7.2" width={34} height={34} aria-hidden="true">
      {DOTS.map(dot => (
        <circle
          key={`${dot.x},${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={`var(--lp-mark-${dot.level})`}
        />
      ))}
    </svg>
  );
}

export function Nav({ children }: { children?: ReactNode }) {
  return (
    <header className="lp-wrap lp-chrome lp-header">
      <a href="/#top" className="lp-brand">
        <Mark />
        <span>Cadence</span>
      </a>
      {children}
      <a href="/#download" className="lp-get">
        Get Cadence
      </a>
    </header>
  );
}
