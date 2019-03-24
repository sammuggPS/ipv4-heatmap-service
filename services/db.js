const { Pool } = require('pg');
const config = require('config');

const pool = new Pool(config.get('pgPool'));

/**
 * The SELECT query used to find coordinates in bounding box
 * - ipv4_points is the table containing the coordinate data from GeoLite2-City-Blocks-IPv4.csv
 * - p.geo is the GEOGRAPHY type column in PG
 * - The POLYGON defines the area in which to find coordinates
 * - ST_GeomFromText lets us form a POLYGON on the fly (doesn't have to be stored in db)
 * - the ST_INTERSECTS will return true if the point is inside the polygon
 */
const findInPolygonSql = 'SELECT * FROM ipv4_points as p WHERE ST_INTERSECTS(ST_GeomFromText(\'POLYGON(($1 $3, $1 $4, $2 $4, $2 $3, $1 $3))\', 4326), p.geo)';

pool.query('SELECT NOW()')
  .then((res) => {
    console.info('Connected to DB.');
  })
  .catch((e) => {
    console.error('Couldn\'t connect to DB. Shutting down.');
    process.exit(0);
  });

let isShuttingDown = false;
const shutdownPool = () => {
  if (!isShuttingDown) {
    isShuttingDown = true;
    console.info('Cleaning out DB Pool');
    pool.end()
      .finally(() => {
        process.exit(0);
      });
  }
};

process.on('exit', shutdownPool);
process.on('SIGINT', shutdownPool);

const findInBoundingBox = () => {
  return findInPolygonSql;
};

module.exports = {
  findInBoundingBox
};