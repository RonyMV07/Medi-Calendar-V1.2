import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { crearRegistro, obtenerRegistroPorFecha, obtenerRegistros, actualizarRegistro, eliminarRegistro } from '../utils/api';
import { format } from 'date-fns';
import { formatDateFromServer } from '../utils/dateUtils';
import '../styles/CalendarPage.css';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registros, setRegistros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActualId, setRegistroActualId] = useState(null);
  const [registroExistente, setRegistroExistente] = useState(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    cardiovascular: { presion_sistolica: '', presion_diastolica: '', frecuencia_cardiaca: '' },
    sueno: { 
      duracion_horas: '', 
      calidad_percibida: '', 
      notas_sueno: '',
      usa_medicacion: false,
      medicamento_sueno: '',
      hora_medicamento_sueno: ''
    },
    ejercicios: { tipo_actividad: '', duracion_min: '', esfuerzo_percibido: '' },
    peso: { peso_kg: '', altura_m: '1.70', objetivo_peso: '' },
    // Nuevos módulos
    medicacion: [
      { medicamento_id: '', dosis_tomada: false, hora_registro: '' }
    ],
    citas: [
      { fecha_cita: '', medico_especialidad: '', motivo: '', recordatorio_activo: false }
    ],
    estado_emocional_dia: ''
  });
  
  // Estado para IMC calculado
  const [imcCalculado, setImcCalculado] = useState(null);

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      const data = await obtenerRegistros();
      setRegistros(data);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  };

  const loadRegistroForDate = useCallback(async (date) => {
    try {
      const fechaStr = format(date, 'yyyy-MM-dd');
      const registro = await obtenerRegistroPorFecha(fechaStr);
      if (registro && registro.modulos) {
        // Normalizar campos para inputs (HH:mm y yyyy-MM-dd)
        const mod = registro.modulos || {};
        const medicacion = (mod.medicacion || []).map(m => {
          if (!m?.hora_registro) return { ...m, hora_registro: '' };
          const d = new Date(m.hora_registro);
          const hh = String(d.getUTCHours()).padStart(2, '0');
          const mm = String(d.getUTCMinutes()).padStart(2, '0');
          return { ...m, hora_registro: `${hh}:${mm}` };
        });
        const citas = (mod.citas || []).map(c => ({
          ...c,
          fecha_cita: c?.fecha_cita ? format(new Date(c.fecha_cita), 'yyyy-MM-dd') : ''
        }));
        setFormData({
          cardiovascular: mod.cardiovascular || { presion_sistolica: '', presion_diastolica: '', frecuencia_cardiaca: '' },
          sueno: mod.sueno || { duracion_horas: '', calidad_percibida: '', notas_sueno: '', usa_medicacion: false, medicamento_sueno: '', hora_medicamento_sueno: '' },
          ejercicios: mod.ejercicios || { tipo_actividad: '', duracion_min: '', esfuerzo_percibido: '' },
          peso: mod.peso || { peso_kg: '', altura_m: '1.70', objetivo_peso: '' },
          medicacion,
          citas,
          estado_emocional_dia: mod.estado_emocional_dia || ''
        });
        setRegistroActualId(registro._id);
        setRegistroExistente(registro);
        setModoEdicion(false);
      } else {
        resetForm();
        setRegistroActualId(null);
        setRegistroExistente(null);
        setModoEdicion(false);
      }
    } catch (error) {
      resetForm();
      setRegistroActualId(null);
      setRegistroExistente(null);
      setModoEdicion(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadRegistroForDate(selectedDate);
    }
  }, [selectedDate, loadRegistroForDate]);

  const resetForm = useCallback(() => {
    setFormData({
      cardiovascular: { presion_sistolica: '', presion_diastolica: '', frecuencia_cardiaca: '' },
      sueno: { 
        duracion_horas: '', 
        calidad_percibida: '', 
        notas_sueno: '',
        usa_medicacion: false,
        medicamento_sueno: '',
        hora_medicamento_sueno: ''
      },
      ejercicios: { tipo_actividad: '', duracion_min: '', esfuerzo_percibido: '' },
      peso: { peso_kg: '', altura_m: '1.70', objetivo_peso: '' },
      medicacion: [
        { medicamento_id: '', dosis_tomada: false, hora_registro: '' }
      ],
      citas: [
        { fecha_cita: '', medico_especialidad: '', motivo: '', recordatorio_activo: false }
      ],
      estado_emocional_dia: ''
    });
    setImcCalculado(null);
  }, []);

  const handleInputChange = (modulo, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [modulo]: {
        ...prev[modulo],
        [campo]: valor
      }
    }));
  };
  
  // Calcular IMC en tiempo real
  useEffect(() => {
    const peso = parseFloat(formData.peso.peso_kg);
    const altura = parseFloat(formData.peso.altura_m);
    
    if (peso > 0 && altura > 0) {
      const imc = (peso / (altura * altura)).toFixed(2);
      setImcCalculado(parseFloat(imc));
    } else {
      setImcCalculado(null);
    }
  }, [formData.peso.peso_kg, formData.peso.altura_m]);
  
  // Función para obtener categoría de IMC
  const getCategoriaIMC = (imc) => {
    if (!imc) return null;
    if (imc < 18.5) return { texto: 'Bajo peso', color: '#fbbf24', emoji: '⚠️' };
    if (imc < 25) return { texto: 'Normal', color: '#10b981', emoji: '✅' };
    if (imc < 30) return { texto: 'Sobrepeso', color: '#f59e0b', emoji: '⚠️' };
    return { texto: 'Obesidad', color: '#ef4444', emoji: '🚨' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Preparar datos para enviar
      const fechaStr = format(selectedDate, 'yyyy-MM-dd');
      const toIsoAtDate = (hhmm) => {
        if (!hhmm) return undefined;
        // construir ISO en UTC para evitar desfases
        return `${fechaStr}T${hhmm}:00.000Z`;
      };

      // Normalizar arrays filtrando filas vacías
      const medicacionNormalizada = (formData.medicacion || [])
        .filter(m => m && (m.medicamento_id || m.hora_registro || m.dosis_tomada))
        .map(m => ({
          medicamento_id: m.medicamento_id || '',
          dosis_tomada: !!m.dosis_tomada,
          hora_registro: toIsoAtDate(m.hora_registro)
        }));

      const citasNormalizadas = (formData.citas || [])
        .filter(c => c && (c.fecha_cita || c.medico_especialidad || c.motivo))
        .map(c => ({
          fecha_cita: c.fecha_cita ? `${c.fecha_cita}T12:00:00.000Z` : undefined,
          medico_especialidad: c.medico_especialidad || '',
          motivo: c.motivo || '',
          recordatorio_activo: !!c.recordatorio_activo
        }));

      const datosAEnviar = {
        ...formData,
        sueno: {
          ...formData.sueno,
          // Si no se usa medicación, eliminar los campos del bloque de sueño
          ...(!formData.sueno.usa_medicacion && {
            medicamento_sueno: undefined,
            hora_medicamento_sueno: undefined
          })
        },
        medicacion: medicacionNormalizada,
        citas: citasNormalizadas
      };

      if (modoEdicion && registroActualId) {
        // Actualizar registro existente
        await actualizarRegistro(registroActualId, datosAEnviar);
        setMessage('✅ Registro actualizado exitosamente');
      } else {
        // Crear nuevo registro
        await crearRegistro(fechaStr, datosAEnviar);
        setMessage('✅ Registro guardado exitosamente');
      }
      setShowForm(false);
      setModoEdicion(false);
      fetchRegistros();
      loadRegistroForDate(selectedDate);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al guardar el registro');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = () => {
    setModoEdicion(true);
    setShowForm(true);
  };

  const handleEliminar = async () => {
    if (!registroActualId) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
      setLoading(true);
      try {
        await eliminarRegistro(registroActualId);
        setMessage('✅ Registro eliminado exitosamente');
        resetForm();
        setRegistroActualId(null);
        setRegistroExistente(null);
        fetchRegistros();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error al eliminar el registro');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    setShowForm(false);
    if (registroExistente) {
      setFormData(registroExistente.modulos);
    }
  };

  const tileClassName = ({ date }) => {
    const fechaStr = format(date, 'yyyy-MM-dd');
    const tieneRegistro = registros.some(r => {
      // Usar utilidad para normalizar fecha del servidor
      const fechaRegistroStr = formatDateFromServer(r.fecha_registro);
      return fechaRegistroStr === fechaStr;
    });
    return tieneRegistro ? 'has-registro' : null;
  };

  return (
    <div className="calendar-page">
      <nav className="navbar">
        <h2>🏥 MediCalendar</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Volver al Dashboard
          </button>
          <button onClick={() => navigate('/medicacion')} className="btn-back">
            💊 Medicación
          </button>
          <button onClick={() => navigate('/citas')} className="btn-back">
            🗓️ Citas
          </button>
        </div>
      </nav>

      <div className="calendar-content">
        <h1>📅 Calendario de Registros</h1>
        
        {message && <div className="message">{message}</div>}

        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            locale="es-ES"
          />
        </div>

        <div className="selected-date">
          <h3>Fecha seleccionada: {format(selectedDate, 'dd/MM/yyyy')}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {registroExistente && !showForm && (
              <>
                <button 
                  className="btn-edit" 
                  onClick={handleEditar}
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✏️ Editar Registro
                </button>
                <button 
                  className="btn-delete" 
                  onClick={handleEliminar}
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#ef4444', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🗑️ Eliminar Registro
                </button>
              </>
            )}
            {!registroExistente && (
              <button 
                className="btn-register" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cerrar Formulario' : '+ Registrar Datos'}
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>❤️ Cardiovascular</h3>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Presión Sistólica"
                  value={formData.cardiovascular.presion_sistolica}
                  onChange={(e) => handleInputChange('cardiovascular', 'presion_sistolica', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Presión Diastólica"
                  value={formData.cardiovascular.presion_diastolica}
                  onChange={(e) => handleInputChange('cardiovascular', 'presion_diastolica', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Frecuencia Cardíaca"
                  value={formData.cardiovascular.frecuencia_cardiaca}
                  onChange={(e) => handleInputChange('cardiovascular', 'frecuencia_cardiaca', e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>😴 Sueño</h3>
              <div className="form-row">
                <input
                  type="number"
                  step="0.5"
                  placeholder="Horas de sueño"
                  value={formData.sueno.duracion_horas}
                  onChange={(e) => handleInputChange('sueno', 'duracion_horas', e.target.value)}
                />
                <select
                  value={formData.sueno.calidad_percibida}
                  onChange={(e) => handleInputChange('sueno', 'calidad_percibida', e.target.value)}
                >
                  <option value="">Calidad (1-5)</option>
                  <option value="1">1 - Muy mala</option>
                  <option value="2">2 - Mala</option>
                  <option value="3">3 - Regular</option>
                  <option value="4">4 - Buena</option>
                  <option value="5">5 - Excelente</option>
                </select>
              </div>
              <textarea
                placeholder="Notas sobre el sueño"
                value={formData.sueno.notas_sueno}
                onChange={(e) => handleInputChange('sueno', 'notas_sueno', e.target.value)}
              />
              
              {/* Toggle para medicación de sueño */}
              <div className="medication-toggle" style={{ marginTop: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.sueno.usa_medicacion}
                    onChange={(e) => handleInputChange('sueno', 'usa_medicacion', e.target.checked)}
                    style={{ marginRight: '10px', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'bold' }}>💊 ¿Usó medicación para dormir?</span>
                </label>
              </div>
              
              {/* Campos condicionales de medicación */}
              {formData.sueno.usa_medicacion && (
                <div className="medication-fields" style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '8px',
                  border: '2px solid #fbbf24'
                }}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Nombre del medicamento *"
                      value={formData.sueno.medicamento_sueno}
                      onChange={(e) => handleInputChange('sueno', 'medicamento_sueno', e.target.value)}
                      required={formData.sueno.usa_medicacion}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="time"
                      placeholder="Hora de administración"
                      value={formData.sueno.hora_medicamento_sueno}
                      onChange={(e) => handleInputChange('sueno', 'hora_medicamento_sueno', e.target.value)}
                      required={formData.sueno.usa_medicacion}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <small style={{ color: '#92400e', display: 'block', marginTop: '8px' }}>
                    * Campos requeridos cuando se usa medicación
                  </small>
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>🏃 Ejercicio</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Tipo de actividad"
                  value={formData.ejercicios.tipo_actividad}
                  onChange={(e) => handleInputChange('ejercicios', 'tipo_actividad', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Duración (min)"
                  value={formData.ejercicios.duracion_min}
                  onChange={(e) => handleInputChange('ejercicios', 'duracion_min', e.target.value)}
                />
                <select
                  value={formData.ejercicios.esfuerzo_percibido}
                  onChange={(e) => handleInputChange('ejercicios', 'esfuerzo_percibido', e.target.value)}
                >
                  <option value="">Esfuerzo (1-10)</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>⚖️ Peso</h3>
              <div className="form-row">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Peso (kg)"
                  value={formData.peso.peso_kg}
                  onChange={(e) => handleInputChange('peso', 'peso_kg', e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="2.5"
                  placeholder="Altura (m)"
                  value={formData.peso.altura_m}
                  onChange={(e) => handleInputChange('peso', 'altura_m', e.target.value)}
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Objetivo de peso (kg)"
                  value={formData.peso.objetivo_peso}
                  onChange={(e) => handleInputChange('peso', 'objetivo_peso', e.target.value)}
                />
              </div>
              {imcCalculado && (
                <div className="imc-display" style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  backgroundColor: '#f0f9ff',
                  border: `2px solid ${getCategoriaIMC(imcCalculado).color}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong>IMC Calculado:</strong> {imcCalculado}
                    </div>
                    <div style={{ 
                      color: getCategoriaIMC(imcCalculado).color, 
                      fontWeight: 'bold',
                      fontSize: '1.1em'
                    }}>
                      {getCategoriaIMC(imcCalculado).emoji} {getCategoriaIMC(imcCalculado).texto}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>😊 Estado Emocional</h3>
              <input
                type="text"
                placeholder="¿Cómo te sientes hoy?"
                value={formData.estado_emocional_dia}
                onChange={(e) => setFormData({...formData, estado_emocional_dia: e.target.value})}
              />
            </div>

            {/* Medicación general */}
            <div className="form-section">
              <h3>💊 Medicación</h3>
              {(formData.medicacion || []).map((m, idx) => (
                <div key={idx} className="form-row" style={{ alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="Medicamento"
                    value={m.medicamento_id}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        medicacion: prev.medicacion.map((it, i) => i === idx ? { ...it, medicamento_id: val } : it)
                      }));
                    }}
                    style={{ flex: 2 }}
                  />
                  <input
                    type="time"
                    placeholder="Hora"
                    value={m.hora_registro}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        medicacion: prev.medicacion.map((it, i) => i === idx ? { ...it, hora_registro: val } : it)
                      }));
                    }}
                    style={{ flex: 1 }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={!!m.dosis_tomada}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          medicacion: prev.medicacion.map((it, i) => i === idx ? { ...it, dosis_tomada: val } : it)
                        }));
                      }}
                    />
                    <span>Dosis tomada</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      medicacion: prev.medicacion.filter((_, i) => i !== idx)
                    }))}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px' }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  medicacion: [...(prev.medicacion || []), { medicamento_id: '', dosis_tomada: false, hora_registro: '' }]
                }))}
                style={{ marginTop: 8 }}
              >
                + Agregar medicamento
              </button>
            </div>

            {/* Citas médicas */}
            <div className="form-section">
              <h3>🗓️ Citas médicas</h3>
              {(formData.citas || []).map((c, idx) => (
                <div key={idx} className="form-row" style={{ alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <input
                    type="date"
                    placeholder="Fecha de la cita"
                    value={c.fecha_cita}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        citas: prev.citas.map((it, i) => i === idx ? { ...it, fecha_cita: val } : it)
                      }));
                    }}
                    style={{ flex: 1, minWidth: 180 }}
                  />
                  <input
                    type="text"
                    placeholder="Médico/Especialidad"
                    value={c.medico_especialidad}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        citas: prev.citas.map((it, i) => i === idx ? { ...it, medico_especialidad: val } : it)
                      }));
                    }}
                    style={{ flex: 2, minWidth: 200 }}
                  />
                  <input
                    type="text"
                    placeholder="Motivo"
                    value={c.motivo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        citas: prev.citas.map((it, i) => i === idx ? { ...it, motivo: val } : it)
                      }));
                    }}
                    style={{ flex: 3, minWidth: 220 }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={!!c.recordatorio_activo}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          citas: prev.citas.map((it, i) => i === idx ? { ...it, recordatorio_activo: val } : it)
                        }));
                      }}
                    />
                    <span>Recordatorio</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      citas: prev.citas.filter((_, i) => i !== idx)
                    }))}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px' }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  citas: [...(prev.citas || []), { fecha_cita: '', medico_especialidad: '', motivo: '', recordatorio_activo: false }]
                }))}
                style={{ marginTop: 8 }}
              >
                + Agregar cita
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Guardando...' : modoEdicion ? '✔️ Actualizar Registro' : '💾 Guardar Registro'}
              </button>
              {modoEdicion && (
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={handleCancelarEdicion}
                  style={{ 
                    backgroundColor: '#6b7280', 
                    color: 'white', 
                    padding: '15px 30px', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1em'
                  }}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
