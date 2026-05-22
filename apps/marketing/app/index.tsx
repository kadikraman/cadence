import Head from 'expo-router/head';
import { useCallback, useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

const WIDGET_SMALL_IOS = '/widget-small.png';
const WIDGET_MEDIUM_IOS = '/widget-medium.png';
const WIDGET_LARGE_IOS = '/widget-large.png';
const WIDGET_SMALL_ANDROID = '/android-widget-small.png';
const WIDGET_MEDIUM_ANDROID = '/android-widget-medium.png';
const WIDGET_LARGE_ANDROID = '/android-widget-large.png';
const SCREEN_TASKS_IOS = '/screen-tasks.png';
const SCREEN_TASKS_ANDROID = '/android-screen-tasks.png';

const APPLE_SVG_PATH =
  'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z';
const ANDROID_SVG_PATH =
  'M17.6 9.48l1.84-3.18a.36.36 0 00-.13-.5.37.37 0 00-.5.13l-1.86 3.22A11.3 11.3 0 0012 7.85a11.3 11.3 0 00-4.94 1.3L5.2 5.93a.37.37 0 00-.5-.13.36.36 0 00-.14.5L6.4 9.48A10.5 10.5 0 001 18h22c0-3.5-2.05-6.55-5.4-8.52zM7.31 14.5a1 1 0 110-2 1 1 0 010 2zm9.38 0a1 1 0 110-2 1 1 0 010 2z';

type Platform = 'ios' | 'android';

function Checkmark() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10.5l4 4 8-9"
        stroke="#0F9A87"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppStoreButton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <a
      href="https://apps.apple.com/app/id6754192837"
      className="dl-btn"
      aria-label={ariaLabel}
      target="_blank"
      rel="noreferrer"
    >
      <svg className="store-logo" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d={APPLE_SVG_PATH} />
      </svg>
      <span className="dl-text">
        <span className="small">Download on the</span>
        <span className="big">App Store</span>
      </span>
    </a>
  );
}

const ANDROID_TESTING_EMAIL = 'cadence@kadi.dev';
const GOOGLE_PLAY_CLOSED_TESTING_URL =
  'https://support.google.com/googleplay/android-developer/answer/9845334';

function GooglePlayButton({
  ariaLabel,
  onClick,
}: {
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="dl-btn secondary"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <svg className="store-logo" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3.6 2.3a1.6 1.6 0 00-.6 1.25v16.9c0 .49.22.93.57 1.22l9.92-9.92L3.6 2.3z"
          fill="#EA4335"
        />
        <path
          d="M3.6 2.3l9.89 9.45 3.04-3.04L4.83 1.91a1.59 1.59 0 00-1.23.39z"
          fill="#4285F4"
        />
        <path
          d="M3.57 21.67c.18.13.4.21.62.23.3.02.6-.05.86-.2l11.49-6.49-3.05-3.05-9.92 9.51z"
          fill="#34A853"
        />
        <path
          d="M16.54 8.71l-3.05 3.04 3.05 3.05 3.55-2c.84-.48.84-1.72 0-2.2l-3.55-1.89z"
          fill="#FBBC04"
        />
      </svg>
      <span className="dl-text">
        <span className="small">Get it on</span>
        <span className="big">Google Play</span>
      </span>
    </button>
  );
}

function AndroidTestingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ANDROID_TESTING_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="android-modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h3 id="android-modal-title">Would love your help testing Cadence on Android</h3>
        <p>
          The Android build is still being polished, so it&apos;s in{' '}
          <a
            href={GOOGLE_PLAY_CLOSED_TESTING_URL}
            target="_blank"
            rel="noreferrer"
          >
            Google Play closed testing
          </a>{' '}
          rather than on the Play Store just yet.
        </p>
        <p>
          If you&apos;d like to help out, send me a quick note with the Google account you use on
          the Play Store and I&apos;ll add you to the testers list. Thank you!
        </p>
        <div className="modal-email" aria-label="Email address">
          <span className="modal-email-value">{ANDROID_TESTING_EMAIL}</span>
          <button
            type="button"
            className="modal-email-copy"
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('ios');
  const [androidModalOpen, setAndroidModalOpen] = useState(false);
  const openAndroidModal = useCallback(() => setAndroidModalOpen(true), []);
  const closeAndroidModal = useCallback(() => setAndroidModalOpen(false), []);

  return (
    <>
      <Head>
        <title>Cadence · Quiet reminders for the recurring stuff</title>
        <meta
          name="description"
          content="Cadence is the quiet app for the recurring stuff. Water the plants, change the filter, check on the car. Tracked at a glance from your Home Screen. No push notifications, ever. On iOS, with Android in private testing."
        />
      </Head>

      <Nav />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="dot"></span>
              iOS and Android
            </div>
            <h1>
              Quiet reminders,
              <br />
              no pings.
            </h1>
            <p className="lede">
              Cadence is the quiet app for the recurring stuff. Water the plants, change the
              filter, check on the car. It sits on your Home Screen and waits. Glance when you
              want.
            </p>
            <div className="dl-row">
              <AppStoreButton ariaLabel="Download on the App Store" />
              <GooglePlayButton ariaLabel="Get it on Google Play" onClick={openAndroidModal} />
            </div>
            <div className="hero-meta">
              <span className="chk">
                <Checkmark />
                No push notifications
              </span>
              <span className="chk">
                <Checkmark />
                Free · on-device
              </span>
              <span className="chk">
                <Checkmark />
                Native on both
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-phone ios">
              <div className="platform-pill">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d={APPLE_SVG_PATH} />
                </svg>
                iOS
              </div>
              <img src={SCREEN_TASKS_IOS} alt="Cadence task list on iPhone" />
            </div>
            <div className="hero-phone android">
              <div className="platform-pill">
                <svg viewBox="0 0 24 24" fill="#3DDC84">
                  <path d={ANDROID_SVG_PATH} />
                </svg>
                Android
              </div>
              <img src={SCREEN_TASKS_ANDROID} alt="Cadence task list on Pixel" />
            </div>
          </div>
        </div>
      </section>

      <section className="platforms">
        <div className="wrap">
          <div className="platforms-card">
            <div>
              <div className="eyebrow">Native on both</div>
              <h2>Two phones. One quiet app.</h2>
              <p>
                Not a wrapper. Not a port. Cadence is written for each platform's own conventions
                — so it feels like it was always there.
              </p>
              <div className="platforms-points">
                <div className="point">
                  <span className="pi">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d={APPLE_SVG_PATH} />
                    </svg>
                  </span>
                  <span>
                    <strong>iOS</strong>
                    SF&nbsp;Pro, Human Interface Guidelines, three WidgetKit sizes, Lock Screen
                    complications.
                  </span>
                </div>
                <div className="point">
                  <span className="pi" style={{ background: '#DCF1E2', color: '#0E7A40' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d={ANDROID_SVG_PATH} />
                    </svg>
                  </span>
                  <span>
                    <strong>Android</strong>
                    Material 3, dynamic color, three Glance widget sizes, M3 dialogs and tabs.
                  </span>
                </div>
                <div className="point">
                  <span className="pi">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
                    </svg>
                  </span>
                  <span>
                    <strong>Same data model</strong>
                    Cadences, streaks, glyph + tint set — identical on either side. Swap phones
                    and it feels the same.
                  </span>
                </div>
                <div className="point">
                  <span className="pi">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <span>
                    <strong>On device, both ways</strong>
                    No account on either platform. Your data doesn't go anywhere.
                  </span>
                </div>
              </div>
            </div>
            <div className="platforms-visual" aria-hidden="true">
              <div className="pv-line"></div>
              <div className="pv-icon ios">
                <svg viewBox="0 0 24 24" fill="#0E2540">
                  <path d={APPLE_SVG_PATH} />
                </svg>
              </div>
              <div className="pv-center">One app. One feeling.</div>
              <div className="pv-icon android">
                <svg viewBox="0 0 24 24" fill="#3DDC84">
                  <path d={ANDROID_SVG_PATH} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="widgets" className="widgets">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Home Screen widgets</div>
            <h2>One glance and you're done.</h2>
            <p>
              Three sizes on iOS, three on Android. What's due, what's overdue, and what's coming
              up — without opening the app.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="platform-toggle" role="tablist" aria-label="Choose platform">
              <button
                className={platform === 'ios' ? 'active' : undefined}
                role="tab"
                aria-selected={platform === 'ios'}
                onClick={() => setPlatform('ios')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d={APPLE_SVG_PATH} />
                </svg>
                iOS
              </button>
              <button
                className={platform === 'android' ? 'active' : undefined}
                role="tab"
                aria-selected={platform === 'android'}
                onClick={() => setPlatform('android')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d={ANDROID_SVG_PATH} />
                </svg>
                Android
              </button>
            </div>
          </div>

          <div className="widget-row">
            <div className="widget-card small">
              <div className="widget-image">
                <img
                  src={platform === 'ios' ? WIDGET_SMALL_IOS : WIDGET_SMALL_ANDROID}
                  alt={`Cadence small widget on ${platform === 'ios' ? 'iOS' : 'Android'}`}
                />
              </div>
              <div>
                <div className="widget-label">Small</div>
                <h3 style={{ marginTop: 8 }}>The next thing</h3>
              </div>
              <p className="widget-desc">
                One task, one count. For when you just want to know what's next.
              </p>
            </div>

            <div className="widget-card medium">
              <div className="widget-image">
                <img
                  src={platform === 'ios' ? WIDGET_MEDIUM_IOS : WIDGET_MEDIUM_ANDROID}
                  alt={`Cadence medium widget on ${platform === 'ios' ? 'iOS' : 'Android'}`}
                />
              </div>
              <div>
                <div className="widget-label">Medium</div>
                <h3 style={{ marginTop: 8 }}>Three up top</h3>
              </div>
              <p className="widget-desc">
                The next three items on your list. Red for overdue, blue for today.
              </p>
            </div>

            <div className="widget-card large">
              <div className="widget-image">
                <img
                  src={platform === 'ios' ? WIDGET_LARGE_IOS : WIDGET_LARGE_ANDROID}
                  alt={`Cadence large widget on ${platform === 'ios' ? 'iOS' : 'Android'}`}
                />
              </div>
              <div>
                <div className="widget-label">Large</div>
                <h3 style={{ marginTop: 8 }}>Everything at once</h3>
              </div>
              <p className="widget-desc">
                Overdue, today, total. Plus the full list. Your streak, quietly, at the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Built for the recurring stuff</div>
            <h2>
              Small app. One job.
              <br />
              Done well.
            </h2>
            <p>
              Cadence doesn't replace your todo list. It handles the specific things that come
              back around.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v3M12 19v3M5 12H2M22 12h-3M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12M18.36 18.36l-2.12-2.12M7.76 7.76L5.64 5.64" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <h3>Flexible cadences</h3>
              <p>
                Every 3 days. Every 2 weeks. First Monday of the month. Set it once. Cadence keeps
                the schedule.
              </p>
            </div>

            <div className="feature tint-teal">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <h3>On your Home Screen</h3>
              <p>
                Small, medium, and large widgets, so the list is always one glance away. No need
                to launch anything.
              </p>
            </div>

            <div className="feature tint-warn">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                  <line x1="4" y1="4" x2="20" y2="20" />
                </svg>
              </div>
              <h3>No push notifications</h3>
              <p>
                Zero pings. Ever. Your phone doesn't buzz at you. You look when you're ready.
                That's the whole pitch.
              </p>
            </div>

            <div className="feature tint-purple">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>Streaks &amp; stats</h3>
              <p>
                See your on-time rate, your longest streak, and which tasks you're most consistent
                with. Gentle nudges, not shame.
              </p>
            </div>

            <div className="feature">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h3>Your data stays put</h3>
              <p>
                Tasks live on your device. No account, no cloud by default. Anonymous crash
                reports only. Nothing identifying.
              </p>
            </div>

            <div className="feature tint-teal">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                </svg>
              </div>
              <h3>Pick a color, pick an icon</h3>
              <p>
                Twenty calm tints. Forty-two glyphs. Plus Material You dynamic color on Android.
                Your list looks like a shelf, not a spreadsheet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="download-bottom" className="closing">
        <div className="wrap">
          <h2>Let your phone be quiet again.</h2>
          <p>
            Cadence is free on the App Store, and in private testing on Android. Try it for a
            week. If it's not for you, delete it. Your data never left your device anyway.
          </p>
          <div className="dl-row" style={{ justifyContent: 'center' }}>
            <AppStoreButton ariaLabel="Download on the App Store" />
            <GooglePlayButton ariaLabel="Get it on Google Play" onClick={openAndroidModal} />
          </div>
        </div>
      </section>

      <Footer />

      <AndroidTestingModal open={androidModalOpen} onClose={closeAndroidModal} />
    </>
  );
}
