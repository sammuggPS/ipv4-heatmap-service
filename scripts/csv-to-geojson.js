const fs = require('fs');
const fastCsv = require('fast-csv');
const ora = require('ora');

const spinner = ora(`Processing ${process.argv[2]}`).start();

let geoCsv = fs.createReadStream(process.argv[2]);
// const geoJson = {
//   type: "FeatureCollection",
//   features: []
// };
// File start
console.log('{"type":"FeatureCollection", "features": [');

const excludeCoordinates = ({ latitude, longitude, ...properties }) => properties;
let i = 0;

geoCsv
  .pipe(fastCsv({
    headers: true
  }))
  .on('data', function (data) {
    let properties = excludeCoordinates(data);

    let point = {
      type: "Feature",
      properties: {
        ...properties
      },
      geometry: {
        type: "Point",
        coordinates: [
          data.longitude,
          data.latitude
        ]
      }
    };

    console.log(JSON.stringify(point) + ',');
    i++;
    if (i >= 400) {
      process.exit();
    }
  })
  .on('end', function () {
    // fs.writeFileSync('output.json', JSON.stringify(geoJson));
    console.log(']}');
    spinner.succeed('Finished');
  });