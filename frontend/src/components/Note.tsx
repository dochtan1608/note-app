import React from "react";
import create from "zustand";

import styles from "../styles/Note.module.css";

declare module "*.module.css" {
  const classes: { [key: string]: string };
}
//   export default classes;
// }
// import { Button } from "react-bootstrap";

interface NoteType {
  _id: string;
  title: string;
  body: string;
}

interface NoteProps {
  note: NoteType;
}

export default function Note({ note }: NoteProps) {
  const store = useNotesStoreSelector((store) => {
    return { deleteNote: store.deleteNote, toggleUpdate: store.toggleUpdate };
  });

  return (
    <div className={styles.noteCard}>
      <h3>{note.title}</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{note.body}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => store.deleteNote(note._id)}>Delete</button>
        <button onClick={() => store.toggleUpdate(note)}>Update</button>
      </div>
    </div>
  );
}
const useNotesStore = create((set) => ({
  notes: [],
  deleteNote: (id: string) =>
    set((state: any) => ({
      notes: state.notes.filter((note: NoteType) => note._id !== id),
    })),
  toggleUpdate: (note: NoteType) =>
    set((state: any) => ({
      notes: state.notes.map((n: NoteType) =>
        n._id === note._id ? { ...n, ...note } : n
      ),
    })),
}));

function useNotesStoreSelector(
  selector: (store: any) => { deleteNote: any; toggleUpdate: any }
) {
  return useNotesStore(selector);
}
