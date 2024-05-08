export const SQL_COMMANDS = {
  SELECT_CART: `SELECT * FROM carts WHERE user_id = $1`,
  SELECT_CART_ITEMS: `SELECT * FROM cart_items WHERE cart_id = $1`,
  INSERT_CART: `INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES ($1, $2, NOW(), NOW(), $3)`,
  INSERT_CART_ITEMS: `INSERT INTO cart_items (cart_id, product_id, count) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET count = $3`,
  DELETE_CART_ITEMS: `DELETE FROM cart_items WHERE cart_id = $1`,
  DELETE_CART: `DELETE FROM carts WHERE id = $1`,
  UPDATE_CART: `UPDATE carts SET status = $1 WHERE id = $2`,
  INSERT_ORDER:
    'INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
};
