import notesStore from "../stores/notesStore";
import Note from "./Note";

// Notes Component
// Mục đích: Hiển thị danh sách các note đã tạo.
// Vị trí: Cột trái trong layout 2 cột.
// Chức năng: Duyệt qua danh sách note trong store và render từng card note.
export default function Notes() {
  const store = notesStore();

  return (
    <div className="notes-section">
      {/* Tiêu đề của danh sách note */}
      <h2>Notes</h2>
      {/* Lưới chứa các note, sử dụng lớp notes-grid định dạng theo grid */}
      <div className="notes-grid">
        {store.notes &&
          store.notes.map((note) => <Note note={note} key={note._id} />)}
      </div>
    </div>
  );
}
