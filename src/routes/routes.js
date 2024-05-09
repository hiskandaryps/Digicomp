//routes.js
const express = require("express");
const router = express.Router();
const { register, logIn, getUser, getRealtime, getRecords } = require("../handler/handler");
const { authenticateToken } = require("../middleware/jsonwebtoken");


// Define routes
router.post("/register", register);
router.post("/login", logIn);
router.get("/user", authenticateToken, getUser); 
router.get("/realtime", authenticateToken, getRealtime); 
router.get("/records", authenticateToken, getRecords); 

module.exports = router;