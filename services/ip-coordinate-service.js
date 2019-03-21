const _validateQueryParams = (queries) => {
  if (Object.keys(queries).length < 4) {
    throw {
      status: 422,
      message: 'upperLat, lowerLat, upperLong, and lowerLong are all required parameters'
    };
  }
};

module.exports = {};