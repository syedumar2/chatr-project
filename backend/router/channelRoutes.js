const express = require("express");
const { AuthMiddleware } = require("../middleware");
const { ChannelController } = require("../controller");
const router = express.Router();

router.post(
  "/",
  AuthMiddleware.verifyAccessToken,
  ChannelController.addChannel
);
router.get("/", AuthMiddleware.verifyAccessToken, ChannelController.getChannel);
router.get(
  "/user",
  AuthMiddleware.verifyAccessToken,
  ChannelController.getChannelsUserBelongsTo
);
router.delete(
  "/",
  AuthMiddleware.verifyAccessToken,
  ChannelController.deleteChannel
);
router.patch(
  "/",
  AuthMiddleware.verifyAccessToken,
  ChannelController.updateChannel
);
module.exports = router;
