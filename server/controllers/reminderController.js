const Reminder = require("../models/reminder");
const User = require("../models/user");

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({
      dueDate: 1,
    });

    res.json({ reminders });
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
};

exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ reminder });
  } catch (err) {
    console.error("Error fetching reminder:", err);
    res.status(500).json({ error: "Failed to fetch reminder" });
  }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const reminder = await Reminder.create({
      title,
      description,
      dueDate,
      priority,
      user: req.user._id,
      creator: req.user._id,
    });

    res.status(201).json({ reminder });
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(500).json({ error: "Failed to create reminder" });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        description,
        dueDate,
        priority,
        status,
        ...(status === "completed" || status === "dismissed"
          ? { notified: true }
          : {}),
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ reminder });
  } catch (err) {
    console.error("Error updating reminder:", err);
    res.status(500).json({ error: "Failed to update reminder" });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const result = await Reminder.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ success: "Reminder deleted" });
  } catch (err) {
    console.error("Error deleting reminder:", err);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
};

exports.markAsNotified = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notified: true },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ reminder });
  } catch (err) {
    console.error("Error updating reminder:", err);
    res.status(500).json({ error: "Failed to update reminder" });
  }
};
exports.getPendingNotifications = async (req, res) => {
  try {
    const now = new Date();

    // Get due reminders
    const pendingReminders = await Reminder.find({
      user: req.user._id,
      dueDate: { $lte: now },
      status: "pending",
      notified: false,
    });
    const sharedInvites = await Reminder.find({
      "sharedWith.user": req.user._id,
      "sharedWith.status": "pending",
      "sharedWith.notified": false,
    }).populate("creator", "username");

    const allNotifications = {
      reminders: pendingReminders,
      sharedInvites: sharedInvites,
    };

    res.json(allNotifications);
  } catch (err) {
    console.error("Error fetching pending notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markMultipleAsNotified = async (req, res) => {
  try {
    const { reminderIds } = req.body;

    if (!Array.isArray(reminderIds) || reminderIds.length === 0) {
      return res.status(400).json({ error: "No reminder IDs provided" });
    }

    const result = await Reminder.updateMany(
      {
        _id: { $in: reminderIds },
        user: req.user._id,
      },
      { notified: true }
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error updating reminders:", err);
    res.status(500).json({ error: "Failed to update reminders" });
  }
};

// Share a reminder with another user
exports.shareReminder = async (req, res) => {
  try {
    const { email, reminderId } = req.body;

    // Find the user to share with
    const recipientUser = await User.findOne({ email });
    if (!recipientUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if reminder exists and belongs to current user
    const reminder = await Reminder.findOne({
      _id: reminderId,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    // Check if already shared with this user
    const alreadyShared = reminder.sharedWith.some(
      (share) =>
        share.user && share.user.toString() === recipientUser._id.toString()
    );

    if (alreadyShared) {
      return res
        .status(400)
        .json({ error: "Reminder already shared with this user" });
    }
    reminder.sharedWith.push({
      user: recipientUser._id,
      status: "pending",
      notified: false,
    });

    reminder.isShared = true;
    await reminder.save();

    res.json({
      success: true,
      message: `Reminder shared with ${recipientUser.email}`,
    });
  } catch (err) {
    console.error("Error sharing reminder:", err);
    res.status(500).json({ error: "Failed to share reminder" });
  }
};

exports.getSharedReminders = async (req, res) => {
  try {
    const pendingShares = await Reminder.find({
      "sharedWith.user": req.user._id,
    }).populate("creator", "email");

    res.json({ pendingShares });
  } catch (err) {
    console.error("Error fetching shared reminders:", err);
    res.status(500).json({ error: "Failed to fetch shared reminders" });
  }
};

// Accept or reject a shared reminder
exports.handleSharedReminder = async (req, res) => {
  try {
    const { status } = req.body;
    const reminderId = req.params.id;

    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Find the reminder
    const reminder = await Reminder.findOne({
      _id: reminderId,
      "sharedWith.user": req.user._id,
      "sharedWith.status": "pending",
    });

    if (!reminder) {
      return res.status(404).json({ error: "Shared reminder not found" });
    }

    // Update the share status
    const shareIndex = reminder.sharedWith.findIndex(
      (share) => share.user.toString() === req.user._id.toString()
    );

    reminder.sharedWith[shareIndex].status = status;
    reminder.sharedWith[shareIndex].notified = true;

    await reminder.save();
    if (status === "accepted") {
      const newReminder = new Reminder({
        title: reminder.title,
        description: reminder.description,
        dueDate: reminder.dueDate,
        priority: reminder.priority,
        user: req.user._id,
        creator: reminder.creator,
        isShared: true,
      });

      await newReminder.save();
    }

    res.json({
      success: true,
      message: `Reminder ${status}`,
    });
  } catch (err) {
    console.error("Error handling shared reminder:", err);
    res.status(500).json({ error: "Failed to process shared reminder" });
  }
};
exports.markSharedReminderAsNotified = async (req, res) => {
  try {
    const reminderId = req.params.id;

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    const shareIndex = reminder.sharedWith.findIndex(
      (share) => share.user.toString() === req.user._id.toString()
    );

    if (shareIndex === -1) {
      return res.status(404).json({ error: "Share not found" });
    }
    reminder.sharedWith[shareIndex].notified = true;
    await reminder.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking shared reminder as notified:", err);
    res.status(500).json({ error: "Failed to update notification status" });
  }
};
