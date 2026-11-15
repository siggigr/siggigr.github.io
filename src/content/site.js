/**
 * Site text content. Edit this file to change what the site says,
 * then commit and push — the site redeploys automatically.
 *
 * Multi-paragraph text is an array of strings, one string per paragraph.
 */

export const hero = {
  headline: "Halló, ég heiti Siggi.",
  headlineLang: "is", // language of the headline text (set to "en" if you change it)
  subline:
    "Senior software engineer with a background in backend development and quality engineering. These days I also run a team of AI agents that is building a real Android app. Away from work, I have a lifelong weakness for aviation and good books.",
  /** The two buttons under the intro text. */
  cvAction: "View my CV",
  contactAction: "Email me",
};

/**
 * Profile card and intro meta line (dark profile layout).
 */
export const profile = {
  name: "Sigurður G. Hjálmarsson",
  role: "Senior Software Engineer",
  meta: ["Kópavogur", "20 years in software", "Open to work"],
};

/**
 * "What I do" grid under the intro. icon is one of the names in
 * components/Icon.jsx (code, check, terminal, plane, ...).
 */
export const services = [
  {
    icon: "code",
    title: "Backend development",
    text: "New features and maintenance in Java and Oracle SQL analysers, most recently on Sabre's Intelligent Exchange platform.",
  },
  {
    icon: "check",
    title: "Quality engineering",
    text: "14 years in testing, from acceptance testing of air traffic control systems to automated test suites in Java.",
  },
  {
    icon: "terminal",
    title: "Production support",
    text: "Troubleshooting, deployments and on-call for airline systems, including customer deployments on GCP.",
  },
  {
    icon: "plane",
    title: "Aviation know-how",
    text: "I am a former commercial pilot, and I have spent my software career working on systems for air traffic control and airlines.",
  },
  {
    icon: "layers",
    title: "Learning new stacks",
    text: "I pick up new languages and tools quickly. I built Nextpost, an Android app in Kotlin and Jetpack Compose, completely solo, from spec to a working app. I use AI-assisted development daily: Claude Code today, and GitHub Copilot at Sabre before that.",
  },
];

export const about = [
  "I am Sigurður, Siggi to most people.",
  "I grew up in the Vestmannaeyjar Islands with my parents and three younger siblings. After secondary school, I attended the Icelandic Flight Academy (Flugskóli Íslands) and trained as a commercial pilot. In 2005, I made the leap into tech by studying Computer Science at Reykjavík University, turning a lifelong curiosity about problem-solving into a long-term career.",
];

export const professional = [
  "I have worked in software for 20 years: 6 years developing Java and Oracle SQL backend solutions for airlines at Sabre, and 14 years before that testing airline software and safety-critical air traffic control systems. As a Senior Service Delivery Engineer at Sabre I built new features and maintained existing ones in analysers on Sabre's Intelligent Exchange platform. Sabre closed its Iceland office in 2026, and I am now looking for my next role, first of all in software development.",
  "One project I am proud of is a real-time payment-fraud integration between a major US airline and a fraud-prevention company. Our team joined late and still delivered on schedule. During end-to-end testing with both companies I found a critical time-zone defect, fixed it and shipped a new release overnight.",
  "My testing background gives me a structured, quality-focused way of working. These days I use Claude Code daily and run my own team of AI agents to build an Android app. I am conscientious and reliable, and I do my best work in a team that works well together.",
];

/**
 * Opening text for the Interests section, shown above the subsections
 * defined in interests.js.
 */
export const interestsIntro = [
  "I get through a lot of audiobooks, mostly science fiction and fantasy. In my free time, I enjoy video games and tinkering with personal programming projects at home. When time allows, I also love to cook.",
  "Staying consistent at the gym is a continuous work in progress, though my spouse and I recently tackled that by building a home gym. We share our home with four pets, including our Labrador, Krummi. He's been my main companion when I head outdoors, and though he's getting older now and can't go for as long as he used to, we've shared countless walks over the years. Krummi and I also share a love for food, though while I prefer to enjoy good food, he simply enjoys all food.",
];

/**
 * Opening text for the Family section, shown above the family card
 * grid defined in family.js (leave family.js empty if you'd rather
 * keep this as the whole section, or add individual cards below it).
 */
export const familyIntro = [
  "My spouse, Sigga, and I have been writing our story together since 2018. She swept me off my feet on my birthday in London with a proposal I'll never forget, and of course I said yes! While we haven't walked down the aisle just yet, our life together is already filled with so much love, laughter, and beautiful chaos.",
  "Though we don't have children of our own together, we are endlessly proud of the blended family we've built. Today, we make our home in Kópavogur alongside our two daughters. Our family circle also extends to my adult son, who lives with his girlfriend in Hafnarfjörður. Together, we've brought our worlds into one warm, vibrant home with a bright future ahead.",
];

/**
 * Opening text for the Pets section, shown above the pet card grid
 * defined in pets.js.
 */
export const petsIntro = [
  "We share our home with one dog and three cats. Krummi (our dog) and Simbi are the senior gentlemen of the house, both born in 2016, just a month apart. Then there are Moli and Merlín, brothers who joined us in 2025. Walks with Krummi are especially fun these days, as all three cats often tag along for the adventure!",
];

/**
 * Contact links shown in the footer. Fill in the real values —
 * any entry left as an empty string is simply not rendered.
 */
export const contact = {
  email: "siggigr@gmail.com", // renders as mailto link
  linkedin: "https://www.linkedin.com/in/sigurdur-g-hjalmarsson",
  github: "https://github.com/siggigr",
};
