const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();
const SECRET_KEY = "a8f7e4d6c9b1t2m5y3z0x7v6w4p9q"; 


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "src/pages/api/uploads/"); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   },
// });

// const upload = multer({ storage }); 

// Set up Multer to store files on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_posts", 
    format: async () => "png", 
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });


const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};


// router.post(
//   "/create",
//   authenticate,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { title, content } = req.body;
//       const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Save file path

//       const newPost = new Post({
//         title,
//         content,
//         imageUrl,
//         author: req.user.id,
//       });

//       await newPost.save();
//       res.json({ message: "Post created successfully!", post: newPost });
//     } catch (error) {
//       console.error("Post Creation Error:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
// );

// Create a new post with Cloudinary image upload
router.post("/create", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Cloudinary URL

    const newPost = new Post({
      title,
      content,
      imageUrl,
      author: req.user.id,
    });

    await newPost.save();
    res.json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
