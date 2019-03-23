/**
 * This script simply converts a GeoLite CSV file into GeoJson.
 * Strips out some unecessary items.
 *
 * Due to heap size limits, the output file is written using stdout.
 *
 * To run:
 * node csv-to-geojson.js <inputfile>.csv > <outputfile>.json
 *
 * UPDATE [2019-03-23]: I decided to go a different route where data is stored in
 * a PostGIS instance, using ST_INTERSECTS to find data then convert it to GeoJSON and return.
 */
const fs = require('fs');
const fastCsv = require('fast-csv');
const ora = require('ora');

const spinner = ora(`Processing ${process.argv[2]}`).start();

let geoCsv = fs.createReadStream(process.argv[2]);

// File start
console.log('{"type":"FeatureCollection", "features": [');

// const excludeCoordinates = ({ latitude, longitude, ...properties }) => properties;

geoCsv
  .pipe(fastCsv({
    headers: true
  }))
  .on('data', function (data) {
    // let properties = excludeCoordinates(data);

    let point = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        // properties: {
        //   ...properties
        // },
        coordinates: [
          parseFloat(data.longitude),
          parseFloat(data.latitude)
        ]
      }
    };

    console.log(JSON.stringify(point) + ',');
  })
  .on('end', function () {
    console.log(']}');
    spinner.succeed('Finished');
  });