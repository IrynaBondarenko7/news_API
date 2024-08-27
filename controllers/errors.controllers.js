exports.handlingCustomErrors = (err, req, res, next) => {
  if (err.msg === "article does not exist") {
    res.status(404).send(err);
  } else {
    next(err);
  }
};

exports.handlingPsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};
