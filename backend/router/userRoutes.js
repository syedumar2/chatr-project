const express = require("express");
const { UserController } = require("../controller");
const router = express.Router();


router.post('/add-user',UserController.addUser);
router.post('/get-user',UserController.getUser);
router.put("/update-user", UserController.updateUser);
router.delete("/delete-user", UserController.deleteUser);

module.exports = router;