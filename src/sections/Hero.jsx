import { hero } from "../content/site";
import portrait from "../assets/siggi-portrait.webp";

/**
 * Portrait presentation variants — pick one by editing the className
 * on the hero-photo-card div below:
 *   "hero-photo-card"        white card with teal offset shadow (default)
 *   "hero-photo-card tinted" soft teal card
 *   "hero-photo-card free"   no card: the figure stands directly on the page
 */
export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-text">
          <p className="hero-coords">{hero.coords}</p>
          <h1>{hero.headline}</h1>
          <div className="hero-subline">
            <p>{hero.subline}</p>
          </div>
        </div>
        <div className="hero-photo-card">
          <img
            src={portrait}
            alt="Sigurður G. Hjálmarsson"
            width="642"
            height="957"
          />
        </div>
      </div>
      <div className="horizon" aria-hidden="true">
        <span className="horizon-marker" />
      </div>
    </header>
  );
}
