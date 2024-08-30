const { getGreeting } = require("./controllers/articles.controllers");
const {
  handlingCustomErrors,
  handlingPsqlErrors,
} = require("./controllers/errors.controllers");

const apiRouter = require("./routers/api-router");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", getGreeting);

app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handlingCustomErrors);
app.use(handlingPsqlErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
