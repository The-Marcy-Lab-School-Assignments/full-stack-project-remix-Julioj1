const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (todos references users via FK)
  await pool.query('DROP TABLE IF EXISTS expenses');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE expenses (
    expense_id    SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    amount        NUMERIC(10, 2) NOT NULL,
    category      TEXT NOT NULL,
    date          DATE NOT NULL,
    user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  await pool.query(`
    INSERT INTO expenses (title, amount, category, date, user_id) VALUES
      ('Grocery run', 87.43, 'Food', '2025-05-01', $1),
      ('Netflix subscription', 15.99, 'Entertainment', '2025-05-02', $1),
      ('Whole Foods haul', 134.76, 'Food', '2025-05-01', $2),
      ('Uber to airport', 38.00, 'Transport', '2025-05-04', $2),
      ('Electric bill', 110.00, 'Utilities', '2025-05-08', $1),
      ('Coffee shop', 12.40, 'Food', '2025-05-09', $2)
  `, [alice.user_id, bob.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
