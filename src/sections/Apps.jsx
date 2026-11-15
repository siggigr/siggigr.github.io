import Section from "../components/Section";
import { apps } from "../content/apps";

// A url that starts with "/" is a page on this site: it gets the site's
// base path and opens in the same tab. Any other url opens in a new tab.
function linkProps(url) {
  if (url.startsWith("/")) {
    return { href: `${import.meta.env.BASE_URL}${url.slice(1)}` };
  }
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
}

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
                {tag && <span className="tag"> {tag}</span>}
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
