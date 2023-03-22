const jwt = require('jsonwebtoken');
const { SECRET__KEY } = require('../constants/constant');

const VerifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  try {
    const decodeToken = jwt.verify(authHeader, SECRET__KEY);
    if (decodeToken) {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Token Invalid',
    });
  }
};

module.exports = VerifyToken;
