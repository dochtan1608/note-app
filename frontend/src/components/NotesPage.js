// src/pages/NotesPage.js
import Notes from "../components/Notes";
import CreateForm from "../components/CreateForm";

export default function NotesPage() {
  return (
    <div className="content-layout">
      <Notes />
      <CreateForm />
    </div>
  );
}
