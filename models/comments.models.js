const format = require("pg-format");
const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ msg: "comment does not exist" });
      }
    });
};

exports.updateCommentById = (inc_votes, comment_id) => {
  const queryStr = format(
    "UPDATE comments SET votes=votes + %L WHERE comment_id = $1 RETURNING *",
    inc_votes
  );

  return db.query(queryStr, [comment_id]).then(({ rows }) => {
    return rows[0];
  });
};
