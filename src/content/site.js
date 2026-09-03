/**
 * Site text content. Edit this file to change what the site says,
 * then commit and push — the site redeploys automatically.
 *
 * Multi-paragraph text is an array of strings, one string per paragraph.
 */

export const hero = {
  coords: "64°07′N 21°55′W — Kópavogur",
  headline: "Halló, ég heiti Siggi.",
  headlineLang: "is", // language of the headline text (set to "en" if you change it)
  subline:
    "Software professional in Kópavogur with a background in quality engineering and software development—plus a lifelong weakness for aviation and good books.",
};

export const about = [
  "I am Sigurður, Siggi to most people.",
  "I was born in 1975 and grew up in the Vestmannaeyjar Islands with my parents and three younger siblings. After secondary school, I attended the Icelandic Flight School (Flugskóli Íslands), graduating with a Commercial Pilot License in 1997 and ATPL First Class in 1998. In 2005, I made the leap into tech by studying Computer Science at Reykjavík University, turning a lifelong curiosity about problem-solving into a long-term career.",
];

export const professional = [
  "With over 20 years in the software industry, I've built my career around a blend of hands-on engineering and a deep commitment to quality. My journey spans 14 years in software testing followed by 6 years in backend development—most recently as a Senior Service Delivery Engineer at Sabre, where I developed real-time, resilient Java/SQL services for international airline environments. Following the recent closure of Sabre's Iceland office, I'm now actively exploring new opportunities where I can put that experience to work.",
  "I take pride in taking end-to-end ownership of systems, whether that means engineering backend workflows, automating tests, or troubleshooting complex production setups. Over the years, I've learned that the best software comes from combining a structured quality mindset with modern tooling—including AI-assisted development tools like GitHub Copilot. Beyond code, I bring persistence, reliability, and a collaborative spirit to every team I join.",
];

/**
 * Opening text for the Interests section, shown above the subsections
 * defined in interests.js.
 */
export const interestsIntro = [
  "I get through a lot of audiobooks—mostly science fiction and fantasy. In my free time, I enjoy video games and tinkering with personal programming projects at home. When time allows, I also love to cook.",
  "Staying consistent at the gym is a continuous work in progress, though my spouse and I recently tackled that by building a home gym. We share our home with four pets, including our Labrador, Krummi. He's been my main companion when I head outdoors, and though he's getting older now and can't go for as long as he used to, we've shared countless walks over the years. Krummi and I also share a love for food—though while I prefer to enjoy good food, he simply enjoys all food.",
];

/**
 * Opening text for the Family section, shown above the family card
 * grid defined in family.js (leave family.js empty if you'd rather
 * keep this as the whole section, or add individual cards below it).
 */
export const familyIntro = [
  "My spouse, Sigga, and I have been writing our story together since 2018. She swept me off my feet on my 50th birthday in London with a proposal I'll never forget—and, of course, I said yes! While we haven't walked down the aisle just yet, our life together is already filled with so much love, laughter, and beautiful chaos.",
  "Though we don't have children of our own together, we are endlessly proud of the blended family we've built. Today, we make our home in Kópavogur alongside our two daughters (born in 2004 and 2005). Our family circle also extends to my adult son (born in 1999), who lives with his girlfriend in Hafnarfjörður. Together, we've brought our worlds into one warm, vibrant home with a bright future ahead.",
];

/**
 * Opening text for the Pets section, shown above the pet card grid
 * defined in pets.js.
 */
export const petsIntro = [
  "We share our home with one dog and three cats. Krummi (our dog) and Simbi are the senior gentlemen of the house—both born in 2016, just a month apart. Then there are Moli and Merlín, brothers who joined us in 2025. Walks with Krummi are especially fun these days, as all three cats often tag along for the adventure!",
];

/**
 * Contact links shown in the footer. Fill in the real values —
 * any entry left as an empty string is simply not rendered.
 */
export const contact = {
  email: "siggigr@gmail.com", // renders as mailto link
  phone: "+354 698 7372",     // shown on the CV page only, not the homepage footer
  linkedin: "https://www.linkedin.com/in/sigurdur-g-hjalmarsson",
  github: "https://github.com/siggigr",
};
