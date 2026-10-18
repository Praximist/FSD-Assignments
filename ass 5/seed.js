require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Arc Table Lamp",
    category: "Lighting",
    description: "A quiet pool of warm light, shaped in brushed steel and made for slow evenings.",
    price: 148,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
    featured: true,
  },
  {
    name: "Everyday Stoneware Set",
    category: "Objects",
    description: "Hand-finished ceramic pieces with a soft glaze and a pleasingly solid feel.",
    price: 64,
    image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    name: "Studio Headphones",
    category: "Audio",
    description: "Clear, balanced sound and considered comfort for deep work or the ride home.",
    price: 220,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
    featured: true,
  },
  {
    name: "Canvas Carryall",
    category: "Wearables",
    description: "A durable everyday tote cut from heavyweight cotton canvas with roomy pockets.",
    price: 52,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    name: "Field Notes Journal",
    category: "Objects",
    description: "A lay-flat, linen-bound notebook for plans, sketches, lists and everything else.",
    price: 28,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
  {
    name: "Weekend Bottle",
    category: "Outdoor",
    description: "Double-wall insulated steel keeps your drink just right from trailhead to table.",
    price: 38,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
    featured: false,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing. Copy .env.example to .env first.");
  await mongoose.connect(process.env.MONGODB_URI);
  if (await Product.exists()) {
    console.log("Products already exist. No sample products were added.");
  } else {
    await Product.insertMany(products);
    console.log(`Added ${products.length} sample products.`);
  }
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(`Unable to seed products: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});