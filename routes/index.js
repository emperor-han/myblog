module.exports = function(app){
  //
  app.get('/',require('../controllers/index.js').index);
  app.get('/signin',(req,res)=>{
    res.render('signin');
  })

  app.use('/student',require('./student.js'));
  app.use('/help',require('./help.js'));
  app.use('/comment',require('./comment.js'));

  //404 page
  app.use((req,res)=>{
    if(!res.headersSend){
      res.status(404).render('404');
    }
  })

  //error page
  app.use((err,req,res,next)=>{
    res.render('error',{
      error:err
    })
  })
  
}