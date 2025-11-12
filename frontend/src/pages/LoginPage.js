import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
        const result = isRegister ? await register(email, password) : await login(email, password);

        if (result && result.token) { // Asumiendo que el éxito devuelve un token
          navigate('/dashboard');
        } else {
          setError(result.error || 'Ocurrió un error desconocido.');
        }
    } catch (err) {
        setError(err.message || 'Error al conectar con el servidor.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 MediCalendar</h1>
        <p className="subtitle">Tu compañero de autocuidado</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="toggle-auth">
          {isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;