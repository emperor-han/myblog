var express = require('express');
var router = express.Router();
var Help = require('../controllers/help.js');

//检查是否已登录的中间件
var Middle = require('../middlewares/isLogin.js');

//最急求助页面
router.get('/rush_helps',Help.rush_helps);
//失物招领页面
router.get('/lost_and_found',Help.lost_and_found);
//发布新的失物招领页面
router.get('/lost_and_found/publish',Middle.isLogin,Help.lost_found_publish_page);
//失物招领发布
router.post('/lost_and_found/publish',Middle.isLogin,Help.lost_found_publish);
//失物招领详情页面
router.get('/lost_and_found/detail/:id',Help.lost_found_detail);
//失物已找到失主处理逻辑
router.get('/lost_and_found/operate/:id',Help.lost_found_operate);
//发布求助信息页面
router.get('/',Middle.isLogin,Help.helpPage);
//发布求助
router.post('/publish',Middle.isLogin,Help.publish);
//求助编辑页面
router.get('/edit/:id',Middle.isLogin,Help.edit);
//求助删除页面
router.get('/delete/:id',Middle.isLogin,Help.del);
//求助详细页
router.get('/detail/:id',Help.detail);
//安慰操作
router.post('/operate_comfort',Middle.isLogin,Help.operate_comfort);
//顶 操作
router.post('/operate_up',Middle.isLogin,Help.operate_up);
//帮助操作
router.post('/goHelp',Middle.isLogin,Help.goHelp);
//求助已解决
router.post('/has_solve',Middle.isLogin,Help.has_solve);

module.exports = router;