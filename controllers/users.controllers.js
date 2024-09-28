const {
  selectUsers,
  selectUserByName,
  insertNewUser,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUserName = (req, res, next) => {
  const { username } = req.params;

  selectUserByName(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const { name, username, avatar_url } = req.body;

  insertNewUser(name, username, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
