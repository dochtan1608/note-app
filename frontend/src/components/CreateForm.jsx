import React from "react";
import notesStore from "../stores/notesStore";

export default function CreateForm() {
  const store = notesStore();

  return (
    <div className="create-form">
      <form onSubmit={store.createNote}>
        <input
          type="text"
          name="title"
          value={store.createForm.title}
          onChange={store.updateCreateFormField}
          placeholder="Tiêu đề"
        />
        <textarea
          name="body"
          value={store.createForm.body}
          onChange={store.updateCreateFormField}
          placeholder="Nội dung"
          rows="4"
        />
        <button type="submit">Create Note</button>
      </form>
    </div>
  );
}
