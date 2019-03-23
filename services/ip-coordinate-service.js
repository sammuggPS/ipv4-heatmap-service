/**
 * Validates input latitudes and longiutdes
 * Returns uneventfully if params are valid; Throws an error if invalid.
 *
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
 * Constructs the SELECT query that uses ST_INTERSECT to find points in the bound box.
 * - ipv4_points is the table containing the coordinate data from GeoLite2-City-Blocks-IPv4.csv
 * - p.geo is the GEOGRAPHY type column in PG
 * - The POLYGON defines the area in which to find coordinates
 * - ST_GeomFromText lets us form a POLYGON on the fly (doesn't have to be stored in db)
 * - the ST_INTERSECTS will return true if the point is inside the polygon
 *
 * The prefix '_' indicates that this is a private method that shouldn't be exported.
 *
 * @param {*} params - dereferenced upper and lower latitude and longitude
 * @returns {String} SELECT query
 */
const _constructIntersectQuery = ({ upperlat, upperlong, lowerlat, lowerlong}) => {
  return 'SELECT * FROM ipv4_points as p WHERE ' +
    'ST_INTERSECTS(ST_GeomFromText(\'POLYGON((' +
      `${lowerlong} ${lowerlat}, ` +
      `${lowerlong} ${upperlat}, ` +
      `${upperlong} ${upperlat}, ` +
      `${upperlong} ${lowerlat}, ` +
      `${lowerlong} ${lowerlat}))', 4326), ` +
      'p.geo)';
};

module.exports = {};