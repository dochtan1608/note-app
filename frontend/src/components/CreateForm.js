import notesStore from "../stores/notesStore";

export default function CreateForm() {
  const store = notesStore();

  if (store.updateForm._id) return <></>;

  return (
    <div className="creatNote-flex">
      <h2>Create note</h2>
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
          Create note
        </button>
      </form>
    </div>
  );
}
