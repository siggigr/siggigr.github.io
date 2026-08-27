import { hero } from "../content/site";
import portrait from "../assets/siggi-portrait.webp";

/**
 * The full-body portrait is absolutely positioned within the hero:
 * head level with the coordinates line, feet on the horizon line.
 * Sizing lives in .hero-photo-card.free in global.css.
 */
export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-text">
          <p className="hero-coords">{hero.coords}</p>
          <h1 lang={hero.headlineLang}>{hero.headline}</h1>
          <div className="hero-subline">
            <p>{hero.subline}</p>
          </div>
        </div>
        <div className="hero-photo-card free">
          <img
            src={portrait}
            fetchpriority="high"
            decoding="async"
            alt="Sigurður G. Hjálmarsson"
            width="532"
            height="1571"
          />
        </div>
      </div>
      <div className="horizon" aria-hidden="true">
        <span className="horizon-marker" />
      </div>
    </header>
  );
}
