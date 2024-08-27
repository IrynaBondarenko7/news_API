exports.handlingCustomErrors = (err, req, res, next) => {
  if (err.msg === "article does not exist" || err.msg === "not found") {
    res.status(404).send(err);
  } else {
    next(err);
  }
};

exports.handlingPsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "id does not exist" });
  } else {
    next(err);
  }
};
