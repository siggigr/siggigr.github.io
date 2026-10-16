/**
 * Interest lists shown below the intro paragraphs (see `interestsIntro`
 * in site.js). Each list is a button on the main page that opens as a
 * flip-book, one favourite per page.
 *
 *   title      button heading
 *   meta       small line under the heading on the button
 *   openLabel  call to action on the button
 *   blurb      shown on the book's title page
 *   cover      the book itself: title, Icelandic eyebrow, stamp text,
 *              back cover line, and style ("books" teal or "games" purple)
 *   items      one page each: { title, by, note, favourite }
 *              - a title ending in " series" gets a "Series" tag
 *              - note: a line or two about why you love it; leave it ""
 *                and the page simply shows no note
 *              - favourite: true adds a red ribbon and "All-time favourite"
 */
export const interests = [
  {
    id: "books",
    title: "Some favourite books",
    meta: "10 books and series",
    openLabel: "Open the book",
    blurb: "Not ranked, and far from complete. I listen to a lot of audiobooks.",
    cover: {
      title: "Siggi's bookshelf",
      eyebrow: "Bókahillan",
      stamp: "Ex libris · S. G. Hjálmarsson",
      back: "The shelf keeps growing.",
      style: "books",
    },
    items: [
      { title: "The Primal Hunter series", by: "Zogarth", note: "" },
      { title: "Dungeon Crawler Carl series", by: "Matt Dinniman", note: "" },
      { title: "A Soldier's Life series", by: "AlwaysRollsAOne", note: "" },
      { title: "Path of the Berserker series", by: "Rick Scott", note: "" },
      { title: "He Who Fights with Monsters series", by: "Shirtaloon", note: "" },
      { title: "The Spellmonger series", by: "Terry Mancour", note: "" },
      { title: "The Terminal List series", by: "Jack Carr", note: "" },
      { title: "The Martian", by: "Andy Weir", note: "" },
      { title: "Project Hail Mary", by: "Andy Weir", note: "" },
      { title: "The Stormlight Archive series", by: "Brandon Sanderson", note: "" },
    ],
  },
  {
    id: "games",
    title: "Favourite video games",
    meta: "My all-time top three",
    openLabel: "Open the journal",
    blurb: "My all-time top three.",
    cover: {
      title: "Game journal",
      eyebrow: "Tölvuleikir",
      stamp: "Saved games · S. G. Hjálmarsson",
      back: "Press start to continue.",
      style: "games",
    },
    items: [
      { title: "The Witcher 3: Wild Hunt", by: "CD Projekt Red", note: "", favourite: true },
      { title: "Kingdom Come: Deliverance II", by: "Warhorse Studios", note: "" },
      { title: "Red Dead Redemption 2", by: "Rockstar Games", note: "" },
    ],
  },
];
