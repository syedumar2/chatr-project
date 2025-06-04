const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token",
    });
  }

  const token = authHeader.split(" ")[1];


  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    
    
    req.user = { id: decoded.userId }; // ✅ Fixed

    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
module.exports = { verifyAccessToken };