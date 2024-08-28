const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id).then(() => {
    res.status(204).send();
  });
};
