export function AdminPanel({ stats, loading }) {
  return (
    <section className="card">
      <h2>Admin panel (role-based content)</h2>
      {loading ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <ul>
          <li>Users: {stats.usersCount}</li>
          <li>Books: {stats.booksCount}</li>
          <li>Admins: {stats.adminsCount}</li>
        </ul>
      ) : (
        <p>Failed to load stats</p>
      )}
    </section>
  );
}
