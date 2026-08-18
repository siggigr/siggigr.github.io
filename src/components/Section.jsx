/**
 * Standard section shell. The Icelandic eyebrow above each English
 * heading is the site's signature: a small bilingual detail that says
 * something true about its owner.
 */
export default function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section">
      <header className="section-head">
        <span className="eyebrow" lang="is">
          {eyebrow}
        </span>
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}
