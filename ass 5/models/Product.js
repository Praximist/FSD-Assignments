const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    trim: true,
    minlength: [2, "Name must be at least 2 characters."],
    maxlength: [90, "Name must be 90 characters or fewer."],
  },
  category: {
    type: String,
    required: [true, "Choose a category."],
    trim: true,
    maxlength: [40, "Category must be 40 characters or fewer."],
  },
  description: {
    type: String,
    required: [true, "A short description is required."],
    trim: true,
    minlength: [8, "Description must be at least 8 characters."],
    maxlength: [500, "Description must be 500 characters or fewer."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [0.01, "Price must be greater than zero."],
    max: [1000000, "Price is above the allowed limit."],
  },
  image: {
    type: String,
    required: [true, "An image URL is required."],
    trim: true,
    validate: {
      validator: (value) => {
        try {
          return ["http:", "https:"].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      },
      message: "Enter a valid image URL beginning with http:// or https://.",
    },
  },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);