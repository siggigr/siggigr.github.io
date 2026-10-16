import Footer from "./components/Footer";
import AgentOffice from "./components/AgentOffice";
import {
  agentsHero,
  myRole,
  pipeline,
  highlights,
  highlightsIntro,
  officeIntro,
  screens,
} from "./content/agents";

const homeHref = `${import.meta.env.BASE_URL}`;
const cvHref = `${import.meta.env.BASE_URL}cv.html`;

/** Section with the site's English heading and Icelandic accent line. */
function AgentsSection({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="agents-section" aria-labelledby={`${id}-title`}>
      <header className="agents-section-head">
        <h2 id={`${id}-title`}>{title}</h2>
        <span className="agents-eyebrow" lang="is">
          {eyebrow}
        </span>
      </header>
      {children}
    </section>
  );
}

/**
 * "AI software agent team" page: same dark theme, top bar and single
 * panel as the CV page. All text lives in content/agents.js.
 */
export default function AgentsPage() {
  return (
    <>
      <a className="skip-link" href="#agents-main">
        Skip to content
      </a>

      <nav className="nav cv-nav" aria-label="Main">
        <div className="nav-links">
          <a href={homeHref}>← Back to site</a>
          <a href={cvHref}>CV</a>
        </div>
      </nav>

      <main id="agents-main" className="page agents-page">
        <header className="agents-hero">
          <h1>{agentsHero.headline}</h1>
          <p className="agents-meta">
            {agentsHero.meta.map((item, i, all) => (
              <span key={item}>
                <span className="agents-meta-item">
                  {item}
                  {i < all.length - 1 && (
                    <span className="agents-meta-sep" aria-hidden="true"> /</span>
                  )}
                </span>
                {i < all.length - 1 && " "}
              </span>
            ))}
          </p>
          {agentsHero.intro.map((p) =>
            typeof p === "string" ? (
              <p key={p} className="agents-lead">
                {p}
              </p>
            ) : (
              <p key={p.link.href} className="agents-lead">
                {p.before}
                <a href={p.link.href} target="_blank" rel="noopener noreferrer">
                  {p.link.text}
                </a>
                {p.after}
              </p>
            )
          )}

          <aside className="agents-role" aria-label={myRole.title}>
            <strong>{myRole.title}</strong>
            <p>{myRole.text}</p>
          </aside>
        </header>

        <AgentsSection id="pipeline" eyebrow="Ferlið" title="The pipeline">
          <p className="agents-section-intro">
            Each role hands its work to the next, and nothing moves on until I have approved it.
          </p>
          <ol className="pipeline">
            {pipeline.map((step, i) => (
              <li
                key={step.role}
                className={`pipeline-step${step.next ? " is-next" : ""}`}
              >
                <div className="pipeline-top">
                  <span className="pipeline-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step.next && <span className="tag">coming next</span>}
                </div>
                <h3>{step.role}</h3>
                <p className="pipeline-output">{step.output}</p>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </AgentsSection>

        <AgentsSection id="highlights" eyebrow="Lykilákvarðanir" title="Three moments that mattered">
          <p className="agents-section-intro">{highlightsIntro}</p>
          <div className="highlights">
            {highlights.map((h, i) => (
              <article key={h.title} className="highlight">
                <div className="highlight-top">
                  <span className="highlight-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="tag">{h.by}</span>
                </div>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </article>
            ))}
          </div>
        </AgentsSection>

        <AgentsSection id="office" eyebrow="Skrifstofan" title="The office">
          <p className="agents-section-intro">{officeIntro}</p>
          <AgentOffice />
        </AgentsSection>

        <AgentsSection id="screens" eyebrow="Skjámyndir" title={
            <>
              <span className="agents-name">Tillslip</span> on screen
            </>
          }>
          {screens.length === 0 ? (
            <div className="card card-empty agents-screens-empty">
              <h3>Still in the hangar</h3>
              <p>
                Screenshots and a short screen recording of Tillslip will be
                parked here once the first milestones are running on my phone.
              </p>
            </div>
          ) : (
            <div className="agents-screens">
              {screens.map((s) =>
                s.type === "video" ? (
                  <video
                    key={s.src}
                    src={s.src}
                    poster={s.poster}
                    controls
                    preload="metadata"
                    aria-label={s.alt}
                  />
                ) : (
                  <img key={s.src} src={s.src} alt={s.alt} loading="lazy" />
                )
              )}
            </div>
          )}
        </AgentsSection>
      </main>

      <Footer />
    </>
  );
}
