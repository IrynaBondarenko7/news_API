const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByName = (username) => {
  return db
    .query("SELECT * FROM users WHERE users.username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user does not exist" });
      }

      return rows[0];
    });
};

exports.insertNewUser = (name, username, avatar_url) => {
  return db
    .query(
      "INSERT INTO users (name, username, avatar_url) VALUES ($1, $2, $3) RETURNING *",
      [name, username, avatar_url]
    )
    .then((result) => {
      return result.rows[0];
    });
};
