const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoins.controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
