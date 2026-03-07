import { useState, useEffect, useRef, useTransition } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Send, Loader2 } from "lucide-react";
import "animate.css";
import "../styles/chat.css";

export default function UserChat() {
  const [mensajes, setMensajes] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  
  const [isPending, startTransition] = useTransition(); // Hook de transición
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

    const channel = window.Echo.channel('chat-canal')
      .listen('.NuevoMensaje', (data) => {
        if (data.mensaje.destinatario == miId) {
          if (contactoRef.current && data.mensaje.remitente == contactoRef.current.id) {
            setMensajes(prev => [...prev, { 
              id: data.mensaje.id, 
              texto: data.mensaje.mensaje, 
              tipo: "received", 
              hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }
        }
      });

    return () => window.Echo.leave('chat-canal');
  }, [miId]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensajeTexto.trim() || !contactoSeleccionado) return;
    
    const textoParaEnviar = mensajeTexto;
    const temporalId = Date.now();
    
    setMensajeTexto(""); // Limpieza inmediata (Optimistic UI)

    startTransition(async () => {
      try {
        // Agregamos el mensaje visualmente con un estado de "enviando" si fuera necesario
        setMensajes(prev => [...prev, { 
          id: temporalId, 
          texto: textoParaEnviar, 
          tipo: "sent", 
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);

        await axios.post("http://localhost:8000/api/enviar-mensaje", {
          remitente_id: miId, 
          destinatario_id: contactoSeleccionado.id, 
          texto: textoParaEnviar
        });
      } catch (error) {
        // En caso de error, devolvemos el texto al input y avisamos
        setMensajeTexto(textoParaEnviar);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'No se envió el mensaje',
          showConfirmButton: false,
          timer: 2000
        });
        // Removemos el mensaje que falló de la lista
        setMensajes(prev => prev.filter(m => m.id !== temporalId));
      }
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="chat-container animate__animated animate__fadeIn">
      <div className="chat-sidebar">
        <div className="chat-header-side">Contactos</div>
        <div className="contact-list">
          {contactos.map(c => (
            <div key={c.id} 
                 className={`contact-item ${contactoSeleccionado?.id === c.id ? 'active' : ''} animate__animated animate__fadeInLeft`}
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
                <div key={m.id} className={`message ${m.tipo} animate__animated animate__fadeInUp animate__faster`}>
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
                disabled={isPending}
              />
              <button type="submit" className="btn-send" disabled={isPending || !mensajeTexto.trim()}>
                {isPending ? <Loader2 className="spinner-chat" size={18} /> : <Send size={18} />}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat animate__animated animate__pulse animate__infinite">
            <h3>Selecciona un chat para comenzar</h3>
          </div>
        )}
      </div>
    </div>
  );
}