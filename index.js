const express = require('express');
const cors = require('cors');
const config = require('config');

const handlers = require('./handlers/api');
const dbService = require('./services/db');

const PORT = process.env.PORT || 5000;
const app = express();

//initialize db connection
dbService.init()
  .then(() => {
    // Wire up routes to handlers
    app.use(cors(config.get('cors')));
    app.get('/', handlers.getStatus);
    app.get('/ip-coordinates', handlers.getPointsInBoundingBox);
    app.listen(PORT, () => console.log(`Service started at ${PORT}!`));
  })
  .catch((e) => {
    console.info('Error connecting to DB', e);
    process.exit(1);
  });
