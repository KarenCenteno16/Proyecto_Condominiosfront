import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";

// Imports de páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword"; // Importado correctamente
import Home from "./pages/Home";
import Residentes from "./pages/Residentes";
import Pagos from "./pages/Pagos";
import ChatAdmin from "./pages/Chat"; 
import Accesos from "./pages/Accesos";
import Asambleas from "./pages/Asambleas"; 
import Reportes from "./pages/Reportes";
import InicioU from "./pagesu/InicioU"; 
import UserChat from "./pagesu/UserChat";
import ReportesU from "./paginasusu/ReportesU";

function App() {
  const [auth, setAuth] = useState({
    isLogged: !!localStorage.getItem("token"),
    rol: localStorage.getItem("rol")
  });

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

        <Route path="/register" element={<Register />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<Layout />}>
          {/* Rutas de Administrador */}
          <Route path="/home" element={auth.isLogged && esAdmin ? <Home /> : <Navigate to="/" replace />} />
          <Route path="/residentes" element={auth.isLogged && esAdmin ? <Residentes /> : <Navigate to="/" replace />} />
          <Route path="/pagos" element={auth.isLogged && esAdmin ? <Pagos /> : <Navigate to="/" replace />} />
          <Route path="/accesos" element={auth.isLogged && esAdmin ? <Accesos /> : <Navigate to="/" replace />} />
          <Route path="/asambleas" element={auth.isLogged && esAdmin ? <Asambleas /> : <Navigate to="/" replace />} />
          <Route path="/reportes" element={auth.isLogged && esAdmin ? <Reportes /> : <Navigate to="/" replace />} />
          
          {/* Rutas de Residente */}
          <Route path="/inicio-usuario" element={auth.isLogged && !esAdmin ? <InicioU /> : <Navigate to="/" replace />} />
          <Route path="/reportes-usuario" element={auth.isLogged && !esAdmin ? <ReportesU /> : <Navigate to="/" replace />} />
          
          {/* Chat */}
          <Route 
            path="/chat" 
            element={auth.isLogged ? (esAdmin ? <ChatAdmin /> : <UserChat />) : <Navigate to="/" replace />} 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;