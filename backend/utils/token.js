const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  try {
   

    return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw error; // Rethrow so caller can handle it
  }
};

const generateRefreshToken = (userId) => {
  try {
    
    const userIdString = userId.toString(); // Convert ObjectId to string

    return jwt.sign(
      { userId: userId.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (error) {
    console.error("Error generating refresh token:", error.message);
    throw error; // Rethrow so caller can handle it
  }
};

const verifyToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return { decoded, error: null };
  } catch (error) {
    return { decoded: null, error };
  }
};
const verifyAccToken = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return { decoded, error: null };
  } catch (error) {
    return { decoded: null, error };
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken , verifyAccToken};
