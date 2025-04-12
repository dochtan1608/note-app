const express = require("express");
const router = express.Router();
const attachmentController = require("../controllers/attachmentController");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/uploadMiddleware");

router.use(requireAuth);

router.post(
  "/:noteId",
  upload.single("file"),
  attachmentController.uploadAttachment
);

router.get("/note/:noteId", attachmentController.getNoteAttachments);
router.get("/:id/download", attachmentController.downloadAttachment);
router.delete("/:id", attachmentController.deleteAttachment);

module.exports = router;
