/**
 * Text for the AI agent team page (/agents/). Edit here, then commit
 * and push — the site redeploys automatically.
 *
 * Multi-paragraph text is an array of strings, one string per paragraph.
 */

/** Change this when you update the page. Shown at the end of the line under the headline. */
export const lastUpdated = "15 October 2026";

export const agentsHero = {
  headline: "One engineer, six AI colleagues.",
  meta: ["Case study", "Tillslip, Android", "In progress", `Updated ${lastUpdated}`],
  // A paragraph is a string, or { before, link: { text, href }, after }
  // for a paragraph with one link (opens in a new tab).
  intro: [
    "I run a small software team made of AI agents: an Analyst, an Architect, a Designer, a Developer, a Reviewer and a QA Engineer. This page shows them at work on a real Android app, Tillslip, a grocery receipt scanner I'm building for my household.",
    {
      before: "Each role is ",
      link: { text: "a set of instructions I wrote", href: "https://github.com/siggigr/agents" },
      after: ", kept generic so the same team can take on the next app.",
    },
  ],
};

/** The "My part" callout under the intro. */
export const myRole = {
  title: "My part",
  text: "The agents write the documents and the code. I designed the team and its rules, I make the decisions, and I approve each step before the next one starts.",
};

/**
 * The pipeline, in order. One card per role:
 *   { role, output, text, next }
 * Set next: true for a role that hasn't run yet (shows "coming next").
 */
export const pipeline = [
  {
    role: "Analyst",
    output: "Requirements",
    text: "Started from my description of the app and a real store receipt. Asked clarifying questions until the gaps were closed, then wrote the requirements: 26 functional and 24 non-functional.",
  },
  {
    role: "Architect",
    output: "Architecture",
    text: "A Firebase design that keeps household data in the EEA and runs at 0 kr. a month. Every requirement is traced to the design, and the build is planned as ten milestones, from repository setup to release.",
  },
  {
    role: "Designer",
    output: "Visual design",
    text: "Mocked up three visual directions on the same screens. I chose a calm, paper-like look with one muted green accent and prices that line up in a column, and turned down a glass look because blurred backgrounds make text harder to read in a shop.",
  },
  {
    role: "Developer",
    output: "Pull requests",
    text: "One pull request per milestone, with linting and static analysis running in CI from the first one. It never changes the design on its own: when something doesn't fit, it stops and asks.",
  },
  {
    role: "Reviewer",
    output: "Review",
    text: "Checks each pull request for architecture, security and coding rules, and ends with findings and a verdict. On the first pull request it found one major and four minor issues, all fixed before it was merged.",
  },
  {
    role: "QA",
    output: "Test results",
    text: "Will test the user goals and the non-functional requirements, such as the keyboard never covering a text field.",
    next: true,
  },
];

/** Intro line above the three moment cards. */
export const highlightsIntro =
  "All three happened before the first screen was built: two while the architecture was being designed, one in the review of the first pull request.";

/** Three moments that mattered. by: who raised it (shown as a tag). */
export const highlights = [
  {
    by: "Architect",
    title: "Sign-in data in the US",
    text: "Google sign-in through Firebase stores account details in the US, while all household data stays in the EEA. The architect raised this instead of deciding quietly, and asked for my decision in writing. I approved it for the first version, to be re-checked before any public release.",
  },
  {
    by: "Reviewer",
    title: "A blocklist became an allowlist",
    text: "The CI check on app permissions blocked a fixed list of known risky ones, so anything not on the list got through, including permissions added in future Android versions. The reviewer flagged it, and it became an allowlist that fails on anything not explicitly permitted, before the pull request was merged.",
  },
  {
    by: "Decision",
    title: "No receipt photos are kept",
    text: "Receipts can show card digits and a national ID number. The architect proposed not keeping the photos at all, and I approved it: they are read on the phone and then deleted. Card numbers are also blanked out of the text before anything is saved.",
  },
];

/**
 * Screenshots or a screen recording of the app. While this list is
 * empty, the section shows a placeholder card. Add entries like:
 *   { type: "image", src: "/agents/tillslip-scan.webp", alt: "Scanning a receipt" }
 *   { type: "video", src: "/agents/tillslip-demo.mp4", poster: "/agents/poster.webp", alt: "Short demo" }
 * (put the files in public/agents/ so they are copied as-is)
 */
export const screens = [];

/** Teaser card on the main page. */
export const agentsTeaser = {
  title: "One developer, six AI colleagues",
  text: "How I run a small team of AI agents that takes a real Android app from requirements to reviewed code, with me approving every step.",
  link: "See how it works",
};
