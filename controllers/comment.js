var Comment = require('../models/comment.js');
var Message = require('../models/message.js');
var Student = require('../models/student.js');
var Help = require('../models/help.js');

exports.create = (req,res,next)=>{
  
  var message = {
     type:1,
     send : req.body.publisher,
     help : req.body.help,
     content : req.body.content,
     receive : req.body.help_owner
  }
  Promise
    .all([Comment.create(req.body),Message.create(message),Student.incCC(message.receive),Help.incOne(message.help,{comments_count:1})])
    .then((result)=>{
      res.send({
        student:req.session.student,
        time:result[0].meta.createAt
      });
    })
    .catch(next)
  
}