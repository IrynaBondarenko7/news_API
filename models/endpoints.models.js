const fs = require("fs/promises");

exports.readEndpoints = () => {
  return fs
    .readFile(`./endpoints.json`, "utf8")
    .then((data) => {
      const parsedData = JSON.parse(data);
      return { endpoints: parsedData };
    })
    .catch((err) => {
      console.log(err);
    });
};
