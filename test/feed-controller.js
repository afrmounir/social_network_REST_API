const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const feedController = require('../controllers/feed');

const MONGODB_URI = 'mongodb+srv://user815:9TMiDci0cy0Pd92m@cluster0.ns3cqzi.mongodb.net/test-socialnetwork?retryWrites=true&w=majority';

describe('Feed Controller', function () {
  before(function (done) {
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        const user = new User({
          email: 'test@test.fr',
          password: 'testtest',
          name: 'usertest',
          posts: [],
          _id: '6349646e223b47fbf91674d7' // don't use an existing id in the db, id must be unique
        });
        return user.save();
      })
      .then(() => done());
  });

  // if socket io emit is activated this test will fail, remember to comment the io code
  it('should add a created post to the posts of the author', function(done) { // add done as argument for async code
    const req = {
      body: {
        title: 'test post',
        content: 'test description'
      },
      file: {
        path: 'abc'
      },
      userId: '6349646e223b47fbf91674d7'
    };
    const res = {
      status: function () { 
        return this; // so that we return the reference for this entire object who has a json function
      },
      json: function () { }
    };
    feedController
      .createPost(req, res, () => { })
      .then(savedUser => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done(); //tell mocha to wait for async code to complete;
      })
      .catch(err => {
        done(err);
      });
  });

  after(function (done) {
    User.deleteMany({})//clean all the test db so we have a clean db for next test
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });
});