//routes.js
const express = require("express");
const router = express.Router();
const { register, logIn, getUser } = require("./handler");

// Define routes
router.post("/register", register);
router.post("/login", logIn);
router.get("/user", getUser); 

module.exports = router;