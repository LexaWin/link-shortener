const { NotFoundError } = require('../modules/error');
const linksService = require('../services/links');

async function reset(request, response, next) {
  try {
    const { alias } = request.params;
    // if (alias.length === 0 || /^[a-zA-Z0-9]+$/.test(alias) === false) {
    if (alias.length === 0) {
      return next();
    }
    const status = await linksService.resetCounterByAlias(alias);

    response.send({ status });
  } catch (err) {
    next(err);
  }
}

module.exports = { reset };
