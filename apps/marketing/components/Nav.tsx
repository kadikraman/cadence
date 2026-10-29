import type { ReactNode } from 'react';

export function Nav({ children }: { children?: ReactNode }) {
  return (
    <header className="lp-wrap lp-chrome lp-header">
      <a href="/#top" className="lp-brand">
        <img src="/cadence-icon.png" alt="" width={36} height={36} />
        <span>Cadence</span>
      </a>
      {children}
      <a href="/#download" className="lp-get">
        Get Cadence
      </a>
    </header>
  );
}
