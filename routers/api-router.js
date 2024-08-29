const { getEndpoints } = require("../controllers/endpoins.controllers");

const topicRouter = require("../routers/topics.router");
const articlesRouter = require("../routers/articles.router");
const usersRouter = require("../routers/users.router");
const commentsRouter = require("../routers/comments.router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
