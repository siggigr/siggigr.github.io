import { hero, contact } from "./content/site";
import {
  experience,
  education,
  technicalSkills,
  coreStrengths,
  languages,
  cvInterests,
  referencesNote,
} from "./content/cv";

const homeHref = `${import.meta.env.BASE_URL}`;

export default function CVPage() {
  return (
    <>
      <a className="skip-link" href="#cv-main">
        Skip to content
      </a>

      <nav className="nav cv-nav" aria-label="Main">
        <a className="nav-brand" href={homeHref}>
          SGH
        </a>
        <div className="nav-links">
          <a href={homeHref}>← Back to site</a>
          <button
            type="button"
            className="cv-print-btn"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </button>
        </div>
      </nav>

      <main id="cv-main" className="page cv-page">
        <header className="cv-header">
          <p className="hero-coords">{hero.coords}</p>
          <h1 className="cv-name">Sigurður G. Hjálmarsson</h1>
          <p className="cv-tagline">{hero.subline}</p>
          {contact.email && (
            <p className="cv-contact">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          )}
        </header>

        <section className="cv-section">
          <span className="eyebrow" lang="is">
            Starfsferill
          </span>
          <h2>Professional Experience</h2>
          <div className="cv-exp-list">
            {experience.map((job) => (
              <article key={job.company} className="cv-exp-item">
                <h3>{job.company}</h3>
                {job.roles.map((role) => (
                  <div className="cv-exp-role" key={role.title}>
                    <span className="cv-exp-title">{role.title}</span>
                    <span className="cv-exp-period">{role.period}</span>
                  </div>
                ))}
                {job.bullets.length > 0 && (
                  <ul className="cv-bullets">
                    {job.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section">
          <span className="eyebrow" lang="is">
            Menntun
          </span>
          <h2>Education</h2>
          <div className="cv-exp-list">
            {education.map((item) => (
              <article key={`${item.school}-${item.period}`} className="cv-exp-item">
                <div className="cv-exp-role">
                  <span className="cv-exp-title">
                    {item.school} — {item.detail}
                  </span>
                  <span className="cv-exp-period">{item.period}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="cv-two-col">
          <section className="cv-section">
            <span className="eyebrow" lang="is">
              Hæfni
            </span>
            <h2>Technical Skills</h2>
            <ul className="cv-chip-list">
              {technicalSkills.map((skill) => (
                <li key={skill} className="cv-chip">
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section className="cv-section">
            <span className="eyebrow" lang="is">
              Styrkleikar
            </span>
            <h2>Core Strengths</h2>
            <ul className="cv-bullets">
              {coreStrengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="cv-two-col">
          <section className="cv-section">
            <span className="eyebrow" lang="is">
              Tungumál
            </span>
            <h2>Languages</h2>
            <ul className="cv-bullets">
              {languages.map((l) => (
                <li key={l.name}>
                  {l.name} — {l.level}
                </li>
              ))}
            </ul>
          </section>

          <section className="cv-section">
            <span className="eyebrow" lang="is">
              Áhugamál
            </span>
            <h2>Interests</h2>
            <p className="prose">{cvInterests}</p>
          </section>
        </div>

        <section className="cv-section">
          <span className="eyebrow" lang="is">
            Meðmæli
          </span>
          <h2>References</h2>
          <p className="prose">{referencesNote}</p>
        </section>
      </main>

      <footer className="footer cv-footer">
        <span>© {new Date().getFullYear()} Sigurður G. Hjálmarsson</span>
      </footer>
    </>
  );
}
