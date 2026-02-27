import "../styles/asambleas.css";

export default function Asambleas() {
  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Asambleas y Votaciones</h2>
        <p className="section-subtitle">Toma de decisiones comunitaria y encuestas activas</p>
      </div>

      <div className="asambleas-grid">
        <div className="encuesta-card active">
          <div className="encuesta-badge">Activa</div>
          <h3>Remodelación de Fachada</h3>
          <p>Se propone el cambio de color a Gris Oxford en las torres A y B.</p>
          
          <div className="stats-votacion">
            <div className="stat-row">
              <span>A favor (60%)</span>
              <div className="progress-bar"><div className="progress-fill green" style={{width: '60%'}}></div></div>
            </div>
            <div className="stat-row">
              <span>En contra (30%)</span>
              <div className="progress-bar"><div className="progress-fill red" style={{width: '30%'}}></div></div>
            </div>
          </div>
          
          <div className="encuesta-footer">
            <span>Participación: 75/124 Deptos</span>
            <button className="btn-action btn-view">Cerrar Votación</button>
          </div>
        </div>

        <div className="encuesta-card add-new">
          <div className="add-icon">+</div>
          <h3>Nueva Encuesta</h3>
          <p>Crea una nueva votación para los residentes</p>
        </div>
      </div>
    </>
  );
}



