import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerRegistros } from '../utils/api';
import { format, parseISO } from 'date-fns';
import { FaSearch, FaCalendarAlt, FaFilter, FaPlus } from 'react-icons/fa';
import '../styles/CitasPage.css';

const CitasPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registros, setRegistros] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [fechaInicio, fechaFin]);

  const items = useMemo(() => {
    const list = [];
    for (const r of registros) {
      const citas = r?.modulos?.citas || [];
      for (const c of citas) {
        if (!c) continue;
        
        list.push({
          _id: c._id || `${r._id}-${c.medico_especialidad || 'med'}-${c.motivo || 'mot'}-${c.fecha_cita || 'na'}`,
          registroId: r._id,
          fecha_registro: r.fecha_registro,
          fecha_cita: c.fecha_cita || null,
          hora_cita: c.hora_cita || '',
          medico_especialidad: c.medico_especialidad || '',
          motivo: c.motivo || '',
          direccion: c.direccion || '',
          recordatorio_activo: !!c.recordatorio_activo,
        });
      }
    }
    
    // Filtrar por término de búsqueda
    let filtered = [...list];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.medico_especialidad && item.medico_especialidad.toLowerCase().includes(term)) ||
        (item.motivo && item.motivo.toLowerCase().includes(term)) ||
        (item.direccion && item.direccion.toLowerCase().includes(term))
      );
    }
    
    // Ordenar por fecha de cita (más reciente primero)
    return filtered.sort((a, b) => {
      const ad = a.fecha_cita ? new Date(a.fecha_cita).getTime() : 0;
      const bd = b.fecha_cita ? new Date(b.fecha_cita).getTime() : 0;
      return bd - ad;
    });
  }, [registros, searchTerm]);

  const renderFecha = (isoOrDate) => {
    if (!isoOrDate) return '-';
    try {
      const d = typeof isoOrDate === 'string' ? parseISO(isoOrDate) : new Date(isoOrDate);
      return format(d, 'dd/MM/yyyy');
    } catch {
      return '-';
    }
  };

  return (
    <div className="citas-page">
      {/* Navbar */}
      <nav className="citas-nav">
        <div className="citas-nav-content">
          <h1 className="citas-title">Citas Médicas</h1>
          <div className="citas-nav-buttons">
            <button onClick={() => navigate('/dashboard')} className="medicacion-nav-button">← Dashboard</button>
            <button onClick={() => navigate('/calendar')} className="medicacion-nav-button">📅 Calendario</button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="citas-main">
        {/* Filtros */}
        <div className="citas-filters">
          <div className="citas-filters-grid">
            <div>
              <label className="citas-label">Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="citas-input"
              />
            </div>
            <div>
              <label className="citas-label">Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="citas-input"
              />
            </div>
            <div>
              <label className="citas-label">Buscar</label>
              <div className="citas-search-container">
                <div className="citas-search-icon">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  className="citas-search-input"
                  placeholder="Buscar por médico o motivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de citas */}
        <div className="citas-list-container">
          {loading ? (
            <div className="citas-message">Cargando citas...</div>
          ) : error ? (
            <div className="citas-message" style={{ color: '#c53030' }}>{error}</div>
          ) : items.length === 0 ? (
            <div className="citas-message">No se encontraron citas</div>
          ) : (
            <ul className="citas-list">
              {items.map((cita) => (
                <li key={cita._id} className="citas-list-item">
                  <div className="citas-item-header">
                    <p className="citas-item-title">
                      {cita.medico_especialidad || 'Cita sin título'}
                    </p>
                    {cita.recordatorio_activo && (
                      <p className="citas-reminder-badge">
                        Recordatorio activo
                      </p>
                    )}
                  </div>
                  <div className="citas-item-details">
                    <p className="citas-item-info">
                      <FaCalendarAlt className="citas-item-icon" />
                      {cita.fecha_cita ? (
                        <>
                          {renderFecha(cita.fecha_cita)}
                          {cita.hora_cita && ` • ${cita.hora_cita}`}
                        </>
                      ) : 'Sin fecha definida'}
                    </p>
                  </div>
                  {cita.motivo && (
                    <div className="citas-item-details">
                      <p className="citas-item-info">{cita.motivo}</p>
                    </div>
                  )}
                  {cita.direccion && (
                    <div className="citas-item-details">
                      <p className="citas-item-info">{cita.direccion}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default CitasPage;