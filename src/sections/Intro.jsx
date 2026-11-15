import { contact, hero, profile, services } from "../content/site";
import Icon from "../components/Icon";
import { agentsTeaser, team } from "../content/agents";

const agentsHref = `${import.meta.env.BASE_URL}agents/`;
const cvHref = `${import.meta.env.BASE_URL}cv.html`;

/**
 * Opening block of the content panel: big headline, accent meta line,
 * short intro with the CV and email buttons, the feature card for the
 * AI agent team page, then the "What I do" grid.
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

      <p className="intro-actions">
        <a className="btn btn-solid" href={cvHref}>
          {hero.cvAction}
        </a>
        {contact.email && (
          <a className="btn" href={`mailto:${contact.email}`}>
            {hero.contactAction}
          </a>
        )}
      </p>

      <a className="feature" href={agentsHref} aria-labelledby="feature-title">
        <span className="feature-label">
          <Icon name="agents" size={18} />
          {agentsTeaser.label}
        </span>
        <h2 id="feature-title" className="feature-title">
          {agentsTeaser.title}
        </h2>
        <p className="feature-text">{agentsTeaser.text}</p>
        <ul className="feature-flow" role="list" aria-label={agentsTeaser.flowLabel}>
          {team.roles.map((r) => (
            <li key={r.role}>{r.role}</li>
          ))}
          <li className="is-beside">{team.lead.role}</li>
        </ul>
        <span className="feature-cta">
          {agentsTeaser.link} <span aria-hidden="true">→</span>
        </span>
      </a>

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
    </header>
  );
}
