import EditableText from "../components/EditableText";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <p className="hero-coords">64°08′N 21°56′W — Reykjavík</p>
      <EditableText
        path="siteContent/hero"
        field="headline"
        fallback="Halló, ég heiti Siggi."
        className="hero-headline"
        render={(value) => <h1>{value}</h1>}
      />
      <EditableText
        path="siteContent/hero"
        field="subline"
        fallback="Software professional in Reykjavík: quality engineering, business analysis, and a lifelong weakness for aircraft and good books."
        multiline
        className="hero-subline"
      />
      <div className="horizon" aria-hidden="true">
        <span className="horizon-marker" />
      </div>
    </header>
  );
}
