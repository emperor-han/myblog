$(function(){

  $('.dropdown').mouseenter(function(){
    $(this).addClass('open');
  })
  $('.dropdown').mouseleave(function(){
    $(this).removeClass('open');
  })

  setTimeout(hideMessage,3000);
  function hideMessage(){
    $('.message').addClass('hide');
  }

  function logupVerify(){
    // 以下为获取表单中的数据，然后判断是否合理
    var school = document.getElementById('school');
        nickname = document.getElementById('nickname'),
        logup_username = document.getElementById('logup_username'),
        logup_password = document.getElementById('logup_password'),
        noticeInfo = document.getElementsByClassName('notice-info'),
        nickname_regExp = /[^\w\u4e00-\u9fa5]/g,
        username_regExp = /1[\d]{10}/,
        school_ok = false,
        nickname_ok = false,
        username_ok = false,
        password_ok = false,
        logup_form = document.getElementById('logup_form');

    //验证之前将表单的上传置为false
    logup_form.onsubmit = function(){
      return false;
    }

    function showInfo(info){
      noticeInfo[0].classList.remove('hide');
      noticeInfo[0].innerHTML = info;
    }
    function logup_ok(){
      noticeInfo[0].classList.add('hide');
      if(school_ok && nickname_ok && username_ok && password_ok)
        logup_form.onsubmit = function(){
          return true;
      }
    }

    //学校验证
    school.onblur = function(){
      school_ok = false;
      var value = $(school).val();
      if(!value){
        showInfo('学校不能为空');
      }else{
        school_ok = true;
        logup_ok();
      }
    }

    //昵称验证
    nickname.onblur = function(){
      nickname_ok = false;
      var value = $(nickname).val();
      var newValue = value.replace(/[^\x00-xff]/g,"xx")
      if(!value){
        showInfo('昵称不能为空');
      }
      else if(nickname_regExp.test(value)){
        showInfo('昵称含有非法字符');
      }
      else if(newValue.length>20){
        showInfo('昵称长度太长');
      }else{
        nickname_ok = true;
        logup_ok();
      }
    }


    
    //用户名验证
    logup_username.onblur = function(){
      username_ok = false;
      var value = $(logup_username).val();
      if(!value){
        showInfo('用户名不能为空');
      }
      else if(!username_regExp.test(value)){
        showInfo('请输入正确的电话号码！');
      }
      else{
        username_ok = true;
        logup_ok(username_ok);
      }
    }

    //密码验证
    logup_password.onblur = function(){
      password_ok = false;
      var value = $(logup_password).val();
      if(!value){
        showInfo('密码不能为空');
      }
      else if(value.length<6){
        showInfo('密码长度小于 6');
      }
      else if(value.length>20){
        showInfo('密码长度大于 20');
      }
      else{
        password_ok = true;
        logup_ok();
      }
    }


  }

  logupVerify();//调用注册验证函数

})




