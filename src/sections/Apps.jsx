import Section from "../components/Section";
import { apps } from "../content/apps";

export default function Apps() {
  return (
    <Section id="apps" eyebrow="Smíðar" title="Apps">
      {apps.length === 0 && (
        <div className="card card-empty">
          <h3>In the hangar</h3>
          <p>
            The first app is under construction. It will be parked here as
            soon as it is ready for passengers.
          </p>
        </div>
      )}

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
                View on GitHub →
              </a>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
