import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerIndiceBienestar, verificarReflexion } from '../utils/api';
import ReflectionModal from '../components/ReflectionModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bienestar, setBienestar] = useState(null);
  const [reflexion, setReflexion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bienestarData, reflexionData] = await Promise.all([
        obtenerIndiceBienestar(),
        verificarReflexion()
      ]);
      
      setBienestar(bienestarData);
      setReflexion(reflexionData);
      
      if (reflexionData.necesitaReflexion) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2>🏥 MediCalendar</h2>
        <div className="nav-right">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h1>Panel de Bienestar</h1>
        
        <div className="bienestar-card">
          <h2>Índice de Bienestar</h2>
          <div className="bienestar-score">
            <div className="score-circle">
              <span className="score-number">{bienestar?.indice || 0}</span>
              <span className="score-label">/ 100</span>
            </div>
            <p className="score-message">{bienestar?.mensaje}</p>
          </div>
          
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-value">{bienestar?.consistencia || 0}%</span>
              <span className="metric-label">Consistencia</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{bienestar?.adherenciaMedicacion || 0}%</span>
              <span className="metric-label">Adherencia</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{bienestar?.calidadSueno || 0}%</span>
              <span className="metric-label">Calidad de Sueño</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">{bienestar?.totalRegistros || 0}</span>
              <span className="metric-label">Registros (30d)</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-action btn-calendar"
            onClick={() => navigate('/calendar')}
          >
            📅 Ir al Calendario
          </button>
          <button 
            className="btn-action btn-charts"
            onClick={() => navigate('/charts')}
          >
            📊 Ver Evolución
          </button>
          <button 
            className="btn-action btn-notes"
            onClick={() => navigate('/notes')}
            style={{ backgroundColor: '#8b5cf6' }}
          >
            📖 Libro de Notas
          </button>
        </div>

        {reflexion && reflexion.diasSinRegistro > 0 && (
          <div className="info-box">
            <p>Último registro hace {reflexion.diasSinRegistro} día{reflexion.diasSinRegistro > 1 ? 's' : ''}</p>
            <p>{reflexion.mensaje}</p>
          </div>
        )}
      </div>

      {showModal && reflexion?.necesitaReflexion && (
        <ReflectionModal 
          onClose={() => setShowModal(false)}
          diasSinRegistro={reflexion.diasSinRegistro}
        />
      )}
    </div>
  );
};

export default Dashboard;
