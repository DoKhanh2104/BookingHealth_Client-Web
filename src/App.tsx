import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/router";

function App() {
  return (
    <>
      <AuthProvider>
        <Toaster richColors position="top-right" closeButton />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
