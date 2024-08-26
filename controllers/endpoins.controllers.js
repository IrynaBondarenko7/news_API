const { readEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (req, res) => {
  readEndpoints()
    .then((endpoints) => {
      console.log(endpoints);
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      console.log(err);
    });
};
