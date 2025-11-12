import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerRegistros } from '../utils/api';
import { format } from 'date-fns';
import { formatDateFromServer } from '../utils/dateUtils';
import '../styles/MedicacionPage.css';

const MedicacionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registros, setRegistros] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerRegistros(fechaInicio || undefined, fechaFin || undefined);
      setRegistros(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar los registros');
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const items = useMemo(() => {
    const list = [];
    for (const r of registros) {
      const meds = r?.modulos?.medicacion || [];
      for (const m of meds) {
        if (!m) continue;
        list.push({
          id: `${r._id}-${m.medicamento_id}-${m.hora_registro || 'na'}`,
          fecha_registro: r.fecha_registro,
          medicamento: m.medicamento_id || '(sin nombre)',
          dosis_tomada: !!m.dosis_tomada,
          hora: m.hora_registro || null,
        });
      }
    }
    // sort by fecha_registro desc then hora
    return list.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
  }, [registros]);

  const renderHora = (isoOrTime) => {
    if (!isoOrTime) return '-';
    try {
      // if ISO
      if (/T\d{2}:\d{2}/.test(isoOrTime)) {
        const d = new Date(isoOrTime);
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mm = String(d.getUTCMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
      }
      // fallback when stored as "HH:mm" (shouldn't happen after our normalization)
      return isoOrTime;
    } catch {
      return '-';
    }
  };

  return (
    <div className="medicacion-page">
      <nav className="medicacion-nav">
        <div className="medicacion-nav-content">
          <h2 className="medicacion-title">💊 Medicación</h2>
          <div className="medicacion-nav-buttons">
            <button onClick={() => navigate('/dashboard')} className="medicacion-nav-button">← Dashboard</button>
            <button onClick={() => navigate('/calendar')} className="medicacion-nav-button">📅 Calendario</button>
          </div>
        </div>
      </nav>

      <main className="medicacion-main">
        <div className="medicacion-filters">
          <div className="medicacion-filter-group">
            <label className="medicacion-label">Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="medicacion-input" />
          </div>
          <div className="medicacion-filter-group">
            <label className="medicacion-label">Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="medicacion-input" />
          </div>
          <button onClick={fetchData} disabled={loading} className="medicacion-filter-button">
            {loading ? 'Cargando...' : 'Aplicar filtros'}
          </button>
        </div>

        {error && <div className="medicacion-message" style={{ color: '#c53030' }}>{error}</div>}

        <div>
          {loading ? (
            <div className="medicacion-message">Cargando...</div>
          ) : items.length === 0 && !error ? (
            <div className="medicacion-message">No hay registros de medicación en el rango seleccionado.</div>
          ) : (
            <div className="medicacion-list">
              {items.map((it) => (
                <div key={it.id} className="medicacion-item">
                  <div className="medicacion-item-header">
                    <span><strong>Fecha:</strong> {formatDateFromServer(it.fecha_registro)}</span>
                    <span><strong>Hora:</strong> {renderHora(it.hora)}</span>
                  </div>
                  <div className="medicacion-item-detail">
                    <strong>Medicamento:</strong> {it.medicamento}
                  </div>
                  <div className="medicacion-item-detail">
                    <strong>Dosis tomada:</strong> {it.dosis_tomada ? 'Sí' : 'No'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicacionPage;
