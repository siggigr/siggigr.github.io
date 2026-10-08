import { useEffect } from "react";
import { professional, contact } from "./content/site";
import cvAvatar from "./assets/cv-avatar.webp";
import Footer from "./components/Footer";
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
  // Opened as cv.html?print (the "Download CV as PDF" button on the main
  // site): wait for fonts and the photo, then open the print dialog,
  // where the visitor can choose "Save as PDF". The marker is removed
  // from the address first, so reloading the page does not print again.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("print")) return;
    window.history.replaceState(null, "", window.location.pathname);
    const images = Array.from(document.images).map((img) =>
      img.complete ? Promise.resolve() : new Promise((r) => (img.onload = img.onerror = r))
    );
    Promise.all([document.fonts.ready, ...images]).then(() => {
      setTimeout(() => window.print(), 300);
    });
  }, []);

  return (
    <>
      <a className="skip-link" href="#cv-main">
        Skip to content
      </a>

      <nav className="nav cv-nav" aria-label="Main">
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
          <div className="cv-header-info">
            <h1 className="cv-name">Sigurður G. Hjálmarsson</h1>
            <p className="cv-role">Senior Software Engineer | Backend Development &amp; QA | 20 Years in Software (Java, SQL)</p>
            <div className="cv-contacts">
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </div>
          <div className="cv-avatar" aria-hidden="true">
            <img src={cvAvatar} alt="" />
          </div>
        </header>

        <p className="cv-about">{professional[0]}</p>

        <div className="cv-grid">
          <aside className="cv-col-left">
            <section>
              <h2 className="cv-label">Education</h2>
              {education.map((item) => (
                <div className="cv-edu-item" key={`${item.school}-${item.period}`}>
                  <strong>{item.school}</strong>
                  <div className="cv-edu-degree">{item.detail}</div>
                  <div className="cv-edu-year">{item.period}</div>
                </div>
              ))}
            </section>

            <section>
              <h2 className="cv-label">Languages</h2>
              <p className="cv-small">
                {languages.map((l) => `${l.name} (${l.level})`).join(" · ")}
              </p>
            </section>

            <section>
              <h2 className="cv-label">Core Strengths</h2>
              <ul className="cv-plain-list">
                {coreStrengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="cv-label">Interests</h2>
              <p className="cv-small">{cvInterests}</p>
            </section>

            <section>
              <h2 className="cv-label">References</h2>
              <p className="cv-small">{referencesNote}</p>
    
            </section>
          </aside>

          <div className="cv-col-right">
            <section>
              <h2 className="cv-label">Experience</h2>
              {experience.map((job) => (
                <article key={job.company} className="cv-job">
                  <div className="cv-job-header">
                    <span className="cv-job-company">{job.company}</span>
                  </div>
                  {job.roles.map((role) => (
                    <div className="cv-job-role-block" key={role.title}>
                      <div className="cv-job-role">
                        {role.title} <span className="cv-role-sep">|</span> {role.period}
                      </div>
                      {role.bullets.length > 0 && (
                        <ul>
                          {role.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </article>
              ))}
            </section>

            <section>
              <h2 className="cv-label">Technical Skills</h2>
                            {technicalSkills.map((group) => (
                <div key={group.label} className="cv-skill-group">
                  <span className="cv-skill-label">{group.label}</span>
                  <div className="cv-chip-list">
                    {group.items.map((skill) => (
                      <span key={skill} className="cv-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

