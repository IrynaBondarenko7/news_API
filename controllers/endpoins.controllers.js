const { readEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (req, res) => {
  readEndpoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      console.log(err);
    });
};
