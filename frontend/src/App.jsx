import { useEffect, useState } from 'react';
import { request } from './api';
import { AuthPanel } from './components/AuthPanel';
import { UserHeader } from './components/UserHeader';
import { BooksSection } from './components/BooksSection';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [booksLoading, setBooksLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Загружаем книги пользователя при авторизации
  useEffect(() => {
    if (!token) return;
    setBooksLoading(true);
    request('/api/books', { token })
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setBooksLoading(false));
  }, [token]);

  // Загружаем статистику админа
  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') return;
    setStatsLoading(true);
    request('/api/admin/stats', { token })
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, [token, user]);

  function handleAuth(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    setBooks([]);
    setStats(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function handleBookAdded(newBook) {
    setBooks((prev) => [newBook, ...prev]);
  }

  return (
    <main className="container">
      <h1>BookNook SPA + JWT</h1>
      {!token ? (
        <AuthPanel onAuth={handleAuth} />
      ) : (
        <>
          <UserHeader user={user} onLogout={handleLogout} />
          <BooksSection
            token={token}
            books={books}
            loading={booksLoading}
            onBookAdded={handleBookAdded}
            BookForm={BookForm}
            BookList={BookList}
          />
          {user?.role === 'ADMIN' && (
            <AdminPanel stats={stats} loading={statsLoading} />
          )}
        </>
      )}
    </main>
  );
}
