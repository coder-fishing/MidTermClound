import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import "./config/database.js";
import bookRoutes from "./routes/book.js";

const app = express();

// =========================
// MIDDLEWARE
// =========================

// Cho phép Express đọc JSON từ request
app.use(express.json());

// =========================
// SESSION
// =========================

// Lưu session trực tiếp trên MongoDB Atlas
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_WRITE_URI,
      dbName: "DB_23IT_B231",
      collectionName: "sessions"
    }),

    cookie: {
      maxAge: 1000 * 60 * 60 // 1 giờ
    }
  })
);

// =========================
// BOOK ROUTES
// =========================

// GET  /books
// POST /books
app.use("/books", bookRoutes);

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.send("Book Management - 23IT.B231 - VAT 7%");
});

// =========================
// TEST SESSION
// =========================

app.get("/session-test", (req, res) => {

  // Lần đầu chưa có visitCount
  if (!req.session.visitCount) {
    req.session.visitCount = 1;
  } else {
    // Những lần sau tăng lên 1
    req.session.visitCount++;
  }

  res.json({
    message: "Session đang hoạt động",
    visitCount: req.session.visitCount
  });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});