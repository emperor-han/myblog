var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var ObjectId = Schema.Types.ObjectId;
var moment = require('moment');
const saltRounds = 10;


var studentSchema = new Schema({
  school:String,
  nickname:String,
  username:{
    type:String,
    unique:true
  },
  password:String,
  role:{
    type:Number,
    default:0
  },
  sex:{
    type:Number,
    default:0
  },
  brief:{
    type:String,
    default:"这个人很懒，没有留下什么内容！"
  },
  avatar:{
    type:String,
    default:"/default.jpg"
  },
  //not_see_comments_count
  NSC_count:{
    type:Number,
    default:0
  },
  //not_see_helpInfo_count
  NSHI_count:{
    type:Number,
    default:0
  },
  //not_see_comfort_count
  NSCF_count:{
    type:Number,
    default:0
  },
  //not_see_up_count
  NSU_count:{
    type:Number,
    default:0
  },
  meta:{
    createAt:String,
    updateAt:String
  }
});

studentSchema.pre('save',function(next){
  var student = this;
  if(this.isNew){
    this.meta.createAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss a');
    bcrypt.genSalt(saltRounds,(err,salt)=>{
      if(err) return next(err);
      bcrypt.hash(student.password,salt,(err,hash)=>{
        if(err) return next(err);
        student.password = hash;
        next();
      })
    })
  }else{
    this.meta.updateAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss a');
    next();
  }
  
})

studentSchema.methods = {
  comparePassword:function(_password,cb){
    bcrypt.compare(_password,this.password,(err,isMatched)=>{
      if(err) return cb(err);
      cb(null,isMatched);
    })
  }
}



studentSchema.statics = {
  //获取到所有学生
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  //通过 id 获取一个学生
  findById: function(id,cb){
    return this
      .findOne({_id:id})
      .exec(cb)
  },
  //通过用户名获取一个学生
  getByUsername: function(username){
    return this.findOne({username:username}).exec()
  },

  //通过昵称获取学生(正则匹配查询，所以可以有多个)
  getByNickname: function(n){
    return this
              .find({nickname:n})
              .sort({'meta.createAt':-1})
              .exec()
  },

  //通过id更新学生的资料
  updateById: function(id,data){
    return this.findByIdAndUpdate(id,{$set: data}).exec()
  },

  //通过id将学生未读评论消息的数加1
  //incCommentsCount
  incCC: function(id){
    return this
            .findByIdAndUpdate(id,{$inc:{NSC_count:1}})
            .exec()
  },

  //通过id将学生未读求助消息的数加1
  //incHelpsCount
  incHC: function(id,t){
    return this
            .findByIdAndUpdate(id,{$inc:{NSHI_count:1}})
            .exec()
  },

  //通过id将学生未读安慰的数加1
  //incComfortCount
  incCFC: function(id,t){
    return this
            .findByIdAndUpdate(id,{$inc:{NSCF_count:1}})
            .exec()
  },

  //通过id将学生顶的数加1
  //incUpCount
  incUC: function(id,t){
    return this
            .findByIdAndUpdate(id,{$inc:{NSU_count:1}})
            .exec()
  },

  //通过id将学生某种未读消息的数置为0
  //setTypeNotSeeMessage0 简写
  setTNSM0: function(id,data){
    return this
              .findByIdAndUpdate(id,{$set:data})
              .exec()
  }

}

module.exports = studentSchema;