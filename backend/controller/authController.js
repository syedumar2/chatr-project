const { UserDao } = require("../dao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenGenerator = require("../utils");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyAccToken,
} = require("../utils/token");

const SALT_ROUNDS = 10;

const searchContacts = async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: "Missing search query" });

  try {
    const users = await UserDao.getUsers(q);
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, pwd } = req.body;

    if (!name || !email || !pwd) {
      return res.status(400).json({
        success: false,
        message: "Missing name, email or password",
      });
    }

    const existingUser = await UserDao.getUser({ email });

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUserArr = await UserDao.addUser({ name, email, pwd });
    const newUser = newUserArr[0]; //this will return an array thats why we need to access the first item that has our actual user
    //1st item extracted is the userID OR THE obj id

    return res.json({
      success: true,
      message: "Registration successful",
      data: { fullname: newUser.fullname, email: newUser.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  try {
    if (updates.pwd) {
      const hashedPwd = await bcrypt.hash(updates.pwd, SALT_ROUNDS);
      updates.pwd = hashedPwd;

    }
   
    const updatedUser = await UserDao.updateUser({ _id: userId }, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }

    const userArr = await UserDao.getUser({ email });
    const user = userArr[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await UserDao.addRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    //refresh token stored in cookie

    //accessToken sent in respone
    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      data: { fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    console.log("error", error);
    res.json({ success: false, message: error?.message });
  }
};

const logoutUser = async (req, res) => {
  const storedRefreshToken = req.cookies.refreshToken;
  if (!storedRefreshToken)
    return res.status(204).json({ success: false, message: "No token found" });

  try {
    const decodedUser = verifyToken(storedRefreshToken);

    const output = await UserDao.removeRefreshToken(
      decodedUser.decoded.userId,
      storedRefreshToken
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.json({
      success: true,
      message: "Logged Out Successfully! ",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};
//TODO TEST LOGOUT USING BROWSER since httpOnly cookies work on browser only
const getProtectedData = async (req, res) => {
  try {
    const userId = req.user.id;

    const userArr = await UserDao.getUser({ _id: userId });

    const user = userArr[0];

    if (!user) {
      return res.status(404).json({ success: true, message: "User not found" });
    }
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contacts: user.contacts,
        message: "Get Protected Data route hit",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const issueNewTokens = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }
  const refreshToken = req.cookies.refreshToken;
  try {
    const result = verifyToken(refreshToken);
    const userId = result.decoded.userId;
    const newAccessToken = generateAccessToken(userId);
    const newCookieToken = generateRefreshToken(userId);

    res.cookie("refreshToken", newCookieToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Token verification failed:", error.name, error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  getProtectedData,
  issueNewTokens,
  searchContacts,
};
