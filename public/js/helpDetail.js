$(function() {

  var newComment = $('.new-comment');
  $(newComment).find('.main-send').click(() => {
    if ($(this).find('textarea').val().length > 0) {
      $.ajax({
        url: "http://127.0.0.1:8060/comment/create",
        type: 'POST',
        data: {
          help: $('#new_comment_info').data('help'),
          publisher: $('#new_comment_info').data('publisher'),
          help_owner : $('.help-owner').data('help-owner'),
          content: $(this).find('textarea').val()
        },
        dataType: 'JSON',
        success: function(data) {
          var construct = '<div class="comment"><div><div class="author"><a href="#" target="_blank" class="avatar"><img src=' + data.student.avatar + '></a><div class="info"><a href="#" target="_blank" class="name">' + data.student.nickname + '</a><div class="meta"><span>' + data.time + '</span></div></div></div><div class="comment-wrap"><p>' + $('.new-info').val() + '</p><div class="tool-group"></div>';
          $(construct).appendTo($('#normal-comment-list'));
          $('.new-info').val('');
        }
      })
    }
  })

 // 安慰 和 顶 的异步操作
 $('.comfort').click(function(){
     comfort_up_operate("comfort",3);
  })
  $('.up').click(function(){
      comfort_up_operate("up",4);
  })
  function comfort_up_operate(str,t){
    var obj = '.'+str;
    var newClass = 'have-'+str;
    var operate = {
      url:"http://127.0.0.1:8060/help/operate_comfort",
      type:"POST",
      data: {
        help: $('#new_comment_info').data('help'),
        comforter_id:$('#new_comment_info').data('publisher'),
        help_owner:$('#new_comment_info').data('receiver')
      },
      dataType: 'JSON',
      success:function(){
        $(obj).addClass(newClass);
        $(obj).unbind();
        $(obj).find('.fa-check').removeClass('hide');
        $(obj).removeClass(str);
      }
    }
    if(t == 4){
      operate.url = "http://127.0.0.1:8060/help/operate_up";
    }

    $.ajax(operate);
  }

  //帮助的异步操作
  $('.help').click(function(){
    var operate = {
      url:"http://127.0.0.1:8060/help/goHelp",
      type:"POST",
      data: {
        help: $('#new_comment_info').data('help'),
        helper_id:$('#new_comment_info').data('publisher'),
        help_owner:$('#new_comment_info').data('receiver')
      },
      dataType: 'JSON',
      success:function(){
        $('.help').addClass('have-help');
        $('.help').unbind();
        $('.help').find('.fa').addClass('hide');
        $('.help').find('span').text("正在帮助。。");
        $('.help').removeClass('help');
      }
    }
    
    $.ajax(operate);
  })

  //求助用户点击已解决按钮
  $('.helping').find('li').click(function(){
    var help_owner = $('.help-owner').data('help-owner');
    var help_id = $('#new_comment_info').data('help');
    var _href = $(this).find('.helper-name').attr('href');
    var helper_id = _href.split('/')[3];

    $.ajax({
      url: "http://127.0.0.1:8060/help/has_solve",
      type: 'POST',
      data: {
        help_owner: help_owner,
        help_id: help_id,
        helper_id: helper_id
      },
      dataType: 'JSON',
      success: ()=>{
        $(this).find('.has-solve').addClass('has-solve-style');
      }
    })

  })

})
