import Section from "../components/Section";
import { apps } from "../content/apps";
import { linkProps } from "../components/linkProps";

export default function Apps() {
  return (
    <Section id="apps" eyebrow="Smíðar" title="Apps">
      <div className="card-grid">
        {apps.map((app) => {
          const tag = app.tag || (!app.url && "coming soon");
          return (
            <article key={app.name} className="card">
              <h3>
                {app.name}
                {tag && (
                  <>
                    {" "}
                    <span className="tag">{tag}</span>
                  </>
                )}
              </h3>
              <p>{app.description}</p>
              {app.url && (
                <a className="app-link" {...linkProps(app.url)}>
                  {app.linkText || "View on GitHub"}{" "}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
