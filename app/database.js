const MongoClient = require("mongodb").MongoClient;
import mongoose from "mongoose";

mongoose.connect("mongodb://admin:123456@ds127536.mlab.com:27536/chat_app", {useMongoClient: true});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", _ => {
  console.log("Database is connected!");
  return db;
});
