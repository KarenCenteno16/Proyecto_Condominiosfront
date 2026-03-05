import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/chat.css";

export default function InicioU() {
    const navigate = useNavigate();
    
    const userId = localStorage.getItem("userId");
    const rol = localStorage.getItem("rol");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/"); 
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'between', 
                backgroundColor: '#2c3e50', 
                padding: '15px', 
                color: 'white',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0 }}>Panel de Residente</h2>
                <div style={{ marginLeft: 'auto' }}>
                    <button 
                        onClick={() => navigate("/chat")} 
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                    >
                        Ir al Chat 💬
                    </button>
                    <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <div className="welcome-card" style={{ 
                backgroundColor: '#ecf0f1', 
                padding: '30px', 
                borderRadius: '10px',
                textAlign: 'center' 
            }}>
                <h1>¡Bienvenido, Vecino!</h1>
                <p>Has iniciado sesión correctamente como <strong>{rol}</strong>.</p>
                <p>Tu ID de usuario es: {userId}</p>
                
                <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3>Mis Pagos</h3>
                        <p>Consulta tus recibos pendientes aquí.</p>
                        <button disabled>Próximamente</button>
                    </div>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3>Comunicados</h3>
                        <p>Revisa las últimas noticias del condominio.</p>
                        <button disabled>Próximamente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}