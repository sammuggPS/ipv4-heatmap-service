const { Pool } = require('pg');
const poolConfig = require('config').get('pgPool');

let pool;
let isShuttingDown = false;

/**
 * When the process is exiting, clears out all open pool connections
 */
const _shutdownPool = () => {
  if (!isShuttingDown) {
    isShuttingDown = true;
    console.info('Cleaning out DB Pool');
    pool.end()
      .finally(() => {
        process.exit(0);
      });
  }
};

const init = async () => {
  pool = new Pool(poolConfig);
  await pool.query('SELECT NOW()');

  console.info('Connected to DB', poolConfig.database);

  // Set up clean up step
  process.on('exit', _shutdownPool);
  process.on('SIGINT', _shutdownPool);
};

/**
 * The SELECT query used to find coordinates in bounding box
 * - ipv4_points is the table containing the coordinate data from GeoLite2-City-Blocks-IPv4.csv
 * - p.geo is the GEOGRAPHY type column in PG
 * - The POLYGON defines the area in which to find coordinates
 * - ST_GeomFromText lets us form a POLYGON on the fly (doesn't have to be stored in db)
 * - the ST_INTERSECTS will return true if the point is inside the polygon
 */
const findInPolygonSql = 'SELECT * FROM ipv4_points as p WHERE ST_INTERSECTS(ST_GeomFromText($1, 4326), p.geo)';

/**
 * Gets a client connection and makes the findInPolygonSql query
 *
 * @param {*} params - query params for bounding box
 * @returns Result set from SELECT query
 */
const findInBoundingBox = async ({ lowerlong, upperlong, lowerlat, upperlat }) => {
  const client = await pool.connect();
  let result;

  try {
    // Originally, I was going to call client.query like so:
    //     await client.query(findInPolygonSql, [lowerlong, upperlong, lowerlat, upperlat]);
    // However, There is a quirk in the postgres tool that when a parameter is surrounded by quotes, in a query
    // e.g. "'$1\'", it is treated as a string literal, not a parameter. Therefore, I had to construct the POLYGON
    // text as one single parameter to be passed in.

    let polygon = `POLYGON((${lowerlong} ${lowerlat}, ${lowerlong} ${upperlat}, ${upperlong} ${upperlat}, ${upperlong} ${lowerlat}, ${lowerlong} ${lowerlat}))`;
    result = await client.query(findInPolygonSql, [polygon]);
    return result;
  } catch (e) {
    console.error('Error in service: db - PostGres encountered an error', e);
    throw {
      status: 500,
      message: 'Error occurred while fetching data from store'
    };
  } finally {
    client.release();
  }
};

module.exports = {
  init,
  findInBoundingBox
};