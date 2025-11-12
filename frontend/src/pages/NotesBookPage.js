import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerNotas } from '../utils/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../styles/NotesBookPage.css';

const NotesBookPage = () => {
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotas = async () => {
      setLoading(true);
      try {
        const data = await obtenerNotas();
        setNotas(data);
      } catch (error) {
        console.error('Error al cargar las notas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  return (
    <div className="notes-book-page">
      <nav className="navbar">
        <h2>🏥 MediCalendar</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Volver al Dashboard
        </button>
      </nav>
      <div className="notes-content">
        <h1>📖 Libro de Notas</h1>
        <div className="notes-list">
          {loading ? (
            <div className="loading">Cargando datos...</div>
          ) : notas.length > 0 ? (
            notas.map((item, index) => (
              <div key={index} className="note-item">
                <p className="note-date">
                  {format(new Date(item.fecha), "eeee, d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
                <p className="note-text">{item.nota}</p>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No has registrado ninguna nota de sueño todavía.</p>
              <p>Tus reflexiones aparecerán aquí cuando las añadas en el calendario.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesBookPage;
