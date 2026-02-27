import { Home, Users, CreditCard, Key, MessageSquare, Menu, Gavel, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  // funcion para determinar si la ruta esta activa
  const activeClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="hamburger">
          <Menu size={20} />
        </span>
        <div className="sidebar-title">Gestión de condominios</div>
      </div>

      <nav className="menu-list">
        <Link to="/home" className={`menu-item ${activeClass("/home")}`}>
          <span className="menu-icon"><Home size={18} /></span> Home
        </Link>

        <Link to="/residentes" className={`menu-item ${activeClass("/residentes")}`}>
          <span className="menu-icon"><Users size={18} /></span> Residentes
        </Link>

        <Link to="/pagos" className={`menu-item ${activeClass("/pagos")}`}>
          <span className="menu-icon"><CreditCard size={18} /></span> Pagos
        </Link>

        <Link to="/accesos" className={`menu-item ${activeClass("/accesos")}`}>
          <span className="menu-icon"><Key size={18} /></span> Accesos
        </Link>

        <Link to="/chat" className={`menu-item ${activeClass("/chat")}`}>
          <span className="menu-icon"><MessageSquare size={18} /></span> Chat
        </Link>

        <Link to="/asambleas" className={`menu-item ${activeClass("/asambleas")}`}>
          <span className="menu-icon"><Gavel size={18} /></span> Asambleas
        </Link>

        <Link to="/reportes" className={`menu-item ${activeClass("/reportes")}`}>
          <span className="menu-icon"><ClipboardList size={18} /></span> Reportes
        </Link>
      </nav>
    </aside>
  );
}