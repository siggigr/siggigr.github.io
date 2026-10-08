import { useEffect, useState } from "react";
import Icon from "./Icon";

const cvHref = `${import.meta.env.BASE_URL}cv.html`;

const LINKS = [
  { id: "about", label: "About", icon: "user" },
  { id: "family", label: "Family", icon: "home" },
  { id: "professional", label: "Work", icon: "briefcase" },
  { id: "cv", label: "CV", icon: "resume", href: cvHref },
  { id: "interests", label: "Interests", icon: "book" },
  { id: "pets", label: "Pets", icon: "paw" },
  { id: "apps", label: "Apps", icon: "grid" },
];

/**
 * Narrow icon rail: brand mark at the top, one icon per section plus
 * the CV page, and a CV shortcut at the bottom. Highlights the section
 * currently in view (the CV link goes to a separate page, so it never
 * lights up).
 * On small screens it becomes a horizontal bar (see dark.css).
 */
export default function Rail() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const sections = LINKS.filter((l) => !l.href)
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="rail" aria-label="Main">
      <a className="rail-brand" href="#top" aria-label="Back to top">
        SGH
      </a>
      <ul className="rail-links">
        {LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={link.href || `#${link.id}`}
              className={active === link.id ? "is-active" : undefined}
              aria-current={active === link.id ? "true" : undefined}
              title={link.label}
            >
              <Icon name={link.icon} />
              <span className="rail-label">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <a className="rail-cv" href={cvHref} title="CV">
        <Icon name="download" />
        <span className="rail-label">CV</span>
      </a>
    </nav>
  );
}
