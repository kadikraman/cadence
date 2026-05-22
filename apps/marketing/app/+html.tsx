import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
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
  --maxw: 1160px;
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
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 28px;
}
@media (max-width: 640px) {
  .wrap { padding: 0 20px; }
}

/* ─── NAV ─────────────────────────────────── */
.nav {
  position: sticky; top: 0; z-index: 20;
  background: rgba(242, 246, 252, 0.82);
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);
  border-bottom: 0.5px solid var(--rule);
}
.nav-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 14px 28px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
}
.brand {
  display: inline-flex; align-items: center; gap: 10px;
  color: var(--ink);
  font-weight: 600;
  font-size: 17px;
  letter-spacing: -0.01em;
}
.brand img {
  width: 30px; height: 30px; border-radius: 7px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.nav-links {
  display: flex; align-items: center; gap: 28px;
}
.nav-links a {
  color: var(--ink-2);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.nav-links a:hover { color: var(--ink); }
.nav-cta {
  padding: 7px 14px;
  background: var(--ink);
  color: #fff !important;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
}
.nav-cta:hover { background: var(--accent-ink); color: #fff !important; }
@media (max-width: 640px) {
  .nav-links a:not(.nav-cta) { display: none; }
}

/* ─── DOWNLOAD BUTTONS ───────────────────── */
.dl-row {
  display: inline-flex; flex-wrap: wrap; gap: 12px;
  align-items: center;
}
.dl-btn {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 14px 22px 14px 18px;
  border-radius: 14px;
  background: var(--ink);
  color: #fff !important;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: transform 0.12s ease, background 0.18s ease;
  border: 0;
  cursor: pointer;
}
.dl-btn:hover { transform: translateY(-1px); background: var(--accent-ink); color: #fff !important; }
.dl-btn.secondary {
  background: var(--surface);
  color: var(--ink) !important;
  box-shadow: var(--shadow-sm);
}
.dl-btn.secondary:hover { background: #fff; color: var(--ink) !important; transform: translateY(-1px); box-shadow: var(--shadow-md); }
.dl-btn .store-logo { width: 24px; height: 24px; flex-shrink: 0; }
.dl-btn .dl-text { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15; }
.dl-btn .dl-text .small { font-size: 11px; opacity: 0.72; letter-spacing: 0.02em; text-transform: uppercase; }
.dl-btn .dl-text .big { font-size: 17px; font-weight: 600; }

/* ─── HERO ───────────────────────────────── */
.hero {
  position: relative;
  padding: 80px 0 100px;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: -10% -10% auto -10%;
  height: 80%;
  background: radial-gradient(ellipse at 30% 20%, rgba(47, 138, 255, 0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 0%, rgba(10, 107, 216, 0.12) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
.hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 60px;
  align-items: center;
}
@media (max-width: 960px) {
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero { padding: 56px 0 80px; }
}
.hero-copy .eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 8px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  font-size: 13px;
  color: var(--ink-2);
  font-weight: 500;
  margin-bottom: 24px;
}
.hero-copy .eyebrow .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.hero-copy h1 { margin-bottom: 20px; }
.hero-copy .lede {
  font-size: 20px;
  color: var(--ink-2);
  max-width: 520px;
  margin-bottom: 32px;
  line-height: 1.5;
  letter-spacing: -0.01em;
}
.hero-copy .hero-meta {
  display: flex; gap: 20px; margin-top: 24px;
  font-size: 13px; color: var(--ink-3);
  align-items: center;
  flex-wrap: wrap;
}
.hero-copy .hero-meta .chk {
  display: inline-flex; align-items: center; gap: 6px;
}

/* Two-phone hero visual */
.hero-visual {
  position: relative;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.hero-phone {
  position: relative;
  flex: 0 0 auto;
  width: 230px;
  aspect-ratio: 1170 / 2532;
  padding: 5px;
  background: #0c0c0c;
  box-shadow: var(--shadow-lg);
}
.hero-phone.ios {
  border-radius: 38px;
  transform: rotate(-3deg) translateY(8px);
}
.hero-phone.ios img {
  border-radius: 33px;
}
.hero-phone.android {
  border-radius: 32px;
  transform: rotate(3deg) translateY(-8px);
}
.hero-phone.android img {
  border-radius: 28px;
}
.hero-phone img {
  width: 100%; height: 100%; object-fit: cover;
  display: block;
}
.hero-phone .platform-pill {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: 5;
}
.hero-phone.ios .platform-pill { transform: translateX(-50%) rotate(3deg); }
.hero-phone.android .platform-pill { transform: translateX(-50%) rotate(-3deg); }
.hero-phone .platform-pill svg { width: 12px; height: 12px; }

@media (max-width: 960px) {
  .hero-visual { padding: 12px 0; gap: 12px; }
  .hero-phone { width: 200px; }
}
@media (max-width: 560px) {
  .hero-visual { gap: 8px; }
  .hero-phone { width: 160px; }
  .hero-phone.ios { transform: rotate(-3deg) translateY(6px); }
  .hero-phone.android { transform: rotate(3deg) translateY(-6px); }
}

/* ─── NATIVE-ON-BOTH ─────────────────────── */
.platforms {
  padding: 80px 0 20px;
}
.platforms-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 48px;
  box-shadow: var(--shadow-md);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
@media (max-width: 800px) {
  .platforms-card { grid-template-columns: 1fr; padding: 36px 28px; gap: 28px; }
}
.platforms-card .eyebrow {
  font-size: 13px; font-weight: 600;
  color: var(--accent); letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.platforms-card h2 { font-size: clamp(28px, 3.4vw, 40px); margin-bottom: 12px; }
.platforms-card p { font-size: 16px; line-height: 1.55; }
.platforms-points {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  margin-top: 22px;
}
.platforms-points .point {
  display: flex;
  gap: 10px;
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1.4;
}
.platforms-points .point .pi {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent);
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.platforms-points .point strong { color: var(--ink); display: block; font-weight: 600; font-size: 14px; }

.platforms-visual {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.platforms-visual .pv-icon {
  position: absolute;
  width: 88px; height: 88px;
  border-radius: 22px;
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}
.platforms-visual .pv-icon svg { width: 52px; height: 52px; }
.platforms-visual .pv-icon.ios {
  top: 20px; left: 22%;
  transform: rotate(-6deg);
}
.platforms-visual .pv-icon.android {
  bottom: 20px; right: 22%;
  transform: rotate(6deg);
}
.platforms-visual .pv-line {
  position: absolute;
  inset: 50% 16% auto 16%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--rule-strong) 30%, var(--rule-strong) 70%, transparent);
}
.platforms-visual .pv-center {
  position: relative;
  z-index: 2;
  padding: 14px 22px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  box-shadow: var(--shadow-md);
}
@media (max-width: 800px) {
  .platforms-visual { height: 220px; }
  .platforms-visual .pv-icon.ios { left: 12%; }
  .platforms-visual .pv-icon.android { right: 12%; }
}

/* ─── WIDGETS SECTION ────────────────────── */
.widgets {
  padding: 100px 0;
  background: linear-gradient(180deg, transparent 0%, var(--bg-soft) 40%, var(--bg-soft) 60%, transparent 100%);
}
.widgets .section-head {
  text-align: center;
  max-width: 680px; margin: 0 auto 32px;
}
.widgets .section-head .eyebrow {
  font-size: 13px; font-weight: 600;
  color: var(--accent); letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.widgets .section-head p { font-size: 19px; margin-top: 16px; color: var(--ink-2); }

.platform-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  margin: 8px auto 56px;
}
.platform-toggle button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--ink-3);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
  font-family: inherit;
}
.platform-toggle button:hover { color: var(--ink); }
.platform-toggle button.active {
  background: var(--ink);
  color: #fff;
}
.platform-toggle button svg { width: 14px; height: 14px; }

.widget-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1.4fr;
  gap: 28px;
  align-items: end;
}
@media (max-width: 860px) {
  .widget-row { grid-template-columns: 1fr; gap: 40px; max-width: 340px; margin: 0 auto; }
}
.widget-card {
  display: flex; flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}
.widget-card .widget-image {
  background: #fff;
  border-radius: 36px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  width: 100%;
  max-width: 320px;
  position: relative;
}
.widget-card.small .widget-image { max-width: 200px; }
.widget-card .widget-image img {
  width: 100%; display: block;
  transition: opacity 0.25s ease;
}
.widget-card .widget-image img.hidden { display: none; }
.widget-card .widget-label {
  font-size: 13px; font-weight: 600; color: var(--accent);
  letter-spacing: 0.08em; text-transform: uppercase;
}
.widget-card .widget-desc {
  font-size: 15px;
  color: var(--ink-2);
  text-align: center;
  max-width: 280px;
  line-height: 1.45;
}

/* ─── FEATURES ───────────────────────────── */
.features {
  padding: 100px 0;
}
.features .section-head {
  text-align: center;
  max-width: 680px; margin: 0 auto 72px;
}
.features .section-head .eyebrow {
  font-size: 13px; font-weight: 600;
  color: var(--accent); letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.features .section-head p { font-size: 19px; margin-top: 16px; color: var(--ink-2); }

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 860px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .feature-grid { grid-template-columns: 1fr; } }

.feature {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.feature:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.feature .ficon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
}
.feature h3 {
  margin-bottom: 10px;
  color: var(--ink);
  letter-spacing: -0.015em;
}
.feature p { font-size: 15px; line-height: 1.5; color: var(--ink-2); }

.feature.tint-teal .ficon { background: #D6F0EB; color: var(--teal); }
.feature.tint-warn .ficon { background: #FFEBD1; color: var(--warn); }
.feature.tint-purple .ficon { background: #ECE2FB; color: var(--purple); }

.closing {
  padding: 100px 0 120px;
  text-align: center;
}
.closing h2 {
  margin: 0 auto 16px;
  max-width: 640px;
}
.closing p {
  font-size: 19px;
  max-width: 560px;
  margin: 0 auto 36px;
  color: var(--ink-2);
}

.footer {
  border-top: 0.5px solid var(--rule);
  padding: 40px 0 48px;
  background: var(--bg);
}
.footer-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 28px;
  display: flex; justify-content: space-between; flex-wrap: wrap;
  gap: 24px;
  font-size: 14px;
  color: var(--ink-3);
}
.footer a { color: var(--ink-3); }
.footer a:hover { color: var(--ink); }
.footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
.footer-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--ink-2); }
.footer-brand img { width: 22px; height: 22px; border-radius: 5px; }

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

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 37, 64, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  animation: modal-fade 0.18s ease;
}
@keyframes modal-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 32px;
  max-width: 460px;
  width: 100%;
  position: relative;
  animation: modal-rise 0.22s ease;
}
@keyframes modal-rise {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal h3 {
  margin: 0 0 14px;
  font-size: 22px;
  padding-right: 28px;
}
.modal p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 14px;
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: 0;
  padding: 6px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--ink-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover { background: var(--bg-soft); color: var(--ink); }
.modal-email {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 16px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
}
.modal-email-value {
  flex: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 15px;
  color: var(--ink);
  user-select: all;
}
.modal-email-copy {
  background: var(--ink);
  color: #fff;
  border: 0;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.modal-email-copy:hover { background: var(--accent-ink); }
`;
