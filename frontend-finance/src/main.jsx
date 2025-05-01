import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './css/index.css';

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENTID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
