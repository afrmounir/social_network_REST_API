const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{
      _id: '1',
      title: 'first',
      content: 'first post',
      imageURL: 'images/screenshot.png',
      creator: {
        name: 'username'
      },
      createdAt: new Date().toLocaleDateString('fr-FR')
    }]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    throw error;
  }
  const { title, content, imageURL } = req.body;
  const post = new Post({
    title,
    content,
    imageURL: 'images/screenshot.png',
    creator: { name: 'username' }
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};