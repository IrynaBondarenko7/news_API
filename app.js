const { getTopics } = require("./controllers/topics.controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
