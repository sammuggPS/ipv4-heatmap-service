/**
 * Validates input latitudes and longiutdes
 * Returns uneventfully if params are valid; Throws an error if invalid.
 *
 * This was written with TDD!
 * The prefix '_' indicates that this is a private method that shouldn't be exported.
 *
 * @param {*} parameters - query parameters to validate; sourced from req.query
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

module.exports = {};