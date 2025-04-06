import React, { useState } from "react";
import notesStore from "../stores/notesStore";

const CreateForm = () => {
  const store = notesStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't render if update form is active
  if (store.updateForm._id) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only proceed if there's actual content
    if (!store.createForm.title.trim() && !store.createForm.body.trim()) return;

    setIsSubmitting(true);
    try {
      await store.createNote(e);
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-form-section">
      <h2>Create Note</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={store.createForm.title}
          onChange={store.updateCreateFormField}
          className="input-field"
          placeholder="Title"
          required
        />

        <textarea
          name="body"
          value={store.createForm.body}
          onChange={store.updateCreateFormField}
          className="input-field"
          placeholder="What's on your mind?"
          required
          rows="5"
        />

        <button type="submit" className="btn-create" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            "Create Note"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
