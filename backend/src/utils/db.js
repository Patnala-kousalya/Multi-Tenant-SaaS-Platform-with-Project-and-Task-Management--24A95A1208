const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runSqlFile(filePath) {
  const sql = fs.readFileSync(filePath).toString();
  await pool.query(sql);
}

async function runMigrationsAndSeeds() {
  try {
    console.log("⏳ Connecting to database...");
    await pool.query("SELECT 1");
    console.log("✅ Database connected");

    const migrationsDir = path.join(__dirname, "../../migrations");
    const seedsDir = path.join(__dirname, "../../seeds");

    // Run migrations
    const migrations = fs.readdirSync(migrationsDir).sort();
    for (const file of migrations) {
      console.log(`▶ Running migration: ${file}`);
      try {
        await runSqlFile(path.join(migrationsDir, file));
      } catch (migrationErr) {
        // If it's "already exists" error, we can ignore it
        if (migrationErr.code === '42P07' || migrationErr.code === '42710' || migrationErr.code === '23505') {
          console.log(`ℹ Migration ${file} already applied or skipped (object exists)`);
        } else {
          throw migrationErr;
        }
      }
    }

    // Run seeds
    const seeds = fs.readdirSync(seedsDir).sort();
    for (const file of seeds) {
      console.log(`▶ Running seed: ${file}`);
      try {
        await runSqlFile(path.join(seedsDir, file));
      } catch (seedErr) {
        // Ignore unique constraint violations in seeds
        if (seedErr.code === '23505') {
          console.log(`ℹ Seed ${file} already applied (unique constraint violation)`);
        } else {
          throw seedErr;
        }
      }
    }

    console.log("✅ Migrations & seeds completed");
  } catch (err) {
    console.error("❌ Database setup failed", err);
    process.exit(1);
  }
}

module.exports = {
  pool,
  runMigrationsAndSeeds,
};
