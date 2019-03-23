/*global describe, it, before, beforeEach*/
/*jshint -W079, expr:true */
const rewire = require('rewire');
const expect = require('chai').expect;

describe('IpCoordinateService - _constructIntersectQuery()', () => {
  let _constructIntersectQuery;

  before(() => {
    let service = rewire('../../services/ip-coordinate-service');
    _constructIntersectQuery = service.__get__('_constructIntersectQuery');
  });

  describe('Given an object containing upperlat, upperlong, lowerlat, and lowerlong', () => {
    let result;

    beforeEach(() => {
      result = _constructIntersectQuery({
        lowerlong: 1,
        upperlong: 2,
        lowerlat: 3,
        upperlat: 4
      });
    });

    it('should return the constructed SELECT', () => {
      expect(result).to.equal(
        'SELECT * FROM ipv4_points as p WHERE ' +
        'ST_INTERSECTS(' +
        'ST_GeomFromText(\'POLYGON((1 3, 1 4, 2 4, 2 3, 1 3))\', 4326), ' +
        'p.geo)');
    });
  });
});