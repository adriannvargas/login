import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../api.js';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api('/auth/login', { method: 'POST', body: form });
      setToken(token);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required data-testid="login-email" />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" value={form.password} onChange={onChange} required data-testid="login-password" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={loading} data-testid="login-submit">
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p className="muted">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </section>
  );
}
