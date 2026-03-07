import { useState, useEffect, useTransition } from "react";
import { Trash2, X, AlertCircle, CheckCircle, Clock, Plus, Loader2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css";
import "../styles/reportes.css";

export default function ReportesU() {
  const [reportes, setReportes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Hook para gestionar transiciones de UI
  const [isPending, startTransition] = useTransition();
  
  const miId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    categoria: "Mantenimiento",
    descripcion: ""
  });

  useEffect(() => {
    if (miId) fetchReportesUsuario();
  }, [miId]);

  const fetchReportesUsuario = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/reportes/usuario/${miId}`);
      setReportes(res.data);
    } catch (err) {
      console.error("Error al obtener tus reportes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función de alerta reutilizable con transiciones
  const notify = (title, icon, text = "") => {
    Swal.fire({
      title,
      text,
      icon,
      timer: 2500,
      showConfirmButton: false,
      showClass: { popup: 'animate__animated animate__fadeInRight' },
      hideClass: { popup: 'animate__animated animate__fadeOutRight' },
      toast: true,
      position: 'top-end'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Iniciamos la transición para el estado de "Enviando..."
    startTransition(async () => {
      try {
        await axios.post("http://localhost:8000/api/reportes", {
          usuario_id: miId,
          categoria: formData.categoria,
          descripcion: formData.descripcion,
          estado: "Pendiente"
        });

        setShowModal(false);
        setFormData({ categoria: "Mantenimiento", descripcion: "" });
        fetchReportesUsuario();
        notify("Reporte Enviado", "success", "La administración lo revisará pronto.");
      } catch (err) {
        notify("Error", "error", "No se pudo enviar el reporte.");
      }
    });
  };

  const handleCancelReport = (id) => {
    Swal.fire({
      title: '¿Cancelar reporte?',
      text: "Se eliminará la solicitud de mantenimiento.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      showClass: { popup: 'animate__animated animate__headShake' }
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          try {
            await axios.delete(`http://localhost:8000/api/reportes/${id}`);
            fetchReportesUsuario();
            notify("Reporte Cancelado", "success");
          } catch (err) {
            notify("Error", "error", "No se pudo cancelar.");
          }
        });
      }
    });
  };

  const renderEstado = (estado) => {
    const estilos = {
      'Pendiente': { class: 'badge-pendiente', icon: <Clock size={14} /> },
      'En Proceso': { class: 'badge-proceso', icon: <AlertCircle size={14} /> },
      'Resuelto': { class: 'badge-resuelto', icon: <CheckCircle size={14} /> }
    };
    const config = estilos[estado] || estilos['Pendiente'];
    return (
      <span className={`badge-status ${config.class}`}>
        {config.icon} {estado}
      </span>
    );
  };

  return (
    <div className="main-content">
      <div className="section-header">
        <div>
          <h2 className="main-title">Mis Reportes</h2>
          <p className="section-subtitle">Seguimiento de tus incidencias en el condominio</p>
        </div>
        <button className="btn-add-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{marginRight: '8px'}} /> Nuevo Reporte
        </button>
      </div>

      <div className="residentes-card">
        {loading ? (
          <div className="loader-container">
            <Loader2 className="spinner" size={40} />
            <p>Cargando tus reportes...</p>
          </div>
        ) : (
          <table className={`residentes-table ${isPending ? 'table-loading' : ''}`}>
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CATEGORÍA</th>
                <th>DESCRIPCIÓN</th>
                <th>ESTADO</th>
                <th className="text-center">OPCIONES</th>
              </tr>
            </thead>
            <tbody>
              {reportes.length === 0 ? (
                <tr><td colSpan="5" className="text-center">Aún no has realizado ningún reporte.</td></tr>
              ) : (
                reportes.map((r) => (
                  <tr key={r.id} className="animate__animated animate__fadeIn">
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td><span className="cat-tag">{r.categoria}</span></td>
                    <td className="desc-cell" title={r.descripcion}>
                      {r.descripcion.length > 50 ? r.descripcion.substring(0, 50) + "..." : r.descripcion}
                    </td>
                    <td>{renderEstado(r.estado)}</td>
                    <td className="text-center">
                      {r.estado === "Pendiente" ? (
                        <button 
                          className="btn-delete-icon" 
                          disabled={isPending}
                          onClick={() => handleCancelReport(r.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span className="text-muted" style={{fontSize: '11px'}}>En gestión</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay animate__animated animate__fadeIn">
          <div className="modal-content animate__animated animate__zoomIn animate__faster">
            <div className="modal-header">
              <h3 className="modal-title-dark">Crear Nueva Incidencia</h3>
              <button className="close-x" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="section-subtitle">¿Qué tipo de problema es?</label>
                <select 
                  className="modal-input"
                  value={formData.categoria}
                  disabled={isPending}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                >
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="form-group" style={{marginTop: '15px'}}>
                <label className="section-subtitle">Describe el problema detalladamente</label>
                <textarea 
                  className="modal-input modal-textarea" 
                  value={formData.descripcion}
                  required
                  disabled={isPending}
                  placeholder="Ej: El foco del pasillo 3 no enciende..."
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
              </div>
              
              <div className="modal-actions-centered">
                <button type="button" className="btn-cancel" disabled={isPending} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-add-primary" disabled={isPending}>
                  {isPending ? (
                    <><Loader2 className="spinner-small" size={16} /> Enviando...</>
                  ) : (
                    "Enviar a Administración"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}