var express = require('express');
var router = express.Router();
var Comment = require('../controllers/comment.js');

//检查是否已登录的中间件
var Middle = require('../middlewares/isLogin.js');

//创建一个评论
router.post('/create',Middle.isLogin,Comment.create);

module.exports = router;