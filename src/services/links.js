const fs = require('fs/promises');
const path = require('path');

const { dbPath } = require('../config');
const { BadRequestError } = require('../modules/error');

const linksDevFilePath = path.resolve(dbPath, './links.dev.json');
const linksProdFilePath = path.resolve(dbPath, './links.prod.json');

const linksFilePath =
  process.env.LINKS_TYPE === 'prod' ? linksProdFilePath : linksDevFilePath;

async function deleteByAlias(alias) {
  const links = require(linksFilePath);

  if (links[alias]) {
    delete links[alias];
    await fs.writeFile(linksFilePath, JSON.stringify(links, null, 2), 'utf-8');
    return 'ok';
  }

  return 'error';
}

async function resetCounterByAlias(alias) {
  const links = require(linksFilePath);

  if (links[alias]) {
    links[alias].visited = 0;
    await fs.writeFile(linksFilePath, JSON.stringify(links, null, 2), 'utf-8');
    return 'ok';
  }

  return 'error';
}

async function getByAlias(alias) {
  const links = require(linksFilePath);

  const longLink = links[alias];

  if (longLink) {
    longLink.visited += 1;
    await fs.writeFile(linksFilePath, JSON.stringify(links, null, 2), 'utf-8');
    if (longLink.isOneTimeLink) {
      setTimeout(async () => await deleteByAlias(alias), longLink.ttl);
    }
  }

  return longLink;
}

async function addAlias(alias, link, isOneTimeLink, ttl) {
  const links = require(linksFilePath);

  if (!links[alias]) {
    links[alias] = { link, visited: 0, isOneTimeLink, ttl: ttl < 0 ? 0 : ttl };
    await fs.writeFile(linksFilePath, JSON.stringify(links, null, 2), 'utf-8');
  }

  return links[alias];
}

module.exports = {
  deleteByAlias,
  resetCounterByAlias,
  getByAlias,
  addAlias,
};
