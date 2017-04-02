var Student = require('../models/student.js');
var fs = require('fs');
var path = require('path');
var Help = require('../models/help.js');
var Message = require('../models/message.js');

//学生注册
exports.signup = (req, res, next) => {
  var student = req.body.student;
  Student
    .create(req.body.student)
    .then((s) => {
      req.flash('success', '注册成功！');
      res.redirect('/signin');
    })
    .catch((e)=>{
      if(e.message.match('E11000 duplicate key')){
        req.flash('error','用户名已注册');
        return res.redirect('/');
      }
      next(e);
    })
  
}

//学生登录
exports.signin = (req, res, next) => {
  var _student = req.body.student;
  try {
    if (_student.username.length === 0) {
      throw new Error('用户名为空！');
    }
    if (_student.password.length === 0) {
      throw new Error('密码为空！');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  Student
    .getByUsername(_student.username)
    .then((student) => {
      student.comparePassword(_student.password, (err, isMatch) => {
        if (isMatch) {
          req.flash('success', '登录成功！');
          //删除登录学生的密码字段
          delete student.password;
          req.session.student = student;
          return res.redirect('/');
        } else {
          req.flash('error', '密码错误！');
          return res.redirect('back');
        }
      })
    })
    .catch(next)
}

//学生退出
exports.signout = (req,res)=>{
  delete req.session.student;
  req.flash('success','退出成功');
  res.redirect('/');
}

//资料设置
exports.info = (req,res)=>{
  res.render('studentInfo');
}

//资料更改
exports.edit = (req,res,next)=>{
  //获得学生信息
  var id = req.params.id;
  var nickname = req.fields.nickname;
  var sex = req.fields.sex;
  var brief = req.fields.brief;
  //获取该学生目前头像 名称
  var avatarName = req.files.avatar.path.split(path.sep).pop();
  try{
    if(nickname.length === 0){
      throw new Error('用户名为空！');
    }
  }catch(e){
      fs.unlink(req.files.avatar.path);
      req.flash('error',e.message);
      return res.redirect('back');
  }
  //用户修改后的信息
  var data =　{
    nickname:nickname,
    sex:sex,
    brief:brief,
    avatar:'/'+avatarName
  }
  Student
    .updateById(id,data)
    .then((or)=>{
      //用户修改后将 session 中的学生信息同步更新
      req.flash('success','修改成功');
      req.session.student.nickname = nickname;
      req.session.student.sex = sex;
      req.session.student.brief = brief;
      req.session.student.avatar = data.avatar;
      //目前还未实现学生头像更新后，原头像删除
      /*if(avatarName){
        fs.unlink('students/'+or.avatar);
        req.session.student.avatar = data.avatar;
      }*/

      res.redirect('back');
    })
    .catch(next)

}

//进入学生个人主页
exports.personal_home = (req, res) => {
  var id = req.params.id;
  console.log(id);
  Promise
    .all([Help.getSUById(id),Help.getSById(id),Help.getOById(id),Student.findById(id)])
    .then((result)=>{
      res.render('personalHome', {
        pageTitle: '个人中心-校友互助',
        helpings: result[0],
        have_helps: result[1],
        helping_others: [],
        have_help_others: result[2],
        viewStudent: result[3]
      })
    })

}

//进入学生消息页面
exports.notification = (req,res,next)=>{
  var id = req.params.id;
  Promise
    .all([Message.getNSMByIdAndT(id,1)])
    .then((result)=>{
        res.render('notification',{
          pageTitle: '消息-校友互助',
          receiveComments: result[0]
        })
    })
  
}

//搜索页面
exports.search = (req,res,next)=>{
  var search_content = req.query.search_content;
  var matchExp = RegExp(search_content);
  if (search_content) {
    Promise
        .all([Help.getByTitle(matchExp),Student.getByNickname(matchExp)])
        .then((result)=>{
          res.render('search', {
              pageTitle: '搜索-校友互助',
              helps: result[0],
              students: result[1]
          });
        })

    /*Help
      .find({ title: matchExp })
      .populate({
        path: 'publisher',
        select: 'avatar nickname'
      })
      .sort({ meta: -1 })
      .exec((err, helps) => {
        if (err) {
          console.log(err);
          return;
        }
        Student
          .find({ nickname: matchExp })
          .sort({ meta: -1 })
          .exec((err, students) => {
            if (err) {
              console.log(err);
              return;
            }
            res.render('search', {
              pageTitle: '搜索-校友互助',
              helps: helps,
              students: students
            });
          })
      })*/
  } else {
    req.flash('error','搜索内容为空！');
    return res.redirect('back');
  }

}

//异步让用户未读评论数为0
exports.sub_comments = (req,res,next)=>{
  var id = req.params.id;
  Promise
    .all([Message.updateHSByIdAndT(id,1),Student.setTNSM0(id,{NSC_count:0})])
    .then(()=>{
      res.send({'status':'ok'});
    })
    .catch(next)
  
}

//点击异步得到未读求助，展示到页面，同时让这些求助设为已读消息，同时让该用户的未读求助消息为0
exports.sub_helps = (req,res,next)=>{
  var id = req.params.id;
  Promise
    .all([Message.getNSMByIdAndT(id,2),Student.setTNSM0(id,{NSHI_count:0})])
    .then((result)=>{
      Message.updateHSByIdAndT(id,2);
      res.send(result[0]);
    })
    .catch(next)
  
}

//点击异步得到未读安慰，展示到页面，同时让这些安慰设为已读消息，同时让该用户的未读安慰消息为0
exports.sub_comforts = (req,res,next)=>{
  var id = req.params.id;
  Promise
    .all([Message.getNSMByIdAndT(id,3),Student.setTNSM0(id,{NSCF_count:0})])
    .then((result)=>{
      Message.updateHSByIdAndT(id,3);
      res.send(result[0]);
    })
    .catch(next)
  
}

//点击异步得到未读顶，展示到页面，同时让这些顶设为已读消息，同时让该用户的未读顶消息为0
exports.sub_ups = (req,res,next)=>{
  var id = req.params.id;
  Promise
    .all([Message.getNSMByIdAndT(id,4),Student.setTNSM0(id,{NSU_count:0})])
    .then((result)=>{
      Message.updateHSByIdAndT(id,4);
      res.send(result[0]);
    })
    .catch(next)
  
}