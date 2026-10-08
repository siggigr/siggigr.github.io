import { hero, profile, services } from "../content/site";
import Icon from "../components/Icon";

/**
 * Opening block of the content panel: big headline, accent meta line,
 * short intro, then the "What I do" grid.
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
    </header>
  );
}
