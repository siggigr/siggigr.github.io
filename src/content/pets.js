/**
 * Pets shown in the Pets section.
 *
 * Photos: put the image file in src/assets/pets/ and import it at the
 * top of this file, then reference it in the pet's `photo` field.
 * Omit `photo` (or set it to null) for a card without a picture.
 */
import krummi from "../assets/pets/krummi.webp";
import simbi from "../assets/pets/simbi.webp";
import moli from "../assets/pets/moli.webp";
import merlin from "../assets/pets/merlin.webp";

export const pets = [
  {
    name: "Krummi",
    description:
      "Our Labrador, and the senior statesman of the house at over ten years old. He used to go on long walks constantly; these days they're shorter, but no less enjoyed.",
    photo: krummi,
  },
  {
    name: "Simbi",
    description:
      "The oldest of our three cats, born the same year as Krummi. Determined, and fiercely protective of his territory.",
    photo: simbi,
  },
  {
    name: "Moli",
    description:
      "One half of our cat twins, about a year and a half old. A lovely, easygoing character — a real gold nugget, or gullmoli in Icelandic, which is exactly where his name comes from.",
    photo: moli,
  },
  {
    name: "Merlín",
    description:
      "Moli's littermate. So cute and magical that there was really only one name for him — after the wizard of Arthurian legend.",
    photo: merlin,
  },
];
