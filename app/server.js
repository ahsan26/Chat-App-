import express from "express";
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
import "./database";
import mongoose from "mongoose";
import Message from "./models/message";
var userNames = [];
mongoose.Promise = global.Promise;
var savedMessagesLoaded = false;
// Setup Routes
app.use(require("./routes"));
app.use(express.static(__dirname));
io.sockets.on("connection", sockets => {
  if (!savedMessagesLoaded) {
    Message.find({}).then(d => {
      if (d.length) {
        d.forEach(item => {
          io.sockets.emit("savedMessage", { message: item.message, user: item.nickname });
        });
      }
    });
    savedMessagesLoaded = true;
  }
  sockets.on("disconnect", data => {
    if (sockets.userName) {
      userNames.splice(userNames.indexOf(sockets.userName), 1);
      io.sockets.emit("usernames", userNames);
      io.sockets.emit("user_leaved", sockets.userName);
    }
  });
  sockets.on("incoming message", message => {
    io.sockets.emit("message", { message, user: sockets.userName });
    let newMSG = new Message({ nickname: sockets.userName, message });
    newMSG.save();
  });
  sockets.on("new user", (data, callback) => {
    if (userNames.indexOf(data) != -1) {
      callback(false);
    } else {
      sockets.userName = data;
      userNames.push(sockets.userName);
      callback(true);
      console.log(userNames);
      io.sockets.emit("usernames", userNames);
      io.sockets.emit("newUserAdded", sockets.userName);
    }
  });
});

server.listen(process.env.PORT || 19000, function () {
  console.log("Server is Started!");
});