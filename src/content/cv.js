/**
 * CV content, shown on the cv.html page. Edit this file to change
 * what the CV says, then commit and push — the site redeploys
 * automatically, same as any other content file.
 */

export const experience = [
  {
    company: "Sabre Corporation",
    period: "2016 – 2026",
    roles: [
      { title: "Senior Service Delivery Engineer", period: "2020 – 2026" },
      { title: "Senior Software Engineer in Test", period: "2016 – 2020" },
    ],
    bullets: [
      "Development and maintenance of solutions for airlines",
      "Java development for automated testing",
    ],
  },
  {
    company: "Tern Systems",
    period: "2007 – 2016",
    roles: [{ title: "Test Engineer", period: "2007 – 2016" }],
    bullets: [
      "Designed and implemented testing for various systems",
      "Led and managed testing activities",
    ],
  },
  {
    company: "Nanoq & Útilíf",
    period: "2001 – 2007",
    roles: [{ title: "Sales Associate, Outdoor Department", period: "2001 – 2007" }],
    bullets: ["Assistant Store Manager (Autumn 2004)"],
  },
  {
    company: "Landsflug / Flugfélag Vestmannaeyja",
    period: "2001 – 2005",
    roles: [
      { title: "Captain", period: "2001 – 2002" },
      { title: "First Officer", period: "2005" },
    ],
    bullets: [],
  },
];

export const education = [
  {
    school: "Reykjavík University",
    detail: "B.Sc. in Computer Science",
    period: "2005 – 2009",
  },
  {
    school: "Icelandic Flight School",
    detail: "ATPL First Class",
    period: "1998",
  },
  {
    school: "Icelandic Flight School",
    detail: "Commercial Pilot License with Instrument Rating",
    period: "1997",
  },
  {
    school: "Framhaldsskólinn í Vestmannaeyjum",
    detail: "Secondary School Diploma, natural science program",
    period: "1991 – 1995",
  },
];

export const technicalSkills = [
  "Java",
  "SQL / SQL Developer",
  "IntelliJ IDEA",
  "GitHub",
  "Copilot",
  "Linux & Windows",
  "Microsoft 365",
];

export const coreStrengths = [
  "Strong communication and teamwork skills",
  "Attention to detail in development and testing",
  "Persistence in problem-solving",
  "Reliable and accountable",
  "Service-minded attitude",
];

export const languages = [
  { name: "Icelandic", level: "Native" },
  { name: "English", level: "Fluent" },
];

export const cvInterests =
  "Computing, literature, aviation & aircraft, outdoor activities.";

/**
 * References are intentionally not listed with direct contact
 * details on a public page — provided on request instead.
 */
export const referencesNote = "Available upon request.";
