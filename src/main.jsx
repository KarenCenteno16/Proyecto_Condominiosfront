import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import axios from 'axios'

// Configuración de Axios
axios.defaults.baseURL = "http://localhost:8000/api";

// Interceptor para adjuntar el token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para detectar el cierre de sesión global (401)
axios.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear(); 
      if (window.Echo) window.Echo.disconnect(); 
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

// Configuración de WebSockets (Reverb) - REINSTALADO
window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)