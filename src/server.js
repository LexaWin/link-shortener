const express = require('express');

const { addAlias } = require('./controllers/addAlias');
const { resolveAlias } = require('./controllers/resolveAlias');
const { reset } = require('./controllers/reset');
const { deleteAlias } = require('./controllers/deleteAlias');
const { notFound } = require('./middlewares/notFound.js');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.post('/links', addAlias);
app.get('/:alias', resolveAlias);
app.put('/:alias/reset', reset);
app.delete('/:alias', deleteAlias);

app.use(notFound);

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
