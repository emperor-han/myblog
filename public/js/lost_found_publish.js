function logupVerify(){
    // 以下为获取表单中的数据，然后判断是否合理
    var title = document.getElementById('lost_found_title');
        content = document.getElementById('lost_found_content'),
        coverImg = document.getElementById('coverImg'),
        contact = document.getElementById('contact'),
        noticeInfo = $('.notice-info'),
        publish_btn = $('#publish_btn'),
        lost_found_form = document.getElementById('lost_found');
    //验证之前将表单的上传置为false
    console.log(publish_btn);
    publish_btn.click(function(){
      try{
        if(!title.value){
          throw new Error('标题不能为空！');
        }
        if(!content.value){
          throw new Error('内容不能为空！');
        }
        if(!coverImg.value){
          throw new Error('封面图片不能为空！');
        }
        if(!contact.value){
          throw new Error('联系方式不能为空！');
        }
      }catch(e){
        noticeInfo[1].classList.remove('hide');
        noticeInfo[1].innerHTML = e.message;
        return lost_found_form.onsubmit = function(){
          console.log(2323);
          return false;
        }
      }
      return lost_found_form.onsubmit = function(){
          return true;
        }
    })
    
    function showInfo(info){
      noticeInfo[1].classList.remove('hide');
      noticeInfo[1].innerHTML = info;
    }

  }

$(function(){
    logupVerify();//调用验证函数
})