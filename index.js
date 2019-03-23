const express = require('express');
const version = require('./package.json').version;
const ipCoordinateService = require('./services/ip-coordinate-service');
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
  try {
    // ipCoordinateService(req.query);
    res.status(200).send(req.query);
  } catch (e) {
    return res.status(e.status).send(e);
  }
});

app.listen(PORT, () => console.log(`Service started at ${PORT}!`));
