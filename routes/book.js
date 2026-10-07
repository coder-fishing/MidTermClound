import express from "express";
import { ReadBook, WriteBook } from "../models/book.js";

const router = express.Router();

const PREFIX = "231";
const VAT_RATE = 0.07;

// =========================
// GET /books
// Dùng READ account
// =========================

router.get("/", async (req, res) => {
  try {
    const books = await ReadBook.find();

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// =========================
// POST /books
// API thêm sách
// Dùng WRITE account
// =========================

router.post("/", async (req, res) => {
  try {
    const { code, name, price } = req.body;

    if (!code || !name || price == null) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin"
      });
    }

    if (!code.startsWith(PREFIX)) {
      return res.status(400).json({
        message: "Mã sách phải bắt đầu bằng 231"
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        message: "Giá sách không hợp lệ"
      });
    }

    const vat = 7;
    const priceAfterTax = numericPrice * (1 + VAT_RATE);

    const book = await WriteBook.create({
      code,
      name,
      price: numericPrice,
      vat,
      priceAfterTax
    });

    res.status(201).json(book);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// =========================
// POST /books/add
// Nhận dữ liệu từ form UI
// =========================

router.post("/add", async (req, res) => {
  try {
    const { code, name, price } = req.body;

    // Kiểm tra nhập đầy đủ
    if (!code || !name || price == null) {
      return res.redirect("/?error=missing");
    }

    // Kiểm tra prefix MSSV
    if (!code.startsWith(PREFIX)) {
      return res.redirect("/?error=prefix");
    }

    const numericPrice = Number(price);

    // Kiểm tra giá
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.redirect("/?error=price");
    }

    // VAT 7%
    const vat = 7;
    const priceAfterTax = numericPrice * (1 + VAT_RATE);

    // Ghi lên MongoDB bằng WRITE account
    await WriteBook.create({
      code,
      name,
      price: numericPrice,
      vat,
      priceAfterTax
    });

    // Thêm thành công → quay lại UI
    res.redirect("/");

  } catch (error) {
    console.error(error);

    res.redirect("/?error=server");
  }
});

export default router;