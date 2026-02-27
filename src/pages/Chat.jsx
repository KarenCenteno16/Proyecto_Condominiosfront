import { useState, useEffect } from "react";
import axios from "axios"; 
import "../styles/chat.css";

export default function Chat() {
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [mensajes, setMensajes] = useState([
    { id: 1, texto: "Hola, ¿podrían confirmarme si recibieron mi comprobante de pago?", tipo: "received", hora: "10:30 AM" },
    { id: 2, texto: "Hola Juan, sí, ya está registrado en el sistema.", tipo: "sent", hora: "10:32 AM" }
  ]);

  //escuchar web socket
  useEffect(() => {
    const channel = window.Echo.channel('chat-canal')
      .listen('.NuevoMensaje', (data) => {
        const nuevoMsg = {
          id: Date.now(),
          texto: data.texto,
          tipo: "received", 
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMensajes((prev) => [...prev, nuevoMsg]);
      });

    return () => {
      window.Echo.leave('chat-canal');
    };
  }, []);

  //enviar mensaje a la api
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensajeTexto.trim()) return;

    try {
      // mensaje instantaneo local
      const miMensaje = {
        id: Date.now(),
        texto: mensajeTexto,
        tipo: "sent",
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMensajes([...mensajes, miMensaje]);
      const textoAEnviar = mensajeTexto;
      setMensajeTexto("");

      // peticion post a la ruta que creamos en api.php
      await axios.post("http://localhost:8000/api/enviar-mensaje", {
        texto: textoAEnviar
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-search">
          <input type="text" placeholder="Buscar departamento..." />
        </div>
        <div className="contact-list">
          <div className="contact-item active">
            <div className="contact-avatar">101</div>
            <div className="contact-info">
              <strong>Depto 101</strong>
              <p>Juan Pérez: Gracias por...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header">
          <h3>Departamento 101 - Juan Pérez</h3>
          <span className="status-online">En línea</span>
        </div>
        
        <div className="chat-messages">
          {mensajes.map((msg) => (
            <div key={msg.id} className={`message ${msg.tipo}`}>
              <p>{msg.texto}</p>
              <span>{msg.hora}</span>
            </div>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={enviarMensaje}>
          <input 
            type="text" 
            placeholder="Escribe un mensaje aquí..." 
            value={mensajeTexto}
            onChange={(e) => setMensajeTexto(e.target.value)}
          />
          <button type="submit" className="btn-send">Enviar</button>
        </form>
      </div>
    </div>
  );
}