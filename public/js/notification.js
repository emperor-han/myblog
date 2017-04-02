$(function() {
  //获取侧边栏中所有的 li
  var lis = $('.aside').find('ul li');
  //点击侧边栏控制右边div 的显示和隐藏
  lis.click(function() {
    var index = $(this).data('index');
    var divs = $('.main>div');
    lis.removeClass('active');
    $(this).addClass('active');
    divs.addClass('hide');
    divs[index].classList.remove('hide');
  })

  

  //得到未读消息的数量
  var comment_count = $('#not_see_comments_count').data('comment-count');
  var help_count = $('#not_see_comments_count').data('help-count');
  var comfort_count = $('#not_see_comments_count').data('comfort-count');
  var up_count = $('#not_see_comments_count').data('up-count');
  var id = $('.student-id').data('student-id');

  function ajaxOperate(type, success) {
    $.ajax({
      url: "/student/notification/" + type + "/" + id,
      type: "GET",
      success: success
    })
  }
  //如果为真，就异步让该用户的未读评论数为0
  if (comment_count) {
      ajaxOperate('comments');
      //隐藏未读评论的数量
      setTimeout(hideCount, 3000);
      function hideCount() {
        $('#disappear').addClass('hide');
      }
  }


  //求助信息点击
  if(help_count){
    $(lis[1]).click(function() {
      var constructs='';
      ajaxOperate('helps', function(data) {
        data.forEach((item)=>{
          var li_construct = '<li><a href="/student/personal_home/'+item.send._id+'",target="_blank" class="avatar"><img src='+item.send.avatar+'></a><div class="info"><div class="div"><a href="/student/personal_home/'+item.send._id+'",class="student">'+item.send.nickname+'</a><span class="comment-slogan">正在帮助你</span><a href="/help/detail/'+item.help._id+'">《 '+item.help.title+' 》</a></div><div class="time">'+item.createAt+'</div></div</li>';
          constructs += li_construct;
        })
        var appendContent = '<a class="check_more">查看所有求助信息</a>'; 
        $('.helper-list').html(constructs);
        $(appendContent).appendTo($('.helper-list'));
      })
    })
  }
  

  //安慰点击
  if (comfort_count) {
    $(lis[2]).click(function() {
      var constructs='';
      ajaxOperate('comforts', function(data) {
        data.forEach((item)=>{
          var li_construct = '<li><a href="/student/personal_home/'+item.send._id+'",target="_blank" class="avatar"><img src='+item.send.avatar+'></a><div class="info"><div class="div"><a href="/student/personal_home/'+item.send._id+'",class="student">'+item.send.nickname+'</a><span class="comment-slogan">在求助中安慰了你</span><a href="/help/detail/'+item.help._id+'">《 '+item.help.title+' 》</a></div><div class="time">'+item.createAt+'</div></div</li>';
          constructs += li_construct;
        })
        var appendContent = '<a class="check_more">查看所有安慰</a>'; 
        $('.comfort-list').html(constructs);
        $(appendContent).appendTo($('.comfort-list'));
      })
    })
  }


  //顶点击
  if (up_count) {
    $(lis[3]).click(function() {
      var constructs='';
      ajaxOperate('ups', function(data) {
        data.forEach((item)=>{
          var li_construct = '<li><a href="/student/personal_home/'+item.send._id+'",target="_blank" class="avatar"><img src='+item.send.avatar+'></a><div class="info"><div class="div"><a href="/student/personal_home/'+item.send._id+'",class="student">'+item.send.nickname+'</a><span class="comment-slogan">在求助中顶了你</span><a href="/help/detail/'+item.help._id+'">《 '+item.help.title+' 》</a></div><div class="time">'+item.createAt+'</div></div</li>';
          constructs += li_construct;
        })
        var appendContent = '<a class="check_more">查看所有安慰</a>'; 
        $('.up-list').html(constructs);
        $(appendContent).appendTo($('.up-list'));
      })
    })
  }

})
