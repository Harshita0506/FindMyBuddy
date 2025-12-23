const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // later you can restrict to frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/user", userRoutes);

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("FindMyBuddy Backend is running 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*", // later replace with Vercel frontend URL
    methods: ["GET", "POST"],
  },
});

// Track connected users
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", ({ roomName, username }) => {
    if (!username) {
      username = `Guest_${socket.id.substring(0, 5)}`;
    }

    if (!users[socket.id]) {
      const userColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);

      users[socket.id] = { username, userColor };
      socket.join(roomName);

      io.to(roomName).emit("message", {
        username: "Admin",
        color: "#000000",
        text: `${username} has joined the room.`,
      });
    }
  });

  socket.on("sendMessage", ({ roomName, message }) => {
    const user = users[socket.id];
    if (user) {
      io.to(roomName).emit("message", {
        username: user.username,
        color: user.userColor,
        text: message,
      });
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.emit("message", {
        username: "Admin",
        color: "#000000",
        text: `${user.username} has left the room.`,
      });
      delete users[socket.id];
    }
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
