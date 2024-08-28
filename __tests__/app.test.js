const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET:200 sends an array of topic objects, each of which should have the following properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("Wrong endpoint", () => {
  test("responds with 404 status and error message when provided wrong url", () => {
    return request(app)
      .get("/api/topicsss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api", () => {
  test("should return a list of endpoints with descriptions,queries and exampleResponse", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = body.endpoints;

        expect(endpoints).toEqual(endpointsData);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/888")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/someArticleId")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("the articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments (with the most recent comments first) for the given article_id to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);

        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });

        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET:200 sends an empty array of comments for the given article_id when there are no comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
        expect(Array.isArray(body.comments)).toBe(true);
      });
  });

  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/someId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 inserts a new comment to the comments table and sends the new comment back to the client", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like this article",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(19);
        expect(body.comment.article_id).toBe(2);
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad comment (no user name)", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "I like this article",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when given a valid but non-existent article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like this article",
    };
    return request(app)
      .post("/api/articles/888/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("id does not exist");
      });
  });
  test("POST:400 sends an appropriate status and error message when given an invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like this article",
    };
    return request(app)
      .post("/api/articles/myId/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 update an article votes by given number and sends the updated article back to the client", () => {
    const votesCount = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(votesCount)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({ article_id: 2, votes: -100 });
      });
  });

  test("PATCH:400 sends an appropriate status and error message when no provided updated body", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("PATCH:400 sends an appropriate status and error message when given an invalid article id", () => {
    const votesCount = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/updatedId")
      .send(votesCount)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("PATCH:404 responds with an appropriate status and error message when given a valid but non-existent article id", () => {
    const votesCount = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/88")
      .send(votesCount)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent comment id", () => {
    return request(app)
      .delete("/api/comments/88")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/notId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
