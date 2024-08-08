//routes.js
const express = require("express");
const router = express.Router();
const { register, logIn, getUser, getRealtime, postRealtime, getRecords, getControl, putControlTemp, putControlMoist, deactivateDevice, activateDevice, getState } = require("../handler/handler");
const { authenticateToken } = require("../middleware/jsonwebtoken");


// Define routes
router.post("/user", register);
router.post("/user/login", logIn);
router.get("/user", authenticateToken, getUser); 
router.get("/realtime", getRealtime); 
router.post("/realtime", postRealtime);
router.get("/records", getRecords); 
router.get("/control", getControl); 
router.put("/control/temperatur", authenticateToken, putControlTemp); 
router.put("/control/kelembapan", authenticateToken, putControlMoist); 
router.put("/state/activate", authenticateToken, activateDevice);
router.put("/state/deactivate", authenticateToken, deactivateDevice);
router.get("/state", authenticateToken, getState);

module.exports = router;