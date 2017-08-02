/**
 * Created by xsann on 2017/7/22.
 */
//数据加载
$(function () {
    $.ajax({
        type: 'GET',
        url: 'dist/data/get_new.php',
        success: function (data) {
            $('#book-new .middle ul').html(showData(data));
        }
    });
    $.ajax({
        type: 'GET',
        url: 'dist/data/get_hot.php',
        success: function (data) {
            //console.log(data);
            var html = '';
            $.each(data, function (i, item) {
                html += `<li data-bid="${item.bid}" class="hot-item">
                            <i></i>
                            <span>${i + 1}</span>
                            <p>${item.name}</p>
                            <div class="detail">
                                <div class="p-img">
                                    <img src="dist/img/${item.img}" title="${item.title}">
                                </div>
                                <div class="p-msg">
                                    <div class="p-name">
                                       <a href="#">${item.name}</a>
                                       <p>月销量：${item.sellCount}</p>
                                    </div>
                                </div>
                            </div>
                            </li>
                           `
                if (i >= 10) {
                    return;
                }
            })
            $('.book-hot .hot-content').html(html);
            $('.hot-content li').eq(0).addClass('active');
            $('.hot-item i').addClass('line').eq(0).remove();
        }
    });
    $.ajax({
        type:'GET',
        url:'dist/data/get_others.php',
        success: function (data) {
            var wdList = data['wd'];
            $('#book-wonder .middle ul').html(showData(wdList));
            var claList = data['art'];
            $('#book-art .middle ul').html(showData(claList));
        }
    });
    showCartDetail();
    $(window).scroll(function(e){
        lazyload(e,$('#book-new'));
        lazyload(e,$('#book-wonder'));
        lazyload(e,$('#book-art'));
        showBack(e,$('.backtop'));
    })
});
//轮播图
var carousel = {
    TIMER: null,
    init: function () {
        this.autoPlay();
        $('.banner-ctrl ul').on('click', 'span', function () {
            var index = $(this).parent().index();
            carousel.play(index);
        });
        $('.banner').mouseover(function () {
            clearInterval(carousel.TIMER);
        }).mouseout(function () {
            setTimeout(carousel.autoPlay(), 3000)
        });
    },
    autoPlay: function () {
        this.TIMER = setInterval(function () {
            var index = $('.banner li.active').index() + 1;
            carousel.play(index);
        }, 3000);
    },
    play: function (index) {

        var size = $('.banner .item').size();
        if (index >= size) {
            index = 0;
        }
        $(".banner li.active").removeClass('active');
        $(".banner li.item").eq(index).addClass('active');

        $('.banner-ctrl li.in').removeClass('in');
        $('.banner-ctrl li').eq(index).addClass('in');
    }
};
carousel.init();
//注册、登录、退出功能
if (sessionStorage['uname']) {
    $('#login-form').css('display', 'none');
    $('.wc-box').css('display', 'block');
    $('.wc-name').html(sessionStorage['uname']);
} else {
    $('#login-submit').click(function (e) {
        e.preventDefault();
        var data = $('#login-form').serialize();
        $.ajax({
            url: 'dist/data/login.php',
            type: "POST",
            data: data,
            success: function (data) {
                if (data.code === 2) {
                    //console.log('error');
                    $('div.form-info').show().children('p').html(data.msg);
                } else if (data.code === 1) {
                    loginSucc();
                    $('.wc-name').html(data.uname);
                    sessionStorage['uname'] = data.uname;
                    sessionStorage['uid'] = data.uid;
                    showCartDetail();
                }
            }
        })
    });
}
function DragValidate(dargEle, msgEle) {
    var dragging = false;//滑块拖动标识
    var iX;
    dargEle.mousedown(function (e) {
        msgEle.text("");
        dragging = true;
        iX = e.clientX; //获取初始坐标
    });
    $(document).mousemove(function (e) {
        if (dragging) {
            var e = e || window.event;
            var oX = e.clientX - iX;
            if (oX < 30) {
                return false;
            }
            if (oX >= 230) {//容器宽度+10
                oX = 200;
                return false;
            }
            dargEle.width(oX + "px");
            //console.log(oX);
            return false;
        }
    });
    $(document).mouseup(function (e) {
        var width = dargEle.width();
        if (width < 220) {
            //console.log(width);
            dargEle.width("30px");
            msgEle.text(">>拖动滑块验证<<");
        } else {
            dargEle.attr("validate", "true").text("验证成功！").unbind("mousedown");
            $('#login-submit').removeClass('btn-disabled').attr('disabled', false);
        }
        dragging = false;
    });
}
DragValidate($("#dragEle"), $(".tips"));
function loginSucc() {
    $('.modal').hide();
    $('div.form-info').hide();
    $('#login-form').css('display', 'none');
    $('.wc-box').css('display', 'block');
}
$('.quit a').click(function () {
    sessionStorage.removeItem("uname");
    sessionStorage.removeItem("uid");
    location.reload();
});
$('#goReg').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    $('.modal').show();
    $('#book-detail').css('display', 'none');
    $('#modal-content').css('display', 'block').animate({
        top: 0
    }, 300);
});
$('#reg-form input').on('blur', function () {
    var value = $(this).val();
    var type = $(this).attr('name'), reg;
    var valid = false;
    switch (type) {
        case "reg-name":
            reg = /^\w{6,12}$/g;
            break;
        case "reg-pwd":
            reg = /^\w{8,15}$/g;
            if ($('#re-pwd').val()) {
                rePwd($(this), $('#re-pwd').val());
            }
            break;
        case "reg-email":
            reg = /^\w+@[a-z0-9]+(\.[a-z]{2,3}){1,2}$/g;
            break;
        case "reg-phone":
            reg = /^1[34578]\d{9}$/;
            break;
        case 're-pwd':
            rePwd($(this), value);
            return;
    }
    if (type != 're-pwd') {
        if (reg.test(value)) {
            $(this).next('span').removeClass('error');

        } else {
            $(this).next('span').addClass('error');
        }
    }
    $('#reg-form input').each(function () {
        if ($(this).val() != '' && !$(this).next('span').hasClass('error')) {
            valid = true;
        } else {
            valid = false;
        }
    });
    if (valid) {
        $('#reg-submit').attr('disabled', false).removeClass('btn-disabled').attr('title',
            '点击注册');
    }
});
function rePwd(ele, value) {
    if (value === $('#reg-pwd').val()) {
        $('#re-pwd').next('span').removeClass('error');
    } else {
        $('#re-pwd').next('span').addClass('error');
    }
}
$('#reg-submit').click(function (e) {
    e.preventDefault();
    var data = $('#reg-form').serialize();
    var name = $('#reg-name').val();
    $.ajax({
        type: 'POST',
        url: 'dist/data/regiest.php',
        data: data,
        success: function (data) {
            if (data.code === 1) {
                loginSucc();
                $('.wc-name').html(name);
                sessionStorage['uname'] = name;
                sessionStorage['uid'] = data.uid;
            }
        }
    })
});
$('.backtop').click(function () {
        $('html,body').animate({scrollTop: '0px'},800);
});
//全局弹窗行为绑定动画注册
$(function () {
    $(document).click(function () {
        $('.login-collapse').slideUp();
        $('.cart-detail').fadeOut(300);
        $('.search-form input').removeClass('in');
        $('.search-form').css("visibility", "hidden");
        $('.search').removeAttr("disabled");
        $('#suggest').hide();
    });
    $('#header').on('click', '.search', function (e) {

        if ($('.search-form').css('visibility') === "hidden") {
            $('.search-form input').addClass('in')[0].addEventListener("transitionend", function () {
                $(this).keyup(function () {
                    var kw = $(this).val();
                    var Reg = /[\u4e00-\u9fa5]+/;
                    if(Reg.test(kw)){
                        showSuggest(kw);
                    }
                }).focus(function () {
                    $('#suggest').show().html('')[0].className='default';
                }).focus();
            }, true);
            $('.search-form').css("visibility", "visible");
            $('.search').attr("disabled", true);
        }
    }).on('click', '.navbar', function (e) {
        e.stopPropagation();
    });
    $('#suggest').on('click','li', function (e) {
        var bid = $(this).data('bid');
        showBookDetail(e,bid);
    });
    $('.login-collapse').click(function (e) {
        e.stopPropagation();
    });
    $('a.login').on('click', function (e) {
        e.stopPropagation();
        $('.login-collapse').slideToggle(300);
    });
    $('.modal').on('click', function (e) {
        //console.log(e.target);
        e.stopPropagation();

        if (e.target.className === 'modal') {
            $('#modal-content').animate({
                top: -200
            }, 300, function () {
                $('.modal').hide();
            });
            $('#book-detail').animate({
                top: -200
            }, 300, function () {
                $('.modal').hide();
            });
        }
    });
});
//橱窗行为绑定
$('.book-hot').on('mouseenter', '.hot-item', function () {
    $(this).addClass('active').siblings('.active').removeClass('active');
});
$('.middle')
    .on('mouseover', 'li', function () {
        $(this).children('.outer').addClass('hide').siblings('.inner').addClass('active');
    })
    .on('mouseout', 'li', function () {
        $(this).children('.outer').removeClass('hide').siblings('.inner').removeClass('active');
    });
//商品详情及购物车行为
//橱窗加入购物车功能
$('div.middle')
    .on('click', '.btn-add', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).attr('disabled', true);
        var offset = $('#slide-bar li.shopcart').offset();
        var target = $(this).parent().parent().siblings('img');
        var data = $(this).parent('.btn-group').data('bid');
            cartJoin(data);
            fly(target, offset, e, -130, -170);
    })
    .on('click', '.a-detail', function (e) {
        var data = $(this).parent('.btn-group').data('bid');
        showBookDetail(e, data);
    });
$('.hot-content')
    .on('click', 'li.hot-item', function (e) {
        var data = $(this).data('bid');
        showBookDetail(e, data);
    });
$('#book-detail')
    .on('click', '.btn-add', function (e) {
        $(this).attr('disabled', true);
        var offset = $('#slide-bar li.shopcart').offset();
        var target = $('.detail-img');
        cartJoin($(this).data('bid'));
        fly(target, offset, e, -750, -250);
    });
// 右侧购物车列表
$('li.shopcart')
    .click(function (e) {
        e.stopPropagation();
        //showCartDetail();
        $('.cart-detail').fadeToggle(300);
    });
$('.cart-detail')
    .on('mouseenter', function () {
        timerHide('clear');
    })
    .on('mouseleave', function () {
        timerHide();
    })
    .on('click', 'span.delete', function (e) {
        e.stopPropagation();
        var li = $(this).parent('li');
        var data = li.data('bid');
        $.ajax({
            type: 'GET',
            url: 'dist/data/cart_delete.php',
            data: {bid: data},
            success: function (data) {
                if (data.msg === 'succ') {
                    li.animate({
                        left: -222
                    }, 700, function () {
                        showCartDetail();
                    });

                }
            }
        });
    });
$('.CS-content')
    .on('mouseover', 'li', function () {
        $(this).children('span.delete').show();
    })
    .on('mouseout', 'li', function () {
        $(this).children('span.delete').hide();
    });

function showBookDetail(e, data) {
    e.preventDefault();
    $('.modal').show();
    $('#modal-content').css('display', 'none');
    //console.log(data);
    $.ajax({
        type: 'GET',
        url: 'dist/data/getbybid.php',
        data: {bid: data},
        success: function (data) {
            var html = '', type,
                price = parseInt(data.price * 0.9) + '.00';
            switch (data.type) {
                case '1':
                    type = "新书推荐";
                    break;
                case '2':
                    type = "文学经典";
                    break;
                case '3':
                    type = "精彩小说";
                    break;
                case '4':
                    type = "人文科技";
                    break;
                default:
                    type = "好书推荐";
            }
            html = `<div class="detail-nav"><span>${type}</span> > <b>${data.name}</b> >详情 </div>
                <div class="detail-content">
                <div class="img-box">
                    <img class="detail-img" src="dist/img/${data.img}" alt="">
                </div>
                    <div class="detail-entry">
                        <h3>${data.name} <span>${data.author}</span></h3>
                        <h4>${data.title}</h4>
                        <h4><span>￥${price}</span> <s>￥${data.price}</s> <b>全场任意商品9折起</b></h4>
                        <p>${data.detail}</p>
                    </div>
                </div>
                <div class="detail-btn">
                    <div class="btn-group">
                        <a disabled="disabled" title="结算功能暂不可用" id="btn-order">立刻购买</a>
                        <button data-bid="${data.bid}" class="btn-add">加入购物车</button>
                    </div>
                </div>`
            $('#book-detail').html(html);
        }
    });
    $('#book-detail').css('display', 'block').animate({
        top: 0
    }, 300);
}
function cartJoin(bid) {
    $.ajax({
        type: 'POST',
        url: 'dist/data/cart_join.php',
        data: {uid: sessionStorage['uid'], bid: bid},
        success: function (data) {

        }
    });
}
function goLogin() {
    $('html,body').animate({scrollTop: '0px'}, 800, function () {
        $('.login-collapse').slideDown(300);
    });
}
function fly(target, offset, e, revX, revY) {
    var img = target.attr('src');
    var flyer = $('<img class="flyer-img" src="' + img + '">').css({
        width: 150,
        height: 150,
        borderRadius: 100,
        zIndex: 2000
    });
    flyer.fly({
        start: {
            left: e.clientX + revX,
            top: e.clientY + revY
        },
        end: {
            left: offset.left - $(document).scrollLeft(),
            top: offset.top - $(document).scrollTop(),
            width: 20,
            height: 20
        },
        vertex_Rtop: 50,
        speed: 1.4,
        onEnd: function () {
            timerHide('clear');
            e.target.removeAttribute('disabled');
            this.destroy();
            showCartDetail();
            $('.cart-detail').fadeIn(300).scrollTop();
            $('.CS-content').scrollTop("");
            timerHide();
        }
    })
}
function showCartDetail() {
    $.ajax({
        type: 'GET',
        url: 'dist/data/cart_detail.php',
        data: {uid: sessionStorage['uid']},
        success: function (data) {
            if (data.length) {
                var html = '', t_count = 0, t_price = 0,result='';
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    html += `<li data-bid='${item.bid}'>
                    <a class="left" href="#"><img src="dist/img/${item.img}" alt=""></a>
                    <div class="center">
                        <a href="">
                            <span class="name">${item.name}</span>
                            <span class="num">x${item.count}</span>
                        </a>
                        <p>￥${item.price}</p>
                    </div>
                    <span class="delete"></span>
                </li>`;
                    t_count += parseInt(item.count);
                    t_price += parseInt(item.price * item.count);
                }

                result = `  <div>
                         <p>共<b class="b-num">${t_count}</b>件商品</p>
                         <p class="totail">￥${parseInt(t_price * 0.9)}.00 <span>全场9折促销中</span></p>
                       </div>
                       <a disabled="disabled" title="结算功能暂不可用" class="clearing" href="">立即结算</a>
                      `;
                $('ul.CS-content').show().html(html).scrollTop(9999);
                $('.result').removeClass('empty').html(result);
                $('.count').show().html(t_count);
            } else if (data.length === 0) {
                $('ul.CS-content').hide();
                $('.result').html("").addClass('empty');
                $('.count').hide();
            }
        }
    })
}
var timer = null;
function timerHide(stop) {
    if (stop === 'clear') {
        clearTimeout(timer);
        timer = null;
    } else if (!stop) {
        timer = setTimeout(function () {
            $('.cart-detail').fadeOut(300);
        }, 6000)
    }
}
function showSuggest(data) {
    $.ajax({
        type:'GET',
        url:'dist/data/getsuggest.php',
        data:{kw:data},
        success: function (data) {
            var html = ``;
            if(data.length){
                for(var i =0;i<data.length;i++){
                    var item = data[i];
                    html+=` <li data-bid="${item.bid}">
                        <img src="dist/img/${item.img}" alt="">
                        <b>${item.name}<span>${item.author}</span></b>
                    </li>`
                }
                $('#suggest')[0].className='';
            }else if(data.length===0){
                $('#suggest')[0].className='empty';
            }
            $('#suggest').html(html);
        }
    })
}
function showData(list){
    var html='';
    $.each(list,function(i,item){
        html += `<li>
                    <img class="lazy" data-src="dist/img/${item.img}" src="dist/img/loading.gif"
                    style="width:193px;height:193px;"
                    title="${item.title}">
                    <div class="outer">
                        <div class="p-name">${item.name}</div>
                        <div class="p-price">￥${item.price}</div>
                    </div>
                    <div class="inner">
                        <div data-bid="${item.bid}" class="btn-group">
                            <a class="a-detail" href="#">查看详情</a>
                            <button class="btn-add">加入购物车</button>
                        </div>
                    </div>
                </li>`
    });
    return html
}
function lazyload(e,curr){
        if($(window).scrollTop()-curr[0].offsetTop>-600){
            var list = curr.find('img.lazy');
            $.each(list,function(i,item){
                var src = item.getAttribute('data-src');
                item.setAttribute('src',src)
            })
        }
}
function showBack(e,btn){
    if($(window).scrollTop()>800){
        btn.fadeIn(300);
    }else{
        btn.fadeOut(300);
    }

}




