const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const router = express.Router();

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

router.get("/", async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found." });
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;