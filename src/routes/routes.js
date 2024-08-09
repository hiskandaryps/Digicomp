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
    getDays } = require("../handler/handler");
const { authenticateToken } = require("../middleware/jsonwebtoken");


// Define routes
router.post("/user", register);
router.post("/user/login", logIn);
router.get("/user", authenticateToken, getUser); 
router.get("/realtime", getRealtime); 
router.post("/realtime", postRealtime);
router.post("/records", postRecords); 
router.get("/records", getRecords); 
router.get("/control", getControl); 
router.put("/control/temperature", authenticateToken, putControlTemp); 
router.put("/control/moisture", authenticateToken, putControlMoist); 
router.put("/state/activate", activateDevice);
router.put("/state/deactivate", deactivateDevice);
router.get("/state", authenticateToken, getState);
router.get("/time/days", authenticateToken, getDays);

module.exports = router;