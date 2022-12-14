const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const authController = require('../controllers/auth');

const MONGODB_URI = process.env.MONGODB_KEY;

describe('Auth Controller', function () {
  before(function (done) {
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        const user = new User({
          email: 'test@test.fr',
          password: 'testtest',
          name: 'test',
          posts: [],
          _id: '6349646e223b47fbf91674d7' // don't use an existing id in the db, id must be unique
        });
        return user.save();
      })
      .then(() => done());
  })

  it('should throw an error (code 500) if accessing the database fails', function (done) { // add done as argument for async code
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

  it('should send a response with a valid user status for an existing user', function (done) {
    const req = { userId: '6349646e223b47fbf91674d7' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) { // so we can call json on this object, like in the real controller
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status
      }
    };
    authController
      .getUserStatus(req, res, () => { })
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('Nouvel utilisateur');
        done();
      });
  });

  after(function (done) {
    User.deleteMany({})//clean all the test db so we have a clean db for next test
      .then(() => {
        return mongoose.disconnect()
      })
      .then(() => done());
  });
});