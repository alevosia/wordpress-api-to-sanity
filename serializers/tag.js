const parseBody = require('../utils/parse-body')
const sanitizeHtml = require('../utils/sanitize-html')

module.exports = function serializeTag(tag) {
  return {
    _id: `tag-${tag.id}`,
    _type: 'tag',
    title: tag.name,
    slug: tag.slug,
    description: sanitizeHtml(tag.description),
  }
}
