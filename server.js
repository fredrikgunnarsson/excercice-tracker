const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
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
  let user = Users.users.find((el) => el._id === req.params._id);
  delete req.body[":_id"];
  if (!req.body.date)
    req.body.date = new Date(Date.now()).toISOString().slice(0, 10);
  user.log.push(req.body);
  res.send(user);
});

app.get("/api/users/:_id/logs", (req, res) => {
  if (!isUserId(req.params._id)) return res.send("no such user ID");
  let user = Users.users.find((el) => el._id === req.params._id);
  user.count = user.log.length;
  let resUser = JSON.parse(JSON.stringify(user));
  const { limit, from, to } = req.query;
  if (limit) {
    resUser.log = resUser.log.filter((el, idx) => idx < limit);
  }
  if (from) {
    // console.log(resUser.log[0].date, Date(resUser.log[0].date));
    resUser.log = resUser.log.filter(
      (el) => new Date(el.date) >= new Date(from)
    );
  }
  if (to) {
    resUser.log = resUser.log.filter((el) => new Date(el.date) <= new Date(to));
  }

  res.send(resUser);
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
  return Users.users.find((el) => el._id === userId);
}

const Users = { users: [] };
class User {
  constructor(username, _id, log) {
    (this.username = username), (this._id = generateId()), (this.log = []);
  }
}
Users.users.push(new User("stefan"));
