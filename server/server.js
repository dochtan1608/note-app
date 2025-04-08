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
const shareController = require("./controllers/shareController");
const reminderController = require("./controllers/reminderController");

// create express app

const app = express();

// config express app
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// connect to database
connectToDB();
// routing
app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.get("/logout", userController.logout);
app.get("/check-auth", requireAuth, userController.checkAuth);

// Note sharing routes - Move these BEFORE the other note routes
app.post("/notes/share", requireAuth, shareController.shareNote);
app.get("/notes/shared", requireAuth, shareController.getSharedNotes);
app.put("/notes/shared/:id", requireAuth, shareController.updateSharedNote);

// Add attachment routes
const attachmentRoutes = require("./routes/attachmentRoutes");
app.use("/attachments", attachmentRoutes);

// Regular note routes
app.get("/notes", requireAuth, notesController.fetchNotes);
app.get("/notes/:id", requireAuth, notesController.fetchNote);
app.post("/notes", requireAuth, notesController.createNote);
app.put("/notes/:id", requireAuth, notesController.updateNote);
app.delete("/notes/:id", requireAuth, notesController.deleteNote);

// Note actions routes
app.put("/notes/:id/pin", requireAuth, notesController.togglePin);
app.put("/notes/:id/favorite", requireAuth, notesController.toggleFavorite);

// Reminder routes
app.get("/reminders", requireAuth, reminderController.getReminders);
app.get("/reminders/:id", requireAuth, reminderController.getReminder);
app.post("/reminders", requireAuth, reminderController.createReminder);
app.put("/reminders/:id", requireAuth, reminderController.updateReminder);
app.delete("/reminders/:id", requireAuth, reminderController.deleteReminder);
app.put(
  "/reminders/:id/notify",
  requireAuth,
  reminderController.markAsNotified
);
app.get(
  "/notifications/pending",
  requireAuth,
  reminderController.getPendingNotifications
);
app.post(
  "/notifications/mark-read",
  requireAuth,
  reminderController.markMultipleAsNotified
);

// Add new routes for sharing reminders
app.post("/reminders/share", requireAuth, reminderController.shareReminder);
app.get(
  "/reminders/shared/pending",
  requireAuth,
  reminderController.getSharedReminders
);
app.put(
  "/reminders/shared/:id",
  requireAuth,
  reminderController.handleSharedReminder
);
app.put(
  "/reminders/shared/:id/notify",
  requireAuth,
  reminderController.markSharedReminderAsNotified
);

// Add static file serving for uploaded files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// chay server
app.listen(process.env.PORT);
