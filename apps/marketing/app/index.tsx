import type { GenerateMetadataFunction } from 'expo-router/server';
import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

const APP_STORE_URL = 'https://apps.apple.com/app/id6754192837';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=dev.kadi.cadence';

type Theme = 'light' | 'dark';

type WidgetTask = {
  glyph: string;
  hue: number;
  title: string;
  due: string;
  tone?: 'today' | 'late';
};

const WATER: WidgetTask = {
  glyph: 'potted_plant',
  hue: 150,
  title: 'Water the plants',
  due: 'Today',
  tone: 'today',
};
const CALL: WidgetTask = {
  glyph: 'call',
  hue: 30,
  title: 'Call mum',
  due: 'Tomorrow',
};
const CAR: WidgetTask = {
  glyph: 'directions_car',
  hue: 80,
  title: 'Wash the car',
  due: 'In 5 days',
};
const FILTER: WidgetTask = {
  glyph: 'air',
  hue: 235,
  title: 'Change the filter',
  due: '2 days late',
  tone: 'late',
};
const OVEN: WidgetTask = {
  glyph: 'cleaning_services',
  hue: 330,
  title: 'Clean the oven',
  due: 'In 2 weeks',
};

const MEDIUM_TASKS = [WATER, CALL, CAR];
const LARGE_TASKS = [FILTER, WATER, CALL, CAR, OVEN];

const SMALL_THINGS = [
  'An optional To do tab',
  'Log a task on a past date',
  "Change a task's cadence",
  'About 40 tints and glyphs',
  'Light and dark',
  'Archive',
];

function Glyph({
  name,
  className,
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={className ? `lp-glyph ${className}` : 'lp-glyph'}
      style={size ? { fontSize: size } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function TaskTile({ task, size }: { task: WidgetTask; size: number }) {
  return (
    <span
      className="lp-tile"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.29,
        background: `oklch(0.66 0.11 ${task.hue})`,
      }}
    >
      <Glyph name={task.glyph} className="lp-tile-glyph" size={size * 0.6} />
    </span>
  );
}

function dueClass(task: WidgetTask) {
  return task.tone ? `lp-due lp-due-${task.tone}` : 'lp-due';
}

function TaskRow({ task }: { task: WidgetTask }) {
  return (
    <div className="lp-row">
      <TaskTile task={task} size={28} />
      <span className="lp-row-title">{task.title}</span>
      <span className={dueClass(task)}>{task.due}</span>
    </div>
  );
}

function Widgets() {
  return (
    <section id="widgets" className="lp-wrap">
      <div className="lp-widgets">
        <figure className="lp-figure lp-figure-small">
          <div className="lp-widget lp-widget-small">
            <TaskTile task={WATER} size={34} />
            <div>
              <div className="lp-small-title">{WATER.title}</div>
              <div className="lp-small-due">{WATER.due}</div>
            </div>
          </div>
          <figcaption>Small · the next thing</figcaption>
        </figure>

        <figure className="lp-figure">
          <div className="lp-widget lp-widget-medium">
            {MEDIUM_TASKS.map(task => (
              <TaskRow key={task.title} task={task} />
            ))}
          </div>
          <figcaption>Medium · the next three</figcaption>
        </figure>

        <figure className="lp-figure">
          <div className="lp-widget lp-widget-large">
            <div className="lp-counts">
              <div>
                <div className="lp-count lp-count-late">1</div>
                <div className="lp-count-label">overdue</div>
              </div>
              <div>
                <div className="lp-count lp-count-today">1</div>
                <div className="lp-count-label">today</div>
              </div>
            </div>
            <div className="lp-large-list">
              {LARGE_TASKS.map(task => (
                <TaskRow key={task.title} task={task} />
              ))}
            </div>
          </div>
          <figcaption>Large · the whole list</figcaption>
        </figure>
      </div>
      <p className="lp-widgets-note">
        Home Screen widgets on iPhone and Android.
      </p>
    </section>
  );
}

function Detail({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="lp-detail">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function DownloadActions() {
  return (
    <div className="lp-actions">
      <a href={APP_STORE_URL} className="lp-pill">
        Download on the App Store
      </a>
      <a href={PLAY_STORE_URL} className="lp-pill">
        Get it on Google Play
      </a>
    </div>
  );
}

export const generateMetadata: GenerateMetadataFunction = () => ({
  title: 'Cadence · For the things that come back around',
  description:
    "Water the plants. Change the filter. Call your mum. Cadence knows how often each one comes back, and shows what's due right on your Home Screen. No notifications, ever.",
});

export default function Home() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(query.matches);
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.dataset.theme = theme;
    else delete root.dataset.theme;
  }, [theme]);

  const dark = theme ? theme === 'dark' : systemDark;
  const themeLabel = dark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <div className="lp">
      <Nav>
        <button
          type="button"
          className="lp-theme"
          onClick={() => setTheme(dark ? 'light' : 'dark')}
          aria-label={themeLabel}
          title={themeLabel}
        >
          <Glyph name={dark ? 'light_mode' : 'dark_mode'} size={20} />
        </button>
      </Nav>

      <section id="top" className="lp-wrap lp-hero">
        <h1>For the things that come back around.</h1>
        <p>
          Water the plants. Change the filter. Call your mum. Cadence knows how
          often each one comes back, and shows what&apos;s due right on your
          Home Screen. No notifications, ever.
        </p>
        <DownloadActions />
      </section>

      <Widgets />

      <section className="lp-wrap lp-details">
        <Detail title="No pings. Not one.">
          <p>
            Cadence never sends a push notification. No reminders, no nudges, no
            red badges. The list sits on your Home Screen and waits until you
            look.
          </p>
        </Detail>
        <Detail title="Set the rhythm once.">
          <p>
            Daily, weekly, monthly. Or every so many days, weeks or months. Each
            task is floating or fixed. Floating counts from when you actually
            did it. Fixed stays on the calendar, so every Sunday stays Sunday.
          </p>
        </Detail>
        <Detail title="See what slips.">
          <p>
            Stats shows how often you&apos;re on time, with a lane per task on a
            shared timeline. Each task also has a dial for the current cycle,
            its past cycles, and its streak.
          </p>
        </Detail>
        <Detail id="privacy" title="There is no Cadence server.">
          <p>
            No account to make. Your tasks live on your phone. Sync through your
            own iCloud or Google Drive if you want to, or export a JSON backup
            whenever you like.
          </p>
        </Detail>
        <Detail title="Small things.">
          <ul>
            {SMALL_THINGS.map(thing => (
              <li key={thing}>{thing}</li>
            ))}
          </ul>
        </Detail>
      </section>

      <section id="download" className="lp-wrap lp-download">
        <h2>Let your phone be quiet again.</h2>
        <p>Free on the App Store and Google Play.</p>
        <DownloadActions />
      </section>

      <Footer />
    </div>
  );
}
