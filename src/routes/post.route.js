const express = require('express');
const {
  createPost,
  updatePost,
  removePost,
  getListPost,
  getMyPost,
  like,
} = require('../controllers/post.controller');

const router = express.Router();

router.post('/post/create', createPost);
router.put('/post/update', updatePost);
router.delete('/post/remove', removePost);
router.get('/post/list', getListPost);
router.get('/post/yourself', getMyPost);
router.put('/post/like', like);

module.exports = router;
