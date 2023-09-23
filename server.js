// app.js
const express = require("express");
const session = require("express-session");

const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

const dotenv = require("dotenv");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//config env
dotenv.config();

// Load MongoDB configuration
const dbConfig = require("./config/database");
mongoose.connect(dbConfig.url, dbConfig.options);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(
  session({
    secret: "your-secret-key", // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Add body parsing middleware
app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Define routes
const roomRoutes = require("./routes/roomRoutes");
app.use("/rooms", roomRoutes);
app.get("/", (req, res) => {
  res.redirect("/rooms");
});

// Set up Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle Socket.IO events here

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Additional cleanup code as needed
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
