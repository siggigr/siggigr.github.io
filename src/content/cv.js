/**
 * CV content, shown on the cv.html page. Edit this file to change
 * what the CV says, then commit and push — the site redeploys
 * automatically, same as any other content file.
 *
 * Each job has one or more `roles`, and bullets belong to the role
 * they were done in — not to the company as a whole.
 */

export const experience = [
  {
    company: "Sabre Corporation",
    roles: [
      {
        title: "Senior Service Delivery Engineer",
        period: "2020 – 2026",
        bullets: [
          "Development and support of analysers built on Sabre's Intelligent Exchange (IX) platform, in Java and Oracle SQL",
          "Project planning from customer requests and PRDs, and solution design with the team",
          "Investigation of customer-reported issues, with fixes and re-deployments",
          "Customer support, on-call duty, releases and CVT testing",
        ],
      },
      {
        title: "Senior Software Engineer in Test",
        period: "2016 – 2020",
        bullets: [
          "Java development of automated tests for the IX platform, using Test Kit, an internal platform supplying bookings (PNRs), flights and test data",
          "Manual test cases and smoke testing for new and changed functionality",
        ],
      },
    ],
  },
  {
    company: "Tern Systems",
    roles: [
      {
        title: "Test Engineer",
        period: "2006 – 2016 (part-time 2006)",
        bullets: [
          "Manual acceptance testing (FAT/SAT) of safety-critical air traffic control systems",
          "Responsible for testing, incl. on-site SAT with customers abroad",
        ],
      },
    ],
  },
  {
    company: "Nanoq & Útilíf",
    roles: [
      {
        title: "Sales Associate, Outdoor Department",
        period: "2001 – 2007",
        bullets: ["Assistant Store Manager, autumn 2004"],
      },
    ],
  },
  {
    company: "Flugfélag Vestmannaeyja / Landsflug",
    roles: [
      {
        title: "Captain, Flugfélag Vestmannaeyja",
        period: "2001 – 2002",
        bullets: ["Partenavia P68C"],
      },
      {
        title: "First Officer, Landsflug",
        period: "2005",
        bullets: ["Piper Chieftain, air ambulance flights"],
      },
    ],
  },
];

export const education = [
  {
    school: "Reykjavík University",
    detail: "B.Sc. in Computer Science",
    period: "2005 – 2009",
  },
  {
    school: "Icelandic Flight Academy",
    detail: "ATPL first class",
    period: "1998",
  },
  {
    school: "Icelandic Flight Academy",
    detail: "Commercial Pilot License with Instrument Rating",
    period: "1997",
  },
  {
    school: "Framhaldsskólinn í Vestmannaeyjum",
    detail: "Secondary School Diploma, natural science program",
    period: "1991 – 1995",
  },
];

/**
 * Technical skills, grouped as on the Word CV. Each group renders as
 * an italic label followed by its own row of chips.
 */
export const technicalSkills = [
  {
    label: "Programming",
    items: ["Java", "SQL / Oracle SQL Developer", "ActiveMQ"],
  },
  {
    label: "Tools",
    items: ["IntelliJ IDEA", "GitHub", "GitHub Copilot", "Jira", "Rally"],
  },
  {
    label: "Platforms",
    items: ["Google Cloud", "Linux & Windows", "Microsoft 365"],
  },
  {
    label: "Personal project",
    items: ["Nextpost — Android app (Kotlin, Compose, Firebase)"],
  },
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
