import { useEffect } from "react";
import authStore from "../stores/authStore";

export default function LogoutPage() {
  const store = authStore();
  useEffect(() => {
    store.logout();
  }, []);
  return <h1>Ban da dang xuat</h1>;
}
