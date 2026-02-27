import { useEffect, useState } from "react";
import "../styles/residentes.css";

export default function Residentes() {
  const [residentes, setResidentes] = useState([]);
  const [listaDepartamentos, setListaDepartamentos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    celular: "",
    activo: true,
    id_depa: ""
  });

  const cargarDatos = async () => {
    try {
      const [resRes, depRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/residentes"),
        fetch("http://127.0.0.1:8000/api/departamentos")
      ]);
      setResidentes(await resRes.json());
      setListaDepartamentos(await depRes.json());
    } catch (err) { console.error("Error:", err); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const abrirModalNuevo = () => {
    setEditandoId(null);
    setFormData({ nombre: "", apellido_p: "", apellido_m: "", celular: "", activo: true, id_depa: "" });
    setMostrarModal(true);
  };

  const iniciarEdicion = (residente) => {
    setEditandoId(residente.id);
    setFormData({
      nombre: residente.nombre || "",
      apellido_p: residente.apellido_p || "",
      apellido_m: residente.apellido_m || "",
      celular: residente.celular || "",
      activo: residente.activo,
      id_depa: residente.per_deps?.[0]?.id_depa || ""
    });
    setMostrarModal(true);
  };

  const manejarGuardar = (e) => {
    e.preventDefault();
    const esEdicion = !!editandoId;
    const url = esEdicion 
      ? `http://127.0.0.1:8000/api/residentes/${editandoId}` 
      : "http://127.0.0.1:8000/api/residentes";
    
    fetch(url, {
      method: esEdicion ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    .then(res => { if (!res.ok) throw new Error("Error en la operación"); return res.json(); })
    .then(() => {
      setMostrarModal(false);
      cargarDatos();
    })
    .catch(err => alert(err.message));
  };

  const eliminarResidente = (id) => {
    if (!window.confirm("¿Estás seguro?")) return;
    fetch(`http://127.0.0.1:8000/api/residentes/${id}`, { method: "DELETE" })
      .then(() => {
        setResidentes(prev => prev.filter(r => r.id !== id));
      });
  };

  return (
    <div className="main-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Residentes</h2>
          <p className="section-subtitle">Gestión de Nombres y Asignación de Departamentos</p>
        </div>
      </div>

      <div className="residentes-card">
        <div className="table-controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar residente..." 
              className="top-search-bar" 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)} 
            />
          </div>
          <button className="btn-add-primary" onClick={abrirModalNuevo}>+ Agregar Residente</button>
        </div>

        <table className="residentes-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Apartamento</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {residentes
              .filter(r => `${r.nombre} ${r.apellido_p}`.toLowerCase().includes(busqueda.toLowerCase()))
              .map((res) => (
                <tr key={res.id}>
                  <td className="text-dark">
                    <strong>{res.nombre} {res.apellido_p}</strong>
                    <div style={{fontSize: '11px', color: '#94a3b8'}}>{res.apellido_m}</div>
                  </td>
                  <td className="apt-cell">{res.per_deps?.[0]?.departamento?.depa || "S/N"}</td>
                  <td>{res.celular}</td>
                  <td>
                    <span className={res.activo ? "badge-activo" : "badge-inactivo"}>
                      {res.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => iniciarEdicion(res)}>Editar</button>
                    <button className="btn-delete" onClick={() => eliminarResidente(res.id)}>Eliminar</button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editandoId ? "Editar Residente" : "Nuevo Registro"}</h3>
              <button className="close-x" onClick={() => setMostrarModal(false)}>×</button>
            </div>
            
            <form onSubmit={manejarGuardar}>
              <div className="form-grid-upper">
                <div className="form-group">
                  <label>Nombre(s)</label>
                  <input 
                    className="modal-input" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Departamento</label>
                  <select 
                    className="modal-input" 
                    value={formData.id_depa} 
                    onChange={(e) => setFormData({...formData, id_depa: e.target.value})} 
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {listaDepartamentos.map(dep => <option key={dep.id} value={dep.id}>{dep.depa}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-grid-lower">
                <div className="form-group">
                  <label>Apellido Paterno</label>
                  <input 
                    className="modal-input" 
                    value={formData.apellido_p} 
                    onChange={(e) => setFormData({...formData, apellido_p: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Apellido Materno</label>
                  <input 
                    className="modal-input" 
                    value={formData.apellido_m} 
                    onChange={(e) => setFormData({...formData, apellido_m: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Celular</label>
                  <input 
                    className="modal-input" 
                    value={formData.celular} 
                    onChange={(e) => setFormData({...formData, celular: e.target.value})} 
                  />
                </div>
              </div>

              {editandoId && (
                <div className="form-group" style={{marginBottom: '25px'}}>
                  <label>Estado del Residente</label>
                  <select 
                    className="modal-input" 
                    value={formData.activo} 
                    onChange={(e) => setFormData({...formData, activo: e.target.value === 'true'})}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              )}

              <div className="modal-actions-centered">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}