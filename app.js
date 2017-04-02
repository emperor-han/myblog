const express = require('express');
const path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var moment = require('moment');
var bodyParser = require('body-parser');
var config = require('config-lite');
var flash = require('connect-flash');
var Student = require('./models/student.js');

const app = express();
//设置模板引擎
app.set('view engine', 'jade');
//设置模板目录
app.set('views', path.join(__dirname, '/views/pages'));
//设置静态文件存放地址
app.use(express.static(path.join(__dirname, '/public/')));
//设置用户头像存放地址
app.use(express.static(path.join(__dirname, '/students/avatars/')));
//设置每次 req 请求中 数据的解析
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  maxAge: config.session.maxAge,
  store: new MongoStore({ url: config.mongodb })
}))

mongoose.connect(config.mongodb);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('database connect successful!');
})

//中间件，显示消息
app.use(flash());
//设置全局变量
app.use((req,res,next)=>{
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  if(req.session.student){
    Student
    .findById(req.session.student._id)
    .then((s)=>{
      res.locals.student = s;
      next();
    })
  }else{
    next();
  }
  
})

if('development' === app.get('env')){
  app.set('showStackError',true);
  app.use(morgan(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug',true);
}
//用户信息后上传头像目录
app.use('/student/info/edit',require('express-formidable')({
  uploadDir: path.join(__dirname, 'students/avatars'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));
//求助信息的封面图片
app.use('/help/publish',require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img/'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));
//失物招领的封面图片
app.use('/help/lost_and_found/publish',require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/lost_found_img/'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));


require('./routes/index.js')(app);


app.listen(config.port,()=>{
  console.log('server is running the 127.0.0.1:' + config.port);
});