const fetch = require("node-fetch");
const serializePost = require("../serializers/post");
const { getEndpointUrl } = require("../utils/urls");
const ENDPOINT_NAME = "posts";

async function getPosts() {
  const posts = await fetch(getEndpointUrl(ENDPOINT_NAME));
  const postsJson = await posts.json();

  return Promise.all(
    postsJson.map(async (postJson) => serializePost(postJson))
  );
}

module.exports = getPosts;
