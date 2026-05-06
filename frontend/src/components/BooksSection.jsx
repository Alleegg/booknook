export function BooksSection({ token, books, loading, onBookAdded, BookForm, BookList }) {
  return (
    <section className="card">
      <h2>My books (protected endpoint)</h2>
      <BookForm token={token} onBookAdded={onBookAdded} />
      {loading ? <p>Loading books...</p> : <BookList books={books} />}
    </section>
  );
}
