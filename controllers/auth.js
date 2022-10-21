const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });
    const result = await user.save();
    res.status(201).json({ message: 'Utilisateur ajouté', userId: result._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Utilisateur ou mot de passe incorrect');
      error.statusCode = 401;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Utilisateur ou mot de passe incorrect');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    },
    process.env.SESSION_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token, userId: user._id.toString() });
    return; //implicitly return the promesse behind async await for tests purpose
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
    return error; //implicitly return the promesse behind async await for tests purpose
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.patchUserStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'Status mis à jour' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};