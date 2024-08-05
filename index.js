const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define Schema and Model
const bioSchema = new mongoose.Schema({
  image: String,
  name: String,
  role: String,
  age: Number,
  spot: String,
  institute: String,
  recall_text: String,
  recall_link: [String],
  recall_title: String,
  deathDate: Date,
});

const Bio = mongoose.model("bio", bioSchema);

// Routes
app.get("/", (req, res) => res.send("National Heros Server is running."));

// Get all bios with pagination
app.get("/bios", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const bios = await Bio.find().skip(skip).limit(limit);
    const count = await Bio.countDocuments();
    res.status(200).json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: bios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving data." });
  }
});

// Get bio by _id
app.get("/bios/:id", async (req, res) => {
  try {
    const bio = await Bio.findById(req.params.id);
    if (!bio) {
      return res.status(404).json({ message: "Bio not found." });
    }
    res.status(200).json(bio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving data." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
