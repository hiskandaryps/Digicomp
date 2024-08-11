//routes.js
const express = require("express");
const router = express.Router();
const { register, 
    logIn, 
    getUser, 
    getRealtime, 
    postRealtime, 
    postRecords,
    getRecords, 
    getControl, 
    putControlTemp, 
    putControlMoist, 
    deactivateDevice, 
    activateDevice, 
    getState,
    getDays,
    calculateFIS } = require("../handler/handler");
const { authenticateToken } = require("../middleware/jsonwebtoken");


// Define routes
router.post("/user", register);
router.post("/user/login", logIn);
router.get("/user", authenticateToken, getUser); 
router.get("/data/realtime", getRealtime); 
router.post("/data/realtime", postRealtime);
router.post("/data/records", postRecords); 
router.get("/data/records", getRecords); 
router.get("/control", getControl); 
router.put("/control/temperature", authenticateToken, putControlTemp); 
router.put("/control/moisture", authenticateToken, putControlMoist); 
router.put("/state/activate", activateDevice);
router.put("/state/deactivate", deactivateDevice);
router.get("/state", getState);
router.get("/state/days", authenticateToken, getDays);
router.post("/fuzzy", calculateFIS);
//router.post("/fuzzy", getFIS);

module.exports = router;