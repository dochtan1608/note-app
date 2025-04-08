const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Add static file serving for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const shareRoutes = require("./routes/shareRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");

app.use("/notes", noteRoutes);
app.use("/", userRoutes);
app.use("/reminders", reminderRoutes);
app.use("/notes/share", shareRoutes);
app.use("/attachments", attachmentRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
