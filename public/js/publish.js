
var fileReader = new FileReader();
var imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
fileReader.onload = function(e){

  putb64(e.target.result);
}
function loadImageFile(){
  if(!$('.help-add-img')[0].files.length) return;
  var file = $('.help-add-img')[0].files[0];
  if (!imgFilter.test(file.type)) { alert("You must select a valid image file!"); return; }
  fileReader.readAsDataURL(file);
}

$(function(){
  $('.help-add-img').change(loadImageFile);
})



/*picBase是base64图片带头部的完整编码*/
    function putb64(picBase){

            /*picUrl用来存储返回来的url*/
            var picUrl;

            /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
            picBase=picBase.substring(23);
            /*通过base64编码字符流计算文件流大小函数*/
            function fileSize(str)
            {
                var fileSize;
                if(str.indexOf('=')>0)
                {
                    var indexOf=str.indexOf('=');
                    str=str.substring(0,indexOf);//把末尾的’=‘号去掉
                }

                fileSize=parseInt(str.length-(str.length/8)*2);
                return fileSize;
            }

            /*把字符串转换成json*/
            function strToJson(str)
            { 
                var json = eval('(' + str + ')'); 
                return json; 
            } 


            var url = "http://up.qiniu.com/putb64/"+fileSize(picBase); 
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange=function()
            {
                if (xhr.readyState==4){
                    var keyText=xhr.responseText;
                    //获取textarea
                    var textBox = $('#seek_help_content');
                    //将光标重新定位到 textarea 中，防止光标不在该输入框中
                    textBox[0].focus();
                    //获取当前光标的位置
                    var indexStart = textBox[0].selectionStart;
                    var value = textBox.val();
                    
                    
                    /*返回的key是字符串，需要装换成json*/
                    keyText=strToJson(keyText);
                    /* http://ojvh6i96g.bkt.clouddn.com/是我的七牛云空间网址，keyText.key 是返回的图片文件名*/
                    picUrl="http://omubenjtf.bkt.clouddn.com/"+keyText.key;
                    //要在光标处插入的 html 代码
                    var html = '<img src="'+picUrl+'">';
                    //插入图片后整个输入框的值
                    var newValue = value.substring(0,indexStart)+html+value.substring(indexStart);
                    textBox.val(newValue);
                }
            }
            xhr.open("POST", url, true); 
            xhr.setRequestHeader("Content-Type", "application/octet-stream"); 
            xhr.setRequestHeader("Authorization", "UpToken GE9ZBzdhghxJdNeTOrI1yTtj1vM3MPGB1EcM_DH7:HmTM3ZRwa-BFXaR6uIOfxaI5dMU=:eyJzY29wZSI6InB1YmxpY2ltYWdlcyIsImRlYWRsaW5lIjoxNDk5ODA0MzgzODI4fQ=="); 
            xhr.send(picBase);

         }
