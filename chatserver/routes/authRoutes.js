const express = require("express");
const router = express.Router();
const { register, login, user } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/Users", user);

module.exports = router;
