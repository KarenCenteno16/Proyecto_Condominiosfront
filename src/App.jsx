import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";

// Páginas de Administrador
import Login from "./pages/Login";
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
    isLogged: !!localStorage.getItem("userId"),
    rol: localStorage.getItem("rol")
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth({
        isLogged: !!localStorage.getItem("userId"),
        rol: localStorage.getItem("rol")
      });
    };

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
              esAdmin ? <Navigate to="/home" /> : <Navigate to="/inicio-usuario" />
            ) : (
              <Login />
            )
          } 
        />

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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;