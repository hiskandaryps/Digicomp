//routes.js
const express = require("express");
const router = express.Router();
const { register, logIn, getUser, getRealtime, getRecords, getControl, putControl } = require("../handler/handler");
const { authenticateToken } = require("../middleware/jsonwebtoken");


// Define routes
router.post("/user", register);
router.post("/user/login", logIn);
router.get("/user", getUser); 
router.get("/realtime", getRealtime); 
router.get("/records", getRecords); 
router.get("/control", getControl); 
router.put("/control", putControl); 

module.exports = router;