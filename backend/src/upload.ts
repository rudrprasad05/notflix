import express from "express";
import multer from "multer";
import path from "path";
import { UploadVideoMetaToSql } from "./db";
var fs = require("fs");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const dir = path.join(uploadsDir, file.filename); // Change 'test' to dynamic if needed
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, `./uploads/${file.filename}/`);
  },

  filename: async function (req, file, cb) {
    console.log(file);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.filename);
    // const url = `/uploads/${file.filename}`;
    await UploadVideoMetaToSql("", "", file.filename, 0);
  },
});

export const upload = multer({ storage });
