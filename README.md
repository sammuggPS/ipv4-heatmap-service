# IPv4 Heatmap Service

Serves ipv4 coordinates for use in a heatmap implementation of IPv4 Address density.

## Overview
- [Node.js][node] app running with [Express.js][express]
- Backed by [Heroku PostgreSQL][herokupg] datastore containing coordinates of IPv4 address locations
- The response from `/ip-coordinates` complies with the [GeoJSON FeatureCollection spec][geojson]
- App status can be checked by a GET to `/`

> Note that you must have PostgreSQL installed, running, and configured properly in `config/default.js` in order to run this service on you machine.  
> A useful guide to install Postgres on your machine can be found here http://postgresguide.com/setup/install.html

## Usage

Install dependencies with `npm` or `yarn`.

### Run locally
```
npm start
```

### Run unit tests
```
npm test
```

## API Spec

|Method       |Input|Output|Description
|-------------|-----|-----|-|
| GET `/` | n/a | Status Response | A GET on the api root will return the API status.  `200` if Healthy, `503` otherwise
| GET `/ip-coordinates`| Bounding Box Query params | GeoJSON FeatureCollection | Returns the set of IPv4 Coordinates that lie within the Bounding Box defined by query params. `200` if successfully found, `422` if input is invalid, `500` if an error occurs, `503` if service did not initialize

## Input Types

### Bounding Box Query params
Query Parameters indicating the geographic bounding box in which to find IPv4 addresses.

| Query Name | Query Type | Description
|--|--|--
| `lowerLong` | Number | Eastern longitude of bounding box; must be between -179.999999 and 180.000000 degrees
| `upperLong` | Number | Western longitude of bounding box; must be between -179.999999 and 180.000000 degrees
| `lowerLat` | Number | Southern latitude of bounding box; must be between -90 and 90 degrees
| `upperLat` | Number | Northern latitude of bounding box; must be between -90 and 90 degrees

## Response Types

### Status Response
Response of type `application/json`

| Item Name | Item Type | Description
|--|--|--
| `status` | String | Enumerated: `Initializing`, `Healthy`, or `Failed to Initialize`
| `version` | String | Semantic Version of current build

### GeoJSON FeatureCollection
This response adheres to the [GeoJSON FeatureCollection spec][geojson].

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "Primary key in PostGres"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          longitude,
          latitude
        ]
      }
    },
    ...
  ]
}
```

### Error
Response of type `application/json`

| Item Name | Item Type | Description
|--|--|--
| `status` | Number | HTTP Status Code
| `message` | String | Description of error that occurred


## Scripts

`create-inserts-sql.js` was written to read in and parse a large CSV file (using [`fast-csv`][fcsv]) and output a set of INSERT statements for PostgreSQL. It expects a number of rows to process as the second argument, which is handy when wanting to create a subset for testing. It should be called with stdout pointing to the desired output file.
```
node create-inserts-sql.js <inputfile>.csv {integer number of lines to process} > <outputfile>
```

[geojson]: https://tools.ietf.org/html/rfc7946#section-3.3
[node]: https://nodejs.org/en/
[express]: https://expressjs.com/
[herokupg]: https://devcenter.heroku.com/articles/heroku-postgresql
[fcsv]:https://c2fo.io/fast-csv/