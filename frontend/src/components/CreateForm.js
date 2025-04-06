import React from "react";
import notesStore from "../stores/notesStore";

// Form tạo ghi chú (Create Note) bên cột phải
export default function CreateForm() {
  const store = notesStore();

  // Nếu đang cập nhật (store.updateForm._id có giá trị) thì ẩn form tạo
  if (store.updateForm._id) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo note mới
      await store.createNote(e);
      // Không cần gọi fetchNotes ở đây vì createNote đã cập nhật state
    } catch (err) {
      console.error("Error creating note:", err);
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
          placeholder="Body"
          required
        />
        <button type="submit" className="btn-create">
          Create Note
        </button>
      </form>
    </div>
  );
}
