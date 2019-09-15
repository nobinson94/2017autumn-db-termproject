const express = require('express');

const app = express();

const render = require('./render');
const api = require('./api');

app.use('/', render);
app.use('/api', api);

module.exports = app;
