const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('La validation a échoué, les données entrées sont incorrectes');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({ email, name, password: hashedPassword });
      return user.save();
    })
    .then(result => res.status(201).json({ message: 'Utilisateur ajouté', userId: result._id }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};