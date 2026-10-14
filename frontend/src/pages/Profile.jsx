import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, clearToken } from '../api.js';

const FIELDS = [
  { name: 'name', label: 'Nombre' },
  { name: 'phone', label: 'Teléfono' },
  { name: 'city', label: 'Ciudad' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', phone: '', city: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function logout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  useEffect(() => {
    api('/profile')
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name, bio: data.bio, phone: data.phone, city: data.city });
      })
      .catch((err) => {
        if (err.status === 401) logout();
        else setError(err.message);
      });
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const data = await api('/profile', { method: 'PUT', body: form });
      setProfile(data);
      setMessage('Perfil actualizado');
    } catch (err) {
      setError(err.message);
    }
  }

  if (!profile) return <section className="card"><p>{error || 'Cargando perfil…'}</p></section>;

  return (
    <section className="card">
      <header className="profile-header">
        <div>
          <h1 data-testid="profile-title">Hola, {profile.name}</h1>
          <p className="muted" data-testid="profile-email">{profile.email}</p>
        </div>
        <button className="secondary" onClick={logout} data-testid="logout">Cerrar sesión</button>
      </header>
      <form onSubmit={onSubmit}>
        {FIELDS.map((f) => (
          <label key={f.name}>
            {f.label}
            <input name={f.name} value={form[f.name]} onChange={onChange} data-testid={`profile-${f.name}`} />
          </label>
        ))}
        <label>
          Biografía
          <textarea name="bio" rows={3} maxLength={300} value={form.bio} onChange={onChange} data-testid="profile-bio" />
        </label>
        {message && <p className="success" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" data-testid="profile-save">Guardar cambios</button>
      </form>
      <p className="muted small">Miembro desde {new Date(profile.createdAt).toLocaleDateString('es')}</p>
    </section>
  );
}
