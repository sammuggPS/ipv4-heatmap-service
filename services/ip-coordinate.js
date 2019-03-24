const dbService = require('./db');

/**
 * Validates input latitudes and longiutdes
 * Returns uneventfully if params are valid; Throws an error if invalid.
 *
 * This was written using TDD!
 *
 * @param {*} parameters - query parameters to validate; sourced from req.query
 * @throws error if params are invalid
 * @returns undefined
 */
const _validateBoundingBoxCoordinates = (parameters) => {
  if (!parameters ||
      Object.keys(parameters).length < 4 ||
      !(parameters.upperlat && parameters.lowerlat && parameters.upperlong &&parameters.lowerlong)) {
    throw {
      status: 422,
      message: 'upperlat, lowerlat, upperlong, and lowerlong are all required parameters'
    };
  }

  // Taking advantage of Javascript where 1 == '1' (even though 1 !== '1')
  if (!(-90 <= parameters.upperlat && 90 >= parameters.upperlat &&
    -90 <= parameters.lowerlat && 90 >= parameters.lowerlat &&
    -179.999999<= parameters.upperlong && 180 >= parameters.upperlong &&
    -179.999999 <= parameters.lowerlong && 180 >= parameters.lowerlong)) {
    throw {
      status: 422,
      message: 'upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range'
    };
  }
};

/**
 * Takes result set from db query and converts it into GeoJson format.
 *
 * This was written using TDD!
 *
 * @params {*} results - result set from db query
 * @returns {GeoJSON} Feature Collection (Spec: https://tools.ietf.org/html/rfc7946)
 */
const _mapResultsToGeoJson = (results) => {
  return {
    type: 'FeatureCollection',
    features: results.rows.map((row) => {
      return {
        type: 'Feature',
        properties: {
          id: row.id
        },
        geometry: {
          type: 'Point',
          coordinates: [
            row.long,
            row.lat
          ]
        }
      };
    })
  };
};

const getPointsInBoundingBox = async (params) => {
  _validateBoundingBoxCoordinates(params);
  return dbService.findInBoundingBox(params);
};

module.exports = {
  getPointsInBoundingBox
};