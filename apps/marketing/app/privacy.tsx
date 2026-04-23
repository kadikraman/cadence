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
            Cadence stores your tasks on your device. We collect anonymous crash and performance
            data so the app keeps working. Nothing that identifies you. That&apos;s it.
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
              Your tasks never leave your phone. We see anonymous crash reports and performance
              metrics. No account, no ads, no tracking.
            </p>
          </div>
        </div>

        <h2>What stays on your device</h2>
        <p>
          Everything you create in Cadence, your tasks, their schedules, the history of when you
          ticked them off, your streaks, your settings, lives in local storage on your phone. We
          don&apos;t have a server that holds a copy. If you delete the app, it&apos;s gone.
        </p>

        <h2>What we do collect</h2>
        <p>
          Cadence sends us two kinds of anonymous data so we can keep the app stable and improve it:
        </p>
        <ul>
          <li>
            <strong>Crash reports.</strong> If the app crashes, we get a stack trace showing what
            went wrong and the device model &amp; OS version. Nothing about <em>what</em> you were
            doing, just <em>where</em> the code broke.
          </li>
          <li>
            <strong>Performance metrics.</strong> Aggregate numbers like app launch time, widget
            refresh duration, and session length. These tell us if a recent update made the app
            slower.
          </li>
        </ul>
        <p>
          Both streams are anonymized before they leave your phone. We cannot tie a crash report
          back to an individual user, a specific task, or an email address. There is no user ID.
        </p>

        <h2>What we don&apos;t collect</h2>
        <ul>
          <li>The names, contents, or schedules of your tasks.</li>
          <li>Your location. Cadence never asks for it.</li>
          <li>Your contacts, photos, calendar, or any other system data.</li>
          <li>Your name, email, or phone number. There is no account to create.</li>
          <li>
            Advertising identifiers. We don&apos;t show ads and don&apos;t sell data to anyone who
            does.
          </li>
        </ul>

        <h2>Third parties</h2>
        <p>
          The anonymous crash and performance data is processed by our analytics provider.
          We&apos;ve picked one that doesn&apos;t build ad profiles and doesn&apos;t correlate
          across apps. We don&apos;t share data with anyone else. No data brokers, no partners, no
          buyers.
        </p>
        <p>
          When you download Cadence from the App Store, Apple collects their own metrics
          (downloads, crash rollups, etc.) under{' '}
          <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">
            Apple&apos;s privacy policy
          </a>
          . That&apos;s outside our control.
        </p>

        <h2>Your rights</h2>
        <p>
          Because we don&apos;t store any personally identifiable information, there&apos;s nothing
          to hand over, correct, or delete on our side. Deleting the app deletes your tasks. If
          you&apos;d like to stop sharing anonymous crash data, you can turn off analytics in
          Settings → Privacy.
        </p>

        <h2>Kids</h2>
        <p>
          Cadence is a general-audience productivity app. We don&apos;t knowingly collect
          information from anyone, including kids under 13.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we ever change what Cadence collects, for example, if we add an optional sync feature,
          we&apos;ll update this page and call it out in the app&apos;s release notes before it
          ships. We won&apos;t change the defaults on you silently.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or concerns about this policy? Open Cadence, go to <strong>Settings</strong>,
          and tap <strong>Feedback &amp; feature requests</strong>.
        </p>

        <p style={{ marginTop: 48, color: 'var(--ink-4)', fontSize: 14 }}>
          Last updated: April 2026.
        </p>
      </article>

      <Footer />
    </>
  );
}
