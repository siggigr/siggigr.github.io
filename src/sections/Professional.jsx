import Section from "../components/Section";
import EditableText from "../components/EditableText";

export default function Professional() {
  return (
    <Section id="professional" eyebrow="Starfsferill" title="Professional life">
      <EditableText
        path="siteContent/professional"
        field="body"
        multiline
        className="prose"
        fallback={
          "Twenty years in software: fourteen in testing and quality assurance, six in development, with experience spanning safety-critical air traffic control systems and airline technology.\n\nSign in as an admin and press Edit to write your own professional summary here."
        }
      />
    </Section>
  );
}
