import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
