/*global describe, it, before, beforeEach, afterEach*/
/*jshint -W079, expr:true */
const rewire = require('rewire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('IpCoordinateService - getPointsInBoundingBox()', () => {
  let getPointsInBoundingBox;
  let testInput;
  let testOutput;
  let validationStub;
  let dbStub;
  let mapStub;

  before(() => {
    let service = rewire('../../services/ip-coordinate');
    getPointsInBoundingBox = service.__get__('getPointsInBoundingBox');

    testInput = 'this is a test';
    testOutput = 'This would be GeoJSON';

    validationStub = sinon.stub();
    service.__set__('_validateBoundingBoxCoordinates', validationStub);

    dbStub = sinon.stub();
    service.__set__('dbService.findInBoundingBox', dbStub);

    mapStub = sinon.stub();
    service.__set__('_mapResultsToGeoJson', mapStub);
  });

  afterEach(() => {
    validationStub.reset();
    dbStub.reset();
    mapStub.reset();
  });

  it('should return a promise', () => {
    return getPointsInBoundingBox(testInput)
      .then(() => { })
      .catch(() => { });
  });

  describe('When validation throws an error', () => {
    let testError;

    beforeEach(() => {
      testError = new Error('testing');
      validationStub.throws(testError);
    });

    it('should surface the error', () => {
      return getPointsInBoundingBox(testInput)
        .then(() => {
          throw new Error('Didn\'t catch expected error');
        })
        .catch((e) => {
          expect(e).to.eql(testError);
        });
    });
  });

  describe('When validation passes', () => {
    it('should call dbService.findInBoundingBox with input params', () => {
      return getPointsInBoundingBox(testInput)
        .then(() => {
          expect(dbStub.args[0][0]).to.equal(testInput);
        });
    });

    describe('When db call fails', () => {
      let testError;

      beforeEach(() => {
        testError = new Error('testing');
        dbStub.throws(testError);
      });

      it('should surface the error', () => {
        return getPointsInBoundingBox(testInput)
          .then(() => {
            throw new Error('Didn\'t catch expected error');
          })
          .catch((e) => {
            expect(e).to.eql(testError);
          });
      });
    });

    describe('When db call passes', () => {
      let testResults;

      beforeEach(() => {
        testResults = 'results here';
        dbStub.resolves(testResults);
        mapStub.returns(testOutput);
      });

      it('should call _mapResultsToGeoJson with results', () => {
        return getPointsInBoundingBox(testInput)
          .then(() => {
            expect(mapStub.args[0][0]).to.equal(testResults);
          });
      });

      it('should return results of _mapResultsToGeoJson', () => {
        return getPointsInBoundingBox(testInput)
          .then((output) => {
            expect(output).to.equal(testOutput);
          });
      });
    });
  });
});