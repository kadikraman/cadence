import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Young+Serif&display=swap"
        />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const globalStyles = `
:root {
  /* Cool blue-tinted whites that match the icon and store screenshots */
  --bg: #F2F6FC;
  --bg-soft: #E4EDF8;
  --ink: #0E2540;            /* deep navy, near-black */
  --ink-2: #334D6E;
  --ink-3: #5E7493;
  --ink-4: #97A7BF;
  --rule: rgba(14, 37, 64, 0.08);
  --rule-strong: rgba(14, 37, 64, 0.14);
  --accent: #0A6BD8;         /* primary brand blue */
  --accent-2: #2F8AFF;       /* mid blue */
  --accent-soft: #DCE9FB;
  --accent-ink: #08418A;
  --teal: #0F9A87;
  --warn: #F39C2A;
  --purple: #8B5CF6;
  --surface: #FFFFFF;
  --shadow-sm: 0 1px 2px rgba(14, 37, 64, 0.06), 0 0 0 0.5px rgba(14, 37, 64, 0.06);
  --shadow-md: 0 6px 24px rgba(14, 37, 64, 0.08), 0 0 0 0.5px rgba(14, 37, 64, 0.06);
  --shadow-lg: 0 20px 60px rgba(14, 37, 64, 0.14), 0 0 0 0.5px rgba(14, 37, 64, 0.06);
  --radius: 18px;
  --radius-sm: 12px;
  --radius-lg: 28px;
}

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  scroll-padding-top: 72px;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  height: auto;
  overflow: auto;
}

#root {
  display: block;
  height: auto;
  min-height: 100vh;
}

h1, h2, h3 {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0;
  font-weight: 600;
  text-wrap: balance;
}
h1 { font-size: clamp(44px, 7.2vw, 96px); }
h2 { font-size: clamp(32px, 4.4vw, 56px); letter-spacing: -0.025em; line-height: 1.1; }
h3 { font-size: 22px; letter-spacing: -0.015em; font-weight: 600; }

p { margin: 0; color: var(--ink-2); text-wrap: pretty; }

a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-ink); }

.wrap {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 48px);
}

/* ─── CONTENT PAGES (privacy / support) ──── */
.content-hero {
  padding: 72px 0 48px;
  border-bottom: 0.5px solid var(--rule);
}
.content-hero .kicker {
  font-size: 13px; font-weight: 600;
  color: var(--accent); letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.content-hero h1 {
  font-size: clamp(38px, 5.4vw, 64px);
  margin-bottom: 16px;
}
.content-hero p { font-size: 19px; max-width: 620px; }

.article {
  max-width: 720px;
  padding: 56px 28px 80px;
  margin: 0 auto;
}
.article h2 {
  font-size: 26px;
  margin: 48px 0 16px;
  letter-spacing: -0.02em;
}
.article h2:first-child { margin-top: 0; }
.article p { margin: 0 0 14px; font-size: 17px; color: var(--ink-2); line-height: 1.6; }
.article ul { padding-left: 22px; margin: 0 0 14px; }
.article ul li { margin-bottom: 8px; color: var(--ink-2); line-height: 1.55; }
.article strong { color: var(--ink); font-weight: 600; }

.callout {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
  margin: 24px 0;
  display: flex; gap: 16px; align-items: flex-start;
}
.callout .ci {
  width: 34px; height: 34px; flex-shrink: 0;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  display: inline-flex; align-items: center; justify-content: center;
}
.callout h3 { font-size: 16px; font-weight: 600; margin: 0 0 4px; }
.callout p { font-size: 15px; margin: 0; }

.contact-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow-md);
  margin: 24px 0 40px;
  display: flex; justify-content: space-between; align-items: center; gap: 24px;
  flex-wrap: wrap;
}
.contact-card h3 { margin: 0 0 6px; font-size: 20px; }
.contact-card p { margin: 0; font-size: 15px; }
.contact-card .mail-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 12px 20px;
  background: var(--ink);
  color: #fff !important;
  border-radius: 12px;
  font-weight: 500;
  font-size: 15px;
}
.contact-card .mail-btn:hover { background: var(--accent-ink); }

.faq details {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: 12px;
  padding: 4px 0;
}
.faq summary {
  list-style: none; cursor: pointer;
  padding: 18px 22px;
  display: flex; justify-content: space-between; align-items: center;
  gap: 14px;
  font-weight: 600;
  color: var(--ink);
  font-size: 17px;
}
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after {
  content: "＋";
  color: var(--ink-3);
  font-size: 20px; font-weight: 400;
  transition: transform 0.2s ease;
}
.faq details[open] summary::after { transform: rotate(45deg); }
.faq details[open] summary { padding-bottom: 10px; }
.faq .faq-body {
  padding: 0 22px 20px;
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.6;
}
.faq .faq-body p + p { margin-top: 10px; }

/* ─── LANDING ─────────────────────────────── */
:root {
  --lp-bg: oklch(0.97 0.012 250);
  --lp-bg2: oklch(0.94 0.022 250);
  --lp-card: oklch(0.995 0.004 250);
  --lp-ink: oklch(0.23 0.03 260);
  --lp-ink2: oklch(0.48 0.03 260);
  --lp-line: oklch(0.88 0.02 250);
  --lp-accent: oklch(0.53 0.19 258);
  --lp-on-accent: #fff;
  --lp-late: oklch(0.6 0.15 50);
}
@media (prefers-color-scheme: dark) {
  :root:has(.lp):not([data-theme=light]) {
    --lp-bg: oklch(0.2 0.028 260);
    --lp-bg2: oklch(0.235 0.032 260);
    --lp-card: oklch(0.27 0.034 260);
    --lp-ink: oklch(0.95 0.01 250);
    --lp-ink2: oklch(0.74 0.025 250);
    --lp-line: oklch(0.34 0.035 260);
    --lp-accent: oklch(0.72 0.14 252);
    --lp-on-accent: oklch(0.2 0.028 260);
    --lp-late: oklch(0.75 0.14 55);
  }
}
:root[data-theme=dark] {
  --lp-bg: oklch(0.2 0.028 260);
  --lp-bg2: oklch(0.235 0.032 260);
  --lp-card: oklch(0.27 0.034 260);
  --lp-ink: oklch(0.95 0.01 250);
  --lp-ink2: oklch(0.74 0.025 250);
  --lp-line: oklch(0.34 0.035 260);
  --lp-accent: oklch(0.72 0.14 252);
  --lp-on-accent: oklch(0.2 0.028 260);
  --lp-late: oklch(0.75 0.14 55);
}
html:has(.lp) { scroll-padding-top: 0; color-scheme: light; }
@media (prefers-color-scheme: dark) {
  html:has(.lp):not([data-theme=light]) { color-scheme: dark; }
}
html[data-theme=dark]:has(.lp) { color-scheme: dark; }
html:has(.lp), html:has(.lp) body { background: var(--lp-bg); }

.lp {
  background: var(--lp-bg);
  color: var(--lp-ink);
  font-family: 'Hanken Grotesk', system-ui, sans-serif;
  font-size: 16px;
  line-height: normal;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  overflow-x: clip;
}
.lp a, .lp-chrome a { color: var(--lp-ink); text-decoration: underline; text-underline-offset: 3px; }
.lp a:hover, .lp-chrome a:hover { color: var(--lp-accent); }
.lp button { font: inherit; }
.lp p { color: var(--lp-ink2); text-wrap: pretty; }
.lp h1, .lp h2, .lp h3 {
  font-family: 'Young Serif', Georgia, serif;
  font-weight: 400;
  margin: 0;
}

.lp-glyph {
  font-family: 'Material Symbols Rounded';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  -webkit-font-feature-settings: 'liga';
  font-feature-settings: 'liga';
}

.lp-wrap {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding-left: clamp(20px, 5vw, 48px);
  padding-right: clamp(20px, 5vw, 48px);
}

.lp-chrome {
  color: var(--lp-ink);
  font-family: 'Hanken Grotesk', system-ui, sans-serif;
  font-size: 16px;
  line-height: normal;
}
.lp-header {
  padding-top: 28px;
  padding-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.lp-chrome .lp-brand {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Young Serif', Georgia, serif;
  font-size: 22px;
  text-decoration: none;
  color: var(--lp-ink);
}
.lp-theme {
  flex: none;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--lp-ink2);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.lp-theme:hover { color: var(--lp-ink); background: var(--lp-bg2); }
.lp-brand img {
  display: block;
  width: 36px; height: 36px;
  margin: -4px 0 -4px -6px;
}
.lp-chrome .lp-get {
  flex: none;
  font-size: 15px;
  font-weight: 600;
  color: var(--lp-accent);
  text-decoration: none;
}

.lp-hero {
  padding-top: clamp(64px, 10vw, 144px);
  padding-bottom: clamp(64px, 8vw, 112px);
}
.lp-hero h1 {
  font-size: clamp(44px, 6.4vw, 88px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  max-width: 10.5em;
  text-wrap: balance;
}
.lp-hero p {
  margin: 32px 0 0;
  font-size: clamp(18px, 1.6vw, 21px);
  line-height: 1.6;
  max-width: 30em;
}

.lp-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 28px;
  margin-top: 40px;
}
.lp .lp-pill {
  display: inline-flex;
  align-items: center;
  height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  background: var(--lp-accent);
  color: var(--lp-on-accent);
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
}
.lp .lp-pill:hover { color: var(--lp-on-accent); opacity: 0.9; }
.lp-android {
  height: 52px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--lp-ink);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: var(--lp-accent);
  text-underline-offset: 5px;
  text-decoration-thickness: 1.5px;
}

.lp-widgets {
  border-radius: clamp(24px, 3vw, 36px);
  background: var(--lp-bg2);
  padding: clamp(28px, 6vw, 72px) clamp(20px, 5vw, 64px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: 40px clamp(20px, 3vw, 32px);
}
.lp-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(100%, 360px);
}
.lp-figure-small { width: 170px; }
.lp-figure figcaption { font-size: 14px; color: var(--lp-ink2); }
.lp-widget {
  border-radius: 24px;
  background: var(--lp-card);
  box-shadow: 0 1px 2px rgba(20, 35, 70, 0.06), 0 12px 32px -12px rgba(20, 35, 70, 0.16);
  display: flex;
  flex-direction: column;
}
.lp-widget-small {
  width: 170px; height: 170px;
  padding: 16px;
  justify-content: space-between;
}
.lp-widget-medium {
  height: 170px;
  padding: 16px 18px;
  justify-content: space-between;
}
.lp-widget-large { height: 376px; padding: 18px; }
.lp-tile {
  flex: none;
  display: grid;
  place-items: center;
}
.lp-tile-glyph { color: #fff; font-variation-settings: 'FILL' 1; }
.lp-small-title { font-size: 16px; font-weight: 600; line-height: 1.2; }
.lp-small-due { font-size: 14px; font-weight: 500; color: var(--lp-accent); margin-top: 4px; }
.lp-row { display: flex; align-items: center; gap: 12px; }
.lp-row-title { flex: 1; min-width: 0; font-size: 15px; font-weight: 600; }
.lp-due { font-size: 13px; color: var(--lp-ink2); }
.lp-due-today { font-weight: 500; color: var(--lp-accent); }
.lp-due-late { font-weight: 500; color: var(--lp-late); }
.lp-counts {
  display: flex;
  gap: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--lp-line);
}
.lp-count { font-family: 'Young Serif', Georgia, serif; font-size: 28px; line-height: 1; }
.lp-count-late { color: var(--lp-late); }
.lp-count-today { color: var(--lp-accent); }
.lp-count-label { font-size: 12px; color: var(--lp-ink2); margin-top: 4px; }
.lp-large-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-top: 6px;
}
.lp .lp-widgets-note { margin: 24px 0 0; text-align: center; font-size: 15px; }

.lp-details { padding-top: clamp(96px, 12vw, 160px); }
.lp-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 48px;
  padding: 40px 0;
  border-top: 1px solid var(--lp-line);
}
.lp-detail:last-child { border-bottom: 1px solid var(--lp-line); }
.lp-detail h2 {
  flex: 1 1 260px;
  font-size: clamp(26px, 2.6vw, 32px);
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-wrap: initial;
}
.lp-detail p, .lp-detail ul {
  flex: 2 1 420px;
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
  color: var(--lp-ink2);
}
.lp-detail ul {
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 10px 32px;
  line-height: 1.5;
}

.lp-download {
  padding-top: clamp(112px, 14vw, 192px);
  padding-bottom: clamp(112px, 14vw, 192px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lp-download h2 {
  font-size: clamp(36px, 4.6vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-wrap: balance;
}
.lp-download p { margin: 20px 0 0; font-size: 18px; line-height: 1.6; max-width: 28em; }
.lp-download .lp-actions { justify-content: center; margin-top: 36px; }

.lp-footer {
  padding-top: 32px;
  padding-bottom: 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px 32px;
  font-size: 14px;
  color: var(--lp-ink2);
}
.lp-footer nav { display: flex; flex-wrap: wrap; gap: 8px 28px; }
.lp-chrome.lp-footer a { color: var(--lp-ink2); }
.lp-chrome.lp-footer a:hover { color: var(--lp-accent); }

.lp-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: oklch(0.2 0.03 260 / 0.4);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.lp-modal {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--lp-card);
  color: var(--lp-ink);
  border-radius: 24px;
  padding: clamp(24px, 5vw, 32px);
  box-shadow: 0 30px 80px -20px rgba(10, 20, 45, 0.45), inset 0 0 0 1px var(--lp-line);
}
.lp-modal h3 { font-size: 26px; line-height: 1.15; letter-spacing: normal; padding-right: 40px; }
.lp-modal p { margin: 12px 0 0; font-size: 16px; line-height: 1.55; }
.lp-modal-close {
  position: absolute;
  top: 14px; right: 14px;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--lp-ink2);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.lp-modal-close:hover { background: var(--lp-bg2); }
.lp-email {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 6px 6px 16px;
  border-radius: 14px;
  background: var(--lp-bg2);
}
.lp-email span { flex: 1; min-width: 0; font-size: 16px; font-weight: 500; overflow-wrap: anywhere; }
.lp-email button {
  flex: none;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 0;
  background: var(--lp-card);
  color: var(--lp-ink);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.lp-modal-actions { gap: 12px 24px; margin-top: 24px; }
.lp-modal-actions .lp-pill { height: 48px; padding: 0 22px; font-size: 15px; }
.lp-not-now {
  height: 48px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--lp-ink2);
  cursor: pointer;
  font-size: 15px;
}
.lp-not-now:hover { color: var(--lp-ink); }
`;
