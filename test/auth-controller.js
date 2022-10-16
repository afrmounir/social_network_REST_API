const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const authController = require('../controllers/auth');

describe('Auth Controller - Login', function () {
  it('should throw an error (code 500) if accessing the database fails', function (done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();
    const req = {
      body: {
        email: 'test@test.com',
        password: 'mdpmdp'
      }
    }
    authController
      .login(req, {}, () => { })
      .then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done(); //tell mocha to wait for async code to complete;
      })
      .catch(err => {
        done(err);
      });;

    User.findOne.restore();
  });

});