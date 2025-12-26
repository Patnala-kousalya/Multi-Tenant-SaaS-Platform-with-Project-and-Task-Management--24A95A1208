const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");


const app = express();

app.use(express.json());
app.use(cors());

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);


module.exports = app;
