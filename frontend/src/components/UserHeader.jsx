export function UserHeader({ user, onLogout }) {
  return (
    <section className="card">
      <div>
        <p>
          Signed in as <b>{user?.name}</b> ({user?.email})
        </p>
        <p>
          Role: <b>{user?.role}</b>
        </p>
      </div>
      <button onClick={onLogout}>Logout</button>
    </section>
  );
}
