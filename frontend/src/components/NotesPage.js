import React from "react";
import Notes from "../components/Notes";
import CreateForm from "../components/CreateForm";

/*
  NotesPage: Trang quản lý ghi chú
  - Bên trái: hiển thị danh sách note
  - Bên phải: form tạo note
*/
export default function NotesPage() {
  return (
    <div className="content-layout">
     <CreateForm />
     <Notes />
    </div>
  );
}
