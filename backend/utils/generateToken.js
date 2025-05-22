const jwt = require("jsonwebtoken");

const generateToken = (emailId) => {
  return jwt.sign({ id: emailId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = generateToken;