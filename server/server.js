// run env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// depecendencies
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./config/connectToDB");
const notesController = require("./controllers/notesController");
const userController = require("./controllers/userController");
const requireAuth = require("./middleware/requireAuth");
// create express app

const app = express();

// config express app
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// connect to database
connectToDB();
// routing
app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.get("/logout", userController.logout);
app.get("/check-auth", requireAuth, userController.checkAuth);
app.get("/notes", requireAuth, notesController.fetchNotes);
app.get("/notes/:id", requireAuth, notesController.fetchNote);
app.post("/notes", requireAuth, notesController.createNote);
app.put("/notes/:id", requireAuth, notesController.updateNote);
app.delete("/notes/:id", requireAuth, notesController.deleteNote);
// chay server
app.listen(process.env.PORT);
