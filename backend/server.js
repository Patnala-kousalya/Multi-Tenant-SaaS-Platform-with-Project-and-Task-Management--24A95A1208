require("dotenv").config();
const app = require("./src/app");
const { runMigrationsAndSeeds } = require("./src/utils/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await runMigrationsAndSeeds();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();
