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
  "/:cid",
  AuthMiddleware.verifyAccessToken,
  ChannelController.deleteChannel
);
router.patch(
  "/",
  AuthMiddleware.verifyAccessToken,
  ChannelController.updateChannel
);
router.patch(
  "/user",
  AuthMiddleware.verifyAccessToken,
  ChannelController.removeMemberFromChannel
);
router.patch(
  "/members",
  AuthMiddleware.verifyAccessToken,
  ChannelController.updateChannelMember
);
router.post(
  "/dm/:id",
  AuthMiddleware.verifyAccessToken,
  ChannelController.dmChannel
);
module.exports = router;
