const express = require("express");
const { AuthMiddleware } = require("../middleware");
const { MessageController } = require("../controller");
const router = express.Router();

// create a msg
router.get("/:channelid", MessageController.getMessages); //get msgs by channel

module.exports = router;
