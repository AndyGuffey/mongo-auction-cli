import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/Item.js";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mission05");
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Base route --> check server status
// GET http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Auction API is connected and running ✅");
});

//?=====================
//? API Endpoints
//?=====================

//---------------------
// GET all items
//---------------------
// GET http://localhost:3000/api/items

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//---------------------
// SEARCH - text search
//---------------------
// GET http://localhost:3000/api/items/search?query=surfboard
// GET http://localhost:3000/api/items/search?query=paper clip
app.get("/api/items/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Using MongoDB text index for search
    const items = await Item.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//---------------------
// SEARCH - price range
//---------------------
// GET http://localhost:3000/api/items/price?min=100&max=600
// GET http://localhost:3000/api/items/price?min=500
// GET http://localhost:3000/api/items/price?max=200
app.get("/api/items/price", async (req, res) => {
  try {
    const { min, max } = req.query;

    // Build query object
    const query = {};

    if (min) query.start_price = { $gte: Number(min) };
    if (max) query.start_price = { ...query.start_price, $lte: Number(max) };

    const items = await Item.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//------------------------
// FIND - similar items
//------------------------
// GET http://localhost:3000/api/items/similar/68c8beed5ccdfcab9adf2b48
app.get("/api/items/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find reference item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    // Use items title and description as the search terms
    const searchTerms = `${item.title} ${item.description}`;
    // Find similar items, excluding the original item
    const similarItems = await Item.find(
      {
        $text: { $search: searchTerms },
        _id: { $ne: item._id }, // Exclude original item
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5); // Limit to top 5 similar items

    res.json(similarItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
