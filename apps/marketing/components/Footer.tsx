const EMAIL = 'cadence@kadi.dev';

export function Footer() {
  return (
    <footer className="lp-wrap lp-chrome lp-footer">
      <span>Cadence · cadence.kadi.dev</span>
      <nav>
        <a href="/support">Support</a>
        <a href="/privacy">Privacy</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </nav>
    </footer>
  );
}
