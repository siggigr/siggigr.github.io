import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const cvHref = `${import.meta.env.BASE_URL}cv.html`;
const agentsHref = `${import.meta.env.BASE_URL}agents/`;

const LINKS = [
  { id: "about", label: "About", icon: "user" },
  { id: "family", label: "Family", icon: "home" },
  { id: "professional", label: "Work", icon: "briefcase" },
  { id: "cv", label: "CV", icon: "resume", href: cvHref },
  { id: "agents", label: "AI agent team", icon: "agents", href: agentsHref },
  { id: "interests", label: "Interests", icon: "book" },
  { id: "pets", label: "Pets", icon: "paw" },
  { id: "apps", label: "Apps", icon: "grid" },
];

/**
 * Narrow icon rail: brand mark at the top, one icon per section plus
 * the CV page and the AI agent team page, and a "Download CV as PDF" button at the bottom, which
 * opens the CV page straight into the print dialog (see CVPage.jsx).
 * Highlights the section currently in view (the CV and agent team
 * links go to separate pages, so they never light up): the last
 * section whose top has passed a line 35% down the screen. At the very
 * bottom of the page the last section lights up, because a short last
 * section (Apps) can never scroll up to that line. A clicked icon
 * stays lit while the page scrolls to it.
 * On small screens it becomes a horizontal bar (see dark.css).
 */
export default function Rail() {
  const [active, setActive] = useState("about");

  const clicked = useRef(null); // section id while a clicked link scrolls to it

  useEffect(() => {
    const sections = LINKS.filter((l) => !l.href)
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    let frame = 0;
    let settle = 0;

    const update = () => {
      frame = 0;
      if (clicked.current) return;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }
      const line = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      // After a click, wait until the scrolling stops before following
      // the scroll position again.
      if (clicked.current) {
        clearTimeout(settle);
        settle = setTimeout(() => {
          clicked.current = null;
        }, 150);
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onClick = (e) => {
      const link = e.target.closest('.rail-links a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      clicked.current = id;
      setActive(id);
      clearTimeout(settle);
      settle = setTimeout(() => {
        clicked.current = null;
      }, 1000); // in case the page does not need to scroll at all
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
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
      <a className="rail-cv" href={`${cvHref}?print`} title="Download CV as PDF">
        <Icon name="download" />
        <span className="rail-label">Download CV as PDF</span>
      </a>
    </nav>
  );
}
