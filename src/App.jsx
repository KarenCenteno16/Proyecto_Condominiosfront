import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";

// imports de páginas - asegúrate de que las rutas de archivo sean correctas
import Login from "./pages/Login";
import Register from "./pages/Register";
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
  // estado inicial verificando el localstorage
  const [auth, setAuth] = useState({
    isLogged: !!localStorage.getItem("token"),
    rol: localStorage.getItem("rol")
  });

  // función para actualizar el estado cuando el usuario inicia o cierra sesión
  const refreshAuth = () => {
    setAuth({
      isLogged: !!localStorage.getItem("token"),
      rol: localStorage.getItem("rol")
    });
  };

  // escucha cambios en el storage (útil para cuando el interceptor borra el token)
  useEffect(() => {
    const handleStorageChange = () => refreshAuth();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const esAdmin = auth.rol === "admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* ruta raíz: decide si mostrar login o mandar al home según el rol */}
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

        {/* rutas protegidas con layout (sidebar/navbar) */}
        <Route element={<Layout />}>
          
          {/* rutas exclusivas de administrador */}
          <Route path="/home" element={auth.isLogged && esAdmin ? <Home /> : <Navigate to="/" />} />
          <Route path="/residentes" element={auth.isLogged && esAdmin ? <Residentes /> : <Navigate to="/" />} />
          <Route path="/pagos" element={auth.isLogged && esAdmin ? <Pagos /> : <Navigate to="/" />} />
          <Route path="/accesos" element={auth.isLogged && esAdmin ? <Accesos /> : <Navigate to="/" />} />
          <Route path="/asambleas" element={auth.isLogged && esAdmin ? <Asambleas /> : <Navigate to="/" />} />
          <Route path="/reportes" element={auth.isLogged && esAdmin ? <Reportes /> : <Navigate to="/" />} />
          
          {/* rutas exclusivas de usuario residente */}
          <Route path="/inicio-usuario" element={auth.isLogged && !esAdmin ? <InicioU /> : <Navigate to="/" />} />
          <Route path="/reportes-usuario" element={auth.isLogged && !esAdmin ? <ReportesU /> : <Navigate to="/" />} />
          
          {/* rutas comunes o dinámicas (chat) */}
          <Route 
            path="/chat" 
            element={
              auth.isLogged ? (esAdmin ? <ChatAdmin /> : <UserChat />) : <Navigate to="/" />
            } 
          />
          
        </Route>

        {/* redirección por defecto para rutas no existentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;