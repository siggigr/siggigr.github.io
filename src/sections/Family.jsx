import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Section from "../components/Section";
import { useCollection } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";

const EMPTY_FORM = { name: "", description: "" };

export default function Family() {
  const { isAdmin } = useAuth();
  const members = useCollection("family");
  const [form, setForm] = useState(null); // null | { id?, name, description }
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
      };
      if (form.id) {
        await updateDoc(doc(db, "family", form.id), data);
      } else {
        await addDoc(collection(db, "family"), { ...data, order: Date.now() });
      }
      setForm(null);
    } catch (err) {
      console.error(err);
      alert("Could not save this family member.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (window.confirm("Remove this family member from the page?")) {
      await deleteDoc(doc(db, "family", id));
    }
  };

  return (
    <Section id="family" eyebrow="Fjölskyldan" title="Family">
      {members.length === 0 && !isAdmin && (
        <p className="empty-note">Family introductions are on their way.</p>
      )}

      <div className="card-grid">
        {members.map((member) => (
          <article key={member.id} className="card">
            <h3>{member.name}</h3>
            <p>{member.description}</p>
            {isAdmin && (
              <div className="card-admin">
                <button className="btn btn-small" onClick={() => setForm(member)}>
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => remove(member.id)}
                >
                  Remove
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {isAdmin && !form && (
        <button className="btn btn-add" onClick={() => setForm(EMPTY_FORM)}>
          + Add family member
        </button>
      )}

      {isAdmin && form && (
        <div className="admin-form">
          <h3>{form.id ? "Edit family member" : "Add family member"}</h3>
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
          <div className="edit-actions">
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button className="btn" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
