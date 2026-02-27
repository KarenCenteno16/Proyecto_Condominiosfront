import { useEffect, useState } from "react";
import "../styles/accesos.css"; 

export default function Visitantes() {
  const [visitantes, setVisitantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre_visitante: "",
    id_depa: "",
    vehiculo: "",
    placas: "",
    identificacion: ""
  });

  return (
    <div className="main-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Visitantes</h2>
          <p className="section-subtitle">Control de acceso y registro de visitas</p>
        </div>
      </div>

      <div className="residentes-card"> 
        <div className="table-controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar visitante..." 
              className="top-search-bar" 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)} 
            />
          </div>
          <button className="btn-add-primary" onClick={() => setMostrarModal(true)}>
            + Agregar Registro de Visita
          </button>
        </div>

        <table className="residentes-table">
          <thead>
            <tr>
              <th>Nombre del Visitante</th>
              <th>Departamento</th>
              <th>Vehículo/Placas</th>
              <th>Fecha/Hora</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-dark"><strong>Ejemplo Visitante</strong></td>
              <td className="apt-cell">101-A</td>
              <td>Mazda Rojo / JKL-901</td>
              <td>26/02/2026 12:00 PM</td>
              <td className="actions">
                <button className="btn-edit">Ver Detalle</button>
                <button className="btn-delete">Salida</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nuevo Registro de Visita</h3>
              <button className="close-x" onClick={() => setMostrarModal(false)}>×</button>
            </div>
            
            <form>
              <div className="form-grid-upper">
                <div className="form-group">
                  <label>Nombre del Visitante</label>
                  <input className="modal-input" placeholder="Ej. Roberto Gómez" />
                </div>
                <div className="form-group">
                  <label>Departamento</label>
                  <select className="modal-input">
                    <option>Seleccionar Depto...</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-lower">
                <div className="form-group">
                  <label>Vehículo (Modelo/Color)</label>
                  <input className="modal-input" placeholder="Ej. Mazda 3 Rojo" />
                </div>
                <div className="form-group">
                  <label>Placas</label>
                  <input className="modal-input" placeholder="JKL-901" />
                </div>
                <div className="form-group">
                  <label>Identificación (ID)</label>
                  <input className="modal-input" placeholder="IFE / Licencia" />
                </div>
              </div>

              <div className="modal-actions-centered">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}