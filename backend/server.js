const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// ------------------- CONFIG -------------------
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ------------------- CORS SETUP -------------------
const allowedOrigins = [
  "http://localhost:3000",            // local frontend
  process.env.FRONTEND_URL,           // deployed frontend (Vercel)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------- SERVER & SOCKET -------------------
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ------------------- SOCKET LOGIC -------------------
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

// ------------------- ROUTES -------------------
app.use("/api/user", userRoutes);

// ------------------- ROOT & PRODUCTION BUILD -------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running");
  });
}

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
