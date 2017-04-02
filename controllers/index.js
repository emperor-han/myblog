var Help = require('../models/help.js');

exports.index = (req, res,next) => {
  var page = req.query.p || 0;//页数
  var number = 5;//每页的求助数
  var index = page*number;//数组索引
  var currentPage = page;//当前页码
      
  Promise
      .all([Help.getSUHelps(index,number,{'meta.updateAt':-1}),Help.getUFHCount()])
      .then((result)=>{
        var allPages = Math.ceil(result[1]/number);//分页总数
        res.render('index',{
          pageTitle: '首页-校友互助',
          helps: result[0],
          allPages:allPages,
          currentPage:currentPage,
        })
      })
      .catch(next)

  }