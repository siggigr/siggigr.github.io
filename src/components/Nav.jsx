const LINKS = [
  { href: "#about", label: "About" },
  { href: "#professional", label: "Work" },
  { href: "#interests", label: "Interests" },
  { href: "#family", label: "Family" },
  { href: "#pets", label: "Pets" },
  { href: "#apps", label: "Apps" },
];

export default function Nav() {
  return (
    <nav className="nav" aria-label="Main">
      <a className="nav-brand" href="#top">
        SGH
      </a>
      <div className="nav-links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
