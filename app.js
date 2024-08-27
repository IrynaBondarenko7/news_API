const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoins.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  handlingCustomErrors,
  handlingPsqlErrors,
} = require("./controllers/errors.controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlingCustomErrors);
app.use(handlingPsqlErrors);

module.exports = app;
