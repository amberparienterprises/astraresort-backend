const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token → treat as guest
    req.user = { role: "user", isGuest: true };
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id, username, role }
    return next();
  } catch (err) {
    // Invalid token → still treat as guest user
    req.user = { role: "user", isGuest: true };
    return next();
  }
};

module.exports = authMiddleware;
