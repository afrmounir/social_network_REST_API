const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
    const totalItems = await Post
      .find()
      .estimatedDocumentCount();
    const posts = await Post
      .find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage) // skip the first items
      .limit(perPage); // limit the amount of items
    res.status(200).json({ message: 'posts chargé avec succès', posts, totalItems });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    error.data = errors.array();
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
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const savedUser = await user.save();
    io.getIO().emit('posts', {// instantly informs all clients that there is a new post with websocket
      action: 'create',
      post: {
        ...post._doc,
        creator: {
          _id: req.userId,
          name: user.name
        }
      }
    });
    res.status(201).json({
      message: 'post généré',
      post: post,
      creator: { _id: user._id, name: user.name }
    });
    return savedUser; // return the user for testing purpose
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Impossible de trouver le post')
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    error.data = errors.array();
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
  try {
    const post = await Post
      .findById(postId)
      .populate('creator');
    if (!post) {
      const error = new Error('Impossible de trouver un post');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) { // toString => _id is retrieved from db, _id is treated as a string in js but it's not of type string so === will be false.
      const error = new Error('Pas autorisé');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'post mis à jour', post: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Impossible de trouver le post')
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) { // toString => _id is retrieved from db, _id is treated as a string in js but it's not of type string so === will be false.
      const error = new Error('Pas autorisé');
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save()
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Le post a ete supprimé' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
