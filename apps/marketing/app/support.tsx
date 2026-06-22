import Head from 'expo-router/head';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

export default function Support() {
  return (
    <>
      <Head>
        <title>Support · Cadence</title>
        <meta
          name="description"
          content="Help, FAQ, and contact for Cadence, the quiet reminder app."
        />
      </Head>

      <Nav />

      <section className="content-hero">
        <div className="wrap">
          <div className="kicker">Support</div>
          <h1>We read everything.</h1>
          <p>
            Cadence is a small app, made by a small team. The fastest way to
            reach us is through the app itself.
          </p>
        </div>
      </section>

      <article className="article">
        <div className="contact-card">
          <div>
            <h3>Send feedback from the app</h3>
            <p>
              Open Cadence, go to <strong>Settings</strong>, and tap{' '}
              <strong>Feedback &amp; feature requests</strong>. Bugs, questions,
              ideas, all welcome.
            </p>
          </div>
        </div>

        <h2>Frequently asked</h2>

        <div className="faq">
          <details>
            <summary>How do I add the widget to my Home Screen?</summary>
            <div className="faq-body">
              <p>
                <strong>iOS:</strong> Press and hold the{' '}
                <strong>Cadence</strong> app icon, then pick the widget size you
                want: small, medium, or large.
              </p>
              <p>
                <strong>Android:</strong> Long-press an empty area of your Home
                Screen, tap <strong>Widgets</strong>, find{' '}
                <strong>Cadence</strong> in the list, then long-press the size
                you want (small, medium, or large) and drag it onto the Home
                Screen.
              </p>
              <p>
                The widget updates automatically as you complete tasks on either
                platform.
              </p>
            </div>
          </details>

          <details>
            <summary>Why don&apos;t I get notifications?</summary>
            <div className="faq-body">
              That&apos;s by design. Cadence is meant to be glanceable, not
              pushy. The widget lives on your Home Screen so you see what&apos;s
              due whenever you unlock your phone. If you really want a
              notification, the iOS reminders app or your calendar will serve
              you better.
            </div>
          </details>

          <details>
            <summary>Can I sync across devices?</summary>
            <div className="faq-body">
              Not right now. We prefer to keep Cadence simple, with your tasks
              on the device you installed it on. If there&apos;s a lot of demand
              for syncing, we&apos;ll consider building it. You can export and
              import a JSON backup from Settings in the meantime.
            </div>
          </details>

          <details>
            <summary>Can I back up or move my data?</summary>
            <div className="faq-body">
              Yes. Go to <strong>Settings → Export</strong> to save a JSON file
              of your tasks and history. You can re-import it on the same
              device, or on a new one once you&apos;ve installed Cadence there.
            </div>
          </details>

          <details>
            <summary>Does it work on iPad?</summary>
            <div className="faq-body">
              There&apos;s no native iPad version yet. Cadence runs on iPad in
              iPhone compatibility mode, but we haven&apos;t built a proper iPad
              layout. If there&apos;s a lot of demand for it, we&apos;ll build
              one.
            </div>
          </details>

          <details>
            <summary>How do I get Cadence on Android?</summary>
            <div className="faq-body">
              We&apos;d love your help testing it! The Android build is still
              being polished, so it&apos;s in{' '}
              <a
                href="https://support.google.com/googleplay/android-developer/answer/9845334"
                target="_blank"
                rel="noreferrer"
              >
                Google Play closed (private) testing
              </a>{' '}
              rather than on the Play Store just yet. If you&apos;d like to give
              it a go, send a quick note to <strong>cadence@kadi.dev</strong>{' '}
              with the Google account you use on the Play Store and we&apos;ll
              add you to the testers list.
            </div>
          </details>

          <details>
            <summary>How much does it cost?</summary>
            <div className="faq-body">
              Cadence is free to download and use. There&apos;s no subscription,
              no paywall, no ads. If we ever add a premium feature, it would be
              optional and one-time.
            </div>
          </details>

          <details>
            <summary>I found a bug. What do I send you?</summary>
            <div className="faq-body">
              Submit feedback from inside the app:{' '}
              <strong>Settings → Feedback &amp; feature requests</strong>. Tell
              us what you were doing when it happened and include a screenshot
              if you have one. Even a rough description helps. We&apos;d rather
              hear &ldquo;something weird happened&rdquo; than hear nothing.
            </div>
          </details>

          <details>
            <summary>How do I delete my data?</summary>
            <div className="faq-body">
              Delete the app. Since we don&apos;t store your tasks on a server,
              removing Cadence removes all your data. If you&apos;ve turned on
              anonymous analytics, you can turn it off in{' '}
              <strong>Settings → Privacy</strong> at any time. We don&apos;t
              retain any user-identifiable records to delete.
            </div>
          </details>
        </div>

        <h2 style={{ marginTop: 56 }}>Still stuck?</h2>
        <p>
          Open Cadence, tap{' '}
          <strong>Settings → Feedback &amp; feature requests</strong>, and tell
          us what&apos;s going on. Real person, no form, no ticket number. We
          usually reply within a day.
        </p>
      </article>

      <Footer />
    </>
  );
}
