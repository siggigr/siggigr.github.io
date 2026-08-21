import { contact } from "../content/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const links = [
    contact.email && { label: "Email", href: `mailto:${contact.email}` },
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin },
    contact.github && { label: "GitHub", href: contact.github },
  ].filter(Boolean);

  return (
    <footer className="footer">
      <span>© {year} Sigurður G. Hjálmarsson</span>
      {links.length > 0 && (
        <nav className="footer-links" aria-label="Contact">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
}
