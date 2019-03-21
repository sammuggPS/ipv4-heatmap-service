/*global describe, it, before, beforeEach*/
/*jshint -W079, expr:true */
const rewire = require('rewire');
const expect = require('chai').expect;

describe('IpCoordinateService - _validateQueryParams()', () => {
  let _validateQueryParams;

  before(() => {
    let service = rewire('../../services/ip-coordinate-service');
    _validateQueryParams = service.__get__('_validateQueryParams');
  });

  describe('Given no query parameters', () => {
    it('should throw a 422 error', () => {
      try {
        _validateQueryParams();
        throw new Error('Didn\'t receive expected error');
      } catch (e) {
        expect(e.status).to.equal(422);
        expect(e.message).to.equal('upperLat, lowerLat, upperLong, and lowerLong are all required parameters');
      }
    });
  });

  describe('Given incomplete parameters', () => {
    let params;

    beforeEach(() => {
      params = {
        upperLat: 1,
        lowerLat: 2,
        upperLong: 3
      };
    });

    it('should throw a 422 error', () => {
      try {
        _validateQueryParams(params);
        throw new Error('Didn\'t receive expected error');
      } catch (e) {
        expect(e.status).to.equal(422);
        expect(e.message).to.equal('upperLat, lowerLat, upperLong, and lowerLong are all required parameters');
      }
    });
  });

  describe('Given upperLat, lowerLat, upperLong, and lowerLong', () => {
    let params;

    beforeEach(() => {
      params = {
        upperLat: 1,
        lowerLat: 2,
        upperLong: 3,
        lowerLong: 4
      };
    });

    describe('When upperLat is not a number', () => {
      beforeEach(() => {
        params.upperLat = undefined;
      });

      it('should throw a 422 error', () => {
        try {
          _validateQueryParams(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperLat, lowerLat, upperLong, and lowerLong should all be numbers');
        }
      });
    });

    describe('When lowerLat is not a number', () => {
      beforeEach(() => {
        params.lowerLat = undefined;
      });

      it('should throw a 422 error', () => {
        try {
          _validateQueryParams(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperLat, lowerLat, upperLong, and lowerLong should all be numbers');
        }
      });
    });

    describe('When upperLong is not a number', () => {
      beforeEach(() => {
        params.upperLong = undefined;
      });

      it('should throw a 422 error', () => {
        try {
          _validateQueryParams(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperLat, lowerLat, upperLong, and lowerLong should all be numbers');
        }
      });
    });

    describe('When lowerLong is not a number', () => {
      beforeEach(() => {
        params.lowerLong = undefined;
      });

      it('should throw a 422 error', () => {
        try {
          _validateQueryParams(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperLat, lowerLat, upperLong, and lowerLong should all be numbers');
        }
      });
    });

    describe('When all params are present and numbers', () => {
      it('should return without error', () => {
        try {
          _validateQueryParams(params);
        } catch (e) {
          throw new Error('Shouldn\'t have gotten an error');
        }
      });
    });
  });
});