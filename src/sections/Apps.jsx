import Section from "../components/Section";
import { apps, hangar } from "../content/apps";

// hangar.url is a path on this site, such as "/agents/".
const hangarHref = hangar.url
  ? `${import.meta.env.BASE_URL}${hangar.url.replace(/^\//, "")}`
  : "";

export default function Apps() {
  return (
    <Section id="apps" eyebrow="Smíðar" title="Apps">
      <div className="card-grid">
        {apps.map((app) => (
          <article key={app.name} className="card">
            <h3>
              {app.name}
              {!app.url && <span className="tag"> coming soon</span>}
            </h3>
            <p>{app.description}</p>
            {app.url && (
              <a
                className="app-link"
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub <span aria-hidden="true">→</span>
              </a>
            )}
          </article>
        ))}
        {hangar.text && (
          <div className="card card-empty">
            <h3>
              {hangar.title}
              {hangar.tag && <span className="tag"> {hangar.tag}</span>}
            </h3>
            <p>{hangar.text}</p>
            {hangarHref && (
              <a className="app-link" href={hangarHref}>
                {hangar.linkText} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
