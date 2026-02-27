import { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import "../styles/reportes.css";

export default function Reportes() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  //  los datos del formulario
  const [formData, setFormData] = useState({
    id_reporte: "",
    id_usuario: "",
    categoria: "Mantenimiento",
    descripcion: ""
  });

  const handleOpenModal = (reporte = null) => {
    if (reporte) {
      setEditMode(true);
      setFormData({
        id_reporte: reporte.id,
        id_usuario: reporte.usuario_id,
        categoria: reporte.categoria,
        descripcion: reporte.descripcion
      });
    } else {
      setEditMode(false);
      setFormData({ id_reporte: "", id_usuario: "10", categoria: "Mantenimiento", descripcion: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    setShowModal(false);
  };

  return (
    <div className="main-content">
      <div className="section-header">
        <div className="header-text-container">
          <h2 className="main-title">Reportes de Incidencias</h2>
          <p className="section-subtitle">Gestión de quejas y mantenimiento</p>
        </div>
        <button className="btn-add-primary" onClick={() => handleOpenModal()}>
          + Crear Reporte
        </button>
      </div>

      <div className="residentes-card">
        <table className="residentes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USUARIO</th>
              <th>DESCRIPCIÓN</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th className="text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="text-muted">#001</span></td>
              <td><strong>Juan Pérez</strong></td>
              <td>Fuga de agua en pasillo principal.</td>
              <td>{new Date().toLocaleDateString()}</td>
              <td><span className="badge-pendiente">Pendiente</span></td>
              <td className="text-center">
                <div className="action-buttons">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleOpenModal({id: "001", usuario_id: "10", categoria: "Mantenimiento", descripcion: "Fuga de agua en pasillo principal."})}
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button className="btn-delete"><Trash2 size={16} /> Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title-dark">{editMode ? "Editar Reporte" : "Nuevo Reporte"}</h3>
              <button className="close-x" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid-upper">
                <div className="form-group">
                  <label>ID Usuario (No editable)</label>
                  <input 
                    type="text" 
                    className="modal-input read-only-input" 
                    value={formData.id_usuario} 
                    readOnly={editMode} 
                    onChange={(e) => setFormData({...formData, id_usuario: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select 
                    className="modal-input"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option>Mantenimiento</option>
                    <option>Seguridad</option>
                    <option>Limpieza</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción del Reporte</label>
                <textarea 
                  className="modal-input modal-textarea" 
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions-centered">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">
                  {editMode ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}