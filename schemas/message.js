var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var moment = require('moment');

var messageSchema = new Schema({
  // type 1 代表评论消息，2 代表帮助消息， 3 代表安慰 ，4代表顶
    type:Number,
    have_saw:{
      type:Boolean,
      default:false
    },
    send:{
      type:ObjectId,
      ref:'Student'
    },
    receive:{
      type:ObjectId,
      ref:'Student'
    },
    help:{
      type:ObjectId,
      ref:'Help'
    },
    content:String,
    createAt:String
});

messageSchema.pre('save',function(next){
  if(this.isNew){
    this.createAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss');
  }
  next();
})


messageSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id,cb){
    return this
      .findOne({_id:id})
      .exec(cb)
  },

  //通过求助id获取该求助信息下的所有评论
  getByHelpId: function(id){
    return this
              .find({help:id})
              .sort({'meta.updateAt':-1})
              .populate({
                path:'publisher',
                select:'nickname avatar'
              })
              .exec()
  },

  //删除某一求助下的所有消息
  deleteByHelp: function(help){
    return this
              .remove({help:help})
              .exec()
  },

  /*//获取所有未读消息的总数
  //getNotKnowMessageAmount 简写
  getNKMAmount: function(id){
    return this
              .find({have_saw:false,_id:id})
              .sort({'createAt':-1})
              .exec()
  },*/

  //通过学生id和类型 来获得某一类型下的未看的消息
  //getNotSeeMessageByIdAndType 简写 t 代表 type
  getNSMByIdAndT: function(id,t){
    return this
              .find({have_saw:false,receive:id,type:t})
              .sort({'createAt':-1})
              .populate({
                path:'send receive help',
                select:'avatar nickname title'
              })
              .exec()
  },

  //通过学生id和类型来将某一类型下的消息的 have_saw 设为 true
  //updateHaveSawByIdAndType
  updateHSByIdAndT:function(id,t){
    return this
              .update({have_saw:false,receive:id,type:t},{$set:{have_saw:true}},{ multi: true })
              .exec()
  },

  //通过学生id和类型 来获得某一类型下的未看消息的总数
  //getNotSeeTypeMessageByIdAndType 简写 t 代表 type
  getNSTMByIdAT: function(id,t){
    return this
              .count({have_saw:false,receive:id,type:t})
              .exec()
  }

}

module.exports = messageSchema;