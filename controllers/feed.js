exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'first', content: 'first post' }]
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // create post in db
  res.status(201).json({
    message: 'Post created',
    post: { id: new Date().toISOString(), title, content }
  });
};