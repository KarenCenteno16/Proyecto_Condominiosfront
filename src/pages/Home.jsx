import { useEffect, useState } from "react";
import "../styles/home.css";

export default function Home() {
  const [stats, setStats] = useState({
    visitantes_hoy: 0,
    pagos_pendientes: 0,
    total_residentes: 0,
    pagos_mes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard-stats")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener estadísticas");
        return res.json();
      })
      .then((data) => {
        setStats({
          visitantes_hoy: data.visitantes_hoy || 0,
          pagos_pendientes: data.pagos_pendientes || 0,
          total_residentes: data.total_residentes || 0,
          pagos_mes: data.pagos_mes || 0
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar estadísticas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">Cargando panel...</div>;

  return (
    <div className="home-content">
      <h2 className="section-title">Panel principal</h2>

      <div className="cards-grid">
        <div className="card">
          <div className="card-header">
            <h3>Visitantes Hoy</h3>
            <div className="icon-box purple">👥</div>
          </div>
          <div className="card-value">{stats.visitantes_hoy}</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Pagos Pendientes</h3>
            <div className="icon-box orange">!</div>
          </div>
          <div className="card-value">{stats.pagos_pendientes}</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Total Residentes</h3>
            <div className="icon-box blue">👤</div>
          </div>
          <div className="card-value">{stats.total_residentes}</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Pagos del Mes</h3>
            <div className="icon-box green">$</div>
          </div>
          <div className="card-value">
            ${new Intl.NumberFormat("es-MX").format(stats.pagos_mes)}
          </div>
        </div>
      </div>
    </div>
  );
}