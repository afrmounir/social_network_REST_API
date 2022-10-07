const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post
    .find()
    .estimatedDocumentCount()
    .then(numPost => {
      totalItems = numPost;
      return Post
        .find()
        .skip((currentPage - 1) * perPage) // skip the first items
        .limit(perPage); // limit the amount of items
    })
    .then(posts => {
      res.status(200).json({ message: 'posts chargé avec succès', posts, totalItems });
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
        message: 'post généré',
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('Pas de fichier');
    error.statusCode = 422;
    throw error;
  }
  Post
    .findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Impossible de trouver un post');
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => res.status(200).json({ message: 'post mis à jour', post: result }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post
    .findOneAndDelete({ _id: postId/*, userId: req.user._id*/ }) //later we will check the user
    .then(post => {
      if (!post) {
        const error = new Error('Impossible de trouver le post')
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Le post a ete supprimé' })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
