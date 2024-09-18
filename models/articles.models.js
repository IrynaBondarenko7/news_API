const format = require("pg-format");
const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0)
        return Promise.reject({ status: 404, msg: "article does not exist" });
      return result.rows[0];
    });
};

exports.selectAllArticles = (sort_by, order, topic) => {
  const queryProms = [];
  const validColumns = [
    "article_id",
    "title",
    "author",
    "created_at",
    "topic",
    "votes",
    "comment_count",
  ];
  const validOrder = ["desc", "asc"];

  let queryString =
    "SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id";
  if (sort_by) {
    if (!validColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "invalid request" });
    }
    order
      ? (queryString += ` ORDER BY articles.${sort_by} ${order}`)
      : (queryString += ` ORDER BY articles.${sort_by} DESC`);
  } else if (order) {
    if (!validOrder.includes(order)) {
      return Promise.reject({ status: 400, msg: "invalid request" });
    }
    sort_by
      ? (queryString += ` ORDER BY articles.${sort_by} ${order}`)
      : (queryString += ` ORDER BY articles.created_at ${order}`);
  } else {
    queryString += ` ORDER BY articles.created_at DESC`;
  }

  if (topic) {
    if (sort_by && order) {
      queryString = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic='${topic}' GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;
    } else if (sort_by) {
      queryString = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic='${topic}' GROUP BY articles.article_id ORDER BY articles.${sort_by} ASC`;
    } else if (order) {
      queryString = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic='${topic}' GROUP BY articles.article_id ORDER BY articles.created_at ${order}`;
    } else {
      queryString = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic='${topic}' GROUP BY articles.article_id ORDER BY articles.created_at DESC`;
    }

    queryProms.push(checkExists("articles", "topic", topic));
  }

  queryProms.push(db.query(queryString));

  return Promise.all(queryProms).then((response) => {
    return queryProms.length === 1 ? response[0].rows : response[1].rows;
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
  queryProms.push(checkExists("articles", "article_id", article_id));

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
