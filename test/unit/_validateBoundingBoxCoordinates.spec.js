/*global describe, it, before, beforeEach*/
/*jshint -W079, expr:true */
const rewire = require('rewire');
const expect = require('chai').expect;

describe('IpCoordinateService - _validateBoundingBoxCoordinates()', () => {
  let _validateBoundingBoxCoordinates;

  before(() => {
    let service = rewire('../../services/ip-coordinate');
    _validateBoundingBoxCoordinates = service.__get__('_validateBoundingBoxCoordinates');
  });

  describe('Given no query parameters', () => {
    it('should throw a 422 error', () => {
      try {
        _validateBoundingBoxCoordinates();
        throw new Error('Didn\'t receive expected error');
      } catch (e) {
        expect(e.status).to.equal(422);
        expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong are all required parameters');
      }
    });
  });

  describe('Given incomplete parameters', () => {
    let params;

    beforeEach(() => {
      params = {
        upperlat: 1,
        lowerlat: 2,
        upperlong: 3
      };
    });

    it('should throw a 422 error', () => {
      try {
        _validateBoundingBoxCoordinates(params);
        throw new Error('Didn\'t receive expected error');
      } catch (e) {
        expect(e.status).to.equal(422);
        expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong are all required parameters');
      }
    });
  });

  describe('Given upperlat, lowerlat, upperlong, and lowerlong', () => {
    let params;

    beforeEach(() => {
      params = {
        upperlat: 1,
        lowerlat: 2,
        upperlong: 3,
        lowerlong: 4
      };
    });

    describe('When upperlat is out of acceptable range of -90 to 90', () => {
      it('should throw a 422 error', () => {
        params.upperlat = -91;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }

        params.upperlat = 91;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }
      });
    });

    describe('When lowerlat is out of acceptable range of -90 to 90', () => {
      it('should throw a 422 error', () => {
        params.lowerlat = -91;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }

        params.lowerlat = 91;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }
      });
    });

    describe('When upperlong is out of acceptable range of -179.999999 to 180', () => {
      it('should throw a 422 error', () => {
        params.upperlong = -180;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }

        params.upperlong = 181;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }
      });
    });

    describe('When lowerlong is out of acceptable range of -179.999999 to 180', () => {
      it('should throw a 422 error', () => {
        params.lowerlong = -180;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }

        params.lowerlong = 181;
        try {
          _validateBoundingBoxCoordinates(params);
          throw new Error('Didn\'t receive expected error');
        } catch (e) {
          expect(e.status).to.equal(422);
          expect(e.message).to.equal('upperlat, lowerlat, upperlong, and lowerlong should be in valid geospatial range');
        }
      });
    });

    describe('When all bounds are in acceptable range', () => {
      it('should return uneventfully', () => {
        _validateBoundingBoxCoordinates(params);
      });
    });
  });
});