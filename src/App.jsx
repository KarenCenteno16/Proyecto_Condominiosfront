import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";

// Páginas de Administrador
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Residentes from "./pages/Residentes";
import Pagos from "./pages/Pagos";
import ChatAdmin from "./pages/Chat"; 
import Accesos from "./pages/Accesos";
import Asambleas from "./pages/Asambleas"; 
import Reportes from "./pages/Reportes";

// Páginas de Usuario
import InicioU from "./pagesu/InicioU"; 
import UserChat from "./pagesu/UserChat";
import ReportesU from "./paginasusu/ReportesU";

function App() {
  const [auth, setAuth] = useState({
    isLogged: !!localStorage.getItem("token"),
    rol: localStorage.getItem("rol")
  });

  // Función para forzar la actualización del estado de autenticación
  const refreshAuth = () => {
    setAuth({
      isLogged: !!localStorage.getItem("token"),
      rol: localStorage.getItem("rol")
    });
  };

  useEffect(() => {
    const handleStorageChange = () => refreshAuth();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const esAdmin = auth.rol === "admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN: Le pasamos la función refreshAuth como prop */}
        <Route 
          path="/" 
          element={
            auth.isLogged ? (
              esAdmin ? <Navigate to="/home" replace /> : <Navigate to="/inicio-usuario" replace />
            ) : (
              <Login onLoginSuccess={refreshAuth} />
            )
          } 
        />

        <Route 
          path="/register" 
          element={auth.isLogged ? <Navigate to="/" replace /> : <Register />} 
        />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<Layout />}>
          <Route 
            path="/chat" 
            element={esAdmin ? <ChatAdmin /> : <UserChat />} 
          />

          {esAdmin && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/residentes" element={<Residentes />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/accesos" element={<Accesos />} />
              <Route path="/asambleas" element={<Asambleas />} /> 
              <Route path="/reportes" element={<Reportes />} />
            </>
          )}

          {!esAdmin && auth.isLogged && (
            <>
              <Route path="/inicio-usuario" element={<InicioU />} />
              <Route path="/chat-usuario" element={<UserChat />} />
              <Route path="/reportes-usuario" element={<ReportesU />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;