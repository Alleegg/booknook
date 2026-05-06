import { useState } from 'react';
import { request } from '../api';

export function RegisterForm({ onAuth }) {
  const [register, setRegister] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await request('/api/auth/register', { method: 'POST', body: register });
      onAuth(data);
      setRegister({ email: '', name: '', password: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h3>Register</h3>
      <input
        placeholder="Name"
        value={register.name}
        onChange={(e) => setRegister({ ...register, name: e.target.value })}
        disabled={loading}
      />
      <input
        placeholder="Email"
        type="email"
        value={register.email}
        onChange={(e) => setRegister({ ...register, email: e.target.value })}
        disabled={loading}
      />
      <input
        placeholder="Password"
        type="password"
        value={register.password}
        onChange={(e) => setRegister({ ...register, password: e.target.value })}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
