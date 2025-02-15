const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); 
}

const authRoutes = require("./routes/auth");

const app = express();


app.use(
  cors({
    origin: ["http://localhost:3000", "https://blog-ashy-six-25.vercel.app/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


///mongodb+srv://regikeerthana3:<db_password>@blogcluster.hq5lu.mongodb.net/
//mongodb://127.0.0.1:27017/blogdb

mongoose
  .connect("mongodb+srv://regikeerthana3:v6ntSBEDgRSJkCwN@blogcluster.hq5lu.mongodb.net/")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const postRoutes = require("./routes/posts");
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
