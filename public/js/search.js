$(function(){
    $('.aside .menu').find('li').click(function(){
      $('.aside .menu').find('li').removeClass('active');
      $(this).addClass('active');
      var index = $(this).data('index');
      $('.search-content').find('ul').addClass('hide');
      $('.search-content').find('ul')[index].classList.remove('hide');
  })
})