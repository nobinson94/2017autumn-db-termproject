const express = require('express');

const app = express();

const auth = require('./auth');
const cctv = require('./cctv');
const takeSpace = require('./takeSpace');
const file = require('./file');
const neighbor = require('./neighbor');
const info = require('./info');
const path = require('./path');
const sequence = require('./sequence');

app.use('/auth', auth);
app.use('/cctv', cctv);
app.use('/takeSpace', takeSpace);
app.use('/file', file);
app.use('/neighbor', neighbor);
app.use('/info', info);
app.use('/path', path);
app.use('/sequence', sequence);

module.exports = app;
