import { hero, profile, services } from "../content/site";
import Icon from "../components/Icon";
import { agentsTeaser } from "../content/agents";

const agentsHref = `${import.meta.env.BASE_URL}agents/`;

/**
 * Opening block of the content panel: big headline, accent meta line,
 * short intro, the "What I do" grid, then the teaser card for the
 * AI agent team page.
 */
export default function Intro() {
  return (
    <header className="intro">
      <h1 lang={hero.headlineLang}>{hero.headline}</h1>
      <p className="intro-meta">
        {profile.meta.map((item, i) => (
          <span key={item}>
            {i > 0 && <span className="intro-meta-sep" aria-hidden="true"> / </span>}
            {item}
          </span>
        ))}
      </p>
      <p className="intro-lead">{hero.subline}</p>

      <h2 className="intro-subhead">What I do</h2>
      <ul className="services">
        {services.map((s) => (
          <li key={s.title} className="service">
            <span className="service-icon">
              <Icon name={s.icon} size={26} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ul>

      <aside className="teaser" aria-labelledby="teaser-title">
        <span className="teaser-icon">
          <Icon name="agents" size={26} />
        </span>
        <div>
          <h3 id="teaser-title">{agentsTeaser.title}</h3>
          <p>{agentsTeaser.text}</p>
          <a className="app-link" href={agentsHref}>
            {agentsTeaser.link} →
          </a>
        </div>
      </aside>
    </header>
  );
}
