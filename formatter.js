const logger = require("./logger");

class Formatter {
  parseError(error, status = 500) {
    const errorPayload = {
      error: error.message,
      status,
    };
    return errorPayload;
  }

  parseResponse(result, status) {
    const resultPayload = {
      status,
      result,
    };
    return resultPayload;
  }
}

module.exports = new Formatter();
