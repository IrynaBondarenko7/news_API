const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentOnArticle,
  patchArticleById,
} = require("../controllers/articles.controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter
  .get("/:article_id", getArticleById)
  .patch("/:article_id", patchArticleById);

articlesRouter
  .get("/:article_id/comments", getCommentsByArticleId)
  .post("/:article_id/comments", postCommentOnArticle);

module.exports = articlesRouter;
