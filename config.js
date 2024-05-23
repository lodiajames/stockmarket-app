const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const dbURI = process.env.MONGO_URL;
    await mongoose.connect(dbURI);
    console.log("successfully connected on MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
