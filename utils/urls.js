require("dotenv").config();

const { PAGE, PER_PAGE } = require("../config");

function getEndpointUrl(segment) {
  return `${
    process.env.WP_API_ENDPOINT || ""
  }/${segment}?page=${PAGE}&per_page=${PER_PAGE}`;
}

module.exports = {
  getEndpointUrl,
};
