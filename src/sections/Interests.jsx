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

/**
 * Interests are stored as documents in the `interests` collection:
 *   { title, blurb, order, items: [{ id, title, note }] }
 * Each document is one hobby section ("Favourite books", "Aviation", ...)
 * and its `items` array holds the entries within that section.
 */
export default function Interests() {
  const { isAdmin } = useAuth();
  const sections = useCollection("interests");

  const [sectionForm, setSectionForm] = useState(null); // { id?, title, blurb }
  const [itemFormFor, setItemFormFor] = useState(null); // section id
  const [itemDraft, setItemDraft] = useState({ title: "", note: "" });
  const [saving, setSaving] = useState(false);

  const saveSection = async () => {
    if (!sectionForm.title.trim()) return;
    setSaving(true);
    try {
      const data = {
        title: sectionForm.title.trim(),
        blurb: sectionForm.blurb.trim(),
      };
      if (sectionForm.id) {
        await updateDoc(doc(db, "interests", sectionForm.id), data);
      } else {
        await addDoc(collection(db, "interests"), {
          ...data,
          items: [],
          order: Date.now(),
        });
      }
      setSectionForm(null);
    } finally {
      setSaving(false);
    }
  };

  const removeSection = async (section) => {
    if (
      window.confirm(
        `Remove the whole "${section.title}" section and everything in it?`
      )
    ) {
      await deleteDoc(doc(db, "interests", section.id));
    }
  };

  const addItem = async (section) => {
    if (!itemDraft.title.trim()) return;
    setSaving(true);
    try {
      const items = [
        ...(section.items || []),
        {
          id: crypto.randomUUID(),
          title: itemDraft.title.trim(),
          note: itemDraft.note.trim(),
        },
      ];
      await updateDoc(doc(db, "interests", section.id), { items });
      setItemDraft({ title: "", note: "" });
      setItemFormFor(null);
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (section, itemId) => {
    const items = (section.items || []).filter((item) => item.id !== itemId);
    await updateDoc(doc(db, "interests", section.id), { items });
  };

  return (
    <Section id="interests" eyebrow="Áhugamál" title="Interests">
      {sections.length === 0 && !isAdmin && (
        <p className="empty-note">Hobbies and enthusiasms, to be catalogued.</p>
      )}

      {sections.map((section) => (
        <div key={section.id} className="interest-block">
          <div className="interest-head">
            <h3>{section.title}</h3>
            {isAdmin && (
              <div className="card-admin">
                <button
                  className="btn btn-small"
                  onClick={() =>
                    setSectionForm({
                      id: section.id,
                      title: section.title,
                      blurb: section.blurb || "",
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => removeSection(section)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {section.blurb && <p className="interest-blurb">{section.blurb}</p>}

          {(section.items || []).length > 0 && (
            <ul className="interest-items">
              {section.items.map((item) => (
                <li key={item.id}>
                  <span className="item-title">{item.title}</span>
                  {item.note && <span className="item-note"> — {item.note}</span>}
                  {isAdmin && (
                    <button
                      className="btn btn-tiny btn-danger"
                      onClick={() => removeItem(section, item.id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {isAdmin && itemFormFor !== section.id && (
            <button
              className="btn btn-small"
              onClick={() => {
                setItemDraft({ title: "", note: "" });
                setItemFormFor(section.id);
              }}
            >
              + Add entry
            </button>
          )}

          {isAdmin && itemFormFor === section.id && (
            <div className="admin-form admin-form-inline">
              <label>
                Title (e.g. a book)
                <input
                  value={itemDraft.title}
                  onChange={(e) =>
                    setItemDraft({ ...itemDraft, title: e.target.value })
                  }
                />
              </label>
              <label>
                Note
                <input
                  value={itemDraft.note}
                  onChange={(e) =>
                    setItemDraft({ ...itemDraft, note: e.target.value })
                  }
                />
              </label>
              <div className="edit-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => addItem(section)}
                  disabled={saving}
                >
                  Add
                </button>
                <button className="btn" onClick={() => setItemFormFor(null)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {isAdmin && !sectionForm && (
        <button
          className="btn btn-add"
          onClick={() => setSectionForm({ title: "", blurb: "" })}
        >
          + Add interest section
        </button>
      )}

      {isAdmin && sectionForm && (
        <div className="admin-form">
          <h3>{sectionForm.id ? "Edit section" : "New interest section"}</h3>
          <label>
            Section title (e.g. Favourite books)
            <input
              value={sectionForm.title}
              onChange={(e) =>
                setSectionForm({ ...sectionForm, title: e.target.value })
              }
            />
          </label>
          <label>
            Short introduction (optional)
            <textarea
              rows={2}
              value={sectionForm.blurb}
              onChange={(e) =>
                setSectionForm({ ...sectionForm, blurb: e.target.value })
              }
            />
          </label>
          <div className="edit-actions">
            <button
              className="btn btn-primary"
              onClick={saveSection}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button className="btn" onClick={() => setSectionForm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
