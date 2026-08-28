import Section from "../components/Section";
import { petsIntro } from "../content/site";
import { pets } from "../content/pets";

export default function Pets() {
  return (
    <Section id="pets" eyebrow="Dýrin" title="Pets">
      <div className="prose">
        {petsIntro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {pets.length === 0 && (
        <p className="empty-note">
          Portraits of the household animals, coming soon.
        </p>
      )}
      <div className="card-grid card-grid-spaced">
        {pets.map((pet) => (
          <article key={pet.name} className="card card-pet">
            {pet.photo && <img src={pet.photo} alt={pet.name} loading="lazy" />}
            <h3>{pet.name}</h3>
            <p>{pet.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
