const {
  getUsers,
  getUserByUserName,
  postUser,
} = require("../controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).post(postUser);
usersRouter.get("/:username", getUserByUserName);

module.exports = usersRouter;
