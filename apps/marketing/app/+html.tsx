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
  --bg: #F4FAF8;
  --bg-soft: #E8F4F0;
  --ink: #0D2A25;
  --ink-2: #334D48;
  --ink-3: #607874;
  --ink-4: #8FA5A1;
  --rule: rgba(13, 42, 37, 0.08);
  --rule-strong: rgba(13, 42, 37, 0.14);
  --accent: #0B8F7A;
  --accent-2: #1FB39A;
  --accent-soft: #D6EEE8;
  --accent-ink: #083F36;
  --blue: #0A84FF;
  --warn: #F39C2A;
  --surface: #FFFFFF;
  --shadow-sm: 0 1px 2px rgba(13, 42, 37, 0.06), 0 0 0 0.5px rgba(13, 42, 37, 0.06);
  --shadow-md: 0 6px 24px rgba(13, 42, 37, 0.08), 0 0 0 0.5px rgba(13, 42, 37, 0.06);
  --shadow-lg: 0 20px 60px rgba(13, 42, 37, 0.14), 0 0 0 0.5px rgba(13, 42, 37, 0.06);
  --radius: 18px;
  --radius-sm: 12px;
  --radius-lg: 28px;
  --maxw: 1160px;
}

* { box-sizing: border-box; }

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

.nav {
  position: sticky; top: 0; z-index: 20;
  background: rgba(244, 250, 248, 0.82);
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
  font-weight: 500;
  letter-spacing: -0.01em;
  transition: transform 0.12s ease, background 0.18s ease;
  border: 0;
}
.dl-btn:hover { transform: translateY(-1px); background: var(--accent-ink); color: #fff !important; }
.dl-btn.secondary {
  background: var(--surface);
  color: var(--ink) !important;
  box-shadow: var(--shadow-sm);
  position: relative;
}
.dl-btn.secondary:hover { background: #fff; color: var(--ink) !important; transform: translateY(-1px); box-shadow: var(--shadow-md); }
.dl-btn .store-logo { width: 24px; height: 24px; flex-shrink: 0; }
.dl-btn .dl-text { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15; }
.dl-btn .dl-text .small { font-size: 11px; opacity: 0.72; letter-spacing: 0.02em; text-transform: uppercase; }
.dl-btn .dl-text .big { font-size: 17px; font-weight: 600; }
.dl-btn.secondary .soon {
  position: absolute; top: -9px; right: -8px;
  background: var(--accent);
  color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 3px 8px; border-radius: 999px;
  letter-spacing: 0.04em; text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(11,143,122,0.35);
}

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
  background: radial-gradient(ellipse at 30% 20%, rgba(31, 179, 154, 0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 0%, rgba(10, 132, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
.hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 72px;
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
}
.hero-copy .hero-meta .chk {
  display: inline-flex; align-items: center; gap: 6px;
}

.hero-visual {
  position: relative;
  display: flex;
  gap: 18px;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
}
.hero-visual .phone-stack {
  position: relative;
  display: flex; flex-direction: column; gap: 16px;
  flex: 0 0 auto;
}
.hero-visual .phone {
  width: 260px;
  aspect-ratio: 1170 / 2532;
  background: #000;
  border-radius: 42px;
  padding: 5px;
  box-shadow: var(--shadow-lg);
}
.hero-visual .phone img {
  width: 100%; height: 100%; object-fit: cover;
  border-radius: 38px;
  display: block;
}
.hero-visual .widget-stack {
  position: relative;
  display: flex; flex-direction: column; gap: 16px;
  flex: 0 0 auto;
}
.hero-visual .widget {
  width: 210px;
  background: #fff;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.hero-visual .widget img {
  width: 100%; display: block;
}
.hero-visual .widget.small { width: 140px; }
.hero-visual .widget.large { width: 210px; }
@media (max-width: 960px) {
  .hero-visual { flex-direction: column-reverse; align-items: center; gap: 28px; }
  .hero-visual .widget-stack { flex-direction: row; gap: 12px; }
  .hero-visual .widget.small, .hero-visual .widget.large { width: 150px; }
}
@media (max-width: 500px) {
  .hero-visual .phone { width: 220px; }
  .hero-visual .widget-stack { flex-direction: column; gap: 12px; }
  .hero-visual .widget.small, .hero-visual .widget.large { width: 180px; }
}

.widgets {
  padding: 100px 0;
  background: linear-gradient(180deg, transparent 0%, var(--bg-soft) 40%, var(--bg-soft) 60%, transparent 100%);
}
.widgets .section-head {
  text-align: center;
  max-width: 680px; margin: 0 auto 64px;
}
.widgets .section-head .eyebrow {
  font-size: 13px; font-weight: 600;
  color: var(--accent); letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.widgets .section-head p { font-size: 19px; margin-top: 16px; color: var(--ink-2); }
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
}
.widget-card .widget-image {
  background: #fff;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  width: 100%;
  max-width: 320px;
}
.widget-card.small .widget-image { max-width: 200px; }
.widget-card .widget-image img { width: 100%; display: block; }
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

.feature.tint-blue .ficon { background: #DDEBFF; color: var(--blue); }
.feature.tint-warn .ficon { background: #FFEBD1; color: var(--warn); }
.feature.tint-purple .ficon { background: #ECE2FB; color: #8B5CF6; }

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
`;
