import axios from 'axios';

const API_URL = '/api';

// Configurar axios con el token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Configuración global de axios para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido.
      // No redirigir aquí para permitir que las páginas manejen el error localmente (ej. en la página de login).
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Autenticación
export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

// Registros diarios
export const crearRegistro = async (fecha_registro, modulos) => {
  const response = await axios.post(
    `${API_URL}/registros`,
    { fecha_registro, modulos },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const obtenerRegistros = async (fechaInicio, fechaFin) => {
  const params = {};
  if (fechaInicio) params.fechaInicio = fechaInicio;
  if (fechaFin) params.fechaFin = fechaFin;
  
  const response = await axios.get(`${API_URL}/registros`, {
    params,
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerRegistroPorFecha = async (fecha) => {
  const response = await axios.get(`${API_URL}/registros/${fecha}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const actualizarRegistro = async (registroId, modulos) => {
  const response = await axios.put(
    `${API_URL}/registros/${registroId}`,
    { modulos },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const eliminarRegistro = async (registroId) => {
  const response = await axios.delete(`${API_URL}/registros/${registroId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Métricas
export const obtenerEvolucion = async (fechaInicio, fechaFin, tipo) => {
  const params = { tipo };
  if (fechaInicio) params.fechaInicio = fechaInicio;
  if (fechaFin) params.fechaFin = fechaFin;
  
  const response = await axios.get(`${API_URL}/metricas/evolucion`, {
    params,
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerIndiceBienestar = async () => {
  const response = await axios.get(`${API_URL}/metricas/bienestar`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const verificarReflexion = async () => {
  const response = await axios.get(`${API_URL}/metricas/reflexion`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerNotas = async () => {
  const response = await axios.get(`${API_URL}/registros/notas`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Gestión de Citas
export const obtenerCitas = async (fechaInicio, fechaFin, filtros = {}) => {
  const params = { ...filtros };
  if (fechaInicio) params.fechaInicio = fechaInicio;
  if (fechaFin) params.fechaFin = fechaFin;
  
  const response = await axios.get(`${API_URL}/citas`, {
    params,
    headers: getAuthHeader()
  });
  return response.data;
};

export const crearCita = async (citaData) => {
  const response = await axios.post(
    `${API_URL}/citas`,
    citaData,
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const actualizarCita = async (id, citaData) => {
  const response = await axios.put(
    `${API_URL}/citas/${id}`,
    citaData,
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const eliminarCita = async (id) => {
  const response = await axios.delete(
    `${API_URL}/citas/${id}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Gestión de Notificaciones
export const obtenerNotificaciones = async () => {
  const response = await axios.get(`${API_URL}/notificaciones`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const crearNotificacion = async (notificacionData) => {
  const response = await axios.post(
    `${API_URL}/notificaciones`,
    notificacionData,
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const marcarNotificacionLeida = async (notificacionId) => {
  const response = await axios.patch(
    `${API_URL}/notificaciones/${notificacionId}/leer`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};
