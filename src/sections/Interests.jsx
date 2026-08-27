import Section from "../components/Section";
import { interestsIntro } from "../content/site";
import { interests } from "../content/interests";

export default function Interests() {
  return (
    <Section id="interests" eyebrow="Áhugamál" title="Interests">
      <div className="prose">
        {interestsIntro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {interests.map((section) => (
        <div key={section.title} className="interest-block">
          <div className="interest-head">
            <h3>{section.title}</h3>
          </div>
          {section.blurb && <p className="interest-blurb">{section.blurb}</p>}
          {(section.items || []).length > 0 ? (
            <ul className="interest-items">
              {section.items.map((item) => (
                <li key={item.title}>
                  <span className="item-title">{item.title}</span>
                  {item.note && (
                    <span className="item-note"> — {item.note}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">List coming soon.</p>
          )}
        </div>
      ))}
    </Section>
  );
}
