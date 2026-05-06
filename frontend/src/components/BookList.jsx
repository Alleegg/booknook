export function BookList({ books }) {
  return (
    <div>
      <h3>Your books</h3>
      {books.length === 0 ? (
        <p>No books yet. Add your first book!</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <b>{book.title}</b>: {book.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
