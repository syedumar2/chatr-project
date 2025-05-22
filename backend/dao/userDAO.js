const { UserModel } = require("../models");
const bcrypt = require("bcryptjs"); //pwd hasher
const SALT_ROUNDS = 10;

const addUser = async (UserData) => {
  try {
    const hashedPwd = await bcrypt.hash(UserData.pwd,SALT_ROUNDS);
    const newUser = {...UserData, pwd: hashedPwd};
    return await UserModel.create([newUser]);
  } catch (error) {
    throw error;
  }
};

const getUser = async (query) => {
  try {
    return await UserModel.find(query).lean().exec();
  } catch (error) {
    throw error;
    console.log(error);
  }
};

const updateUser = async (query, updateData) => {
  try {
    return await UserModel.findOneAndUpdate(query, updateData).lean().exec();
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

module.exports = {
  addUser,
  deleteUser,
  updateUser,
  getUser,
};
