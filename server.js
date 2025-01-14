const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");

const messages = [];
const users = [];

const app = express();
app.use(express.static(path.join(__dirname, "client")));

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("Server is running on Port:", 8000);
});
const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);
  socket.on("login", (userName) => {
    users.push({ name: userName, id: socket.id });
    console.log(`User logged in: ${userName}, ID: ${socket.id}`);
    console.log("Current users:", users);
    socket.broadcast.emit("join", { author: userName });
  });
  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("Oh, socket " + socket.id + " has left");
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      const userName = users[index].name;
      console.log(`User disconnected: ${userName}, ID: ${socket.id}`);
      socket.broadcast.emit("disconnectUser", { author: userName });
      users.splice(index, 1);
      console.log("Current users:", users);
    }
  });
  console.log("I've added a listener on message event \n");
});
