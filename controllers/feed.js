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
    return res.status(422).json({
      message: 'La validation a échoué, les données entrées sont incorrectes',
      errors: errors.array()
    });
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
    .catch(err => console.log(err));
};