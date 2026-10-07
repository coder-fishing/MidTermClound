import "dotenv/config";

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";

import "./config/database.js";
import { ReadBook } from "./models/book.js";
import bookRoutes from "./routes/book.js";

const app = express();

// =========================
// HANDLEBARS
// =========================

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");
app.set("views", "./views");

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// =========================
// SESSION
// =========================

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
      maxAge: 1000 * 60 * 60
    }
  })
);

// =========================
// HOME
// =========================

app.get("/", async (req, res) => {
  try {
    const books = await ReadBook.find().lean();

    let error = null;

    if (req.query.error === "missing") {
      error = "Vui lòng nhập đầy đủ thông tin.";
    }

    if (req.query.error === "prefix") {
      error = "Mã sách phải bắt đầu bằng 231.";
    }

    if (req.query.error === "price") {
      error = "Giá sách không hợp lệ.";
    }

    if (req.query.error === "server") {
      error = "Có lỗi xảy ra khi thêm sách.";
    }

    res.render("home", {
      books,
      error
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});

// =========================
// BOOK ROUTES
// =========================

app.use("/books", bookRoutes);

// =========================
// SESSION TEST
// =========================

app.get("/session-test", (req, res) => {
  if (!req.session.visitCount) {
    req.session.visitCount = 1;
  } else {
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