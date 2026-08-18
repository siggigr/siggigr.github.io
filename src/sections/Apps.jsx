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

const EMPTY_FORM = { name: "", description: "", url: "" };

export default function Apps() {
  const { isAdmin } = useAuth();
  const apps = useCollection("apps");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
      };
      if (form.id) {
        await updateDoc(doc(db, "apps", form.id), data);
      } else {
        await addDoc(collection(db, "apps"), { ...data, order: Date.now() });
      }
      setForm(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (window.confirm("Remove this app from the page?")) {
      await deleteDoc(doc(db, "apps", id));
    }
  };

  return (
    <Section id="apps" eyebrow="Smíðar" title="Apps">
      {apps.length === 0 && (
        <div className="card card-empty">
          <h3>In the hangar</h3>
          <p>
            The first app is under construction. It will be parked here as
            soon as it is ready for passengers.
          </p>
        </div>
      )}

      <div className="card-grid">
        {apps.map((app) => (
          <article key={app.id} className="card">
            <h3>
              {app.url ? (
                <a href={app.url} target="_blank" rel="noopener noreferrer">
                  {app.name}
                </a>
              ) : (
                <>
                  {app.name} <span className="tag">coming soon</span>
                </>
              )}
            </h3>
            <p>{app.description}</p>
            {isAdmin && (
              <div className="card-admin">
                <button className="btn btn-small" onClick={() => setForm(app)}>
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => remove(app.id)}
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
          + Add app
        </button>
      )}

      {isAdmin && form && (
        <div className="admin-form">
          <h3>{form.id ? "Edit app" : "Add app"}</h3>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label>
            Link (leave empty to show "coming soon")
            <input
              type="url"
              placeholder="https://"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
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
