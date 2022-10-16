const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function () {
  it('should throw an error if no authorization header is available', function () {
    const req = {
      get: function () {
        return null;
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Non autorisé'); //we dont call it ourself, we pass the prepared reference so mocha and chai can call themselves
  });

  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function () {
        return 'xyz';
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
  });

  it('should throw an error if the token can\'t be verified', function () {
    const req = {
      get: function () {
        return 'Bearer xyz';
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => { })).to.throw();
  });

  it('should provide a userId after decoding the token', function () {
    const req = {
      get: function () {
        return 'Bearer xyz';
      }
    }
    sinon.stub(jwt, 'verify'); // check stub official doc
    jwt.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => { });
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});