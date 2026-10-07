import "dotenv/config";
import express from "express";
import "./config/database.js";
import bookRoutes from "./routes/book.js";

const app = express();

app.use(express.json());

app.use("/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Book Management - 23IT.B231 - VAT 7%");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});