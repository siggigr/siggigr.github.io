import Section from "../components/Section";
import { pets } from "../content/pets";

export default function Pets() {
  return (
    <Section id="pets" eyebrow="Dýrin" title="Pets">
      {pets.length === 0 && (
        <p className="empty-note">
          Portraits of the household animals, coming soon.
        </p>
      )}
      <div className="card-grid">
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
