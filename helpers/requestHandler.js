const request = require("request-promise");
const logger = require("../logger")();

module.exports = () => {
  const doReq = (payload, uri, queryParam, headers, method) => {
    return new Promise((resolve, reject) => {
      let options = {
        method: method,
        uri: uri,
        json: true,
        resolveWithFullResponse: true,
      };
      if (headers !== {}) {
        options["headers"] = headers;
      } else {
        options["headers"] = { "content-type": "application/json" };
      }
      if (method === "GET") {
        options["qs"] = queryParam;
      }
      if (method === "POST" || method === "PUT") {
        options["body"] = payload;
      }
      //   logger.debug(`[Request log] - ${JSON.stringify(options)}`);
      request(options)
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          //   logger.error(`[Request error log] - ${JSON.stringify(err)}`);
          return reject(err);
        });
    });
  };
  return {
    doReq,
  };
};
