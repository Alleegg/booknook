import { useEffect, useState } from 'react';
import { request } from './api';

const authDefaults = { email: '', name: '', password: '' };
const bookDefaults = { title: '', description: '' };

function AuthPanel({ onAuth }) {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [register, setRegister] = useState(authDefaults);
  const [error, setError] = useState('');

  async function registerUser(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await request('/api/auth/register', { method: 'POST', body: register });
      onAuth(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loginUser(event) {
    event.preventDefault();
    setError('');
    try {
      const data = await request('/api/auth/login', { method: 'POST', body: login });
      onAuth(data);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="grid">
      <form onSubmit={registerUser}>
        <h3>Register</h3>
        <input placeholder="Name" value={register.name} onChange={(e) => setRegister({ ...register, name: e.target.value })} />
        <input placeholder="Email" value={register.email} onChange={(e) => setRegister({ ...register, email: e.target.value })} />
        <input placeholder="Password" type="password" value={register.password} onChange={(e) => setRegister({ ...register, password: e.target.value })} />
        <button type="submit">Create account</button>
      </form>
      <form onSubmit={loginUser}>
        <h3>Login</h3>
        <input placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
        <input placeholder="Password" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
        <button type="submit">Sign in</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [books, setBooks] = useState([]);
  const [bookForm, setBookForm] = useState(bookDefaults);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    request('/api/books', { token })
      .then(setBooks)
      .catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') return;
    request('/api/admin/stats', { token })
      .then(setStats)
      .catch((e) => setError(e.message));
  }, [token, user]);

  function handleAuth(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  function logout() {
    setToken('');
    setUser(null);
    setBooks([]);
    setStats(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function addBook(event) {
    event.preventDefault();
    setError('');
    try {
      const created = await request('/api/books', { method: 'POST', token, body: bookForm });
      setBooks((prev) => [created, ...prev]);
      setBookForm(bookDefaults);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container">
      <h1>BookNook SPA + JWT</h1>
      {!token ? (
        <AuthPanel onAuth={handleAuth} />
      ) : (
        <>
          <section className="card">
            <p>
              Signed in as <b>{user?.name}</b> ({user?.email}) with role <b>{user?.role}</b>
            </p>
            <button onClick={logout}>Logout</button>
          </section>
          <section className="card">
            <h2>My books (protected endpoint)</h2>
            <form onSubmit={addBook}>
              <input placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
              <input
                placeholder="Description"
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
              />
              <button type="submit">Add book</button>
            </form>
            <ul>
              {books.map((book) => (
                <li key={book.id}>
                  <b>{book.title}</b>: {book.description}
                </li>
              ))}
            </ul>
          </section>
          {user?.role === 'ADMIN' ? (
            <section className="card">
              <h2>Admin panel (role-based content)</h2>
              {stats ? (
                <ul>
                  <li>Users: {stats.usersCount}</li>
                  <li>Books: {stats.booksCount}</li>
                  <li>Admins: {stats.adminsCount}</li>
                </ul>
              ) : (
                <p>Loading stats...</p>
              )}
            </section>
          ) : (
            <section className="card">
              <h2>Admin panel</h2>
              <p>Недоступно. Требуется роль ADMIN.</p>
            </section>
          )}
        </>
      )}
      {error ? <p className="error">{error}</p> : null}
    </main>
  );
}
