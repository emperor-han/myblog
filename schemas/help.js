var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var moment = require('moment');

var helpSchema = new Schema({
  title:String,
  content:String,
  award:String,
  publisher: {
    type:ObjectId,
    ref:'Student'
  },
  haveImg:{
    type:String,
    default:''
  },
  coverImgPath:String,
  //保存内容中图片的数组，暂时还不实现
  /*content_imgs:[{
    type:String
  }],*/
  pv:{
    type:Number,
    default:0
  },
  makeIt:{
    type:Boolean,
    default:false
  },
  receiveComforts:[{
    type:ObjectId,
    ref:'Student'
  }],
  receiveUps:[{
    type:ObjectId,
    ref:'Student'
  }],
  helpers:[{
    type:ObjectId,
    ref:'Student'
  }],
  finalHelper:{
    type:ObjectId,
    ref:'Student'
  },
  comments_count:{
    type:Number,
    default:0
  },
  meta:{
    createAt:String,
    updateAt:String
  }
});

helpSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss a');
  }else{
    this.meta.updateAt = moment(Date.now()).format('YYYY MM DD , h:mm:ss a');
  }
  next();
})


helpSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort({'meta.updateAt':-1})
      .populate({
        path:'publisher',
        select:'nickname avatar'
      })
      .exec(cb)
  },

  //通过标题获取求助(是正则匹配来查询，所有可以有多个)
  getByTitle: function(t){
    return this
              .find({title:t})
              .sort({'meta.updateAt':-1})
              .populate({
                path: 'publisher',
                select: 'avatar nickname'
              })
              .exec()
              
  },
  
  /*//获取所有未解决求助
  getUnfinishHelps:function(){
    return this
      .find({makeIt:false})
      .sort({'meta.updateAt':-1})
      .populate({
        path:'publisher',
        select:'nickname avatar'
      })
      .exec()
  },*/

  //获取特定范围内未解决求助,并对一定顺序排列
  //getspecifiedUnfinishHelps 简写
  getSUHelps:function(index,per_page,order){
    return this
      .find({makeIt:false})
      .skip(index)
      .limit(per_page)
      .sort(order)
      .populate({
        path:'publisher',
        select:'nickname avatar'
      })
      .exec()
  },

  //通过id 来删除一个求助
  deleteById: function(id){
    return this
              .findByIdAndRemove(id)
              .exec()
  },

  //获取所有未解决求助的总数
  //getUnfinishHelpsCount 简写
  getUFHCount:function(){
    return this
            .count({makeIt:false})
            .exec()
          },
  
  findById: function(id,cb){
    return this
      .findOne({_id:id})
      .populate({
        path:'publisher receiveComforts receiveUps helpers',
        select:'nickname avatar'
      })
      .exec(cb)
  },
  //通过求助 id 给 某字段 加1
  incOne: function incOne(id,data){
    return this
            .update({_id:id},{$inc:data})
            .exec()
  },

  //通过id 得到一个求助信息但不populate
  getById: function(id){
    return this
              .findOne({_id:id})
              .exec()
  },

  //通过 id 更新
  updateById: function(id,data){
    return this.findByIdAndUpdate(id,{$set: data}).exec()
  },

  //通过id 获取该学生发布未完成求助
  //getSelfUnfinishById 简写
  getSUById: function(id){
    return this
              .find({publisher:id,makeIt:false})
              .populate({
                path:'publisher',
                select:'nickname avatar'
              })
              .exec()

  },

  //通过id 获取该学生发布完成求助
  //getSelfById 简写
  getSById: function(id){
    return this
              .find({publisher:id,makeIt:true})
              .populate({
                path:'publisher',
                select:'nickname avatar'
              })
              .exec()

  },

  //通过id 获取该学生帮助他人已完成求助
  //getOtherById 简写
  getOById: function(id){
    return this
              .find({finalHelper:id,makeIt:true})
              .populate({
                path:'publisher',
                select:'nickname avatar'
              })
              .exec()

  }

}

module.exports = helpSchema;