import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useDoc } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";

/**
 * A text block bound to one field of a Firestore document.
 * Visitors see the text; admins additionally see an Edit control that
 * swaps the block for an input/textarea with Save and Cancel.
 *
 * Multiline values are split on blank lines and rendered as paragraphs.
 */
export default function EditableText({
  path,
  field,
  fallback = "",
  multiline = false,
  className = "",
  render,
}) {
  const { isAdmin } = useAuth();
  const data = useDoc(path);
  const value = data?.[field] ?? fallback;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, path), { [field]: draft }, { merge: true });
      setEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save. Check your connection and admin access.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className={`edit-block ${className}`}>
        {multiline ? (
          <textarea
            value={draft}
            rows={7}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`Edit ${field}`}
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`Edit ${field}`}
          />
        )}
        <div className="edit-actions">
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button className="btn" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`editable ${className}`}>
      {render ? (
        render(value)
      ) : multiline ? (
        value
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, i) => <p key={i}>{paragraph}</p>)
      ) : (
        <span>{value}</span>
      )}
      {isAdmin && (
        <button
          className="edit-pencil"
          onClick={startEditing}
          aria-label={`Edit ${field}`}
        >
          Edit
        </button>
      )}
    </div>
  );
}
