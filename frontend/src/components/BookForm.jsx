import { useState } from 'react';
import { request } from '../api';

export function BookForm({ token, onBookAdded }) {
  const [bookForm, setBookForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAddBook(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const created = await request('/api/books', { method: 'POST', token, body: bookForm });
      onBookAdded(created);
      setBookForm({ title: '', description: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAddBook}>
      <h3>Add a new book</h3>
      <input
        placeholder="Title"
        value={bookForm.title}
        onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
        disabled={loading}
      />
      <input
        placeholder="Description"
        value={bookForm.description}
        onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add book'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
