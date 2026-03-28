export function createBookModel(pool) {
  return {
    async findAllWithGenre(filterSlug) {
      let sql = `
        SELECT b.id, b.title, b.author, b.price, g.slug AS genre_slug, g.name AS genre_name
        FROM books b
        INNER JOIN genres g ON g.id = b.genre_id
      `;
      const params = [];
      if (filterSlug && filterSlug !== 'all') {
        sql += ' WHERE g.slug = $1';
        params.push(filterSlug);
      }
      sql += ' ORDER BY b.title ASC';
      const { rows } = await pool.query(sql, params);
      return rows;
    },

    async findById(id) {
      const { rows } = await pool.query(
        `SELECT b.id, b.title, b.author, b.price, b.genre_id,
                g.slug AS genre_slug, g.name AS genre_name
         FROM books b
         INNER JOIN genres g ON g.id = b.genre_id
         WHERE b.id = $1`,
        [id],
      );
      return rows[0] ?? null;
    },

    async findByIds(ids) {
      if (!ids.length) return [];
      const { rows } = await pool.query(
        `SELECT b.id, b.title, b.author, b.price
         FROM books b
         WHERE b.id = ANY($1::int[])`,
        [ids],
      );
      const map = new Map(rows.map((r) => [r.id, r]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    },

    async create({ genreId, title, author, price }) {
      const { rows } = await pool.query(
        `INSERT INTO books (genre_id, title, author, price)
         VALUES ($1, $2, $3, $4)
         RETURNING id, genre_id, title, author, price`,
        [genreId, title, author, price],
      );
      return rows[0];
    },

    async update(id, { genreId, title, author, price }) {
      const { rows } = await pool.query(
        `UPDATE books
         SET genre_id = $2, title = $3, author = $4, price = $5
         WHERE id = $1
         RETURNING id`,
        [id, genreId, title, author, price],
      );
      return rows[0] ?? null;
    },

    async deleteById(id) {
      const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [id]);
      return rowCount > 0;
    },
  };
}
