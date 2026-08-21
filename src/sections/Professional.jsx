import Section from "../components/Section";
import { professional } from "../content/site";

export default function Professional() {
  return (
    <Section id="professional" eyebrow="Starfsferill" title="Professional life">
      <div className="prose">
        {professional.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
