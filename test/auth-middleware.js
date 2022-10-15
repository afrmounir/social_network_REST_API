const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

it('should throw an error if no authorization header is available', function () {
  const req = {
    get: function () {
      return null;
    }
  }
  expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Non autorisé'); //we dont call it ourself, we pass the prepared reference so mocha and chai can call themselves
});