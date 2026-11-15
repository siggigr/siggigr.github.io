/**
 * Apps shown in the Apps section. One card per app:
 *   { name, description, url, linkText, tag }
 * `url` is a web address (opens in a new tab) or a page on this site that
 * starts with "/", such as "/agents/" (opens in the same tab).
 * `linkText` is the text of the link. `tag` is an optional small label after
 * the name. Leave `url` as an empty string to show no link; without a `tag`
 * the card then shows a "coming soon" tag.
 */
export const apps = [
  {
    name: "Nextpost",
    description:
      "A native Android app for creating and playing GPS-based scavenger hunts: place real-world posts with graded clues, share a code, and score based on how few clues a player needed. Built solo, from spec to a working app, in Kotlin, Jetpack Compose, and Firebase. The source is on GitHub.",
    url: "https://github.com/siggigr/nextpost",
    linkText: "View on GitHub",
  },
  {
    name: "Tillslip",
    tag: "in development",
    description:
      "An Android app that reads grocery receipts and tracks what a household spends, built in Kotlin, Jetpack Compose and Firebase. It is in development, and I am building it with my own team of AI agents. The case study on the AI agent team page shows how.",
    url: "/agents/",
    linkText: "See the case study",
  },
];
