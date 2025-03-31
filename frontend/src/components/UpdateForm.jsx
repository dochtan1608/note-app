import notesStore from "../stores/notesStore";

export default function UpdateForm() {
  const store = notesStore();

  if (!store.updateForm._id) return <></>;

  return (
    <div>
      <h2>Update note</h2>
      <form onSubmit={store.updateNote}>
        <input
          onChange={store.handleUpdateFieldChange}
          value={store.updateForm.title}
          name="title"
          style={{ width: "100%", padding: "10px", fontSize: "16px" }} // Larger input
        />
        <textarea
          onChange={store.handleUpdateFieldChange}
          value={store.updateForm.body}
          name="body"
          style={{
            width: "100%",
            height: "150px",
            padding: "10px",
            fontSize: "16px",
          }} // Larger textarea
        />
        <button type="submit">Update note</button>
      </form>
    </div>
  );
}
