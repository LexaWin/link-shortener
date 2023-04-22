const { NotFoundError } = require('../modules/error');
const linksService = require('../services/links');

async function resolveAlias(request, response, next) {
  try {
    const { alias } = request.params;

    // if (alias.length === 0 || /^[a-zA-Z0-9]+$/.test(alias) === false) {
    if (alias.length === 0) {
      return next();
    }

    const longLink = await linksService.getByAlias(alias);

    if (!longLink) {
      throw new NotFoundError(`Alias "${alias}" was not found...`);
    }

    const { link, visited, isOneTimeLink, ttl } = longLink;

    if (process.env.NODE_ENV === 'production') {
      response.redirect(302, link);
    } else {
      response.send({ alias, link, visited, isOneTimeLink, ttl });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { resolveAlias };
