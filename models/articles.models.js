const format = require("pg-format");
const db = require("../db/connection");
const { checkIdExists } = require("../db/seeds/utils");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0)
        return Promise.reject({ status: 404, msg: "article does not exist" });
      return result.rows[0];
    });
};

exports.selectAllArticles = (sort_by, order, topic) => {
  const validColumns = [
    "article_id",
    "title",
    "author",
    "created_at",
    "topic",
    "votes",
    "article_img_url",
  ];

  let queryString =
    "SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id";
  if (sort_by) {
    if (!validColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "invalid request" });
    }
    queryString += ` ORDER BY articles.${sort_by}`;
  }
  if (order) {
    queryString += ` ${order}`;
  } else {
    queryString += ` ORDER BY articles.created_at DESC`;
  }

  if (topic) {
    queryString = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic='${topic}' GROUP BY articles.article_id ORDER BY articles.created_at DESC`;
  }

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  const queryProms = [];
  queryProms.push(
    db.query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
  );
  queryProms.push(checkIdExists("articles", "article_id", article_id));

  return Promise.all(queryProms).then((promResults) => {
    return promResults[0].rows;
  });
};

exports.insertNewCommentOnArticle = (author, body, article_id) => {
  return db
    .query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *",
      [body, author, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticleById = (inc_votes, article_id) => {
  const queryStr = format(
    "UPDATE articles SET votes=votes + %L WHERE article_id = $1 RETURNING *",
    inc_votes
  );

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, msg: "article does not exist" });
    return rows[0];
  });
};
