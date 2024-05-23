const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectToDatabase = require("./config.js");
const Stock = require("./models/stockModel.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectToDatabase();

app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch stocks at the moment" });
  }
});

app.post("/api/watchlist", async (req, res) => {
  try {
    const {
      company,
      description,
      initial_price,
      price_2002,
      price_2007,
      symbol,
    } = req.body;
    const existingStock = await Stock.findOne({ symbol });
    if (existingStock) {
      return res.status(400).json({
        error: "Stock with the symbol already exists in the watchlist",
      });
    }

    const stock = new Stock({
      company,
      description,
      initial_price,
      price_2002,
      price_2007,
      symbol,
    });
    await stock.save();
    res.json({ message: "Stock added to watchlist successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to add to watchlist", error });
  }
});

app.delete("/api/watchlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Stock.findByIdAndDelete(id);

    res.json({ success: true, message: "Stock deleted from watchlist" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Unable to delete from watchlist" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
