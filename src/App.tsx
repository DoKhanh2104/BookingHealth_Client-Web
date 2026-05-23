import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="595980941865-udthnl1r1uidff5ha98601ikavrh1af0.apps.googleusercontent.com">
        <AuthProvider>
          <Toaster richColors position="top-right" closeButton />
          <RouterProvider router={router} />
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
