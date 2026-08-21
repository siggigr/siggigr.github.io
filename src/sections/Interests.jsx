import Section from "../components/Section";
import { interests } from "../content/interests";

export default function Interests() {
  return (
    <Section id="interests" eyebrow="Áhugamál" title="Interests">
      {interests.length === 0 && (
        <p className="empty-note">Hobbies and enthusiasms, to be catalogued.</p>
      )}
      {interests.map((section) => (
        <div key={section.title} className="interest-block">
          <div className="interest-head">
            <h3>{section.title}</h3>
          </div>
          {section.blurb && <p className="interest-blurb">{section.blurb}</p>}
          {(section.items || []).length > 0 && (
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
          )}
        </div>
      ))}
    </Section>
  );
}
