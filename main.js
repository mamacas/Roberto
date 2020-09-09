'use strict';

require('dotenv').config();
const { server } = require('./src/app.js');
const PORT = process.env.PORT || 3000;

server.start(PORT);
