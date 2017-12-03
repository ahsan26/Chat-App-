import express from "express";
const Router = express.Router();

Router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

module.exports = Router;
