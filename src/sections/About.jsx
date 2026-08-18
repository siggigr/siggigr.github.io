import Section from "../components/Section";
import EditableText from "../components/EditableText";

export default function About() {
  return (
    <Section id="about" eyebrow="Um mig" title="About">
      <EditableText
        path="siteContent/about"
        field="body"
        multiline
        className="prose"
        fallback={
          "I am Sigurður, Siggi to most people, a software professional living in Reykjavík.\n\nSign in as an admin and press Edit to replace this text with your own introduction."
        }
      />
    </Section>
  );
}
