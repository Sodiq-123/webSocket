var express = require('express');
var config = require('./app');
var app = express();
require('dotenv').config();
var socket = require('socket.io');

app = config(app);
app.set("port", process.env.PORT || 5000);


//  Server
const server = app.listen(app.get("port"), () => {
  console.log("Server up: http://localhost:" + app.get("port"));
});

// Socket.io connection
const io = socket(server);

const activeUsers = new Set();

io.on("connection", (socket) => {
  console.log("socketIO connection initiated");

  socket.on("new user", (data) => {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });
  
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});