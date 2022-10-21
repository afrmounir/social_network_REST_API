const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Non autorisé');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1]; // we add bearer for convention so we have to split it now
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SESSION_SECRET); //verify and decode
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Non autorisé');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};