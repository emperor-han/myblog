module.exports = {
  isLogin: function isLogin(req,res,next){
    if(req.session.student){
      next()
    }else{
      req.flash('error','请先登录！');
      res.redirect('/signin');
    }
  }
}



