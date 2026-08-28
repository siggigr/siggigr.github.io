import Section from "../components/Section";
import { familyIntro } from "../content/site";
import { family } from "../content/family";

export default function Family() {
  return (
    <Section id="family" eyebrow="Fjölskyldan" title="Family">
      <div className="prose">
        {familyIntro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {family.length > 0 && (
        <div className="card-grid card-grid-spaced">
          {family.map((member) => (
            <article key={member.name} className="card">
              <h3>{member.name}</h3>
              <p>{member.description}</p>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
