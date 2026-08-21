import Section from "../components/Section";
import { about } from "../content/site";

export default function About() {
  return (
    <Section id="about" eyebrow="Um mig" title="About">
      <div className="prose">
        {about.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
