import "../styles/pagos.css";

export default function Pagos() {
  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Control de Mensualidades</h2>
        <p className="section-subtitle">Gestión de ingresos y estados de cuenta por departamento</p>
      </div>

      <div className="pagos-stats-container">
        <div className="stat-card">
          <span className="stat-label">Total Recaudado (Mes)</span>
          <span className="stat-amount success">$45,230.00</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pendiente de Cobro</span>
          <span className="stat-amount warning">$12,400.00</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Departamentos en Mora</span>
          <span className="stat-amount danger">8</span>
        </div>
      </div>

      <div className="residentes-card">
        <div className="table-controls">
          <div className="residentes-search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar pago por nombre o departamento..."
              className="residentes-search"
            />
          </div>
          <button className="btn-add-pago">+ Registrar Pago</button>
        </div>

        <table className="residentes-table">
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Departamento</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#PAY-9901</td>
              <td>101</td>
              <td>Mantenimiento Febrero</td>
              <td className="monto">$2,500.00</td>
              <td>15/02/2026</td>
              <td><span className="badge-activo">Completado</span></td>
              <td className="actions">
                <button className="btn-action btn-view">Ver</button>
                <button className="btn-action btn-download">PDF</button>
              </td>
            </tr>
            <tr>
              <td>#PAY-9902</td>
              <td>204</td>
              <td>Multa por Ruidos</td>
              <td className="monto">$500.00</td>
              <td>14/02/2026</td>
              <td><span className="badge-pendiente">Pendiente</span></td>
              <td className="actions">
                <button className="btn-action btn-edit">Editar</button>
                <button className="btn-action btn-delete">Eliminar</button>
              </td>
            </tr>
            <tr>
              <td>#PAY-9903</td>
              <td>302</td>
              <td>Mantenimiento Febrero</td>
              <td className="monto">$2,500.00</td>
              <td>10/02/2026</td>
              <td><span className="badge-activo">Completado</span></td>
              <td className="actions">
                <button className="btn-action btn-view">Ver</button>
                <button className="btn-action btn-download">PDF</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}