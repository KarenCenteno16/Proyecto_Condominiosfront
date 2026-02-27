import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo">🏢</div>

        <h2>Sistema de condominios</h2>

        <div className="form-group">
          <label>Correo</label>
          <input type="email" placeholder="correo@gmail.com" />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" placeholder="Contraseña" />
        </div>

        <button className="btn-login">
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}