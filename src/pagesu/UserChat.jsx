import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/chat.css";

export default function UserChat() {
  const [mensajes, setMensajes] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  
  const scrollRef = useRef(null);
  const contactoRef = useRef(null); 
  const miId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("http://localhost:8000/api/usuarios-chat").then(res => {
      setContactos(res.data.filter(u => u.id != miId));
    });
  }, [miId]);

  useEffect(() => {
    contactoRef.current = contactoSeleccionado;
    if (contactoSeleccionado) {
      cargarMensajes(contactoSeleccionado.id);
    }
  }, [contactoSeleccionado]);

  const cargarMensajes = (contactoId) => {
    axios.get(`http://localhost:8000/api/mensajes/${miId}/${contactoId}`)
      .then(res => {
        setMensajes(res.data.map(m => ({
          id: m.id,
          texto: m.mensaje,
          tipo: m.remitente == miId ? "sent" : "received",
          hora: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      });
  };

  useEffect(() => {
    if (!miId || !window.Echo) return;

    console.log("✅ Conexión persistente iniciada en chat-canal");
    const channel = window.Echo.channel('chat-canal')
      .listen('.NuevoMensaje', (data) => {
        console.log("Evento recibido:", data);
        
        if (data.mensaje.destinatario == miId) {
          if (contactoRef.current && data.mensaje.remitente == contactoRef.current.id) {
            setMensajes(prev => [...prev, { 
              id: data.mensaje.id, 
              texto: data.mensaje.mensaje, 
              tipo: "received", 
              hora: "Ahora" 
            }]);
          } else {
            console.log("Mensaje de otro contacto, se queda en la DB hasta que abras ese chat.");
          }
        }
      });

    return () => {
      console.log("Cerrando canal de chat");
      window.Echo.leave('chat-canal');
    };
  }, [miId]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensajeTexto.trim() || !contactoSeleccionado) return;
    
    const texto = mensajeTexto;
    setMensajeTexto("");
    setMensajes(prev => [...prev, { id: Date.now(), texto, tipo: "sent", hora: "Ahora" }]);

    try {
      await axios.post("http://localhost:8000/api/enviar-mensaje", {
        remitente_id: miId, 
        destinatario_id: contactoSeleccionado.id, 
        texto: texto
      });
    } catch (error) {
      console.error("Error al enviar:", error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header-side">Contactos</div>
        <div className="contact-list">
          {contactos.map(c => (
            <div key={c.id} 
                 className={`contact-item ${contactoSeleccionado?.id === c.id ? 'active' : ''}`}
                 onClick={() => setContactoSeleccionado(c)}>
              <div className="contact-avatar">{c.admin ? "AD" : (c.depa || "?")}</div>
              <div className="contact-info">
                <strong>{c.admin ? "Administración" : `Depto ${c.depa}`}</strong>
                <p>{c.admin ? "Soporte" : "Vecino"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        {contactoSeleccionado ? (
          <>
            <div className="chat-header">
              <h3>Chat con {contactoSeleccionado.admin ? "Administración" : `Depto ${contactoSeleccionado.depa}`}</h3>
            </div>
            <div className="chat-messages">
              {mensajes.map(m => (
                <div key={m.id} className={`message ${m.tipo}`}>
                  <p>{m.texto}</p>
                  <span>{m.hora}</span>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <form className="chat-input-area" onSubmit={enviar}>
              <input type="text" value={mensajeTexto} onChange={e => setMensajeTexto(e.target.value)} placeholder="Escribe..." />
              <button type="submit" className="btn-send">Enviar</button>
            </form>
          </>
        ) : (
          <div className="no-chat"><h3>Selecciona un chat</h3></div>
        )}
      </div>
    </div>
  );
}