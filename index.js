const express = require('express');
const version = require('./package.json').version;
const ipCoordinateService = require('./services/ip-coordinate');
const dbService = require('./services/db');
const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
  res.status(200).send({
    version: version,
    status: 'Healthy',
    environment: process.env.NODE_ENV,
    dependencies: {
      'Heroku Postgres': 'https://elements.heroku.com/addons/heroku-postgresql'
    }
  });
});

app.get('/ip-coordinates', (req, res) => {
  ipCoordinateService.getInBoundsPoints(req.query)
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((e) => {
      res.status(e.status || 500).send(e);
    });
});

//initialize db connection
dbService.init()
  .then(() => {
    app.listen(PORT, () => console.log(`Service started at ${PORT}!`));
  })
  .catch((e) => {
    console.info('Error connecting to DB', e);
    process.exit(1);
  });
