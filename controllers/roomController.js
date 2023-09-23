const Room = require("../models/Room");

// Display the lobby
exports.getLobby = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.render("pages/lobby", { rooms });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  const { name } = req.body;
  const newRoom = new Room({ name, maxUsers: 2 });

  try {
    await newRoom.save();
    res.redirect("/rooms");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Display a specific room
exports.getRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    // Set currentUserRoom in the render function based on the user's session
    res.render("pages/room", {
      room,
      currentUserRoom: req.session.roomId || null,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Join a room
exports.joinRoom = async (req, res) => {
  const roomId = req.params.id;
  const username = req.body.username;

  try {
    // Find the room by ID
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the room is full
    if (room.users.length >= room.maxUsers) {
      return res.status(400).json({ error: "Room is full" });
    }

    // Check if the user is already in a room
    if (req.session.roomId) {
      return res.status(400).json({ error: "You are already in a room" });
    }

    // Add the user to the room and update the user's session
    room.users.push(username);
    await room.save();
    req.session.roomId = roomId;

    res.status(200).json({ message: "You have joined the room" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// Leave a room
exports.leaveRoom = async (req, res) => {
  try {
    if (req.session.roomId) {
      // Find the room by ID
      const roomId = req.session.roomId;
      const room = await Room.findById(roomId);

      if (room) {
        // Remove the user from the room
        const usernameIndex = room.users.indexOf(req.session.username);
        if (usernameIndex !== -1) {
          room.users.splice(usernameIndex, 1);
          await room.save();
        }

        // Clear the user's session
        req.session.roomId = null;
        req.session.username = null;

        res.status(200).json({ message: "You have left the room" });
      } else {
        res.status(404).json({ error: "Room not found" });
      }
    } else {
      res.status(400).json({ error: "You are not in a room" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
