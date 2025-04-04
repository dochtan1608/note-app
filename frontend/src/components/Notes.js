import React, { useEffect } from "react";
import notesStore from "../stores/notesStore";

// Component hiển thị danh sách ghi chú
export default function Notes() {
  const store = notesStore();

  // Fetch notes khi component mount
  useEffect(() => {
    store.fetchNotes();
  }, []);

  return (
    <div className="notes-section">
      <h2>Notes</h2>
      <div className="notes-grid">
        {store.notes &&
          store.notes.map((note) => (
            <div className="note-card" key={note._id}>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-body">{note.body}</p>
              <div className="note-actions">
                <button
                  className="btn-delete"
                  onClick={() => store.deleteNote(note._id)}
                >
                  Delete
                </button>
                <button
                  className="btn-update"
                  onClick={() => store.toggleUpdate(note)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
