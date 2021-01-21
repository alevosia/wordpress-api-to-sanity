const parseBody = require("../utils/parse-body");
const sanitizeHtml = require("../utils/sanitize-html");
const { SANITY_REF_IDS, WP_CATEGORY_IDS } = require("../config");

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

module.exports = function serializePost({ content, ...post }) {
  const section = getSection(post.categories);
  const topicRefId = getTopicRefId(post.categories);
  const date = post.date
    ? new Date(post.date).toISOString()
    : new Date().toISOString();

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
    summary: "",
    content: content.rendered
      ? parseBody(content.rendered)
      : [{ _type: "block", markDefs: [], children: [] }],
    author: {
      _type: "reference",
      _ref: `person-${post.author}`,
      _weak: false,
    },
    publishedAt: date,
    updatedAt: date,
  };

  return article;
};
