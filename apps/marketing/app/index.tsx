import Head from 'expo-router/head';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

const WIDGET_SMALL = '/widget-small.png';
const WIDGET_MEDIUM = '/widget-medium.png';
const WIDGET_LARGE = '/widget-large.png';
const SCREEN_TASKS = '/screen-tasks.png';

export default function Home() {
  return (
    <>
      <Head>
        <title>Cadence · Quiet reminders for the recurring stuff</title>
        <meta
          name="description"
          content="Cadence is a quiet app for keeping teack of the recurring stuff. Water the plants, change the filter, check on the car. Tracked at a glance, on your Home Screen. No push notifications, ever."
        />
      </Head>

      <Nav />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="dot"></span>
              Now on the App Store
            </div>
            <h1>
              Quiet reminders,
              <br />
              no pings.
            </h1>
            <p className="lede">
              Cadence is a quiet app for the recurring stuff. Water the plants, change the filter,
              check on the car. It sits on your Home Screen - glance when you unlock your phone.
            </p>
            <div className="dl-row">
              <a href="#" className="dl-btn" aria-label="Download on the App Store">
                <svg className="store-logo" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="dl-text">
                  <span className="small">Download on the</span>
                  <span className="big">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="dl-btn secondary"
                aria-label="Google Play, coming soon"
                onClick={(e) => e.preventDefault()}
              >
                <svg className="store-logo" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M3.6 2.3a1.6 1.6 0 00-.6 1.25v16.9c0 .49.22.93.57 1.22l9.92-9.92-9.89-9.45z"
                    fill="#34A853"
                  />
                  <path
                    d="M17.1 12l-3.5-3.34-9.92 9.92c.16.13.36.22.58.24.3.02.6-.05.86-.2l12-6.78c.6-.34.6-1.19-.02-1.56"
                    fill="#FBBC04"
                  />
                  <path
                    d="M13.6 8.66l3.5 3.34 3-1.7c.84-.48.84-1.72 0-2.2l-12-6.78a1.59 1.59 0 00-.83-.22l6.33 7.56z"
                    fill="#EA4335"
                  />
                  <path
                    d="M7.27 1.1c-.23.04-.44.13-.62.25L3.6 2.3l9.89 9.45L7.27 1.1z"
                    fill="#4285F4"
                  />
                </svg>
                <span className="dl-text">
                  <span className="small">Get it on</span>
                  <span className="big">Google Play</span>
                </span>
                <span className="soon">Soon</span>
              </a>
            </div>
            <div className="hero-meta">
              <span className="chk">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10.5l4 4 8-9"
                    stroke="#0B8F7A"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                No push notifications
              </span>
              <span className="chk">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10.5l4 4 8-9"
                    stroke="#0B8F7A"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Free · On-device
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="widget-stack">
              <div className="widget small">
                <img src={WIDGET_SMALL} alt="Cadence small Home Screen widget" />
              </div>
              <div className="widget large">
                <img src={WIDGET_MEDIUM} alt="Cadence medium Home Screen widget" />
              </div>
            </div>
            <div className="phone-stack">
              <div className="phone">
                <img src={SCREEN_TASKS} alt="Cadence task list on iPhone" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="widgets" className="widgets">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Home Screen Widgets</div>
            <h2>One glance and you're done.</h2>
            <p>
              Three sizes. See what's due, without opening the app.
            </p>
          </div>

          <div className="widget-row">
            <div className="widget-card small">
              <div className="widget-image">
                <img src={WIDGET_SMALL} alt="" />
              </div>
              <div>
                <div className="widget-label">Small</div>
                <h3 style={{ marginTop: 8 }}>The next thing</h3>
              </div>
              <p className="widget-desc">
                For when you just want to focus on what's next.
              </p>
            </div>

            <div className="widget-card medium">
              <div className="widget-image">
                <img src={WIDGET_MEDIUM} alt="" />
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
                <img src={WIDGET_LARGE} alt="" />
              </div>
              <div>
                <div className="widget-label">Large</div>
                <h3 style={{ marginTop: 8 }}>Everything at once</h3>
              </div>
              <p className="widget-desc">
                Overdue, today, done. Plus the full list. Your totals, at the top.
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
              Keep you from forgetting.
              <br />
              But without the nagging.
            </h2>
            <p>
              Cadence doesn't replace your todo list. It handles the specific things that come back
              around.
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v3M12 19v3M5 12H2M22 12h-3M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12M18.36 18.36l-2.12-2.12M7.76 7.76L5.64 5.64" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <h3>Flexible cadences</h3>
              <p>
                Every 3 days. Every 2 weeks. Cadence keeps track of the schedule.
              </p>
            </div>

            <div className="feature tint-blue">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
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
                Small, medium, and large widgets, so the list is always one glance away.
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
                  strokeWidth="2"
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
                Zero pings. Ever. Enough of notification hell.
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
                  strokeWidth="2"
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
                with.
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h3>Your data stays put</h3>
              <p>
                Tasks live on your device. No account, no cloud sync. Anonymous crash reports and performance metrics
                only. Nothing identifying.
              </p>
            </div>

            <div className="feature tint-blue">
              <div className="ficon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                </svg>
              </div>
              <h3>Pick a color, pick an icon</h3>
              <p>
                A selection of calm tints and fun glyphs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="download-bottom" className="closing">
        <div className="wrap">
          <h2>Let your phone be quiet again.</h2>
          <p>
            Cadence is free on the App Store. Try it for a week. If it's not for you, delete it.
            Your data never left your device anyway.
          </p>
          <div className="dl-row" style={{ justifyContent: 'center' }}>
            <a href="https://apps.apple.com/app/id6754192837" className="dl-btn" aria-label="Download on the App Store" target="_blank">
              <svg className="store-logo" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="dl-text">
                <span className="small">Download on the</span>
                <span className="big">App Store</span>
              </span>
            </a>
            <a href="#" className="dl-btn secondary" onClick={(e) => e.preventDefault()}>
              <svg className="store-logo" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3.6 2.3a1.6 1.6 0 00-.6 1.25v16.9c0 .49.22.93.57 1.22l9.92-9.92-9.89-9.45z"
                  fill="#34A853"
                />
                <path
                  d="M17.1 12l-3.5-3.34-9.92 9.92c.16.13.36.22.58.24.3.02.6-.05.86-.2l12-6.78c.6-.34.6-1.19-.02-1.56"
                  fill="#FBBC04"
                />
                <path
                  d="M13.6 8.66l3.5 3.34 3-1.7c.84-.48.84-1.72 0-2.2l-12-6.78a1.59 1.59 0 00-.83-.22l6.33 7.56z"
                  fill="#EA4335"
                />
                <path
                  d="M7.27 1.1c-.23.04-.44.13-.62.25L3.6 2.3l9.89 9.45L7.27 1.1z"
                  fill="#4285F4"
                />
              </svg>
              <span className="dl-text">
                <span className="small">Get it on</span>
                <span className="big">Google Play</span>
              </span>
              <span className="soon">Soon</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
