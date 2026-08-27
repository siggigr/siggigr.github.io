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
    "Software professional in Kópavogur: quality engineering, business analysis, and a lifelong weakness for aircraft and good books.",
};

export const about = [
  "I am Sigurður, Siggi to most people, a software professional living in Kópavogur.",
  "Replace these paragraphs in src/content/site.js with your own introduction.",
];

export const professional = [
  "Twenty years in software: fourteen in testing and quality assurance, six in development, with experience spanning safety-critical air traffic control systems and airline technology.",
  "Replace these paragraphs in src/content/site.js with your own professional summary.",
];

/**
 * Opening text for the Interests section, shown above the subsections
 * defined in interests.js.
 */
export const interestsIntro = [
  "I get through a lot of audiobooks—mostly science fiction and fantasy. In my free time, I enjoy video games and tinkering with personal programming projects at home. When time allows, I also love to cook.",
  "Staying consistent at the gym is a continuous work in progress, though my spouse and I recently tackled that by building a home gym. We share our home with four pets, including our Labrador, Krummi. He's my main companion when I head outdoors, and given his endless energy, we've spent countless hours walking him over the years. Krummi and I also share a love for food—though while I prefer to enjoy good food, he simply enjoys all food.",
];

/**
 * Contact links shown in the footer. Fill in the real values —
 * any entry left as an empty string is simply not rendered.
 */
export const contact = {
  email: "siggigr@gmail.com", // renders as mailto link
  linkedin: "",         // full URL, e.g. "https://www.linkedin.com/in/..."
  github: "",           // full URL, e.g. "https://github.com/siggigr"
};
