import Section from "../components/Section";
import { interestsIntro } from "../content/site";
import { interests } from "../content/interests";
import { openBook } from "../flipbook/flipBook";
import "../styles/flipbook.css";

/**
 * Interests: intro text, then one button per list in interests.js.
 * Each button opens its list as a flip-book (see flipbook/flipBook.js).
 */
export default function Interests() {
  return (
    <Section id="interests" eyebrow="Áhugamál" title="Interests">
      <div className="prose">
        {interestsIntro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="shelf">
        {interests.map((list) => (
          <button
            key={list.id}
            type="button"
            className="shelf-btn"
            aria-haspopup="dialog"
            onClick={(e) => openBook(list, e.currentTarget)}
          >
            <span className={`mini-book ${list.cover.style}`} aria-hidden="true" />
            <span className="shelf-text">
              <span className="shelf-title">{list.title}</span>
              <span className="shelf-meta">{list.meta}</span>
              <span className="shelf-open">{list.openLabel} <span aria-hidden="true">→</span></span>
            </span>
          </button>
        ))}
      </div>
    </Section>
  );
}
