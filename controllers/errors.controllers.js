exports.handlingCustomErrors = (err, req, res, next) => {
  const errorsMessages = [
    "article does not exist",
    "not found",
    "comment does not exist",
    "user does not exist",
  ];

  if (errorsMessages.includes(err.msg)) {
    res.status(404).send(err);
  } else if (err.msg === "invalid request") {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

exports.handlingPsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "42703") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "does not exist" });
  } else {
    next(err);
  }
};
