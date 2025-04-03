import { useEffect } from "react";
import authStore from "../stores/authStore";

export default function LogoutPage() {
  const store = authStore();
  useEffect(() => {
    store.logout();
  }, []);
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>You have been logged out</h1>
    </div>
  );
}
