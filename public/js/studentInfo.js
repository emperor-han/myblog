
var fileReader = new FileReader();
var imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
fileReader.onload = function(e){
  $('#uploadPreview').attr("src",e.target.result);
}
function loadImageFile(){
  if(!$('#uploadImage')[0].files.length) return;
  console.log($('#uploadImage')[0].value);
  var file = $('#uploadImage')[0].files[0];
  //if (!imgFilter.test(file.type)) { alert("You must select a valid image file!"); return; }
  fileReader.readAsDataURL(file);
}

$(function(){
  $('#uploadImage').change(loadImageFile);
})
