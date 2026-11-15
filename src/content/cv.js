/**
 * CV content, shown on the cv.html page. Edit this file to change
 * what the CV says, then commit and push — the site redeploys
 * automatically, same as any other content file.
 *
 * Each job has one or more `roles`, and bullets belong to the role
 * they were done in — not to the company as a whole.
 */

/**
 * Phone number, shown in the CV header only. It lives here rather than
 * in `contact` (site.js) so it is bundled with the CV page alone.
 */
export const cvPhone = "+354 698 7372";

/**
 * Summary line under the CV header. Same text as on the Word CV.
 */
export const cvSummary =
  "Software developer and test engineer with 20 years in software: 6 years developing Java and Oracle SQL backend solutions for airlines at Sabre, and 14 years testing airline software and safety-critical air traffic control systems.";

export const experience = [
  {
    company: "Sabre Corporation",
    roles: [
      {
        title: "Senior Service Delivery Engineer",
        period: "2020 – 2026",
        bullets: [
          "Developed new features and maintained existing ones in Java and Oracle SQL analysers on Sabre's Intelligent Exchange (IX) platform",
          "Part of the team that built a real-time integration between Alaska Airlines and Sift to prevent payment fraud, delivered on schedule although our team joined late",
          "Found a critical time-zone defect in end-to-end testing with Alaska and Sift, fixed it and shipped a new release overnight, keeping the project on schedule",
          "Sole developer of an analyser that re-assigns disability service requests (SSRs) when booking segments change",
          "Planned work from customer requests and PRDs and designed solutions with the team",
          "Supported airline customers with deployments on GCP and IX platform advice; on-call duty, releases and CVT support",
        ],
      },
      {
        title: "Senior Software Engineer in Test",
        period: "2016 – 2020",
        bullets: [
          "Wrote automated Java tests for the IX platform with Test Kit, an internal tool supplying bookings (PNRs) and flights",
          "Wrote and ran manual functional test cases and smoke tests for all new and changed functionality",
          "Verified customer-reported issues to establish whether they were defects, training gaps or something else",
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
          "Wrote and executed acceptance tests (FAT/SAT) for safety-critical air traffic control systems",
          "In charge of on-site SAT at customer sites in Iceland and abroad",
          "Tested the air traffic controller display (GUI), incl. aircraft-separation alerts and graphical presentation of data",
        ],
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
];

/**
 * Aviation background, shown under Education. One line per entry, no
 * years, as on the Word CV.
 */
export const aviation = [
  "Captain, Partenavia P68C charter flights (Flugfélag Vestmannaeyja); First Officer, Piper Chieftain air ambulance (Landsflug)",
  "Completed ATPL first class and Commercial Pilot License with Instrument Rating, Icelandic Flight Academy (licences no longer current)",
];

/**
 * Technical skills, grouped as on the Word CV. Each group renders as
 * an italic label followed by its own row of chips.
 */
export const technicalSkills = [
  {
    label: "Programming",
    items: ["Java", "SQL (Oracle)", "Kotlin (personal projects)"],
  },
  {
    label: "Testing",
    items: [
      "Test automation in Java",
      "Manual functional testing",
      "Acceptance testing (FAT/SAT)",
      "Smoke testing",
    ],
  },
  {
    label: "Tools",
    items: [
      "IntelliJ IDEA",
      "Oracle SQL Developer",
      "Git",
      "GitHub",
      "Jira",
      "Rally",
      "GitHub Copilot",
      "Claude Code",
    ],
  },
  {
    label: "Platforms",
    items: ["Google Cloud Platform (GCP)", "ActiveMQ", "Linux & Windows"],
  },
  {
    label: "Personal projects",
    items: [
      "Nextpost – Android app (Kotlin, Jetpack Compose, Firebase)",
      "Tillslip – app in development, built with my own team of AI agents in Claude Code",
    ],
  },
];

export const coreStrengths = [
  "Conscientious and reliable",
  "Attention to detail",
  "Persistence in problem-solving",
  "Service-minded",
  "Strong communication and teamwork",
];

export const languages = [
  { name: "Icelandic", level: "native" },
  { name: "English", level: "fluent" },
];

export const cvInterests =
  "Computing, literature, aviation and aircraft, outdoor activities.";

/**
 * References are intentionally not listed with direct contact
 * details on a public page — provided on request instead.
 */
export const referencesNote = "Available upon request.";
