/**
 * Returns uneventfully if params are valid; Throws an error if invalid.
 *
 * ASSUMPTION: Latitudes and Longitudes will be in an acceptable and reasonable range
 *
 * @param {*} parameters - query parameters to validate; sourced from req.query
 */
const _validateQueryParams = (parameters) => {
  if (!parameters || Object.keys(parameters).length < 4) {
    throw {
      status: 422,
      message: 'upperLat, lowerLat, upperLong, and lowerLong are all required parameters'
    };
  }

  if (typeof parameters.upperLat !== 'number' ||
    typeof parameters.lowerLat !== 'number' ||
    typeof parameters.upperLong !== 'number' ||
    typeof parameters.lowerLong !== 'number') {
      throw {
        status: 422,
        message: 'upperLat, lowerLat, upperLong, and lowerLong should all be numbers'
      };
    }
};

module.exports = {};