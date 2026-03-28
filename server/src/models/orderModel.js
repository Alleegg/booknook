export function createOrderModel(pool) {
  return {
    async createOrderWithItems({ customerName, phone, address, items }) {
      let total = 0;
      for (const it of items) {
        total += Number(it.unit_price) * Number(it.quantity);
      }
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const orderRes = await client.query(
          `INSERT INTO orders (customer_name, phone, address, total_amount)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [customerName, phone, address, total],
        );
        const orderId = orderRes.rows[0].id;
        for (const it of items) {
          await client.query(
            `INSERT INTO order_items (order_id, book_id, quantity, unit_price)
             VALUES ($1, $2, $3, $4)`,
            [orderId, it.book_id, it.quantity, it.unit_price],
          );
        }
        await client.query('COMMIT');
        return orderId;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    },
  };
}
