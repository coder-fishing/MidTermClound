import mongoose from "mongoose";
import {
  readConnection,
  writeConnection
} from "../config/database.js";

const bookSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  vat: {
    type: Number,
    required: true
  },
  priceAfterTax: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Cùng collection "books" nhưng dùng 2 connection khác nhau
export const ReadBook =
  readConnection.model("Book", bookSchema, "books");

export const WriteBook =
  writeConnection.model("Book", bookSchema, "books");