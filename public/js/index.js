SlideImg.prototype = {

    go: function() {
        var slideImgWrap = document.querySelector('.slide-img-wrap'),
            outerWrapper = slideImgWrap.querySelector("#outerWrapper"),
            slideLeft = slideImgWrap.querySelector('#arrow-left'),
            slideRight = slideImgWrap.querySelector('#arrow-right'),
            imgWrapper = outerWrapper.querySelector('.img-wrapper'),
            imgNumber = outerWrapper.querySelectorAll('#get-imgs img').length,
            spans = outerWrapper.querySelectorAll('#focus-circle span'),
            activeSpan = 0,
            flag = true;
            timer = null,
            offset = this.offset;

        function changeLeft(offset) {
            var newLeft = parseInt(imgWrapper.style.left) + offset,
                interval = 5;
            if (Math.abs(offset) > this.offset * 2) {
                interval = 2;
            }
            var speed = offset / interval,
                time = 100;
            flag = false;
            (function hhh() {
                if ((offset < 0 && parseInt(imgWrapper.style.left) > newLeft) || (offset > 0 && parseInt(imgWrapper.style.left) < newLeft)) {
                    imgWrapper.style.left = parseInt(imgWrapper.style.left) + speed + 'px';
                    setTimeout(arguments.callee, time);
                } else {
                    flag = true;
                    imgWrapper.style.left = newLeft + 'px';
                    if (newLeft === -(imgNumber - 1) * Math.abs(offset)) {
                        imgWrapper.style.left = -Math.abs(offset) + 'px';
                    } else if (newLeft === 0) {
                        imgWrapper.style.left = -(imgNumber - 2) * Math.abs(offset) + 'px';
                    }
                }
            })();
        }

        function changeFocus(index) {
            if (index === spans.length) {
                index = 0;
            } else if (index === -1) {
                index = (spans.length - 1);
            }
            activeSpan = index;
            outerWrapper.querySelector('#focus-circle span.active').classList.remove('active');
            spans[index].classList.add('active');
        }

        slideLeft.onclick = () => {
            if (flag) {
                activeSpan--;
                changeFocus(activeSpan);
                changeLeft(offset);
            }
        };

        slideRight.onclick = () => {
            if (flag) {
                activeSpan++;
                changeLeft(-offset);
                changeFocus(activeSpan);
            }
        };

        for (var i = 0, len = spans.length; i < len; i++) {
            spans[i].index = i;
            spans[i].onclick = function() {
                if (this.index !== activeSpan) {
                    changeLeft((activeSpan - this.index) * offset);
                    activeSpan = this.index;
                    changeFocus(activeSpan);
                }
            }
        }
        timer = setInterval(slideLeft.onclick, 5000);
        outerWrapper.onmouseenter = () => clearInterval(timer);
        outerWrapper.onmouseleave = () => timer = setInterval(slideLeft.onclick, 5000);
    },
    constructor: SlideImg
};

function SlideImg(offset) {
    this.offset = offset;
}

$(function(){
    var slideImg1 = new SlideImg(630);
    slideImg1.go();
    
    $('ul.nav.navbar-nav').find('li')[0].classList.add('active');

})