const { UserDao } = require("../dao");

const addUser = async (req, res, next) => {
  try {
    const { fullname, email, pwd } = req.body;
    if (fullname || email || pwd) {
      res.json({
        success: true,
        message: "User added successfully",
        data: await UserDao.addUser(req.body),
      });
    } else {
      res.json({
        success: false,
        message: "Missing Data. Did you try to hack your way here ?",
        errors: [],
        warnings: [],
        data: [],
      });
    }
  } catch (error) {
    console.log("error", error);
    res.json({ succes: false, message: error?.message });
  }
};

const getUser = async (req, res, next) => {
  try {
    const userDetails = await UserDao.getUser(req.body);
    if (userDetails.length === 0) {
      res.json({
        success: false,
        message: "No such user read",
      });
    } else {
      res.json({
        success: true,
        message: "User read successfully",
        data: userDetails,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.json({ succes: false, message: error?.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "User deleted successfully",
      data: await UserDao.deleteUser(req.body),
    });
  } catch (error) {
    console.log("error", error);
    res.json({ succes: false, message: error?.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "User updates successfully",
      data: await UserDao.updateUser(req.body.query, req.body.updateData),
    });
  } catch (error) {
    console.log("error", error);
    res.json({ succes: false, message: error?.message });
  }
};

module.exports = { addUser, updateUser, deleteUser, getUser };
