import { useLocation } from "react-router-dom";
import "../styles/navbar.css";


export default function Navbar() {
  const location = useLocation();
  
  // de rutas a titulos
  const titles = {
    "/home": "Panel de Control",
    "/residentes": "Gestión de Residentes",
    "/pagos": "Pagos y Cobranza",
    "/chat": "Mensajería Interna",
    "/accesos": "Control de Accesos (Controles)",
    "/asambleas": "Administración de Asambleas",
    "/reportes": "Reportes de Incidencias"

  };

  const currentTitle = titles[location.pathname] || "Gestión de Condominios";
    
  return (
    <header className="navbar">
      <h1>{currentTitle}</h1>
      <div className="navbar-right">
        <div className="bell">🔔</div>
        <div className="avatar">A</div>
      </div>
    </header>
  );
}