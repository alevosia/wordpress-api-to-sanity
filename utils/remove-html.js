const sanitizeHTML = require("sanitize-html");

module.exports = (html) =>
  sanitizeHTML(html, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });
