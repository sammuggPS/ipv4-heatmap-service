const ipCoordinateService = require('../services/ip-coordinate');
const version = require('../package.json').version;

const getStatus = (req, res) => {
  res.status(200).send({
    version: version,
    status: 'Healthy',
    environment: process.env.NODE_ENV,
    dependencies: {
      'Heroku Postgres': 'https://elements.heroku.com/addons/heroku-postgresql'
    }
  });
};

const getPointsInBoundingBox = (req, res) => {
  ipCoordinateService.getPointsInBoundingBox(req.query)
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((e) => {
      res.status(e.status || 500).send(e);
    });
};

module.exports = {
  getStatus,
  getPointsInBoundingBox
};