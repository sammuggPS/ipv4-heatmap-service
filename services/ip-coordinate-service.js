/**
 * Validates input latitudes and longiutdes
 * Returns uneventfully if params are valid; Throws an error if invalid.
 *
 * @param {*} parameters - query parameters to validate; sourced from req.query
 */
const _validateBoundingBoxCoordinates = (parameters) => {
  if (!parameters || Object.keys(parameters).length < 4) {
    throw {
      status: 422,
      message: 'upperlat, lowerlat, upperlong, and lowerlong are all required parameters'
    };
  }

  if (typeof parameters.upperlat !== 'number' ||
    typeof parameters.lowerlat !== 'number' ||
    typeof parameters.upperlong !== 'number' ||
    typeof parameters.lowerlong !== 'number') {
      throw {
        status: 422,
        message: 'upperlat, lowerlat, upperlong, and lowerlong should all be numbers'
      };
    }

    if (-90 <= parameters.upperlat <= 90 ||
      -90 <= parameters.lowerlat <= 90 ||
      -179.999999 <= parameters.upperlong <= 180 ||
      -179.999999 <= parameters.lowerlong <= 180) {
        throw {
          status: 422,
          message: 'upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range'
        };
      }
};

module.exports = {};