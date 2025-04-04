import React from "react";
import notesStore from "../stores/notesStore";

// Form tạo ghi chú (Create Note) bên cột phải
export default function CreateForm() {
  const store = notesStore();

  // Nếu đang cập nhật (store.updateForm._id có giá trị) thì ẩn form tạo
  if (store.updateForm._id) return null;

  return (
    <div className="create-form-section">
      <h2>Create Note</h2>
      <form onSubmit={store.createNote}>
        <input
          className="input-field"
          type="text"
          name="title"
          placeholder="Note title..."
          value={store.createForm.title}
          onChange={store.updateCreateFormField}
        />
        <textarea
          className="input-field"
          name="body"
          placeholder="Write your note here..."
          rows="5"
          value={store.createForm.body}
          onChange={store.updateCreateFormField}
        />
        <button className="btn-create" type="submit">
          Create Note
        </button>
      </form>
    </div>
  );
}
