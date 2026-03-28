export function createGenreModel(pool) {
  return {
    async findAll() {
      const { rows } = await pool.query(
        'SELECT id, name, slug FROM genres ORDER BY name ASC',
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await pool.query(
        'SELECT id, name, slug FROM genres WHERE id = $1',
        [id],
      );
      return rows[0] ?? null;
    },
  };
}
