import Head from 'expo-router/head';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy · Cadence</title>
        <meta
          name="description"
          content="Cadence privacy policy. What we collect, what we don't, and where your data lives."
        />
      </Head>

      <Nav />

      <section className="content-hero">
        <div className="wrap">
          <div className="kicker">Privacy Policy</div>
          <h1>The short version.</h1>
          <p>
            Cadence stores your tasks on your device, and, only if you turn on
            sync, in your own iCloud or Google Drive. We collect anonymous crash
            and performance data so the app keeps working. Nothing that
            identifies you.
          </p>
        </div>
      </section>

      <article className="article">
        <div className="callout">
          <div className="ci">
            <svg
              width="18"
              height="18"
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
          <div>
            <h3>TL;DR</h3>
            <p>
              Your tasks never reach us. They stay on your phone, or in your own
              iCloud or Google Drive if you turn on sync. We see anonymous crash
              reports and performance metrics. No account, no ads, no tracking.
            </p>
          </div>
        </div>

        <h2>What stays on your device</h2>
        <p>
          Everything you create in Cadence, your tasks, their schedules, the
          history of when you ticked them off, your streaks, your settings,
          lives in local storage on your phone. We don&apos;t have a server that
          holds a copy. If you delete the app and sync is off, it&apos;s gone.
        </p>

        <h2>Optional sync</h2>
        <p>
          Sync is off unless you turn it on, during setup or in{' '}
          <strong>Settings</strong>. When it is on, Cadence keeps a copy of your
          tasks, their schedules and completion history, and your to-dos in your
          own cloud storage, so your other devices stay up to date:
        </p>
        <ul>
          <li>
            <strong>iPhone:</strong> in Cadence&apos;s private folder in your
            iCloud account, under{' '}
            <a
              href="https://www.apple.com/legal/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Android:</strong> in a hidden app folder in your Google
            Drive, after you sign in with Google. Cadence asks only for access
            to that folder, not to your other files. Google&apos;s{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>{' '}
            applies.
          </li>
        </ul>
        <p>
          The copy goes straight from your phone to your account. It never
          passes through a Cadence server, and we can&apos;t read it. Your
          settings are not synced. Turning sync off stops it and signs Cadence
          out of Google on Android. To remove the copy, delete Cadence&apos;s
          data in your iCloud or Google Drive storage settings.
        </p>

        <h2>What we do collect</h2>
        <p>
          Cadence sends us two kinds of anonymous data so we can keep the app
          stable and improve it:
        </p>
        <ul>
          <li>
            <strong>Crash reports.</strong> If the app crashes, we get a stack
            trace showing what went wrong and the device model &amp; OS version.
            Nothing about <em>what</em> you were doing, just <em>where</em> the
            code broke.
          </li>
          <li>
            <strong>Performance metrics.</strong> Aggregate numbers like app
            launch time and session length. These tell us if a recent update
            made the app slower.
          </li>
        </ul>
        <p>
          Both streams are anonymized before they leave your phone. We cannot
          tie a crash report back to an individual user, a specific task, or an
          email address. There is no user ID.
        </p>

        <h2>What we don&apos;t collect</h2>
        <ul>
          <li>The names, contents, or schedules of your tasks.</li>
          <li>Your location. Cadence never asks for it.</li>
          <li>Your contacts, photos, calendar, or any other system data.</li>
          <li>
            Your name, email, or phone number. There is no account to create.
          </li>
          <li>
            Advertising identifiers. We don&apos;t show ads and don&apos;t sell
            data to anyone who does.
          </li>
        </ul>

        <h2>Third parties</h2>
        <p>
          The anonymous crash and performance data is processed by our analytics
          provider. We&apos;ve picked one that doesn&apos;t build ad profiles
          and doesn&apos;t correlate across apps. We don&apos;t share data with
          anyone else.
        </p>
        <p>
          When you download Cadence from the App Store, Apple collects their own
          metrics (downloads, crash rollups, etc.) under{' '}
          <a
            href="https://www.apple.com/legal/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apple&apos;s privacy policy
          </a>
          . That&apos;s outside our control.
        </p>

        <h2>Your rights</h2>
        <p>
          Because we don&apos;t store any personally identifiable information,
          there&apos;s nothing to hand over, correct, or delete on our side.
          Deleting the app deletes your tasks on that device. A synced copy
          stays in your iCloud or Google Drive until you delete it there.
        </p>

        <h2>Kids</h2>
        <p>
          Cadence is a general-audience productivity app. We don&apos;t
          knowingly collect information from anyone, including kids under 13.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we ever change what Cadence collects, we&apos;ll update this page
          and call it out in the app&apos;s release notes before it ships. The
          optional sync described above is the latest change. We won&apos;t
          change the defaults on you silently.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or concerns about this policy? Open Cadence, go to{' '}
          <strong>Settings</strong>, and tap{' '}
          <strong>Feedback &amp; feature requests</strong>.
        </p>

        <p style={{ marginTop: 48, color: 'var(--ink-4)', fontSize: 14 }}>
          Last updated: October 2026.
        </p>
      </article>

      <Footer />
    </>
  );
}
