const linksService = require('../services/links');

async function addAlias(request, response) {
  const { link, isOneTimeLink = false, ttl = 0 } = request.body;
  const alias = 'alias_' + link.slice(-5);

  await linksService.addAlias(alias, link, isOneTimeLink, ttl);

  return response.send({
    alias,
    link,
    visited: 0,
    isOneTimeLink,
    ttl,
  });
}

module.exports = { addAlias };
