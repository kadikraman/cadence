const ICON = '/icon.png';

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="brand">
          <img src={ICON} alt="" />
          Cadence
        </a>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/#widgets">Widgets</a>
          <a href="/support">Support</a>
          <a href="/#download-bottom" className="nav-cta">
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
