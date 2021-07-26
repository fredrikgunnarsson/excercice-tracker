const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
// app.use(express.json());
app.use(express.urlencoded());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/api/users/:id", (req, res) => {
  res.send("hello");
  console.log("hello api");
  console.log(req.params);
});
app.get("/users/", (req, res) => {
  res.send(Users.users);
});
app.post("/api/users/", (req, res) => {
  if (isUser(req.body.username)) {
    res.send("is user");
    return;
  }
  let newUser = new User(req.body.username);
  Users.users.push(newUser);
  res.send(newUser);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

function generateId() {
  return Math.random().toString(36).slice(2);
}

function isUser(user) {
  return Users.users.find((el) => el.username === user);
}

const Users = { users: [] };
class User {
  constructor(username, _id) {
    (this.username = username), (this._id = generateId());
  }
}
Users.users.push(new User("stefan"));
