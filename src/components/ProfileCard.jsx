import portrait from "../assets/siggi-portrait.webp";
import { contact, profile } from "../content/site";
import Icon from "./Icon";

/**
 * The tall profile card: portrait on a dark spotlight, name, role and
 * contact icons along the bottom. Sticky beside the content on desktop.
 */
export default function ProfileCard() {
  const links = [
    contact.email && { label: "Email", icon: "mail", href: `mailto:${contact.email}` },
    contact.linkedin && { label: "LinkedIn", icon: "linkedin", href: contact.linkedin },
    contact.github && { label: "GitHub", icon: "github", href: contact.github },
  ].filter(Boolean);

  return (
    <aside className="profile-card">
      <div className="profile-photo">
        <img
          src={portrait}
          fetchpriority="high"
          decoding="async"
          alt="Sigurður G. Hjálmarsson"
          width="532"
          height="1571"
        />
      </div>
      <div className="profile-info">
        <h2 className="profile-name">{profile.name}</h2>
        <p className="profile-role">{profile.role}</p>
        <ul className="profile-links">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-label={link.label}
                title={link.label}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <Icon name={link.icon} size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
