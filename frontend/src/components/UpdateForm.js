import notesStore from "../stores/notesStore";

export default function UpdateForm() {
  const store = notesStore();

  if (!store.updateForm._id) return null;

  return (
    <div className="form-container">
      <h2 className="form-title">Update Note</h2>
      <form onSubmit={store.updateNote}>
        <input
          className="input-field"
          onChange={store.handleUpdateFieldChange}
          value={store.updateForm.title}
          name="title"
          placeholder="Title"
        />
        <textarea
          className="input-field"
          onChange={store.handleUpdateFieldChange}
          value={store.updateForm.body}
          name="body"
          placeholder="Body"
          rows="5"
        />
        <button className="btn" type="submit">
          Update note
        </button>
      </form>
    </div>
  );
}
