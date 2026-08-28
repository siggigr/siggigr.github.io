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
      "Krummi is truly one of the most beautiful souls I've ever met. He is a friend to everyone and easily one of the smartest dogs around. Krummi's world revolves mostly around his people and food—and if you happen to have a treat for him, you'll instantly become his new best friend.",
    photo: krummi,
  },
  {
    name: "Simbi",
    description:
      "Simbi is fiercely protective of his territory and knows exactly what he wants. But even though he acts like the resident tough guy, he's an absolute sweetheart at heart who can never get enough belly rubs.",
    photo: simbi,
  },
  {
    name: "Moli",
    description:
      "Moli (our little gold nugget) is an active, clever cat with an exceptionally fun personality. Just like his brother Merlín, he is a great communicator and always lets you know what's on his mind.",
    photo: moli,
  },
  {
    name: "Merlín",
    description:
      "Merlín is named after the legendary wizard of King Arthur because he has a way of completely enchanting anyone he meets. Just like his brother Moli, he's a master at expressing himself, and he is endlessly affectionate.",
    photo: merlin,
  },
];
