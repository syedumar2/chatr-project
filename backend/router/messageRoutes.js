const express = require("express");
const { AuthMiddleware, UploadMiddleware } = require("../middleware");
const { MessageController } = require("../controller");

const router = express.Router();

// create a msg
router.get("/:channelid", MessageController.getMessages); //get msgs by channel
router.post(
  "/:channelid",
  AuthMiddleware.verifyAccessToken,
  UploadMiddleware.upload.array("files"),
  MessageController.postMessageWithFile
);

module.exports = router;
