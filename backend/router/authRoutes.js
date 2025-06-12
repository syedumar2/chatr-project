const express = require("express");
const { AuthController } = require("../controller");

const { AuthMiddleware } = require("../middleware");

const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);
router.post("/logout", AuthController.logoutUser);
router.get(
  "/protected",
  AuthMiddleware.verifyAccessToken,
  AuthController.getProtectedData
);
router.patch(
  "/update",
  AuthMiddleware.verifyAccessToken,
  AuthController.updateUser
);
router.post("/refresh", AuthController.issueNewTokens);
router.get("/users", AuthController.searchContacts);

module.exports = router;
