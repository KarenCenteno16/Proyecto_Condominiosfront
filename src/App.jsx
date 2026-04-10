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
import ProtectedRoute from "./components/ProtectedRoute";


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

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Login onLoginSuccess={refreshAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* RUTAS DE ADMINISTRADOR (Middleware: isLogged + rol admin) */}
        <Route element={
            <ProtectedRoute 
                isAllowed={auth.isLogged && auth.rol === 'admin'} 
                redirectTo="/" 
            />
        }>
            <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/residentes" element={<Residentes />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/accesos" element={<Accesos />} />
                <Route path="/asambleas" element={<Asambleas />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/chat" element={<ChatAdmin />} />
            </Route>
        </Route>

        {/* RUTAS DE RESIDENTE (Middleware: isLogged + rol residente) */}
        <Route element={
            <ProtectedRoute 
                isAllowed={auth.isLogged && auth.rol === 'residente'} 
                redirectTo="/" 
            />
        }>
            <Route element={<Layout />}>
                <Route path="/inicio-usuario" element={<InicioU />} />
                <Route path="/reportes-usuario" element={<ReportesU />} />
                <Route path="/chat-usuario" element={<UserChat />} />
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );

  
} export default App;
