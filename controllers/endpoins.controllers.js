const fs = require("fs/promises");

exports.getEndpoints = (req, res) => {
  fs.readFile(`./endpoints.json`, "utf8")
    .then((data) => {
      const parsedData = JSON.parse(data);
      res.status(200).send({ endpoints: parsedData });
    })
    .catch((err) => {
      console.log(err);
    });
};
