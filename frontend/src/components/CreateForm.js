import notesStore from "../stores/notesStore";

// CreateForm Component
// Mục đích: Hiển thị form tạo note.
// Vị trí: Cột phải trong layout 2 cột.
// Chức năng: Cho phép người dùng nhập tiêu đề và nội dung của note, sau đó submit để tạo note mới.
export default function CreateForm() {
  const store = notesStore();

  // Nếu đang trong trạng thái cập nhật note (updateForm có _id) thì không hiển thị form tạo note.
  if (store.updateForm._id) return <></>;

  return (
    <div className="create-form-section">
      {/* Tiêu đề của form */}
      <h2>Create Note</h2>
      {/* Form: Gọi hàm store.createNote khi submit */}
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
