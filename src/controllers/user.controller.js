const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const responseHandler = require('../handlers/response.handler');
const bcrypt = require('bcryptjs');
const { SECRET__KEY } = require('../constants/constant');
const { default: mongoose } = require('mongoose');
//@@@@----------------------register--------------------
const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    picturePath,
    location,
    occupation,
    viewedProfile,
    impressions,
  } = req.body;
  try {
    if (!firstName || !lastName || !email || !password)
      return responseHandler.badRequest(res, { message: 'Some field invalid' });

    const oldUser = await User.findOne({ email });
    if (oldUser)
      return responseHandler.badRequest(res, {
        message: 'username is exiting',
      });

    const slat = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, slat);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      picturePath,
      location,
      occupation,
      viewedProfile,
      impressions,
    });

    await newUser.save();
    const token = jwt.sign({ email, password }, SECRET__KEY);
    newUser.password = undefined;

    responseHandler.created(res, {
      ...newUser._doc,
      token: token,
    });
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

//@@@@----------------------End register----------------

//@@@@----------------------login--------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    const decodePassword = await bcrypt.compare(password, user.password);
    if (!decodePassword)
      responseHandler.badRequest(res, { message: 'Email or password invalid' });

    const token = jwt.sign({ email, password }, SECRET__KEY);

    responseHandler.created(res, {
      ...user._doc,
      token: token,
    });
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

//@@@@----------------------End login----------------

//@@@-----------------------Add friend--------------

const addFriend = async (req, res) => {
  const { friendId, userId } = req.body;

  const user = await User.findById(userId);

  const isFriend = user.friends.find((user) => friendId === user);

  try {
    if (friendId === userId)
      responseHandler.badRequest(res, { message: 'Cannot add friend myself ' });
    if (!isFriend) {
      const updateUser = await User.findByIdAndUpdate(
        userId,
        { $push: { friends: friendId } },
        {
          new: true,
        },
      );
      responseHandler.ok(res, {
        updateUser,
        message: 'Add friend success',
      });
    } else {
      const updateUser = await User.findByIdAndUpdate(
        userId,

        {
          $pull: {
            friends: friendId,
          },
        },
        { new: true },
      );
      responseHandler.ok(res, {
        updateUser,
        message: 'Un friend success',
      });
    }
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

///@@@---------------------end Add Friend--------------

const getFriendList = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);
    const listFriend = [];
    for (let i = 0; i <= user.friends.length; i++) {
      const friend = await User.findById(user.friends[i]);
      if (friend) {
        friend.password = undefined;
        listFriend.push(friend);
      }
    }
    responseHandler.ok(res, listFriend);
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

const getStranger = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findById(userId);

    const lisStranger = [];

    responseHandler.ok(res, {
      lisStranger,
    });
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

const listUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.find({
      _id: {
        $ne: userId,
      },
    });
    responseHandler.ok(res, {
      user,
    });
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};
module.exports = {
  register,
  login,
  listUser,
  addFriend,
  getFriendList,
  getStranger,
};
