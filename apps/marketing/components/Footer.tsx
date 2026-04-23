const ICON = '/icon.png';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={ICON} alt="" />
          <span>Cadence · cadence.kadi.dev</span>
        </div>
        <div className="footer-links">
          <a href="/support">Support</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
