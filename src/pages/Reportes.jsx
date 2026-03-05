import { useState, useEffect } from "react";
import { Trash2, X, AlertCircle, CheckCircle, Clock, Edit } from "lucide-react";
import axios from "axios";
import "../styles/reportes.css";

export default function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
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
      console.error("Error 500 detectado:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (r) => {
    setEditMode(true);
    setSelectedId(r.id);
    setFormData({
      categoria: r.categoria,
      descripcion: r.descripcion,
      estado: r.estado
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      alert("Error en la operación: " + (err.response?.data?.error || "Intente de nuevo"));
    }
  };

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
        <button className="btn-add-primary" onClick={() => { setEditMode(false); setFormData({categoria:"Mantenimiento", descripcion:"", estado:"Pendiente"}); setShowModal(true); }}>
          + Crear Reporte
        </button>
      </div>

      <div className="residentes-card">
        {loading ? <p className="text-center">Cargando...</p> : (
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
                <tr key={r.id}>
                  <td>
                    <strong>{r.usuario_nombre}</strong>
                    <div className="text-muted" style={{fontSize: '12px'}}>Depa: {r.departamento || 'N/A'}</div>
                  </td>
                  <td><span className="cat-tag">{r.categoria}</span></td>
                  <td>{r.descripcion.substring(0, 30)}...</td>
                  <td>{renderEstado(r.estado)}</td>
                  <td className="text-center">
                    <button className="btn-edit" onClick={() => handleOpenEdit(r)} style={{marginRight: '8px'}}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-delete" onClick={async () => { if(window.confirm("¿Borrar?")) { await axios.delete(`http://localhost:8000/api/reportes/${r.id}`); fetchReportes(); } }}>
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title-dark">{editMode ? "Editar Incidencia" : "Nuevo Reporte"}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
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
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">{editMode ? "Guardar Cambios" : "Enviar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}