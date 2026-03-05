import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  
  const miId = localStorage.getItem("userId");
  const rol = localStorage.getItem("rol");

  const titles = {
    "/home": "Panel de Control",
    "/residentes": "Gestión de Residentes",
    "/pagos": "Pagos y Cobranza",
    "/chat": "Mensajería Interna",
    "/accesos": "Control de Accesos",
    "/asambleas": "Administración de Asambleas",
    "/reportes": "Reportes de Incidencias",
    "/inicio-usuario": "Mi Departamento",
    "/reportes-usuario": "Mis Reportes Enviados",
    "/chat-usuario": "Chat con Administración"
  };

  const currentTitle = titles[location.pathname] || "Gestión de Condominios";

  useEffect(() => {
    if (miId) {
      obtenerNotificaciones();
    }
  }, [miId]);

  const obtenerNotificaciones = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/notificaciones/${miId}`);
      setNotificaciones(res.data.filter(n => !n.leido));
    } catch (err) {
      console.error("Error al obtener notificaciones:", err);
    }
  };

  useEffect(() => {
    if (!miId || !window.Echo) {
      console.warn("Echo no detectado o falta ID de usuario");
      return;
    }

    const canalNombre = `notificaciones-user-${miId}`;
    console.log("Navbar escuchando en:", canalNombre);

    const channel = window.Echo.channel(canalNombre)
      .listen('.NuevaNotificacion', (data) => {
        console.log("Notificación recibida:", data);
        
        setNotificaciones(prev => {
          if (prev.find(n => n.id === data.notificacion.id)) return prev;
          return [data.notificacion, ...prev];
        });

        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => console.log("Reproducción de audio bloqueada por el navegador"));
      });

    return () => {
      console.log("Dejando canal:", canalNombre);
      window.Echo.leave(canalNombre);
    };
  }, [miId]);

  const clickNotificacion = async (n) => {
    try {
      await axios.post(`http://localhost:8000/api/notificaciones/leer/${n.id}`);
      setNotificaciones(prev => prev.filter(item => item.id !== n.id));
      setMostrarDropdown(false);
      navigate(n.url);
    } catch (err) {
      console.error("Error al procesar notificación:", err);
    }
  };

  const totalPendientes = notificaciones.length;

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>{currentTitle}</h1>
      </div>
      
      <div className="navbar-right">
        <div className="notification-container">
          <div 
            className="bell-wrapper" 
            onClick={() => setMostrarDropdown(!mostrarDropdown)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <span className="bell-icon" style={{ fontSize: '22px' }}>🔔</span>
            
            {totalPendientes > 0 && (
              <span className="notification-badge">
                {totalPendientes}
              </span>
            )}
          </div>

          {mostrarDropdown && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <strong>Avisos Recientes</strong>
                <span className="notif-count">{totalPendientes} nuevos</span>
              </div>
              
              <div className="notif-body">
                {notificaciones.length === 0 ? (
                  <div className="empty-state">
                    <p>No tienes notificaciones pendientes</p>
                  </div>
                ) : (
                  notificaciones.map(n => (
                    <div 
                      key={n.id} 
                      className="notif-item" 
                      onClick={() => clickNotificacion(n)}
                    >
                      <div className="notif-content">
                        <span className="notif-title">{n.titulo}</span>
                        <p className="notif-desc">
                          {n.mensaje.length > 50 ? n.mensaje.substring(0, 50) + "..." : n.mensaje}
                        </p>
                        <small className="notif-time">
                          {new Date(n.created_at).toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="notif-footer">
                <button onClick={() => setMostrarDropdown(false)}>Cerrar</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-section">
          <div className="user-info">
            <span className="user-role">{rol === "admin" ? "Administrador" : "Residente"}</span>
          </div>
          <div className="avatar">
            {rol === "admin" ? "A" : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}