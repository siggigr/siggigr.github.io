/**
 * Text for the AI agent team page (/agents/). Edit here, then commit
 * and push — the site redeploys automatically.
 *
 * Headings that need a capital letter inside the site's lowercase style
 * are arrays: plain strings and { keep: "I" } for the part that keeps
 * its case. Text with a link or code in it is an array of strings,
 * { code: "…" } and { link: { text, href } } in reading order.
 */

/** Change this when you update the page. Shown at the end of the line under the headline. */
export const lastUpdated = "5 November 2026";

const agentsRepo = "https://github.com/siggigr/agents";

export const agentsHero = {
  headline: "One engineer, seven AI colleagues.",
  meta: ["Case study", "Tillslip, Android", "In progress", `Updated ${lastUpdated}`],
  lead: "I run a small software team made of AI agents built on Claude. Each has one job, and nothing moves on until I have approved it. Together we are building Tillslip, an Android app that reads grocery receipts and tracks what a household spends.",
  /** The three facts: bold part first, then the rest. */
  facts: [
    { lead: "Version 0.1.0 released.", rest: "Signed and built by the pipeline, installed on my phone" },
    { lead: "7 review rounds", rest: "before the first milestone was allowed to merge" },
    { lead: "0 kr. a month", rest: "to run, with all household data kept in the EEA" },
  ],
  more: {
    before: "Each role is ",
    link: { text: "a set of instructions I wrote", href: agentsRepo },
    after: ", kept generic so the same team can take on the next app, or any other software project. They already look after this website too.",
  },
};

export const inThirty = {
  title: "In 30 seconds",
  eyebrow: "Í stuttu máli",
  paragraphs: [
    "An AI agent here is an AI model with one written job description, the way a new colleague gets a role. I wrote seven of them: someone who turns my idea into requirements, an architect, a designer, a developer, a code reviewer, a tester, and a tech lead who keeps the overview.",
    "They work like a small software company, and I run it. Each one hands its work to the next, and nothing moves on until I have read it and said yes. When an agent is unsure, it stops and asks me instead of guessing.",
    "The result so far is a working Android app with sign-in and shared households, nearly 400 automated tests, and a first released version on my phone. The agents did the writing. The decisions, and the responsibility for the result, are mine.",
  ],
  /** The "My part" callout. */
  myPart: {
    label: "My part",
    lead: "My part.",
    text: "I designed the team and its rules, I make every decision, and I test every milestone on my own phone before it is merged. That check finds what automated tests cannot, such as a sign-out that ended on an error screen when the network dropped.",
  },
};

export const team = {
  title: "The team",
  eyebrow: "Teymið",
  intro: "Each role hands its work to the next, and nothing moves on until I have approved it.",
  besideTag: "Beside the pipeline",
  /** The Tech Lead: drawn beside the flow, not in it. */
  lead: {
    role: "Tech Lead",
    output: "Status and prompts",
    text: "Keeps the overview across all the sessions, writes each role's task, and checks what they report against the code before I approve anything.",
  },
  /** The six pipeline roles in order. output = what the role produces (team map). */
  roles: [
    {
      role: "Analyst",
      output: "Requirements",
      text: "Started from my description of the app and a real store receipt. Asked questions until the gaps were closed, then wrote 26 functional and 24 non-functional requirements, each one testable.",
    },
    {
      role: "Architect",
      output: "Architecture",
      text: "A design that keeps household data in the EEA and runs at 0 kr. a month. Every requirement is traced to the design, and the build is planned as ten milestones, from repository setup to release.",
    },
    {
      role: "Designer",
      output: "Visual design",
      text: "Mocked up three visual directions on the same screens. I chose a calm, paper-like look with one muted green accent, and turned down a glass look because blurred backgrounds are harder to read in a shop.",
    },
    {
      role: "Developer",
      output: "Code",
      text: "Writes the code one milestone at a time, as a pull request: a package of changes that is reviewed before it goes in. Linting, static analysis and tests run on every one. It never changes the design on its own: when something doesn't fit, it stops and asks.",
    },
    {
      role: "Reviewer",
      output: "Findings and a verdict",
      text: "Reads every pull request for architecture, security and correctness, runs on a different model from the developer so it doesn't share its blind spots, and blocks anything that isn't ready.",
    },
    {
      role: "QA",
      output: "Tests and a phone checklist",
      text: "Tests the user goals and the non-functional requirements, writes its own tests, and gives me a checklist for my phone. On the first milestone it added 38 tests.",
    },
  ],
  /** Screen readers hear "<role>, produces <output>". Never shown. */
  produces: "produces",
  me: { label: "Me:", text: "approve every hand-off, test each milestone on my phone, and merge" },
};

export const honest = {
  title: ["How ", { keep: "I" }, " keep it honest"],
  eyebrow: "Varnaglarnir",
  intro: "AI agents are fast and confident, and sometimes wrong. These are the checks that catch it before it reaches the app.",
  checks: [
    { label: "I approve every step.", text: "No document is used and no code is merged until I have read it and said yes." },
    { label: "A second pair of eyes.", text: "The reviewer runs on a different AI model from the developer and never edits the code it judges." },
    { label: "Machines check the routine.", text: "Every change runs formatting, static analysis, Android Lint, security rules tests and about 260 app tests before anyone looks at it." },
    { label: "I test on a real phone.", text: "Every milestone passes a written checklist on my own phone and two emulators before it is merged." },
    { label: "Decisions are written down.", text: "Every decision gets a date and a reason in the repository, so the next session starts from facts, not from memory." },
    { label: "No secrets in code.", text: "Keys, passwords and the signing key never enter the repository. The agents are not allowed to handle them." },
  ],
};

/** by: who raised it (shown as a tag). */
export const moments = {
  title: "Moments that mattered",
  eyebrow: "Vendipunktar",
  intro: "Four moments where a check paid off, from the design phase to the first merged milestone.",
  items: [
    {
      by: "Reviewer",
      title: "Every test passed, the button never worked",
      text: "Leaving a household always failed with a \"needs a connection\" message, yet every automated test passed, because the tests talked to a fake database. The reviewer found it by reading the code. The fix came with a test that runs the real code against a local copy of the database, on every change.",
    },
    {
      by: "QA",
      title: "One household per person, on paper only",
      text: "The requirements say a person belongs to one household. The app enforced it, but the database rules did not, so someone calling the database directly could join two. No data could leak either way. I accepted it for now, and it must be fixed before any public release.",
    },
    {
      by: "Reviewer",
      title: "The coordinator got it wrong too",
      text: "The Tech Lead wrote a working rule saying one command runs the same checks as the build server. It didn't: by default it ran only the tests. The reviewer caught it. Now both read one list of checks, and the Tech Lead reads a file before describing how it works.",
    },
    {
      by: "Decision",
      title: "No receipt photos are kept",
      text: "Receipts can show card digits and a national ID number. The architect proposed not keeping the photos at all, and I approved it: they are read on the phone and then deleted. Card numbers are also blanked out of the text before anything is saved.",
    },
  ],
};

export const numbers = {
  title: "By the numbers",
  eyebrow: "Tölur og staðreyndir",
  items: [
    { figure: "26 + 24", label: "functional and non-functional requirements, each one testable" },
    { figure: "384", label: "automated tests: 262 for the app, 17 for the receipt logic, 105 for the database security rules" },
    { figure: "7", label: "review rounds before the first milestone was allowed to merge" },
    { figure: "22", label: "steps in my own phone check of the first milestone" },
    { figure: "0", label: "secrets in the repository" },
    { figure: "0 kr.", label: "a month to run" },
  ],
};

export const learned = {
  title: ["What ", { keep: "I" }, " learned"],
  eyebrow: "Lærdómurinn",
  items: [
    {
      lead: "Agents only know what is written down.",
      text: "Each session starts with no memory of the last one. Decisions, rules and status have to live in files the agents read, or they are lost. Most of my work is keeping those files right.",
    },
    {
      lead: "Checks have to be independent.",
      text: "The worst bug in the first milestone passed every test, because the tests and the code shared the same wrong assumption. A reviewer that had not written the code found it. Separate roles on separate models are the point, not overhead.",
    },
    {
      lead: "The coordinator needs checking too.",
      text: "The agent that keeps the overview made a confident mistake about how a command worked. Now every role, including the Tech Lead, has to read the source before describing it, and the reviewer checks the process documents as well as the code.",
    },
  ],
};

export const hood = {
  title: "Under the hood",
  eyebrow: "Undir húddinu",
  intro: "For engineers who want to know how it is put together.",
  rows: [
    {
      term: "Models",
      text: ["Claude Opus for the roles where a mistake is costly (Analyst, Architect, Designer, Reviewer), Claude Sonnet for the long-running ones (Developer, QA, Tech Lead in code)"],
    },
    {
      term: "Where they run",
      text: ["The document roles and the Tech Lead in a Claude project linked to my PC; Developer, Reviewer and QA as Claude Code subagents in the app's repository"],
    },
    {
      term: "Rules",
      text: [
        "A ",
        { code: "CLAUDE.md" },
        " in every app repository holds the working rules all roles follow; each role is a versioned file in ",
        { link: { text: "github.com/siggigr/agents", href: agentsRepo } },
      ],
    },
    {
      term: "Memory between sessions",
      text: [
        { code: "docs/status.md" },
        " holds the state, with one log line at every hand-off; each role saves its full report to a local folder the Tech Lead reads",
      ],
    },
    {
      term: "Shared knowledge",
      text: ["Two Claude skills: one to bootstrap a new Android app, one with checks learned from my previous app and this one"],
    },
    {
      term: "Security",
      text: ["The reviewer checks the OWASP mobile security areas each change touches; a static scan of the release build comes before any public release"],
    },
    {
      term: "The app",
      text: ["Kotlin, Jetpack Compose and Material 3; Firebase Authentication and Cloud Firestore in the EEA; receipts read on the phone with ML Kit"],
    },
    {
      term: "Pipeline",
      text: ["GitHub Actions runs ktlint, detekt, Android Lint, the rules tests and the app tests against a Firestore emulator; a tag builds and signs the release; Dependabot sends one weekly update per ecosystem"],
    },
  ],
};

export const next = {
  title: "What's next",
  eyebrow: "Næst á dagskrá",
  items: [
    {
      title: "Building a tool the agents can use.",
      text: "A Java service on my own Linux server with a database and an MCP server, so Claude can call it directly. Starting in November 2026.",
    },
    {
      title: "Tillslip's next milestone.",
      text: "Scanning a receipt and saving it on both phones in a household.",
    },
  ],
};

/** "The office", the animated scene of the team. */
export const office = {
  title: "The office",
  eyebrow: "Skrifstofan",
  intro:
    "A playful look at my AI team between tasks: desk work, coffee, stand-ups and the odd game of ping-pong. I drop in to approve their work, and Alan Isaac, the office cat, keeps everyone company. It is just for fun and not connected to the agents' real work.",
};

/** Teaser card on the main page. */
export const agentsTeaser = {
  title: "One engineer, seven AI colleagues",
  text: "How I run a small team of AI agents that takes a real Android app from requirements to a released build, with me approving every step.",
  link: "See how it works",
};
