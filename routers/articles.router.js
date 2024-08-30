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
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentOnArticle);

module.exports = articlesRouter;
