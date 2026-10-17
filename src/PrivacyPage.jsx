import Footer from "./components/Footer";
import { contact } from "./content/site";

const homeHref = `${import.meta.env.BASE_URL}`;

/**
 * Privacy notice: what the site collects about visitors (GDPR Art. 13).
 * Keep it in step with the GoatCounter scripts in the HTML pages and
 * with the hosting setup.
 */
export default function PrivacyPage() {
  return (
    <>
      <a className="skip-link" href="#privacy-main">
        Skip to content
      </a>

      <nav className="nav cv-nav" aria-label="Main">
        <div className="nav-links">
          <a href={homeHref}>← Back to site</a>
        </div>
      </nav>

      <main id="privacy-main" className="page agents-page privacy-page">
        <header className="agents-hero">
          <h1>Privacy</h1>
          <p className="agents-lead">
            This is a personal website. It sets no cookies, has no forms and
            no ads, and does not follow you around the web. Here is what it
            does collect, and why.
          </p>
        </header>

        <section className="agents-section" aria-labelledby="who-title">
          <h2 id="who-title">Who is responsible</h2>
          <p>
            Sigurður G. Hjálmarsson, Kópavogur, Iceland. Questions or
            requests: <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </p>
        </section>

        <section className="agents-section" aria-labelledby="stats-title">
          <h2 id="stats-title">Visitor statistics</h2>
          <p>
            Visits are counted with{" "}
            <a href="https://www.goatcounter.com/" target="_blank" rel="noopener noreferrer">
              GoatCounter
            </a>
            , without cookies or anything else stored on your device. For
            each page you open, your browser sends GoatCounter the page
            address (including any query string such as <code>?ref=</code>),
            the page title, the site you came from, and your screen width.
            GoatCounter also receives your IP address and browser user agent,
            as every web request does. It uses them to tell unique visits
            apart and to work out your country and browser type, and does not
            store your IP address.
          </p>
          <p>
            I see only totals in a private dashboard and cannot identify you
            from them. The purpose is to know how many people read the site,
            which pages, and where they came from. The legal basis is my
            legitimate interest in that (GDPR Art. 6(1)(f)). See{" "}
            <a href="https://www.goatcounter.com/help/privacy" target="_blank" rel="noopener noreferrer">
              GoatCounter's privacy policy
            </a>{" "}
            for how it handles data.
          </p>
        </section>

        <section className="agents-section" aria-labelledby="hosting-title">
          <h2 id="hosting-title">Hosting</h2>
          <p>
            The site is hosted on GitHub Pages. GitHub receives your IP
            address when it serves the pages and may log it for security; see{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub's privacy statement
            </a>
            . Fonts and images are served from this site itself, so no other
            third party is contacted.
          </p>
        </section>

        <section className="agents-section" aria-labelledby="rights-title">
          <h2 id="rights-title">Your rights</h2>
          <p>
            You can ask for access to, or deletion of, data about you, and you
            can object to the counting. Because the statistics hold no data
            that identifies you, there is usually nothing to hand over. You
            can also complain to the Icelandic Data Protection Authority,{" "}
            <a href="https://www.personuvernd.is/" target="_blank" rel="noopener noreferrer" lang="is">
              Persónuvernd
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
