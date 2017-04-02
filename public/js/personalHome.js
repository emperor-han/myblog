$(function(){
  $('.list-menu').find('li').click(function(){
    $('.list-menu').find('li').removeClass('active');
    $(this).addClass('active');
    var index = $(this).data('index');
    $('.list-container').find('ul').addClass('hide');
    $('.list-container').find('ul')[index].classList.remove('hide');
  })


  $('.del').click(function(){
    var li = $(this).closest("li");
    var id = $(this).data("id");
    $.ajax({
        url:"/help/delete/"+id,
        type:"GET",
        success:function(){
          console.log(1111);
          $(li).remove();
          console.log(2222);
        }
      })
  })

  /*var lis  = $('.help-list');
  console.log(lis);
  lis.each(function(index,item){
    console.log(item);
    $(item).find('.del').click(function(){
      var id = $(this).data("id");
      var t = this;
      console.log(item);
      $.ajax({
        url:"/help/delete/"+id,
        type:"GET",
        success:function(){
          console.log(this);
          console.log(1111);
          $(item).remove();
          console.log(2222);
        }
      })
    })

  })*/

})