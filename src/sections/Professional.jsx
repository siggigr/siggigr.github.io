import Section from "../components/Section";
import { professional } from "../content/site";

const cvHref = `${import.meta.env.BASE_URL}cv.html`;

export default function Professional() {
  return (
    <Section id="professional" eyebrow="Starfsferill" title="Professional life">
      <div className="prose">
        {professional.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <a className="cv-link" href={cvHref}>
        View my full CV →
      </a>
    </Section>
  );
}
