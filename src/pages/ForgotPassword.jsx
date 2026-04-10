import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Código y Password
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({ code: "", password: "", password_confirmation: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/forgot-password", { email });
      if (res.data.res) {
        Swal.fire("Enviado", res.data.mensaje, "success");
        setStep(2);
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.mensaje || "Error al enviar", "error");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/reset-password", { email, ...formData });
      if (res.data.res) {
        Swal.fire("Éxito", "Contraseña actualizada", "success");
        navigate("/");
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.mensaje || "Datos inválidos", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>{step === 1 ? "Recuperar Contraseña" : "Ingresar Código"}</h2>
        
        {step === 1 ? (
          <form onSubmit={handleSendCode}>
            <input type="email" placeholder="Tu correo" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control mb-3" />
            <button type="submit" className="btn-login" disabled={loading}>Enviar Código</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input type="text" placeholder="Código de 6 dígitos" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} required className="form-control mb-2" />
            <input type="password" placeholder="Nueva Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="form-control mb-2" />
            <input type="password" placeholder="Confirmar Contraseña" value={formData.password_confirmation} onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} required className="form-control mb-3" />
            <button type="submit" className="btn-login" disabled={loading}>Cambiar Contraseña</button>
          </form>
        )}
        <Link to="/" className="d-block mt-3 text-center">Volver al Login</Link>
      </div>
    </div>
  );
}