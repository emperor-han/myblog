var fs = require('fs');
var path = require('path');
var Help = require('../models/help.js');
var Comment = require('../models/comment.js')
var Message = require('../models/message.js');
var Student = require('../models/student.js');
var Lost = require('../models/lost.js');

//最急求助页面
exports.rush_helps = (req,res,next)=>{
  var page = req.query.p || 0;//页数
  var number = 5;//每页的求助数
  var index = page*number;//数组索引
  var currentPage = page;//当前页码
      
  Promise
      .all([Help.getSUHelps(index,number,{'receiveUps':-1}),Help.getUFHCount()])
      .then((result)=>{
        var allPages = Math.ceil(result[1]/number);//分页总数
        res.render('rush_helps',{
          pageTitle: '首页-校友互助',
          helps: result[0],
          allPages:allPages,
          currentPage:currentPage,
        })
      })
      .catch(next)
}

//求助信息页面
exports.helpPage = (req,res)=>{
  res.render('publish');
}

//失物招领页面
exports.lost_and_found = (req,res,next)=>{
  Lost
      .fetch()
      .then((losts)=>{
          res.render('lostAndFound',{
            losts:losts
          });
      })
      .catch(next)
}

//发布新的失物招领页面
exports.lost_found_publish_page = (req,res)=>{
  res.render("lost_found_publish");
}

//失物招领发布
exports.lost_found_publish = (req,res,next)=>{
  var title = req.fields.title;
  var content = req.fields.content;
  var contact = req.fields.contact;
  var coverImgName = req.files.coverImg.path.split(path.sep).pop();

  var _lost = {
    title:title,
    content:content,
    contact:contact,
    publisher:req.session.student._id,
    coverImgPath:'/lost_found_img/'+coverImgName
  }
  
  Lost
    .create(_lost)
    .then(()=>{
      res.redirect('/help/lost_and_found');
    })
    .catch(next)
}

//失物招领详情页面
exports.lost_found_detail = (req,res,next)=>{
  var id = req.params.id;
  Lost
      .findById(id)
      .then((lost)=>{
        res.render('lost_detail',{
          lost:lost
        });
      })
      .catch(next)
}

//失物招领已完成
exports.lost_found_operate = (req,res,next)=>{
  var id  = req.params.id;
  Lost
    .finishById(id)
    .then(()=>{
      res.json({"status":"ok"})
    })
    .catch(next)
}


//发布求助
exports.publish = (req,res,next)=>{
  var title = req.fields.title;
  var content = req.fields.content;
  var award = req.fields.award;
  console.log(req.query.id);
  //过滤出该求助内容中的图片,暂时不实现
  //var filterSrc = /\"http:.+?\"/g;;
  var coverImgName = req.files.coverImg.path.split(path.sep).pop();
  //保存内容中图片的数组
  //var content_imgs = content.match(filterSrc);
  //验证
  try{
    if(title.length === 0){
      throw new Error('标题为空！');
    }
    if(content.length === 0){
      throw new Error('内容为空！');
    }
  }catch(e){
    //异步删除上传的封面图片
    fs.unlink(req.files.coverImg.path);
    req.flash('error',e.message);
    return res.redirect('back');
  }

  var _help = {
    title:title,
    content:content,
    award:award,
    publisher:req.session.student._id
  }
  if(req.files.coverImg.name){
    _help.haveImg = 'have-img';
    _help.coverImgPath = '/img/'+coverImgName;
  }
  //判断是用户修改求助还是新建
  if(req.query.edit){
    Help
      .updateById(req.query.id,{title:title,content:content,award:award})
      .then(()=>{
        req.flash('success',"修改成功");
        res.redirect('/help//detail/'+req.query.id);
      })
  }else{
    Help
      .create(_help)
      .then((help)=>{
        console.log(help);
        res.redirect('/');
      })
      .catch(next)
  }
}

//跳转到求助详情页面
exports.detail = (req,res,next)=>{
  var id = req.params.id;
  Promise
    .all([Help.findById(id),Comment.getByHelpId(id),Help.incOne(id,{pv:1})])
    .then((result)=>{
      console.log(result[0]);
      res.render('helpDetail',{
        help:result[0],
        comments:result[1]
      })
    })
    .catch(next)
}

//用户重新编辑求助
exports.edit = (req,res,next)=>{
  var id = req.params.id;
  Help
    .getById(id)
    .then((help)=>{
      res.render('edit_help',{
        help:help
      })
    })
    .catch(next)
}


//用户删除该求助
exports.del = (req,res,next)=>{
  var id = req.params.id;
  Promise
      .all([Help.deleteById(id),Comment.deleteByHelp(id),Message.deleteByHelp(id)])
      .then(()=>{
        res.json({"status":"ok"});
      })
      .catch(next)

}

//求助页面的点击安慰操作
exports.operate_comfort = (req,res,next)=>{
  var id = req.body.help;
  var comforter_id = req.body.comforter_id;
  var message = {
    type:3,
    help:id,
    send:comforter_id,
    receive:req.body.help_owner
  }
  Promise
    .all([Help.getById(id),Message.create(message),Student.incCFC(message.receive)])
    .then((result)=>{
      var help = result[0];
      help.receiveComforts.push(comforter_id);
      help.save((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.json({ "status": "OK" });
      })
    })
    .catch(next)

}

//求助页面的顶操作
exports.operate_up = (req,res,next)=>{
  var id = req.body.help;
  var comforter_id = req.body.comforter_id;
  var message = {
    type:4,
    help:id,
    send:comforter_id,
    receive:req.body.help_owner
  }
  Promise
    .all([Help.getById(id),Message.create(message),Student.incUC(message.receive)])
    .then((result)=>{
      var help = result[0];
      help.receiveUps.push(comforter_id);
      help.save((err) => {
        if (err) {
          console.log(err);
          return;
        }
        res.json({ "status": "OK" });
      })
    })
    .catch(next)

}

//求助页面点击帮助
exports.goHelp = (req,res,next)=>{
  var id = req.body.help;
  var helper_id = req.body.helper_id;
  var help_owner = req.body.help_owner;
  var message = {
    type:2,
    help:id,
    send:helper_id,
    receive:help_owner
  }

  Promise
    .all([Help.getById(id),Message.create(message),Student.incHC(message.receive)])
    .then((result)=>{
      var help = result[0];
      help.helpers.push(helper_id);
      help.save((err,help)=>{
        res.json({ "status": "OK" });
      })
    })
    .catch(next)

}

//求助被解决
exports.has_solve = (req, res,next) => {
  var help_owner = req.body.help_owner;
  var help_id = req.body.help_id;
  var helper_id = req.body.helper_id;
  Help
    .updateById(help_id,{makeIt:true,finalHelper:helper_id})
    .then(()=>{
      res.send({'status':'ok'});
    })
    .catch(next)

}