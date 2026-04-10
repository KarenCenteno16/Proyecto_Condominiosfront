import { useState } from "react";
import { 
  Home, 
  Users, 
  CreditCard, 
  Key, 
  MessageSquare, 
  Menu, 
  Gavel, 
  ClipboardList, 
  LogOut,
  ShieldCheck // Icono para seguridad
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal"; // Importamos el modal que creaste

export default function Sidebar() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const rol = localStorage.getItem("rol")?.toLowerCase().trim();
  const esAdmin = rol === "admin";

  const handleLogout = () => {
    localStorage.clear();
    if (window.Echo) {
      console.log("Desconectando WebSockets...");
      window.Echo.disconnect();
    }
    window.location.href = "/";
  };

  const activeClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="hamburger"><Menu size={20} /></span>
        <div className="sidebar-title">Gestión de Condominios</div>
      </div>

      <nav className="menu-list" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* HOME DINÁMICO */}
        <Link 
          to={esAdmin ? "/home" : "/inicio-usuario"} 
          className={`menu-item ${activeClass(esAdmin ? "/home" : "/inicio-usuario")}`}
        >
          <span className="menu-icon"><Home size={18} /></span> Home
        </Link>

        {/* MENÚ PARA ADMINISTRADOR */}
        {esAdmin && (
          <>
            <Link to="/residentes" className={`menu-item ${activeClass("/residentes")}`}>
              <span className="menu-icon"><Users size={18} /></span> Residentes
            </Link>
            
            <Link to="/pagos" className={`menu-item ${activeClass("/pagos")}`}>
              <span className="menu-icon"><CreditCard size={18} /></span> Pagos
            </Link>
            
            <Link to="/accesos" className={`menu-item ${activeClass("/accesos")}`}>
              <span className="menu-icon"><Key size={18} /></span> Accesos
            </Link>
            
            <Link to="/asambleas" className={`menu-item ${activeClass("/asambleas")}`}>
              <span className="menu-icon"><Gavel size={18} /></span> Asambleas
            </Link>
            
            <Link to="/reportes" className={`menu-item ${activeClass("/reportes")}`}>
              <span className="menu-icon"><ClipboardList size={18} /></span> Reportes Admin
            </Link>

            <Link to="/chat" className={`menu-item ${activeClass("/chat")}`}>
              <span className="menu-icon"><MessageSquare size={18} /></span> Chat General
            </Link>
          </>
        )}

        {/* MENÚ PARA RESIDENTE */}
        {!esAdmin && (
          <>
            <Link 
              to="/reportes-usuario" 
              className={`menu-item ${activeClass("/reportes-usuario")}`}
            >
              <span className="menu-icon"><ClipboardList size={18} /></span> Mis Reportes
            </Link>

            <Link 
              to="/chat-usuario" 
              className={`menu-item ${activeClass("/chat-usuario")}`}
            >
              <span className="menu-icon"><MessageSquare size={18} /></span> Chat 
            </Link>
          </>
        )}

        {/* --- OPCIÓN DE SEGURIDAD (BOTÓN PARA EL MODAL) --- */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="menu-item"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            width: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }}
        >
          <span className="menu-icon"><ShieldCheck size={18} /></span> Seguridad
        </button>

        {/* BOTÓN DE CIERRE DE SESIÓN */}
        <button 
          onClick={handleLogout} 
          className="menu-item logout-btn" 
          style={{
            marginTop: 'auto', 
            background: 'none', 
            border: 'none', 
            color: 'inherit', 
            cursor: 'pointer', 
            width: '100%', 
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            fontSize: 'inherit',
            fontFamily: 'inherit'
          }}
        >
          <span className="menu-icon"><LogOut size={18} /></span> Cerrar Sesión
        </button>
      </nav>

      {/* COMPONENTE MODAL (Se activa al pulsar Seguridad) */}
      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </aside>
  );
}