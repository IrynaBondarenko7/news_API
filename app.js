const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoins.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentOnArticle,
  patchArticleById,
  getGreeting,
} = require("./controllers/articles.controllers");
const {
  handlingCustomErrors,
  handlingPsqlErrors,
} = require("./controllers/errors.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", getGreeting);
app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentOnArticle);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlingCustomErrors);
app.use(handlingPsqlErrors);

module.exports = app;
