import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("WARNING: MONGO_URI is missing from your .env file. Chat logs will not be saved.");
}

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
