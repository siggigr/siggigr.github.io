import { useState } from "react";
import Section from "../components/Section";
import { interestsIntro } from "../content/site";
import { interests } from "../content/interests";

export default function Interests() {
  const [openId, setOpenId] = useState(null);

  return (
    <Section id="interests" eyebrow="Áhugamál" title="Interests">
      <div className="prose">
        {interestsIntro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="interest-toggles">
        {interests.map((section) => {
          const isOpen = openId === section.title;
          const panelId = `interest-panel-${section.title.replace(/\s+/g, "-")}`;
          return (
            <div key={section.title} className="interest-block">
              <button
                type="button"
                className="interest-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : section.title)}
              >
                <span>{section.title}</span>
                <svg
                  className="interest-toggle-icon"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                id={panelId}
                className="interest-panel"
                data-open={isOpen}
                role="region"
              >
                <div className="interest-panel-inner">
                  {section.blurb && (
                    <p className="interest-blurb">{section.blurb}</p>
                  )}
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
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
