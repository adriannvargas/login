import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../api.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api('/auth/register', { method: 'POST', body: form });
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
      <h1>Crear cuenta</h1>
      <form onSubmit={onSubmit}>
        <label>
          Nombre
          <input name="name" value={form.name} onChange={onChange} required data-testid="register-name" />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required data-testid="register-email" />
        </label>
        <label>
          Contraseña
          <input name="password" type="password" minLength={6} value={form.password} onChange={onChange} required data-testid="register-password" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={loading} data-testid="register-submit">
          {loading ? 'Creando…' : 'Registrarme'}
        </button>
      </form>
      <p className="muted">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </section>
  );
}
