const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.put('/signup',
  [
    body('email', 'Veuillez entrer un email valide')
      .isEmail()
      .custom((value, { req }) => {
        return User
          .findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('L\'email existe deja');
            }
          })
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .isLength({ min: 3 }),
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth,
  [
    body('status').trim().notEmpty()
  ],
  authController.patchUserStatus
);

module.exports = router;