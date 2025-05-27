const { UserDao } = require("../dao");
const bcrypt = require("bcryptjs");
const tokenGenerator = require("../utils");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/token");

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
    const newUser = newUserArr[0]; //this will return an array thats why we need to access the first item that has our actual user
    //1st item extracted is the userID OR THE obj id

 

    res.json({
      success: true,
      message: "Registration successful",
      data: { fullname: newUser.fullname, email: newUser.email },
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

    const userArr = await UserDao.getUser({ email });
    const user = userArr[0];
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
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
  if (!storedRefreshToken) return res.status(204).json({ success: false, message: "No token found" });

  try {
    const decodedUser = verifyToken(storedRefreshToken);
    console.log(decodedUser);
    
    await UserDao.removeRefreshToken(decodedUser._id, storedRefreshToken);

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

module.exports = { loginUser, registerUser, logoutUser };
