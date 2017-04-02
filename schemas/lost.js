var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var moment = require('moment');
var lostSchema = new Schema({
  title:String,
  publisher:{
    type:ObjectId,
    ref:'Student'
  },
  content:String,
  contact:String,
  coverImgPath:String,
  makeIt:{
    type:Boolean,
    default:false
  },
  meta:{
    createAt:String,
    updateAt:String
  }
});

lostSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss a');
  }else{
    this.meta.updateAt = moment(Date.now()).format("YYYY/MM/DD");
  }
  next();
})


lostSchema.statics = {
  //获取到所有未完成的失物招领
  fetch:function(){
    return this
              .find({makeIt:false})
              .sort({'meta.updateAt':-1})
              .populate({
                path:'publisher',
                select:'nickname avatar'
              })
              .exec()
  },

  //通过id 获取到一个失物招领
  findById: function(id){
    return this
              .findOne({_id:id})
              .populate({
                path:'publisher',
                select:'avatar nickname'
              })
              .exec()
  },

  //通过id 完成一个失物招领
  finishById: function(id){
    return this
              .findByIdAndUpdate(id,{$set: {makeIt: true}})
              .exec()
  }

}

module.exports = lostSchema;