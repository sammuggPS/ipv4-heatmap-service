/**
 * This script simply spits out Postgres INSERT commands for the ipv4-points table.
 *
 * To run:
 * node insert-ipv4-points.js <inputfile>.csv {integer number of lines to process} > <outputfile>.json
 */
const fs = require('fs');
const fastCsv = require('fast-csv');
const ora = require('ora');

const spinner = ora(`Processing ${process.argv[2]}`).start();

let geoCsv = fs.createReadStream(process.argv[2]);
let maxRows = parseInt(process.argv[3]);
let i = 0;

geoCsv
  .pipe(fastCsv({
    headers: true
  }))
  .on('data', function (data) {
    i++;
    console.log(`INSERT INTO ipv4_points (long, lat, geo) VALUES (${data.longitude}, ${data.latitude}, 'SRID=4326;POINT(${data.longitude} ${data.latitude})');`);
    if (i === maxRows) {
      spinner.succeed('Finished');
      process.exit(0);
    }
  });
