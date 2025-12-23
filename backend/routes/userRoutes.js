const express = require("express");
const { registerUser, authUser } = require("../controllers/userControllers");

const router = express.Router();

// POST request to register a user
router.route("/").post(registerUser);

// POST request for user login
router.post("/login", authUser);

module.exports = router;
