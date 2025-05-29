const express = require("express");
const { AuthController } = require("../controller");
const { verifyAccessToken } = require("../middleware/verifyAccessToken");
const { issueNewTokens } = require("../controller/authController");

const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.post('/logout', AuthController.logoutUser);
router.get("/protected",verifyAccessToken,AuthController.getProtectedData);
router.post("/refresh",issueNewTokens);
module.exports = router;
