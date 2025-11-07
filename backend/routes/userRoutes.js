const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");

const { verifyToken } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
