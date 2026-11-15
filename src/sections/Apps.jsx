import Section from "../components/Section";
import { apps, hangar } from "../content/apps";

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
            <h3>{hangar.title}</h3>
            <p>{hangar.text}</p>
          </div>
        )}
      </div>
    </Section>
  );
}
