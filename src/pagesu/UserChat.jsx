import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/chat.css";

export default function UserChat() {
  const [mensajes, setMensajes] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const scrollRef = useRef(null);
  
  const miId = localStorage.getItem("userId");
  const adminId = 1; 
  useEffect(() => {
    axios.get("http://localhost:8000/api/usuarios-chat").then(res => {
      const listaFiltrada = res.data.filter(u => u.id != miId);
      setContactos(listaFiltrada);
    }).catch(err => console.error("Error cargando contactos:", err));
  }, [miId]);

  useEffect(() => {
    if (contactoSeleccionado) {
      axios.get(`http://localhost:8000/api/mensajes/${miId}/${contactoSeleccionado.id}`)
        .then(res => {
          setMensajes(res.data.map(m => ({
            id: m.id,
            texto: m.mensaje,
            tipo: m.remitente == miId ? "sent" : "received",
            hora: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        });
    }
  }, [contactoSeleccionado, miId]);

  useEffect(() => {
    if (!contactoSeleccionado) return;

    const channel = window.Echo.channel('chat-canal')
      .listen('.NuevoMensaje', (data) => {
        if (data.mensaje.destinatario == miId && data.mensaje.remitente == contactoSeleccionado.id) {
          setMensajes(prev => [...prev, { 
            id: data.mensaje.id, 
            texto: data.mensaje.mensaje, 
            tipo: "received", 
            hora: "Ahora" 
          }]);
        }
      });

    return () => window.Echo.leave('chat-canal');
  }, [contactoSeleccionado, miId]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensajeTexto.trim() || !contactoSeleccionado) return;
    
    const texto = mensajeTexto;
    setMensajes(prev => [...prev, { id: Date.now(), texto, tipo: "sent", hora: "Ahora" }]);
    setMensajeTexto("");

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
              
              <div className="contact-avatar">
                {c.admin ? "AD" : (c.depa || c.id_persona || "?")}
              </div>
              
              <div className="contact-info">
                <strong>{c.admin ? "Administración" : `Depto ${c.depa || c.id_persona}`}</strong>
                <p>{c.admin ? "Soporte Técnico" : "Residente"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        {contactoSeleccionado ? (
          <>
            <div className="chat-header">
              <h3>
                Chat con {contactoSeleccionado.admin ? "Administración" : `Depto ${contactoSeleccionado.depa || contactoSeleccionado.id_persona}`}
              </h3>
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
              <input 
                type="text" 
                value={mensajeTexto} 
                onChange={e => setMensajeTexto(e.target.value)} 
                placeholder="Escribe un mensaje..." 
              />
              <button type="submit" className="btn-send">Enviar</button>
            </form>
          </>
        ) : (
          <div className="no-chat">
            <h3>Bienvenido al Chat</h3>
            <p>Selecciona a la administración o a un vecino para conversar.</p>
          </div>
        )}
      </div>
    </div>
  );
}