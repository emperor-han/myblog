var express = require('express');
var router = express.Router();
var Student = require('../controllers/student.js');

//检查是否已登录的中间件
var Middle = require('../middlewares/isLogin.js');

//学生注册
router.post('/signup',Student.signup);
//学生登录
router.post('/signin',Student.signin);
//学生退出
router.get('/signout',Student.signout);
//资料设置页面
router.get('/info/:id',Middle.isLogin,Student.info);
//资料更改
router.post('/info/edit/:id',Middle.isLogin,Student.edit);
//学生个人主页
router.get('/personal_home/:id',Student.personal_home);
//学生消息页面
router.get('/notification/:id',Middle.isLogin,Student.notification);
//搜索页面
router.get('/search',Student.search);
//异步减去用户未读评论数
router.get('/notification/comments/:id',Middle.isLogin,Student.sub_comments);
//异步获取用户未读帮助信息并展示，并且让该用户的未读帮助信息数为0
router.get('/notification/helps/:id',Middle.isLogin,Student.sub_helps);
//异步获取用户未读安慰并展示，并且让该用户的未读安慰数为0
router.get('/notification/comforts/:id',Middle.isLogin,Student.sub_comforts);
//异步获取用户未读顶并展示，并且让该用户的未读顶数为0
router.get('/notification/ups/:id',Middle.isLogin,Student.sub_ups);

module.exports = router;