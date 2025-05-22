const { UserDao } = require("../dao");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

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
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUserArr = await UserDao.addUser({ name, email, pwd });
    const newUser = newUserArr[0];

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(400).json({
        success: false,
        message: "Missing name, email or password",
      });
    }

    const userArr = await UserDao.getUser(null, { email });
    const user = userArr[0];
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      token,
      data: { fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    console.log("error", error);
    res.json({ success: false, message: error?.message });
  }
};


module.exports = { loginUser, registerUser };
