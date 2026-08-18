import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../firebase";
import Section from "../components/Section";
import { useCollection } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";

const EMPTY_FORM = { name: "", description: "", photoUrl: "", photoPath: "" };

export default function Pets() {
  const { isAdmin } = useAuth();
  const pets = useCollection("pets");
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      let { photoUrl = "", photoPath = "" } = form;

      if (file) {
        // Replace the old photo if one exists.
        if (photoPath) {
          await deleteObject(ref(storage, photoPath)).catch(() => {});
        }
        photoPath = `pets/${crypto.randomUUID()}-${file.name}`;
        const storageRef = ref(storage, photoPath);
        await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(storageRef);
      }

      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        photoUrl,
        photoPath,
      };

      if (form.id) {
        await updateDoc(doc(db, "pets", form.id), data);
      } else {
        await addDoc(collection(db, "pets"), { ...data, order: Date.now() });
      }
      setForm(null);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Could not save this pet. Photos must be images under 5 MB.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (pet) => {
    if (!window.confirm(`Remove ${pet.name} from the page?`)) return;
    await deleteDoc(doc(db, "pets", pet.id));
    if (pet.photoPath) {
      await deleteObject(ref(storage, pet.photoPath)).catch(() => {});
    }
  };

  return (
    <Section id="pets" eyebrow="Dýrin" title="Pets">
      {pets.length === 0 && !isAdmin && (
        <p className="empty-note">Portraits of the household animals, coming soon.</p>
      )}

      <div className="card-grid">
        {pets.map((pet) => (
          <article key={pet.id} className="card card-pet">
            {pet.photoUrl && (
              <img src={pet.photoUrl} alt={pet.name} loading="lazy" />
            )}
            <h3>{pet.name}</h3>
            <p>{pet.description}</p>
            {isAdmin && (
              <div className="card-admin">
                <button
                  className="btn btn-small"
                  onClick={() => {
                    setFile(null);
                    setForm(pet);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => remove(pet)}
                >
                  Remove
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {isAdmin && !form && (
        <button
          className="btn btn-add"
          onClick={() => {
            setFile(null);
            setForm(EMPTY_FORM);
          }}
        >
          + Add pet
        </button>
      )}

      {isAdmin && form && (
        <div className="admin-form">
          <h3>{form.id ? "Edit pet" : "Add pet"}</h3>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Brief description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label>
            Photo {form.photoUrl && "(choosing a new file replaces the current one)"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <div className="edit-actions">
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              className="btn"
              onClick={() => {
                setForm(null);
                setFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
