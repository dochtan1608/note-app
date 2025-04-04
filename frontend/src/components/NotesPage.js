import React from "react";
import Notes from "../components/Notes";
import CreateForm from "../components/CreateForm";

export default function NotesPage() {
  return (
    <div className="content-layout">
      <CreateForm />
      <Notes />
    </div>
  );
}
