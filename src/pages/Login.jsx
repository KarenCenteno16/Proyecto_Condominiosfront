import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/login.css";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === '1') {
      Swal.fire({
        icon: 'success',
        title: '¡Correo Verificado!',
        text: 'Tu cuenta ha sido activada. Ya puedes iniciar sesión.',
        confirmButtonColor: '#3085d6'
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email: email,
        pass: password
      });

      if (res.data.res) {
        const { usuario, token } = res.data;
        
        localStorage.setItem("token", token);
        localStorage.setItem("userId", usuario.id_persona);

        // Lógica de rol
        const esAdminReal = 
          usuario.admin === true || 
          usuario.admin === 1 || 
          String(usuario.admin) === "1" || 
          String(usuario.admin).toLowerCase() === "true";

        const rolTexto = esAdminReal ? "admin" : "residente";
        localStorage.setItem("rol", rolTexto);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        if (onLoginSuccess) onLoginSuccess();

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada como ${rolTexto}`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) {
      // --- CAPTURA DE ERRORES MEJORADA ---
      let mensajeError = "Ocurrió un error inesperado";

      if (err.response) {
        // Errores de validación (campos vacíos, formato mal hecho)
        if (err.response.status === 422) {
          const errores = err.response.data.errors;
          mensajeError = Object.values(errores)[0][0]; // Toma el primer error de la lista
        } 
        // Errores de credenciales (401) o Verificación (403)
        else if (err.response.data && err.response.data.mensaje) {
          mensajeError = err.response.data.mensaje;
        }
      } else {
        mensajeError = "No se pudo conectar con el servidor";
      }

      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: mensajeError,
        confirmButtonColor: "#3085d6"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper animate__animated animate__fadeIn">
      <div className="login-card">
        <div className="logo">🏢</div> 
        <h2>Sistema Condominio</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass">Contraseña</label>
            <input 
              type="password" 
              id="pass" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes una cuenta registrada?</p>
          <Link to="/register" className="link-register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}