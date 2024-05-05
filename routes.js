const express = require("express");
const router = express.Router();
const { getUser, checkUser, postUser } = require("./handler");

// Define routes
router.get("/user", getUser);
router.get("/login/user/", checkUser);
router.post("/user", postUser); 

module.exports = router;