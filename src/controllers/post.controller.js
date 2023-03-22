const responseHandler = require('../handlers/response.handler');
const Post = require('../models/post.model');
const { pagination } = require('../utils/pagination');
const fs = require('fs');
//@@@@------------------Create Post-----------
const createPost = async (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    location,
    description,
    picturePath,
    userPicturePath,
    userPicture,
  } = req.body;
  try {
    if (!userId || !firstName || !lastName || !userPicture)
      responseHandler.badRequest(res, { message: 'Some field invalid' });

    const newPost = new Post({
      userId,
      firstName,
      lastName,
      location,
      description,
      picturePath,
      userPicturePath,
      userPicture,
    });

    await newPost.save();

    responseHandler.created(res, {
      post: newPost,
    });
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

//@@@@------------------End--------------

//@@@@------------------Remove Post-----------

const removePost = async (req, res) => {
  const { postId, picturePath } = req.body;
  try {
    const postDeleted = await Post.findByIdAndDelete(postId);
    fs.unlink('src/public/images/' + picturePath, (err) => {
      if (err) {
        throw err;
      }

      console.log('Delete File successfully.');
    });
    responseHandler.ok(res, postDeleted);
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};
//@@@@------------------End--------------

//@@@@------------------Update Post-----------

const updatePost = async (req, res) => {
  const {
    userId,
    postId,
    firstName,
    lastName,
    location,
    description,
    picturePath,
    userPicturePath,
  } = req.body;

  try {
    const postUpdate = await Post.findByIdAndUpdate(postId, {
      userId,
      firstName,
      lastName,
      location,
      description,
      picturePath,
      userPicturePath,
    });

    responseHandler.ok(res, postUpdate);
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

//@@@@------------------End-------------

//@@@-----------------get my post-----------

const getMyPost = async (req, res) => {
  const { page, userId } = req.query;
  try {
    const posts = await Post.find({
      userId,
    })
      .limit(10)
      .skip(pagination(page))
      .sort('-createdAt');

    return responseHandler.ok(res, posts);
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

//@@---------------End--------------------

const getListPost = async (req, res) => {
  const { page } = req.query;

  try {
    const posts = await Post.find({})
      .limit(10)
      .skip(pagination(page))
      .sort('-createdAt');
    return responseHandler.ok(res, posts);
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};

// Like And Unlike

const like = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (post.likes.includes(userId)) {
      // unLike
      const result = await Post.findByIdAndUpdate(postId, {
        $pull: {
          likes: userId,
        },
      });

      return responseHandler.ok(res, result);
    } else {
      // like
      const result = await Post.findByIdAndUpdate(postId, {
        $push: {
          likes: userId,
        },
      });

      return responseHandler.ok(res, result);
    }
  } catch (error) {
    responseHandler.internalServer(res, error);
  }
};
module.exports = {
  createPost,
  removePost,
  updatePost,
  getMyPost,
  getListPost,
  like,
};
