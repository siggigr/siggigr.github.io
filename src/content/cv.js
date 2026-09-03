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
      "Development and operation of Java/SQL solutions for airlines",
      "Project planning from PRDs and solution design with the team",
      "Incident resolution, fixes and re-deployments for customers",
      "Customer support, on-call duty, releases and CVT testing",
      "Java development for automated testing (2016 – 2020)",
    ],
  },
  {
    company: "Tern Systems",
    period: "2006 – 2016",
    roles: [{ title: "Test Engineer", period: "2006 – 2016 (part-time 2006)" }],
    bullets: [
      "Manual acceptance testing (FAT/SAT) of safety-critical air traffic control systems",
      "Responsible for testing, incl. on-site SAT with customers abroad",
    ],
  },
  {
    company: "Nanoq & Útilíf",
    period: "2001 – 2007",
    roles: [
      { title: "Sales Associate, Outdoor Department", period: "2001 – 2007" },
    ],
    bullets: ["Assistant Store Manager, autumn 2004"],
  },
  {
    company: "Landsflug / Flugfélag Vestmannaeyja",
    period: "2001 – 2005",
    roles: [
      { title: "First Officer", period: "2005" },
      { title: "Captain", period: "2001 – 2002" },
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
    detail: "ATPL first class",
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
  "SQL / Oracle SQL Developer",
  "ActiveMQ",
  "IntelliJ IDEA",
  "GitHub",
  "GitHub Copilot",
  "Jira",
  "Rally",
  "Google Cloud",
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
  { name: "Icelandic", level: "native" },
  { name: "English", level: "fluent" },
];

export const cvInterests =
  "Computing, literature, aviation & aircraft, outdoor activities.";

/**
 * References are intentionally not listed with direct contact
 * details on a public page — provided on request instead.
 */
export const referencesNote = "Available upon request.";
