const parseBody = require("../utils/parse-body");
const removeHTML = require("../utils/remove-html");
const capitalizeSection = require("../utils/capitalize-section");
const {
  SANITY_REF_IDS,
  WP_CATEGORY_IDS,
  OPINYON_AUTHORS,
} = require("../config");

function getSection(categories) {
  if (!categories || categories.length === 0) {
    return "national";
  }

  const category = categories[categories.length - 1];

  switch (category) {
    case WP_CATEGORY_IDS.Batangas:
      return "batangas";
    case WP_CATEGORY_IDS.Bicol:
      return "bicol";
    case WP_CATEGORY_IDS.Business:
      return "business";
    case WP_CATEGORY_IDS.CommunityWhispers:
      return "opinion";
    case WP_CATEGORY_IDS.Entertainment:
      return "entertainment";
    case WP_CATEGORY_IDS.Laguna:
      return "laguna";
    case WP_CATEGORY_IDS.Lifestyle:
      return "lifestyle";
    case WP_CATEGORY_IDS.Metro:
      return "metro-manila";
    case WP_CATEGORY_IDS.Mystery:
      return "mystery";
    case WP_CATEGORY_IDS.National:
      return "national";
    case WP_CATEGORY_IDS.Opinion:
      return "opinion";
    case WP_CATEGORY_IDS.PaneloSaid:
      return "opinion";
    case WP_CATEGORY_IDS.Region8:
      return "region-8";
    case WP_CATEGORY_IDS.World:
      return "world";
    default:
      return "national";
  }
}

function getTopicRefId(categories) {
  if (!categories || categories.length === 0) {
    return "national";
  }

  if (categories.includes(WP_CATEGORY_IDS.CommunityWhispers)) {
    return SANITY_REF_IDS.CommunityWhispersTopic;
  }

  return SANITY_REF_IDS.NoTopic;
}

function getAuthorRefId(excerpt, author) {
  if (!excerpt || excerpt.length === 0) {
    return `person-${author}`;
  }

  const sanitized = removeHTML(excerpt);

  const indexOfBy = sanitized.indexOf("By");
  const indexOfBar = sanitized.indexOf("|");

  if (indexOfBy === -1 || indexOfBar === -1) {
    return `person-${author}`;
  }

  const wordpressAuthorName = sanitized
    .substring(indexOfBy + 2, indexOfBar - 1)
    .trim();

  if (!wordpressAuthorName || wordpressAuthorName.length === 0) {
    return `person-${author}`;
  }

  const opinyonAuthor = OPINYON_AUTHORS.find(
    (opinyonAuthor) =>
      opinyonAuthor.name.toLowerCase() == wordpressAuthorName.toLowerCase()
  );

  if (!opinyonAuthor) {
    return `person-${author}`;
  }

  return opinyonAuthor._id;
}

module.exports = function serializePost(post) {
  const section = getSection(post.categories);
  const topicRefId = getTopicRefId(post.categories);
  const date = post.date
    ? new Date(post.date).toISOString()
    : new Date().toISOString();

  const authorRefId = getAuthorRefId(post.excerpt.rendered, post.author);

  const article = {
    _id: `article-${post.id}`,
    _type: "article",
    title: post.title.rendered || "Untitled",
    slug: {
      _type: "slug",
      current: post.slug,
    },
    cover: {
      _type: "reference",
      _ref: SANITY_REF_IDS.DefaultCoverImage,
      _weak: false,
    },
    section: section,
    topic: {
      _type: "reference",
      _ref: topicRefId,
      _weak: false,
    },
    summary: capitalizeSection(section) || "News",
    content: post.content.rendered
      ? parseBody(post.content.rendered)
      : [{ _type: "block", markDefs: [], children: [] }],
    author: {
      _type: "reference",
      _ref: authorRefId,
      _weak: false,
    },
    publishedAt: date,
    updatedAt: date,
  };

  // console.log({
  //   title: article.title,
  //   section: article.section,
  //   topic: article.topic,
  //   author: article.author,
  //   summary: article.summary,
  // });

  // console.log(
  //   "================================================================"
  // );

  return article;
};
