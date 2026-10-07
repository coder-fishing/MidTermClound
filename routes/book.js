import express from "express";
import { ReadBook, WriteBook } from "../models/book.js";

const router = express.Router();

const PREFIX = "231";
const VAT_RATE = 0.07;

// GET /books
// Dùng READ account
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

// POST /books
// Dùng WRITE account
router.post("/", async (req, res) => {
  try {
    const { code, name, price } = req.body;

    // Kiểm tra dữ liệu
    if (!code || !name || price == null) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin"
      });
    }

    // Kiểm tra prefix MSSV
    if (!code.startsWith(PREFIX)) {
      return res.status(400).json({
        message: "Mã sách phải bắt đầu bằng 231"
      });
    }

    // VAT của MSSV 23IT.B231 = 7%
    const vat = 7;

    // Tính giá sau thuế
    const priceAfterTax = price * (1 + VAT_RATE);

    // Lưu bằng WRITE account
    const book = await WriteBook.create({
      code,
      name,
      price,
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

export default router;