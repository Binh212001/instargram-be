const express = require('express');
const {
  register,
  login,
  addFriend,
  getFriendList,
  getStranger,
  listUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/friend/action', addFriend);
router.get('/friend', getFriendList);
router.get('/user', listUser);

module.exports = router;
