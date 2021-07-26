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
  res.send(req.params);
});
app.get("/api/users/", (req, res) => {
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
app.post("/api/users/:_id/exercises", (req, res) => {
  if (!isUserId(req.params._id)) return res.send("no such user ID");
  let user = Users.users.find((el) => el._id);
  delete req.body[":_id"];
  user.log.push(req.body);
  console.log(req.params);
  console.log(req.body);
  res.send(user);
});

app.get("/api/users/:_id/logs", (req, res) => {
  if (!isUserId(req.params._id)) return res.send("no such user ID");
  let user = Users.users.find((el) => el._id === req.params._id);
  user.count = user.log.length;
  // console.log(user);
  // console.log(Users);
  res.send(user);
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
function isUserId(userId) {
  console.log(Users.users.find((el) => el._id === userId));
  return Users.users.find((el) => el._id === userId);
}

const Users = { users: [] };
class User {
  constructor(username, _id, log) {
    (this.username = username), (this._id = generateId()), (this.log = []);
  }
}
Users.users.push(new User("stefan"));
