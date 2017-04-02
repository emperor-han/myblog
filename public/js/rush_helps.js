

//说明，推荐一般将分页列表下li的数量置为单数，这样每次就能以中间的那个一个数作为转换页码的中间点

$(function() {

  $('ul.nav.navbar-nav').find('li')[1].classList.add('active');

  var ul = $('.pagination'); //ul 为分页列表的 ul

  //首先我们在后台获得所有页面的总数 allPages，和当前页面 currentPage
  //然后将 这两个值传到模板中，将他们的值放在 分页列表ul 的自定义属性 data中
  //然后通过ul 便可以在 该文件中获取到这两个值，以下便是这两个值
  var all = ul.data('all');
  var c = ul.data('c');

  //获取分页列表下所有的 li
  var lis = ul.find('li');

  //获得除了上一页和下一页的所有 li 的数量
  var li_counts = lis.length - 2;

  //调用分页函数
  page(all, lis, c, li_counts);

})

//all 为分页的总数，lis 为分页列表下所有的 li，c 为当前页面 p 的大小，li_counts 为除了 上一页和下一页之外的所有 li 的数量
function page(all, lis, c, li_counts) {

  //获取分页列表下最中间的那个 li

  var middle_ceil = Math.ceil(li_counts / 2);

  //获取分页列表以中间点为界限，两边的li的数量分别是多少，一般是 middle_ceil-1；
  var middle_floor = middle_ceil - 1;

  //如果当前页的页码大于 all-1(因为 p 从0开始，所以 all要减一)，那么说明出错了。
  if (c > all - 1) {
    return false;
  }

  //如果点击当前页面的话，就不需要做什么改变直接返回就行了
  /*console.log(lis[c+1]);
  if(lis[c+1].classList.contains('active')){
    return;
  }*/

  //如果分页的总数小于 设定的分页按钮的个数（li_counts），那么就没有必要转换页码了，只需每次改变一下他的 active即可
  if (all <= li_counts) {
    changePage(all);
  } else {
    //如果点击的页码小于 middle_ceil 说明点击的分页按钮不仅在 中间按钮的左边，而且左边显示的页面已经从1开始了，不能再向左边转换页码了，所以按钮从第一页开始
    if (c < middle_ceil) {
      changePage(li_counts);
    }
      //如果 c > all - middle_ceil 说明右边显示的页码已经显示了所有的分页，所以按钮的最后一个就是最后一页，这样倒着来填充按钮内的页码，直到填充完所有的按钮
     else if (c > all - middle_ceil) {
      changePage(li_counts, all - li_counts + 1);
    }
      //如果以上两种情况都不是，那么说明 中间按钮的左边右边都还没有到达他的极限值，所以将当前页码放在中间按钮，然后在把左右两边的按钮填充完
     else {
      changePage(li_counts, c - middle_floor + 1);
    }
  }

  //如果是第一页的话，就让上一页的按钮隐藏
  if(c == 0){
    lis[0].classList.add('hide');
  }
  //如果是最后一页的话就让下一页的按钮隐藏
  if(c == all-1){
    lis[lis.length-1].classList.add('hide');
  }

  function changePage(count, j) {
    //关于这里要用 t 这个变量的原因是：因为这个函数中有两个形参，而在上面代码调用这个函数时，有时传入一个参数，有时传入两个参数，如果没有传入参数 j，那么后面 href 中就会使用 i的值没如果传入变量 j，那么 href 中就会使用 j 的值，所以就使用一个变量来接受一个值，当传入 j 时，它的值为 j，没有传入时，它的值为 i。
    var t;

    //循环依次填充 除上一页和下一页外所有的按钮，因为 第一个 li 永远是 上一页的按钮，所以 i从1开始。
    for (let i = 1; i < count + 1; i++, j++) {
      t = j ? j : i;
      //将当前页所属的 li 的状态设为激活状态
      if (t == c + 1) {
        lis[i].classList.add('active');
      }
      //设置对应 li 下 a 标签的 href 和 值
      var href = '/help/rush_helps?p=' + (t - 1);
      $(lis[i]).find('a').attr('href', href);
      $(lis[i]).find('a').text(t);
    }
  }

}
