import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/chat.css";

export default function AdminChat() {
  const [mensajes, setMensajes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null);
  const scrollRef = useRef(null);
  const miId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("http://localhost:8000/api/usuarios-chat").then(res => {
      setDepartamentos(res.data.filter(u => !u.admin));
    });
  }, []);

  useEffect(() => {
    if (deptoSeleccionado) {
      axios.get(`http://localhost:8000/api/mensajes/${miId}/${deptoSeleccionado.id}`)
        .then(res => {
          setMensajes(res.data.map(m => ({
            id: m.id,
            texto: m.mensaje,
            tipo: m.remitente == miId ? "sent" : "received",
            hora: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        });
    }
  }, [deptoSeleccionado, miId]);

  useEffect(() => {
    if (!deptoSeleccionado) return;

    const channel = window.Echo.channel('chat-canal')
      .listen('.NuevoMensaje', (data) => {
        if (data.mensaje.destinatario == miId && data.mensaje.remitente == deptoSeleccionado.id) {
          setMensajes(prev => [...prev, { 
            id: data.mensaje.id, 
            texto: data.mensaje.mensaje, 
            tipo: "received", 
            hora: "Ahora" 
          }]);
        }
      });

    return () => window.Echo.leave('chat-canal');
  }, [deptoSeleccionado, miId]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensajeTexto.trim() || !deptoSeleccionado) return;
    
    const texto = mensajeTexto;
    setMensajes([...mensajes, { id: Date.now(), texto, tipo: "sent", hora: "Ahora" }]);
    setMensajeTexto("");

    try {
      await axios.post("http://localhost:8000/api/enviar-mensaje", {
        remitente_id: miId, 
        destinatario_id: deptoSeleccionado.id, 
        texto
      });
    } catch (error) {
      console.error("Error al enviar:", error.response?.data);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header-side">Departamentos</div>
        <div className="contact-list">
          {departamentos.map(d => (
            <div key={d.id} 
                 className={`contact-item ${deptoSeleccionado?.id === d.id ? 'active' : ''}`}
                 onClick={() => setDeptoSeleccionado(d)}>
              <div className="contact-avatar">{d.depa}</div>
              <div className="contact-info">
                <strong>Depto {d.depa}</strong>
                <p>ID Persona: {d.id_persona}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <h3>{deptoSeleccionado ? `Chat con Depto ${deptoSeleccionado.depa}` : "Seleccione un residente"}</h3>
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
          <input type="text" value={mensajeTexto} onChange={e => setMensajeTexto(e.target.value)} placeholder="Responder..." />
          <button type="submit" className="btn-send">Enviar</button>
        </form>
      </div>
    </div>
  );
}