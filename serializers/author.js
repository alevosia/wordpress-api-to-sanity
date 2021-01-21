const sanitizeHtml = require("../utils/sanitize-html");
const { SANITY_REF_IDS } = require("../config");

module.exports = function serializeAuthor(author) {
  const person = {
    _id: `person-${author.id}`,
    _type: "person",
    avatar: {
      _type: "reference",
      _ref: SANITY_REF_IDS.DefaultAvatarImage,
      _weak: false,
    },
    name: author.name || "Opinyon",
    slug: {
      _type: "slug",
      current: author.slug,
    },
    role: {
      _type: "reference",
      _ref: SANITY_REF_IDS.DefaultRole,
      _weak: false,
    },
    biography: sanitizeHtml(author.description) || "Biography",
  };

  return person;
};
