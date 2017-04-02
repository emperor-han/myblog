var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var moment = require('moment');
var commentSchema = new Schema({
  help:{
    type:ObjectId,
    ref:'Help'
  },
  publisher:{
    type:ObjectId,
    ref:'Student'
  },
  content:String,
  have_saw:{
    type:Boolean,
    default:false
  },
  meta:{
    createAt:String,
    updateAt:String
  }
});

commentSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss a');
  }else{
    this.meta.updateAt = moment(Date.now()).format("YYYY/MM/DD");
  }
  next();
})


commentSchema.statics = {
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

  //删除某一求助下的所有评论
  deleteByHelp: function(help){
    return this
              .remove({help:help})
              .exec()
  }

}

module.exports = commentSchema;