const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); 

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.snapnestToken;

    if (!token) {
      return res.status(401).json({ message: 'You need to login' });
    }

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    // const user = await userModel.findOne({ email: decoded.email }).select('-password');
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user no longer exists' });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    next(error);
  }
};

module.exports = isLoggedIn;
