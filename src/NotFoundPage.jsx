import Footer from "./components/Footer";

const base = `${import.meta.env.BASE_URL}`;

/** 404 page: GitHub Pages serves 404.html for any address that does not exist. */
export default function NotFoundPage() {
  return (
    <>
      <a className="skip-link" href="#not-found-main">
        Skip to content
      </a>

      <nav className="nav cv-nav" aria-label="Main">
        <div className="nav-links">
          <a href={base}><span aria-hidden="true">←</span> Back to site</a>
        </div>
      </nav>

      <main id="not-found-main" className="page agents-page">
        <header className="agents-hero">
          <h1>Page not found</h1>
          <p className="agents-lead">
            There is nothing at this address. It may have moved, or the link
            may have a typo.
          </p>
        </header>
        <ul>
          <li><a href={base}>Home</a></li>
          <li><a href={`${base}cv.html`}>CV</a></li>
          <li><a href={`${base}agents/`}>AI agent team</a></li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
