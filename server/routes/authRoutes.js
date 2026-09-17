const express = require("express");

const{
    registerUser,
    loginUser
} = require("../controllers/authController");

const router = express.Router();

//Register route
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;