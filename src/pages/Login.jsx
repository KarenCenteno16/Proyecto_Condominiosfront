import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [idPersona, setIdPersona] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        id_persona: idPersona,
        pass: password
      });

      if (res.data.res) {
        const user = res.data.usuario;
        
        localStorage.setItem("userId", user.id_persona);
        
        const rolTexto = (user.admin === true || user.admin === 1 || user.admin === "1") 
          ? "admin" 
          : "residente";
        
        localStorage.setItem("rol", rolTexto);

        if (rolTexto === "admin") {
          navigate("/home"); 
        } else {
          navigate("/inicio-usuario"); 
        }
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo">🏢</div> 
        
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ color: "#dc2626", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="id_persona">ID Persona</label>
            <input 
              type="text" 
              id="id_persona" 
              name="id_persona"
              placeholder="Ej: 1" 
              value={idPersona}
              onChange={(e) => setIdPersona(e.target.value)}
              required 
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass">Contraseña</label>
            <input 
              type="password" 
              id="pass" 
              name="password"
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}