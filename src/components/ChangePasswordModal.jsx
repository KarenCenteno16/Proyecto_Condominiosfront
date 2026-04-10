import { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { X, Lock, ShieldAlert } from "lucide-react";
import "../Styles/ChangePasswordModal.css";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    current_pass: "",
    new_pass: "",
    new_pass_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_pass !== formData.new_pass_confirmation) {
      return Swal.fire({
        icon: "warning",
        title: "atención",
        text: "la nueva contraseña y la confirmación no coinciden.",
        target: '#modal-root-container',
        confirmButtonColor: "#3085d6"
      });
    }

    setLoading(true);

    try {
      const res = await axios.post("/update-password", formData);
      
      if (res.data.res) {
        Swal.fire({
          icon: "success",
          title: "¡logrado!",
          text: res.data.mensaje, // mostrará "contraseña actualizada. sesiones cerradas globalmente."
          target: '#modal-root-container',
          confirmButtonColor: "#3085d6"
        }).then(() => {
          // al limpiar el storage y recargar, app.jsx te mandará al login
          localStorage.clear();
          window.location.href = "/";
        });
      }
    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || "error al procesar la solicitud";
      
      Swal.fire({
        icon: "error",
        title: "no se pudo cambiar",
        text: mensajeError,
        target: '#modal-root-container',
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" id="modal-root-container">
      <div className="modal-content">
        <div className="modal-header">
          <h3><Lock size={20} /> seguridad</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="modal-info">
          <ShieldAlert size={16} />
          <span>se cerrarán todas tus sesiones activas.</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>contraseña actual</label>
            <input 
              type="password" 
              required 
              value={formData.current_pass}
              onChange={(e) => setFormData({...formData, current_pass: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>nueva contraseña</label>
            <input 
              type="password" 
              required 
              value={formData.new_pass}
              onChange={(e) => setFormData({...formData, new_pass: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>confirmar nueva contraseña</label>
            <input 
              type="password" 
              required 
              value={formData.new_pass_confirmation}
              onChange={(e) => setFormData({...formData, new_pass_confirmation: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "verificando..." : "actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}