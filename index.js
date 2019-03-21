const express = require('express');
const version = require('./package.json').version;
const ipCoordinateService = require('./services/ip-coordinate-service');
const PORT = process.env.PORT || 5000;

// Status will change to Healthy on initialization complete
// "Failed to Initialize" if data preparation fails
let status = 'Initializing';

const app = express();

app.get('/', (req, res) => {
  res.status(status === 'Healthy' ? 200 : 503).send({
    version: version,
    status: status
  });
});

app.get('/ip-coordinates', (req, res) => {
  if (status === 'Initializing') {
    res.status(503).send({
      message: 'Service is still starting up'
    });
  }
  // try {
  //   validateQueryParams(req.query);
  //   res.status(200).send(req.query);
  // } catch (e) {
  //   return res.status(e.status).send(e);
  // }
});

app.listen(PORT, () => console.log(`Service started at ${PORT}!`));
