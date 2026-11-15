import Section from "../components/Section";
import { apps } from "../content/apps";

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
      </div>
    </Section>
  );
}
