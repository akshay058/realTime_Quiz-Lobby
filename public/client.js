document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  function updateRoomList(rooms) {
    const roomList = document.getElementById("roomList");
    roomList.innerHTML = "";

    rooms.forEach((room) => {
      const roomDiv = document.createElement("div");
      roomDiv.innerHTML = `<button onclick="joinRoom('${room.name}')">${room.name} (${room.users.length}/2)</button>`;
      roomList.appendChild(roomDiv);
    });
  }

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("updateRooms", (rooms) => {
    updateRoomList(rooms);
  });

  socket.on("errorMessage", (message) => {
    alert(message);
  });

  socket.on("userJoined", (username) => {
    alert(`${username} joined the room.`);
  });

  socket.on("gameStarted", () => {
    alert("The game has started.");
  });

  function createRoom() {
    const username = document.getElementById("username").value;
    socket.emit("createRoom", username);
  }

  function joinRoom(roomName) {
    const username = document.getElementById("username").value;
    socket.emit("joinRoom", { roomName, username });
  }

  function startGame() {
    const roomName = document.getElementById("username").value;
    socket.emit("startGame", roomName);
  }

  function leaveRoom() {
    socket.emit("leaveRoom");
  }

  function joinMatchmaking() {
    const username = document.getElementById("username").value;
    socket.emit("joinMatchmaking", username);
  }

  socket.on("noAvailableRooms", () => {
    const username = document.getElementById("username").value;
    socket.emit("createRoom", username);
    alert("No available rooms. Creating a new room.");
  });

  const createRoomButton = document.getElementById("createRoomButton");
  const joinMatchmakingButton = document.getElementById(
    "joinMatchmakingButton"
  );

  createRoomButton.addEventListener("click", createRoom);
  joinMatchmakingButton.addEventListener("click", joinMatchmaking);
});
