const { UserModel } = require("../models");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

const addUser = async (UserData) => {
  try {
    const hashedPwd = await bcrypt.hash(UserData.pwd, SALT_ROUNDS);
    const newUser = { ...UserData, pwd: hashedPwd };
    return await UserModel.create([newUser]);
  } catch (error) {
    throw error;
  }
};

const getUser = async (query) => {
  try {
    return await UserModel.find(query)
      .populate("contacts", "name email")
      .lean()
      .exec();
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const getUsers = async (query) => {
  try {
    return await UserModel.find({
      email: { $regex: query, $options: "i" },
    }).limit(10);
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const updateUser = async (query, updateData) => {
  try {
    return await UserModel.findOneAndUpdate(
      query,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    )
      .lean()
      .exec();
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (deleteQuery) => {
  try {
    return await UserModel.deleteOne(deleteQuery).lean().exec();
  } catch (error) {
    throw error;
  }
};

const addRefreshToken = async (userId, refreshToken) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");
  user.refreshTokens = refreshToken;
  return await user.save();
};

const removeRefreshToken = async (userId, refreshToken) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken); // return a new array that does not contain the refresh token
  return await user.save();
};

//TODO

module.exports = {
  addUser,
  deleteUser,
  updateUser,
  getUser,
  addRefreshToken,
  removeRefreshToken,
  getUsers,
};
