import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/register.css"; 

export default function Register() {
    const [form, setForm] = useState({ 
        nombre: "", apellido_p: "", apellido_m: "", 
        celular: "", correo: "", pass: "" 
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        Swal.fire({ title: 'Creando cuenta...', didOpen: () => Swal.showLoading() });

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/register", form);
            if (res.data.res) {
                Swal.fire("¡Listo!", res.data.mensaje, "success").then(() => navigate("/"));
            }
       // En tu Register.jsx, cambia el catch:
        } catch (error) {
            // Esto mostrará el mensaje real que devuelve el try/catch de Laravel
            const mensajeError = error.response?.data?.mensaje || "Error desconocido";
            Swal.fire("Error del Servidor", mensajeError, "error");
            console.log(error.response.data); 
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card animate__fadeIn">
                <div className="logo">🏢</div>
                <h2>Registro de Residente</h2>
                <form onSubmit={handleRegister} className="register-grid">
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" onChange={e => setForm({...form, nombre: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido Paterno</label>
                        <input type="text" onChange={e => setForm({...form, apellido_p: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido Materno</label>
                        <input type="text" onChange={e => setForm({...form, apellido_m: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Celular</label>
                        <input type="number" onChange={e => setForm({...form, celular: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Correo Electrónico (Para verificación)</label>
                        <input type="email" onChange={e => setForm({...form, correo: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Contraseña</label>
                        <input type="password" onChange={e => setForm({...form, pass: e.target.value})} required />
                    </div>

                    <button type="submit" className="btn-register" style={{ gridColumn: "span 2" }}>
                        Registrarse ahora
                    </button>
                </form>
                <div className="register-footer">
                    <span>¿Ya tienes cuenta?</span> <Link to="/" className="link-login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
}