const { validationResult } = require('express-validator');

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
  const title = req.body.title;
  const content = req.body.content;
  // create post in db
  res.status(201).json({
    message: 'Post created',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'username' },
      createdAt: new Date()//.toLocaleDateString('fr-FR')
    }
  });
};