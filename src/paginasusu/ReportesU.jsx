
import { useState, useEffect } from "react";
import { Trash2, X, AlertCircle, CheckCircle, Clock, Plus } from "lucide-react";
import axios from "axios";
import "../styles/reportes.css";

export default function ReportesU() {
  const [reportes, setReportes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
      // Llamamos a la nueva ruta filtrada por ID
      const res = await axios.get(`http://localhost:8000/api/reportes/usuario/${miId}`);
      setReportes(res.data);
    } catch (err) {
      console.error("Error al obtener tus reportes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/reportes", {
        usuario_id: miId,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        estado: "Pendiente" // Por defecto siempre inicia en Pendiente
      });
      setShowModal(false);
      setFormData({ categoria: "Mantenimiento", descripcion: "" });
      fetchReportesUsuario();
    } catch (err) {
      alert("Error al enviar el reporte");
    }
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
          <p className="text-center p-4">Cargando tus reportes...</p>
        ) : (
          <table className="residentes-table">
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
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td><span className="cat-tag">{r.categoria}</span></td>
                    <td className="desc-cell" title={r.descripcion}>
                      {r.descripcion.length > 50 ? r.descripcion.substring(0, 50) + "..." : r.descripcion}
                    </td>
                    <td>{renderEstado(r.estado)}</td>
                    <td className="text-center">
                      {r.estado === "Pendiente" ? (
                        <button className="btn-delete-icon" onClick={async () => {
                          if(window.confirm("¿Deseas cancelar este reporte?")) {
                            await axios.delete(`http://localhost:8000/api/reportes/${r.id}`);
                            fetchReportesUsuario();
                          }
                        }}>
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
        <div className="modal-overlay">
          <div className="modal-content">
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
                  placeholder="Ej: El foco del pasillo 3 no enciende..."
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
              </div>
              
              <div className="modal-actions-centered">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-add-primary">Enviar a Administración</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}