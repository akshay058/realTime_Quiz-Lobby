// routes/roomRoutes.js
const express = require("express");
const router = express.Router();

// Import your room controller
const roomController = require("../controllers/roomController");

// Define routes
router.get("/", roomController.getLobby);
router.post("/create", roomController.createRoom);
router.get("/:id", roomController.getRoom);
router.post("/:id/join", roomController.joinRoom);
router.post("/leave", roomController.leaveRoom);

module.exports = router;
