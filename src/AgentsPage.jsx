import Footer from "./components/Footer";
import AgentOffice from "./components/AgentOffice";
import {
  agentsHero,
  inThirty,
  team,
  honest,
  moments,
  numbers,
  learned,
  hood,
  next,
  office,
} from "./content/agents";

const homeHref = `${import.meta.env.BASE_URL}`;
const cvHref = `${import.meta.env.BASE_URL}cv.html`;

/** A heading that may keep a capital inside the site's lowercase style. */
function Keep({ parts }) {
  if (typeof parts === "string") return parts;
  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <span key={i} className="agents-keep-case">
        {part.keep}
      </span>
    )
  );
}

/** Text made of plain strings, { code } and { link } parts. */
function Rich({ parts }) {
  return parts.map((part, i) => {
    if (typeof part === "string") return part;
    if (part.code) return <code key={i}>{part.code}</code>;
    return (
      <a key={i} href={part.link.href} target="_blank" rel="noopener noreferrer">
        {part.link.text}
      </a>
    );
  });
}

/** Section with the site's English heading and Icelandic accent line. */
function AgentsSection({ id, eyebrow, title, className = "", children }) {
  return (
    <section
      id={id}
      className={`agents-section${className ? ` ${className}` : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <header className="agents-section-head">
        <h2 id={`${id}-title`}>
          <Keep parts={title} />
        </h2>
        <span className="agents-eyebrow" lang="is">
          {eyebrow}
        </span>
      </header>
      {children}
    </section>
  );
}

/** The ring-and-tick approval mark. Decorative: drawn as an image, never as text. */
function ApproveMark() {
  return <span className="approve-mark" aria-hidden="true" />;
}

function Hero() {
  const { more } = agentsHero;
  return (
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
      <p className="agents-lead">{agentsHero.lead}</p>
      <ul className="agents-facts" role="list">
        {agentsHero.facts.map((f) => (
          <li key={f.lead}>
            <strong>{f.lead}</strong> {f.rest}
          </li>
        ))}
      </ul>
      <p className="agents-lead is-small">
        {more.before}
        <a href={more.link.href} target="_blank" rel="noopener noreferrer">
          {more.link.text}
        </a>
        {more.after}
      </p>
    </header>
  );
}

function InThirty() {
  return (
    <AgentsSection id="in-30" eyebrow={inThirty.eyebrow} title={inThirty.title}>
      <div className="agents-plain">
        {inThirty.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <aside className="agents-role" aria-label={inThirty.myPart.label}>
        <p>
          <strong>{inThirty.myPart.lead}</strong> {inThirty.myPart.text}
        </p>
      </aside>
    </AgentsSection>
  );
}

function TeamMap() {
  return (
    <figure className="team-map" aria-labelledby="team-intro">
      <p className="team-lane team-lane-lead">
        <span className="tag tag-quiet">{team.besideTag}</span>
        <strong>{team.lead.role}</strong>
        <span className="team-out">
          <span className="sr-only">{team.produces} </span>
          {team.lead.output}
        </span>
      </p>
      <ol className="team-flow" role="list">
        {team.roles.map((r, i) => (
          <li key={r.role} className="team-node">
            <span className="team-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong className="team-role">{r.role}</strong>
            <span className="team-out">
              <span className="sr-only">{team.produces} </span>
              {r.output}
            </span>
          </li>
        ))}
      </ol>
      <p className="team-lane team-lane-me">
        <ApproveMark />
        <span>
          <strong>{team.me.label}</strong> {team.me.text}
        </span>
      </p>
    </figure>
  );
}

function Team() {
  return (
    <AgentsSection id="team" eyebrow={team.eyebrow} title={team.title}>
      <p className="agents-section-intro" id="team-intro">
        {team.intro}
      </p>
      <TeamMap />
      <ol className="pipeline" role="list">
        {team.roles.map((r, i) => (
          <li key={r.role} className="pipeline-step">
            <div className="pipeline-top">
              <span className="pipeline-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3>{r.role}</h3>
            <p>{r.text}</p>
          </li>
        ))}
        <li className="pipeline-step is-beside">
          <div className="pipeline-top">
            <span className="tag tag-quiet">{team.besideTag}</span>
          </div>
          <h3>{team.lead.role}</h3>
          <p>{team.lead.text}</p>
        </li>
      </ol>
    </AgentsSection>
  );
}

function Honest() {
  return (
    <AgentsSection id="honest" eyebrow={honest.eyebrow} title={honest.title}>
      <p className="agents-section-intro">{honest.intro}</p>
      <ul className="agents-checks" role="list">
        {honest.checks.map((c) => (
          <li key={c.label}>
            <ApproveMark />
            <h3>{c.label}</h3>
            <p>{c.text}</p>
          </li>
        ))}
      </ul>
    </AgentsSection>
  );
}

function Moments() {
  return (
    <AgentsSection id="moments" eyebrow={moments.eyebrow} title={moments.title}>
      <p className="agents-section-intro">{moments.intro}</p>
      <div className="highlights">
        {moments.items.map((m, i) => (
          <article key={m.title} className="highlight">
            <div className="highlight-top">
              <span className="highlight-num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="tag">{m.by}</span>
            </div>
            <h3>{m.title}</h3>
            <p>{m.text}</p>
          </article>
        ))}
      </div>
    </AgentsSection>
  );
}

function Numbers() {
  return (
    <AgentsSection id="numbers" eyebrow={numbers.eyebrow} title={numbers.title}>
      <ul className="agents-figures" role="list">
        {numbers.items.map((n) => (
          <li key={n.figure}>
            <span className="agents-figure">{n.figure}</span>{" "}
            <span className="agents-figure-label">{n.label}</span>
          </li>
        ))}
      </ul>
    </AgentsSection>
  );
}

function Learned() {
  return (
    <AgentsSection id="learned" eyebrow={learned.eyebrow} title={learned.title}>
      <div className="agents-plain agents-learned">
        {learned.items.map((l) => (
          <p key={l.lead}>
            <strong>{l.lead}</strong> {l.text}
          </p>
        ))}
      </div>
    </AgentsSection>
  );
}

function Hood() {
  return (
    <AgentsSection id="hood" eyebrow={hood.eyebrow} title={hood.title} className="is-quiet">
      <p className="agents-section-intro">{hood.intro}</p>
      <dl className="agents-hood">
        {hood.rows.map((r) => (
          <div key={r.term}>
            <dt>{r.term}</dt>
            <dd>
              <Rich parts={r.text} />
            </dd>
          </div>
        ))}
      </dl>
    </AgentsSection>
  );
}

function Next() {
  return (
    <AgentsSection id="next" eyebrow={next.eyebrow} title={next.title}>
      <div className="agents-next">
        {next.items.map((n) => (
          <div key={n.title} className="card card-empty">
            <h3>{n.title}</h3>
            <p>{n.text}</p>
          </div>
        ))}
      </div>
    </AgentsSection>
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
          <a href={homeHref}><span aria-hidden="true">←</span> Back to site</a>
          <a href={cvHref}>CV</a>
        </div>
      </nav>

      <main id="agents-main" className="page agents-page">
        <Hero />
        <InThirty />
        <Team />
        <Honest />
        <Moments />
        <Numbers />
        <Learned />
        <Hood />
        <Next />

        <AgentsSection id="office" eyebrow={office.eyebrow} title={office.title}>
          <p className="agents-section-intro">{office.intro}</p>
          <AgentOffice />
        </AgentsSection>
      </main>

      <Footer />
    </>
  );
}
