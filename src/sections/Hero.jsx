import EditableText from "../components/EditableText";
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
          <p className="hero-coords">64°07′N 21°55′W — Kópavogur</p>
          <EditableText
            path="siteContent/hero"
            field="headline"
            fallback="Halló, ég heiti Siggi."
            className="hero-headline"
            render={(value) => <h1>{value}</h1>}
          />
          <EditableText
            path="siteContent/hero"
            field="subline"
            fallback="Software professional in Kópavogur: quality engineering, business analysis, and a lifelong weakness for aircraft and good books."
            multiline
            className="hero-subline"
          />
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
