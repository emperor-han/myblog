$(function(){

  $('.no-found').click(function(){
    var id = $(this).data('lost');
    var btn = $(this);
    $.ajax({
      url: "/help/lost_and_found/operate/" + id,
      type: "GET",
      success: function(){
        btn.removeClass('btn-primary');
        btn.addClass('btn-default founded disabled');
        btn.text('已完成');
        btn.unbind();
        btn.removeClass('no-found');
      }
    })

  });
  
})