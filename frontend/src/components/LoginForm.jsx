import { useState } from 'react';
import { request } from '../api';

export function LoginForm({ onAuth }) {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await request('/api/auth/login', { method: 'POST', body: login });
      onAuth(data);
      setLogin({ email: '', password: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h3>Login</h3>
      <input
        placeholder="Email"
        type="email"
        value={login.email}
        onChange={(e) => setLogin({ ...login, email: e.target.value })}
        disabled={loading}
      />
      <input
        placeholder="Password"
        type="password"
        value={login.password}
        onChange={(e) => setLogin({ ...login, password: e.target.value })}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
