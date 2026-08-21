import { hero } from "../content/site";
import portrait from "../assets/siggi-portrait.webp";

/**
 * Portrait presentation variants — edit the className below:
 *   "hero-photo-card free"   figure emerges from the dark page (default)
 *   "hero-photo-card"        dark card with teal offset shadow
 *   "hero-photo-card tinted" teal-tinted card
 * Monochrome portrait: change the import to ../assets/siggi-portrait-bw.webp
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
            width="870"
            height="702"
          />
        </div>
      </div>
      <div className="horizon" aria-hidden="true">
        <span className="horizon-marker" />
      </div>
    </header>
  );
}
