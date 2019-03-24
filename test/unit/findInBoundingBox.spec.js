/*global describe, it, before, beforeEach, afterEach*/
/*jshint -W079, expr:true */
const rewire = require('rewire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('DbService - findInBoundingBox()', () => {
  let findInBoundingBox;
  let testInput;
  let clientStub;

  before(() => {
    let service = rewire('../../services/db');
    findInBoundingBox = service.__get__('findInBoundingBox');

    testInput = {
      lowerlong: 1,
      upperlong: 2,
      lowerlat: 3,
      upperlat: 4
    };

    clientStub = {
      query: sinon.stub(),
      release: sinon.stub()
    };
    service.__set__('pool', {
      connect: function () {
        return clientStub;
      }
    });
  });

  it('should return a promise', () => {
    return findInBoundingBox(testInput)
      .then(() => { })
      .catch(() => { });
  });

  it('should call client.query with the constructed polygon string', () => {
    let polygon = `POLYGON((1 3, 1 4, 2 4, 2 3, 1 3))`;

    return findInBoundingBox(testInput)
      .then(() => {
        expect(clientStub.query.args[0][1][0]).to.equal(polygon);
      });
  });

  describe('When query throws an error', () => {
    let testError;
    beforeEach(() => {
      testError = new Error('this is a test');
      clientStub.query.throws(testError);
    });

    it('should throw an error with status and message', () => {
      return findInBoundingBox(testInput)
        .then(() => {
          throw new Error('Not the error we wanted');
        })
        .catch((e) => {
          expect(e).to.not.eql(testError);
          expect(e.status).to.equal(500);
          expect(e.message).to.equal('Error occurred while fetching data from store');
        });
    });

    it('should release the client', () => {
      return findInBoundingBox(testInput)
        .catch(() => {
          expect(clientStub.release.called).to.equal(true);
        });
    });
  });

  describe('When query is successful', () => {
    let testOutput;
    beforeEach(() => {
      testOutput = 'this is a test'
      clientStub.query.resolves(testOutput);
    });

    it('should resolve with the query results', () => {
      return findInBoundingBox(testInput)
        .then((results) => {
          expect(results).to.eql(testOutput);
        });
    });

    it('should release the client', () => {
      return findInBoundingBox(testInput)
        .then(() => {
          expect(clientStub.release.called).to.equal(true);
        });
    });
  });
});