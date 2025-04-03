// src/components/CreateForm.jsx
import notesStore from "../stores/notesStore";

export default function CreateForm() {
  const store = notesStore();

  // Nếu đang cập nhật note (có _id) thì ẩn form tạo
  if (store.updateForm._id) return null;

  return (
    <div className="create-form-section">
      <h2>Create Note</h2>
      <form onSubmit={store.createNote}>
        <input
          className="input-field"
          onChange={store.updateCreateFormField}
          value={store.createForm.title}
          name="title"
          placeholder="Title"
        />
        <textarea
          className="input-field"
          onChange={store.updateCreateFormField}
          value={store.createForm.body}
          name="body"
          placeholder="Body"
          rows="5"
        />
        <button className="btn" type="submit">
          Create Note
        </button>
      </form>
    </div>
  );
}
