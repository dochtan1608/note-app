import { createBrowserRouter, RouterProvider } from "react-router-dom";
// ...existing code...

const router = createBrowserRouter(
  [
    // ...your routes
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
