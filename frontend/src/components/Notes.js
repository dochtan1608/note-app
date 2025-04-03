import React from "react";
import notesStore from "../stores/notesStore";

// Notes hiển thị danh sách các note đã tạo
export default function Notes() {
  const store = notesStore();

  return (
    <div className="notes-section">
      <h2>Notes</h2>
      {/* Mỗi note có title, content, nút Delete và Update */}
      <div className="notes-list">
        {store.notes?.map((note) => (
          <div className="note-card" key={note._id}>
            <div className="note-content">
              <h3 className="note-title">{note.title}</h3>
              <p className="note-body">{note.body}</p>
            </div>
            <div className="note-actions">
              <button className="btn-delete" onClick={() => store.deleteNote(note._id)}>
                Delete Note
              </button>
              <button className="btn-update" onClick={() => store.setUpdateForm(note)}>
                Update Note
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
