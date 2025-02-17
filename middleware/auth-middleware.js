const jwt = require("jsonwebtoken");

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

const authenticate = (req, res, next) => {
  // console.log(req);
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader");

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token, "JWT_SECRET");
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
}
const authorizeRole = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from `Bearer <token>`
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
      const decoded = jwt.verify(token, "JWT_SECRET"); // Verify token with the same secret
      req.user = decoded; // Attach user info to request object
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      next();
    } catch (error) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

  };
};




module.exports = { authenticate, authorizeRole };
