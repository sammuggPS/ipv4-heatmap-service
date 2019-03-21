# IPv4 Heatmap Service

Serves ipv4 coordinates for use in a heatmap implementation of IPv4 Address density.

## API

|Method       |Input|Output|Description
|-------------|-----|-----|-|
| GET `/` | n/a | Status Response | A GET on the api root will return the API status.  `200` if Healthy, `503` otherwise
| GET `/ip-coordinates`| Bounding Box Input | IPv4 Coordinate Set | Returns the set of IPv4 Coordinates that lie within the Bounding Box defined by query params. `200` if successfully found, `422` if input is invalid, `500` if an error occurs, `503` if service did not initialize

## Input Types

### Bounding Box Input
Query Parameters indicating the geographic bounding box in which to find IPv4 addresses.

| Query Name | Query Type | Description
|--|--|--
| `upperLat` | Number | Upper bound of latitude; must be between -90 and 90 degrees
| `lowerLat` | Number | Lower bound of latitude; must be between -90 and 90 degrees
| `upperLong` | Number | Upper bound of longitude; must be between -179.999999 and 180.000000 degrees
| `lowerLong` | Number | Lower bound of longitude; must be between -179.999999 and 180.000000 degrees

## Response Types

### Status Response
Response of type `application/json`

| Item Name | Item Type | Description
|--|--|--
| `status` | String | Enumerated: `Initializing`, `Healthy`, or `Failed to Initialize`
| `version` | String | Semantic Version of current build

### IPv4 Coordinate Set
TODO

### Error
Response of type `application/json`

| Item Name | Item Type | Description
|--|--|--
| `status` | Number | HTTP Status Code
| `message` | String | Description of error that occurred
