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