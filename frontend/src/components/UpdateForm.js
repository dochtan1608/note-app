import notesStore from "../stores/notesStore";

export default function UpdateForm() {
  const store = notesStore();

  if (!store.updateForm._id) return null;

  return (
    <div className="update-form-section">
      <div className="update-form-header">
        <h2>Update Note</h2>
        <button className="btn-cancel" onClick={() => store.toggleUpdate({})}>
          ✕
        </button>
      </div>
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
        <button className="btn-update-submit" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}
