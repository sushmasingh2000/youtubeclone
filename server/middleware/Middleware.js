// const jwt = require('jsonwebtoken');
// const secretKey = 'sushma'; 

// export const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         return res.status(401).json({ msg: 'Token is required' });
//     }
//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ msg: 'Invalid or expired token' });
//         }
//         req?.userId = decoded?.id; 
//         next();
//     });
// };
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sushma';  // Use the same secret key across your app

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization'); // Extract the token from the request header

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token with your secret key
    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
