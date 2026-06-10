require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/file.routes");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "video-drop-api" }));
app.use("/api/files", fileRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 2567;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
});
