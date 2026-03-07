import { useState, useEffect, useTransition } from "react";
import { Trash2, AlertCircle, CheckCircle, Clock, Edit, Loader2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "animate.css"; // Para las transiciones de las alertas
import "../styles/reportes.css";

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // Hook de transición de React
  const [isPending, startTransition] = useTransition();
  
  const miId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    categoria: "Mantenimiento",
    descripcion: "",
    estado: "Pendiente"
  });

  useEffect(() => { fetchReportes(); }, []);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/reportes");
      setReportes(res.data);
    } catch (err) {
      console.error("Error al cargar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar alertas con transiciones
  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
      hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
      confirmButtonColor: '#3b82f6',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usamos startTransition para envolver la petición HTTP
    startTransition(async () => {
      try {
        if (editMode) {
          await axios.put(`http://localhost:8000/api/reportes/${selectedId}`, formData);
        } else {
          await axios.post("http://localhost:8000/api/reportes", {
            ...formData,
            usuario_id: miId
          });
        }
        
        setShowModal(false);
        fetchReportes();
        showAlert("¡Completado!", `El reporte ha sido ${editMode ? 'actualizado' : 'enviado'} con éxito.`, "success");
      } catch (err) {
        showAlert("Error", err.response?.data?.error || "Hubo un problema con la conexión", "error");
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      showClass: { popup: 'animate__animated animate__zoomIn animate__faster' }
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          try {
            await axios.delete(`http://localhost:8000/api/reportes/${id}`);
            fetchReportes();
            showAlert("Eliminado", "El reporte ha sido borrado.", "success");
          } catch (e) {
            showAlert("Error", "No se pudo eliminar", "error");
          }
        });
      }
    });
  };

  // ... RenderEstado se mantiene igual ...
  const renderEstado = (estado) => {
    const estilos = {
      'Pendiente': { class: 'badge-pendiente', icon: <Clock size={12} /> },
      'En Proceso': { class: 'badge-proceso', icon: <AlertCircle size={12} /> },
      'Resuelto': { class: 'badge-resuelto', icon: <CheckCircle size={12} /> }
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
          <h2 className="main-title">Reportes de Incidencias</h2>
          <p className="section-subtitle">Gestión Administrativa</p>
        </div>
        <button 
          className="btn-add-primary" 
          onClick={() => { setEditMode(false); setFormData({categoria:"Mantenimiento", descripcion:"", estado:"Pendiente"}); setShowModal(true); }}
        >
          + Crear Reporte
        </button>
      </div>

      <div className="residentes-card">
        {loading ? <div className="loader-container"><Loader2 className="spinner" /> <p>Cargando reportes...</p></div> : (
          <table className="residentes-table">
            <thead>
              <tr>
                <th>USUARIO / DEPA</th>
                <th>CATEGORÍA</th>
                <th>DESCRIPCIÓN</th>
                <th>ESTADO</th>
                <th className="text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id} className={isPending ? "row-pending" : ""}>
                  <td>
                    <strong>{r.usuario_nombre}</strong>
                    <div className="text-muted" style={{fontSize: '12px'}}>Depa: {r.departamento || 'N/A'}</div>
                  </td>
                  <td><span className="cat-tag">{r.categoria}</span></td>
                  <td>{r.descripcion.substring(0, 30)}...</td>
                  <td>{renderEstado(r.estado)}</td>
                  <td className="text-center">
                    <button className="btn-edit" onClick={() => {setSelectedId(r.id); setEditMode(true); setFormData({categoria: r.categoria, descripcion: r.descripcion, estado: r.estado}); setShowModal(true);}} style={{marginRight: '8px'}}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(r.id)} disabled={isPending}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay animate__animated animate__fadeIn">
          <div className="modal-content animate__animated animate__zoomIn animate__faster">
            <h3 className="modal-title-dark">{editMode ? "Editar Incidencia" : "Nuevo Reporte"}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Selects y Textarea se mantienen igual */}
              <label className="section-subtitle">Categoría</label>
              <select className="modal-input" value={formData.categoria} onChange={(e)=>setFormData({...formData, categoria: e.target.value})}>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Limpieza">Limpieza</option>
              </select>

              {editMode && (
                <>
                  <label className="section-subtitle" style={{marginTop:'10px', display:'block'}}>Estado</label>
                  <select className="modal-input" value={formData.estado} onChange={(e)=>setFormData({...formData, estado: e.target.value})}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Resuelto">Resuelto</option>
                  </select>
                </>
              )}

              <label className="section-subtitle" style={{marginTop:'10px', display:'block'}}>Descripción</label>
              <textarea className="modal-input modal-textarea" value={formData.descripcion} onChange={(e)=>setFormData({...formData, descripcion: e.target.value})} required />

              <div className="modal-actions-centered">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={isPending}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={isPending}>
                  {isPending ? <Loader2 className="spinner-small" /> : (editMode ? "Guardar" : "Enviar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}