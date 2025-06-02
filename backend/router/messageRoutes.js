const express = require("express");
const { AuthMiddleware } = require("../middleware");
const { MessageController } = require("../controller");
const router = express.Router();

router.post(
  "/",
  AuthMiddleware.verifyAccessToken,
  MessageController.sendMessage
); // create a msg
router.get("/:channelid", MessageController.getMessages); //get msgs by channel
router.delete(
  "/:messageid",
  AuthMiddleware.verifyAccessToken,
  MessageController.deleteMessage
);
router.patch(
  "/:messageid",
  AuthMiddleware.verifyAccessToken,
  MessageController.updateMessage
);

module.exports = router;
