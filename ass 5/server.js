require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/admin", (_req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.use("/api/products", productRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found." });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(" ") });
  }
  console.error(error);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and set your MongoDB connection string.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Fieldnotes is running at http://localhost:${port}`));
}

start().catch((error) => {
  console.error(`Unable to start Fieldnotes: ${error.message}`);
  process.exit(1);
});