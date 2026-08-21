import Section from "../components/Section";
import { family } from "../content/family";

export default function Family() {
  return (
    <Section id="family" eyebrow="Fjölskyldan" title="Family">
      {family.length === 0 && (
        <p className="empty-note">Family introductions are on their way.</p>
      )}
      <div className="card-grid">
        {family.map((member) => (
          <article key={member.name} className="card">
            <h3>{member.name}</h3>
            <p>{member.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
