const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post
    .find()
    .then(posts => {
      res.status(200).json({ posts })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('Pas d\'image reçu');
    error.statusCode(422);
    throw error;
  }
  const imageUrl = req.file.path;
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: { name: 'username' }
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post
    .findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Impossible de trouver le post')
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
