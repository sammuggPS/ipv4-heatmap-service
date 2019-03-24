/*global describe, it, before, beforeEach*/
/*jshint -W079, expr:true */
const rewire = require('rewire');
const expect = require('chai').expect;

describe('IpCoordinateService - _mapResultsToGeoJson()', () => {
  let _mapResultsToGeoJson;

  before(() => {
    let service = rewire('../../services/ip-coordinate');
    _mapResultsToGeoJson = service.__get__('_mapResultsToGeoJson');
  });

  describe('Given a result set from query for findInPolygonSql', () => {
    let input;

    beforeEach(() => {
      input = require('../data/query-result.json');
    });

    describe('When converted to GeoJSON format', () => {
      let result;

      beforeEach(() => {
        result = _mapResultsToGeoJson(input);
      });

      it('should have type Feature Collection', () => {
        expect(result.type).to.equal('FeatureCollection');
      });

      it('should contain properly formatted Features', () => {
        for (let i = 0; i < result.features.length; i++) {
          expect(result.features[i].type).to.equal('Feature');
          expect(result.features[i].properties.id).to.equal(input.rows[i].id);
          expect(result.features[i].geometry.type).to.equal('Point');
          expect(result.features[i].geometry.coordinates).to.eql([input.rows[i].long, input.rows[i].lat]);
        }
      });
    });
  });
});