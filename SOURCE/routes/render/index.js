const express = require('express');

const app = express();

const home = require('./home');
const cctv = require('./cctv');
const file = require('./file');
const user = require('./user');
const neighbor = require('./neighbor');
const sequence = require('./sequence');
const takeSpace = require('./takeSpace');
const path = require('./path');
const info = require('./info');

app.use('/', home);
app.use('/cctv', cctv);
app.use('/file', file);
app.use('/user', user);
app.use('/neighbor', neighbor);
app.use('/sequence', sequence);
app.use('/takeSpace', takeSpace);
app.use('/path', path);
app.use('/info', info);

module.exports = app;
