/**
 * Apps shown in the Apps section. One card per app:
 *   { name, description, url }
 * Leave `url` as an empty string to show a "coming soon" tag.
 */
export const apps = [
  {
    name: "Nextpost",
    description:
      "A native Android app for creating and playing GPS-based scavenger hunts: place real-world posts with graded clues, share a code, and score based on how few clues a player needed. Built solo, from spec to a working app, in Kotlin, Jetpack Compose, and Firebase. The source is on GitHub.",
    url: "https://github.com/siggigr/nextpost",
  },
];

/**
 * The "In the hangar" card, shown after the app cards, for an app that is
 * still in development. Set `text` to an empty string to hide the card.
 * `tag` is the small label after the heading. `url` is a page on this site;
 * the link opens in the same tab. Leave `tag` or `url` empty to leave it out.
 */
export const hangar = {
  title: "In the hangar",
  tag: "in development",
  text: "Tillslip, an Android app that reads grocery receipts and tracks what a household spends, is under construction. It will be parked here as soon as it is ready for passengers.",
  url: "/agents/",
  linkText: "See the case study",
};
