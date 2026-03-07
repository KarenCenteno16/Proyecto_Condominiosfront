import { useState, useEffect, useRef, useTransition } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Send, Loader2 } from "lucide-react";
import "animate.css";
import "../styles/chat.css";

export default function AdminChat() {
  const [mensajes, setMensajes] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState("");
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null);
  const scrollRef = useRef(null);
  const miId = localStorage.getItem("userId");

  // Hook de transición
  const [isPending, startTransition] = useTransition();

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
    if (!miId || !window.Echo) return;

    const channel = window.Echo.channel('chat-canal')
      .listen('.NuevoMensaje', (data) => {
        if (data.mensaje.destinatario == miId && deptoSeleccionado && data.mensaje.remitente == deptoSeleccionado.id) {
          setMensajes(prev => [...prev, { 
            id: data.mensaje.id, 
            texto: data.mensaje.mensaje, 
            tipo: "received", 
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      });

    return () => window.Echo.leave('chat-canal');
  }, [deptoSeleccionado, miId]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensajeTexto.trim() || !deptoSeleccionado) return;
    
    const textoActual = mensajeTexto;
    const temporalId = Date.now();
    setMensajeTexto(""); // Limpiamos input de inmediato (Optimistic UI)

    // Envolvemos la petición en startTransition
    startTransition(async () => {
      try {
        await axios.post("http://localhost:8000/api/enviar-mensaje", {
          remitente_id: miId, 
          destinatario_id: deptoSeleccionado.id, 
          texto: textoActual
        });

        setMensajes(prev => [...prev, { 
          id: temporalId, 
          texto: textoActual, 
          tipo: "sent", 
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'success'
        }]);
      } catch (error) {
        // Si falla, mostramos alerta discreta y devolvemos el texto al input
        setMensajeTexto(textoActual);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'No se pudo enviar el mensaje',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  return (
    <div className="chat-container animate__animated animate__fadeIn">
      <div className="chat-sidebar">
        <div className="chat-header-side">Departamentos</div>
        <div className="contact-list">
          {departamentos.map(d => (
            <div key={d.id} 
                 className={`contact-item ${deptoSeleccionado?.id === d.id ? 'active' : ''}`}
                 onClick={() => setDeptoSeleccionado(d)}>
              <div className="contact-avatar">{d.depa || "U"}</div>
              <div className="contact-info">
                <strong>Depto {d.depa}</strong>
                <p>Residente ID: {d.id_persona}</p>
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
            <div key={m.id} className={`message ${m.tipo} animate__animated animate__fadeInUp animate__faster`}>
              <p>{m.texto}</p>
              <span>{m.hora}</span>
            </div>
          ))}
          {/* Indicador de carga si la transición está pendiente */}
          {isPending && (
            <div className="message sent pending-msg">
              <p>Enviando...</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form className="chat-input-area" onSubmit={enviar}>
          <input 
            type="text" 
            value={mensajeTexto} 
            onChange={e => setMensajeTexto(e.target.value)} 
            placeholder="Responder..." 
            disabled={!deptoSeleccionado}
          />
          <button type="submit" className="btn-send" disabled={isPending || !deptoSeleccionado}>
            {isPending ? <Loader2 className="spinner-chat" size={18} /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}